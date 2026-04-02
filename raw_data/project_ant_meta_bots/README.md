# ANT Meta BOTS

> Algorithmic crypto options trading powered by Lorentzian ML Classification on Delta Exchange India.

ANT Meta BOTS is a full-stack automated trading system that monitors cryptocurrency perpetual futures markets, generates directional signals using a k-NN Lorentzian Classification ML algorithm, and autonomously executes daily-expiry options trades on Delta Exchange India. It provides a React dashboard for bot management, real-time P&L monitoring, and live trade/log streaming over WebSocket.

---

## How It Works

```
  OHLCV Candles              Lorentzian KNN              ATM Option Order
  (futures history)     →    + Kernel Regression    →    (market BUY/SELL)
       │                     + 5 Filters                      │
       │                           │                          │
  InstanceRunner            LONG / SHORT signal         DeltaClient API
  (per-bot candle pool)      (stored in SQLite)              │
                                   │                    LiveFeedManager
                             Watchdog v4.2              (options tick poll)
                             (1-second loop)                  │
                                   │               TP / SL / Trailing / Force-close
                             StrikeSelector          (monitored on options price)
                             (ATM, 5:30 AM expiry rule)
```

---

## Tech Stack

| Layer           | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| **Backend**     | Python 3.11, FastAPI, Uvicorn, Pydantic v2, pydantic-settings     |
| **Frontend**    | React 18, React Router v6, Axios, native WebSocket API            |
| **Database**    | SQLite via plain `sqlite3` (two files: `signals.db`, `trades.db`) |
| **Auth**        | JWT (HS256) via `python-jose`, bcrypt via `passlib`               |
| **HTTP Client** | `aiohttp` (async), `httpx`                                        |
| **Data**        | pandas, numpy                                                     |
| **Exchange**    | Delta Exchange India REST API (HMAC-SHA256 signed)                |
| **Containers**  | Docker, Docker Compose                                            |
| **Timezone**    | `zoneinfo` (IST — Asia/Kolkata hardcoded as process timezone)     |

---

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- A **Delta Exchange India** account with API key + secret (required for live trading)
- Docker & Docker Compose (optional, for containerised deployment)

---

## Installation & Local Setup

### Backend

```bash
cd backend

# Create and activate virtualenv
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file (see Environment Variables section below)
cp .env.example .env              # or create from scratch
# Edit .env: set DELTA_API_KEY, DELTA_API_SECRET, SECRET_KEY, ADMIN_PASSWORD

# Run development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm start                         # Development server on http://localhost:3000
```

> The frontend proxies `/api` requests to `http://localhost:8000` in development (configured via `REACT_APP_API_URL`).

### Docker Compose (Recommended for Production)

```bash
# From project root
docker-compose up --build -d

# Backend:  http://localhost:8000
# Frontend: http://localhost:3000
```

---

## Environment Variables

All backend settings are loaded from `backend/.env` (or real environment variables). Pydantic-settings manages validation and defaults.

| Variable                      | Default                            | Required | Description                                     |
| ----------------------------- | ---------------------------------- | :------: | ----------------------------------------------- |
| `DELTA_API_KEY`               | —                                  |    ✓     | Delta Exchange India API key                    |
| `DELTA_API_SECRET`            | —                                  |    ✓     | Delta Exchange India API secret                 |
| `DELTA_BASE_URL`              | `https://api.india.delta.exchange` |          | Base URL for Delta Exchange API                 |
| `SECRET_KEY`                  | `change-this-in-production-...`    |    ✓     | JWT signing secret (must change in production)  |
| `ADMIN_USERNAME`              | `admin`                            |          | Dashboard login username                        |
| `ADMIN_PASSWORD`              | `admin123`                         |    ✓     | Dashboard login password (must change)          |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440`                             |          | JWT token TTL in minutes (default: 24 h)        |
| `DEBUG`                       | `False`                            |          | Enable debug-level logging                      |
| `DATABASE_URL`                | `sqlite:///./trading_bot.db`       |          | SQLAlchemy DB URL (currently unused by runtime) |
| `LOG_LEVEL`                   | `INFO`                             |          | Logging level: DEBUG / INFO / WARNING / ERROR   |
| `LOG_DIR`                     | `logs`                             |          | Log file directory (relative to project root)   |
| `LOG_TO_FILE`                 | `True`                             |          | Enable file-based log output                    |
| `LOG_RETENTION_DAYS`          | `30`                               |          | Days to retain rotated log files                |
| `LIVE_FEED_INTERVAL`          | `1.0`                              |          | Tick polling interval in seconds                |
| `LIVE_FEED_BUFFER_SIZE`       | `120`                              |          | Rolling tick buffer size per symbol             |
| `WATCHDOG_INTERVAL`           | `1.0`                              |          | Watchdog loop interval in seconds               |
| `FORCE_CLOSE_HOUR_IST`        | `17`                               |          | Force-close hour in IST (default: 5 PM)         |
| `FORCE_CLOSE_MIN_IST`         | `0`                                |          | Force-close minute in IST                       |
| `SESSION_START_HOUR_IST`      | `5`                                |          | Session boundary hour in IST (default: 5:30 AM) |
| `SESSION_START_MIN_IST`       | `30`                               |          | Session boundary minute in IST                  |
| `TELEGRAM_BOT_TOKEN`          | —                                  |          | Telegram Bot token (optional notifications)     |
| `TELEGRAM_CHAT_ID`            | —                                  |          | Telegram Chat ID (optional notifications)       |

---

## Folder Structure

```
lorentzian-options/
├── README.md
├── docker-compose.yml
├── ARCHITECTURE.md            ← (root-level legacy doc; see docs/ for generated ones)
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py            ← FastAPI app entry + lifespan startup/shutdown
│       ├── core/
│       │   ├── config.py      ← Pydantic BaseSettings (all env vars)
│       │   ├── constants.py   ← Trade status / signal / close-reason constants
│       │   ├── logging_config.py
│       │   ├── security.py    ← JWT creation/decode, bcrypt, user auth
│       │   └── timezone.py    ← IST helpers (ZoneInfo)
│       ├── api/
│       │   ├── router.py      ← Master APIRouter (aggregates v1)
│       │   └── v1/
│       │       ├── auth.py    ← Login, /me, Delta credentials
│       │       ├── bots.py    ← Full bot CRUD + start/stop/candles/trades/logs
│       │       ├── trades.py  ← Trade history (read-only)
│       │       ├── logs.py    ← System + bot log access
│       │       ├── health.py  ← /health, /health/ready, /health/live
│       │       └── ws.py      ← WebSocket endpoint + ConnectionManager
│       ├── schemas/
│       │   ├── auth.py        ← Token, LoginRequest/Response, DeltaCredentials
│       │   ├── bot.py         ← BotConfig, TradeInput, LorentzianStrategy schemas
│       │   ├── trade.py       ← ActiveTradeResponse, TradeListResponse
│       │   └── common.py
│       ├── services/
│       │   ├── bot_manager.py     ← BotInstanceManager singleton (CRUD + lifecycle)
│       │   ├── signal_database.py ← SQLite signals store (rolling window per bot)
│       │   └── trade_database.py  ← SQLite trades store (active + historical)
│       └── engines/
│           ├── instance_runner.py           ← Per-bot candle pool + async update loop
│           ├── data_engine/
│           │   ├── ohlcv_fetcher.py         ← Historical candle fetcher (Delta API)
│           │   ├── tick_fetcher.py          ← Live tick fetcher (public /v2/tickers)
│           │   ├── live_feed_manager.py     ← Dual-feed (futures+options) 1s loop
│           │   └── retry_handler.py         ← Exponential backoff retry utility
│           ├── strategy_core/lorentzian/
│           │   ├── strategy.py              ← build_history / process_new_candle
│           │   ├── ml_extensions.py         ← RSI/WT/CCI/ADX feature calculators
│           │   ├── kernel_functions.py      ← Rational Quadratic + Gaussian kernels
│           │   └── types.py                 ← CandleData, StrategySettings, enums
│           ├── execution_engine/
│           │   ├── delta_client.py          ← HMAC-SHA256 Delta API client
│           │   ├── strike_selector.py       ← ATM option picker (5:30 AM expiry rule)
│           │   └── order_executor.py        ← Market order placement + fill resolution
│           └── trade_manager/
│               └── watchdog.py              ← Unified Watchdog v4.2 (signal scan + trade mgmt)
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js             ← BrowserRouter + auth guards + route map
│       ├── api/index.js       ← Axios client, request/response interceptors, API modules
│       ├── context/AuthContext.js  ← JWT auth state (localStorage)
│       ├── hooks/useWebSocket.js   ← WS hook with exponential backoff reconnect
│       ├── pages/
│       │   ├── Login.js       ← Username/password form
│       │   └── Dashboard.js   ← Main view: bots, stats, logs
│       └── components/
│           ├── BotTabPanel.js      ← Per-bot detail tabs
│           ├── BotCard.js          ← Bot status summary card
│           ├── CreateBotModal.js   ← Full strategy config form
│           ├── EditBotModal.js     ← Trade/strategy config edit
│           ├── DeltaKeysModal.js   ← API key management
│           └── LogsPanel.js        ← Scrollable log viewer
│
└── docs/
    ├── ARCHITECTURE.md        ← System architecture + data flows + DB schema
    ├── API_REFERENCE.md       ← All 29 endpoints documented
    └── BACKEND_FLOW.md        ← Request lifecycle, Watchdog phases, error handling
```

---

## Quick Links

| Document                                       | Description                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)   | System architecture diagrams, data flow, database schema, design patterns |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | All REST & WebSocket endpoints with request/response payloads             |
| [docs/BACKEND_FLOW.md](docs/BACKEND_FLOW.md)   | Backend request lifecycle, Watchdog phases, error handling strategy       |

Interactive API docs (requires running backend): `http://localhost:8000/docs`

---

## Trade Lifecycle

```
Signal generated
      │
  CREATED ──(breakout crossover on futures)──► OPEN ──(TP hit)──► WON
                                                │
                                         (SL hit, re-entries left)
                                                │
                                        AWAITING_REENTRY
                                                │
                                  (crossover confirmed on options)
                                                │
                                           OPEN (re-entry)
                                                │
                                    (SL exhausted / force-close)
                                                │
                                            CLOSED
```

## Force-close fires at **5:00 PM IST** on the option's expiry date. Session boundary is **5:30 AM IST** (aligned with Delta Exchange futures daily candle close).

## License

Private project. Not for redistribution.
