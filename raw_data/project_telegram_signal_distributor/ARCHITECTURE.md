# Architecture

This document describes the system design, component responsibilities, data flows, and database schema of the Telegram Signal Copier.

---

## System Overview

The system bridges two ecosystems: **Telegram** (signal source) and **MetaTrader 5** (trade executor).

1. A human analyst posts a structured trading signal into a private Telegram **group**.
2. The Spring Boot backend, running a long-polling Telegram bot, receives the update in real time.
3. The bot parses the message, validates the signal values, and enqueues the signal into a per-account in-memory queue managed by `SignalManager`.
4. Each registered MT5 account runs an Expert Advisor (EA) that calls the server's REST endpoint every 10 seconds.
5. When a signal is present in the queue, the EA dequeues it and executes the corresponding trade(s) on the live broker account.
6. Simultaneously, the bot mirrors all group messages (text, photos, videos, documents, stickers, polls) to a read-only Telegram **channel** for subscriber access.

There is **no browser-based frontend**. All operator interaction occurs through Telegram bot commands in a private chat.

---

## Architecture Diagram

```mermaid
graph TB
    subgraph Telegram["Telegram Platform"]
        A[📢 Signal Group\nAdmin posts signal]
        B[📣 Channel\nSubscribers read]
    end

    subgraph Backend["Spring Boot Backend (AWS EC2 :9090)"]
        C[TelegramBot\nLong-Polling Consumer]
        D[SignalManager\nIn-Memory Queue per MT5 ID]
        E[SignalPollingController\nREST GET /api/poll/metaTraderId]
        F[UserService\nCRUD]
        G[BackupService\nJSON export/import]
    end

    subgraph DB["MariaDB"]
        H[(users table)]
    end

    subgraph MT5["MetaTrader 5 Terminals"]
        I[EA: Telegram.mq5\nAccount A]
        J[EA: Telegram.mq5\nAccount B]
        K[EA: Telegram.mq5\nAccount N]
    end

    A -->|Update via Long-Poll| C
    C -->|Forward all content| B
    C -->|Parse & validate signal| D
    C -->|Admin CRUD commands| F
    C -->|Backup/restore| G
    F <-->|JPA| H
    D -->|broadcastSignalToAll| F
    E -->|pollSignal\nmessage ID| D
    I -->|GET /api/poll/ID every 10s| E
    J -->|GET /api/poll/ID every 10s| E
    K -->|GET /api/poll/ID every 10s| E
```

---

## Data Flow Diagram

The following sequence diagram traces the complete lifecycle of a single trading signal from creation to trade execution.

```mermaid
sequenceDiagram
    actor Analyst
    participant TG_Group as Telegram Group
    participant Bot as TelegramBot (Spring)
    participant SM as SignalManager
    participant DB as MariaDB
    participant EA as MT5 Expert Advisor
    participant Broker as MT5 Broker

    Analyst->>TG_Group: Posts signal message
    TG_Group-->>Bot: Long-poll Update (new message)

    Bot->>Bot: isSignalFormat() — regex pre-check
    Bot->>Bot: processSignal() — extract fields via regex
    Bot->>Bot: verifySignal() — validate price logic

    alt Signal is valid
        Bot->>SM: signalService.sendMessageToAllClients(signal)
        SM->>DB: userService.getAllMetaTraderIds()
        DB-->>SM: [id1, id2, ..., idN]
        loop For each MetaTrader ID
            SM->>SM: addSignal(metaTraderId, signal)\nConcurrentLinkedQueue per ID
        end
        Bot->>TG_Group: (no reply — silent success)
    else Signal is invalid
        Bot->>TG_Group: Sends error message to group
    end

    loop Every 10 seconds (OnTimer)
        EA->>Bot: GET /api/poll/{metaTraderId}
        Bot->>SM: SignalManager.pollSignal(metaTraderId)
        SM->>SM: Check TTL (10s market, 600s pending)

        alt Signal available & not expired
            SM-->>Bot: Signal object
            Bot-->>EA: 200 OK — Signal payload (key=value string)
            EA->>EA: ProcessSignal() — parse response
            EA->>Broker: PlaceBuyOrder / PlaceSellOrder\n/ PlacePendingOrder
        else No signal
            SM-->>Bot: null
            Bot-->>EA: 204 No Content
        else MetaTrader ID unknown
            SM-->>Bot: UnknownClientException
            Bot-->>EA: 400 Bad Request
            EA->>EA: Sleep 5 minutes
        end
    end
```

### Edit & Cancel Signal Flow

```mermaid
sequenceDiagram
    actor Analyst
    participant TG_Group as Telegram Group
    participant Bot as TelegramBot (Spring)
    participant SM as SignalManager
    participant EA as MT5 EA

    Note over Analyst,Bot: Modify signal (edit original message)
    Analyst->>TG_Group: Edit existing signal message
    TG_Group-->>Bot: Long-poll Update (editedMessage)
    Bot->>Bot: processEditedMessage() — action = MODIFIED
    Bot->>SM: Enqueue signal with action=MODIFIED
    EA->>Bot: GET /api/poll/{id}
    Bot-->>EA: Signal {action=MODIFIED, ...}
    EA->>EA: ModifyPositions() or ModifyOrders()

    Note over Analyst,Bot: Cancel signal (reply with "close")
    Analyst->>TG_Group: Reply to signal with "close"
    TG_Group-->>Bot: Long-poll Update (message.replyToMessage)
    Bot->>Bot: processReplyMessage() — action = CANCEL
    Bot->>SM: Enqueue signal with action=CANCEL
    EA->>Bot: GET /api/poll/{id}
    Bot-->>EA: Signal {action=CANCEL, ...}
    EA->>EA: ClosePositions() or CancelOrders()
```

---

## Telegram Signal Format

The bot uses **seven regex patterns** to detect and parse signals. A valid signal must contain all of the following in a single message (or photo caption):

```
#EURUSD
#BUY

Entry Point: 1.0850
Stop Loss (SL): 1.0820
Take Profit (TP1): 1.0880
Take Profit (TP2): 1.0910
Take Profit (TP3): 1.0940
```

Supported order types: `BUY`, `SELL`, `BUY LIMIT`, `SELL LIMIT`, `BUY STOP`, `SELL STOP`.

---

## Database Schema / Entity Model

The schema is minimal — a single `users` table maps human-readable trader names to their MT5 account login numbers.

```mermaid
erDiagram
    USERS {
        BIGINT id PK "AUTO_INCREMENT"
        VARCHAR(50) name "NOT NULL"
        VARCHAR(15) meta_trader_id "NOT NULL"
    }
```

### `users`

| Column           | Type          | Constraints                     | Description                                            |
| ---------------- | ------------- | ------------------------------- | ------------------------------------------------------ |
| `id`             | `BIGINT`      | `PRIMARY KEY`, `AUTO_INCREMENT` | Surrogate key                                          |
| `name`           | `VARCHAR(50)` | `NOT NULL`                      | Display name of the trader                             |
| `meta_trader_id` | `VARCHAR(15)` | `NOT NULL`                      | MT5 account login number (used as the poll identifier) |

> **No foreign keys or join tables.** The `SignalManager` uses `metaTraderId` as the sole routing key for queued signals.

---

## Key Design Patterns & Decisions

### 1. In-Memory Signal Queue (Producer-Consumer)

`SignalManager` maintains a `ConcurrentHashMap<String, ConcurrentLinkedQueue<Signal>>` — one queue per registered MetaTrader ID. The Telegram bot is the **producer** (via `broadcastSignalToAll`); the REST controller is the **consumer** (via `pollSignal`). This avoids a persistent message-broker dependency and keeps the infrastructure lightweight.

### 2. TTL-Based Signal Expiry

When an MT5 EA polls a signal, `pollSignal()` inspects each queued entry's `createdAt` timestamp:

- **Market orders** (`BUY`, `SELL`) expire after **10 seconds** — they are only relevant at the current market price.
- **Pending orders** (`*LIMIT`, `*STOP`) expire after **600 seconds (10 minutes)** — they can still be placed at the specified entry level.

Expired signals are silently discarded.

### 3. Stateful Admin Bot (State Machine)

Admin operations in private chat (registration, removal, update, restore) use a two-map state machine:

- `adminStateMap: Map<Long, AdminOperationState>` — tracks which step the admin is on.
- `adminUserDataMap: Map<Long, User>` — accumulates form fields across messages.

This allows multi-step conversational workflows entirely within the bot's `consume()` loop without any web UI.

### 4. Signal Validation Before Enqueueing

`verifySignal()` enforces price-level sanity rules per order type before a signal is ever enqueued. For example, a `BUY` order requires `sl < entry < tp1 < tp2 < tp3`. Invalid signals produce an error reply in the group and are never forwarded to MT5.

### 5. Scheduled Monthly Backup

A `@Scheduled(cron = "0 0 0 L * ?")` cron on the last day of every month automatically generates a JSON backup of the `users` table and privately sends it to all group administrators via the Telegram bot.

### 6. Broker-Specific Symbol Normalisation (MT5 EA)

The EA contains a broker detection block that renames symbols at runtime to match each broker's naming convention:

- **Exness** appends `m` (e.g. `EURUSDm`)
- **ICM** appends `.a` (e.g. `EURUSD.a`)
- **XM Global** renames `XAUUSD` → `GOLD`, `XAGUSD` → `SILVER`

### 7. Content Mirroring (Group → Channel)

Every message posted to the group — regardless of type (text, photo, video, document, animation, sticker, poll) — is re-sent to the channel by the bot. This decouples the private analyst group from the public subscriber channel.

### 8. Exception Hierarchy

All application exceptions extend a common `ApplicationException` (itself a `RuntimeException`). The hierarchy has two branches:

```
ApplicationException
├── TelegramBotException
│   ├── InvalidSignalValuesException
│   ├── InvalidActionException
│   ├── InvalidOrderTypeException
│   ├── NullSignalException
│   └── CancellingNonPendingOrderException
└── UserException
    └── UserNotFoundException
        (also UnknownClientException extends ApplicationException directly)
```

This allows catch blocks in the REST controller and bot to distinguish between user-facing errors and internal errors with a single `instanceof` check.
