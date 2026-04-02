# Telegram Signal Copier

A Spring Boot application that acts as a **Telegram trading signal relay**. It monitors a Telegram group for structured trading signals, parses them, and queues them into per-user in-memory pipelines. Registered MetaTrader 5 (MT5) accounts then poll a REST endpoint every few seconds to receive their signals and automatically execute trades.

The repository also contains the companion MT5 Expert Advisor (EA) script written in MQL5 that runs the client-side polling and trade execution logic.

---

## Tech Stack

| Layer             | Technology                                        |
| ----------------- | ------------------------------------------------- |
| Language          | Java 21                                           |
| Framework         | Spring Boot 3.4.3                                 |
| ORM               | Spring Data JPA (Hibernate)                       |
| Database          | MariaDB                                           |
| Telegram API      | TelegramBots Long-Polling (`telegrambots` v7.9.1) |
| HTTP Client (bot) | OkHttp (via `telegrambots-client`)                |
| Build Tool        | Apache Maven                                      |
| Utilities         | Lombok, Jackson (ObjectMapper)                    |
| Runtime           | JVM with virtual threads enabled                  |
| MT5 Client        | MQL5 Expert Advisor (MetaTrader 5)                |
| Deployment        | AWS EC2 (managed as a `systemd` service)          |

---

## Prerequisites

- Java 21 JDK
- Apache Maven 3.8+
- MariaDB (running locally or on a remote host)
- A Telegram Bot Token (obtained from [@BotFather](https://t.me/BotFather))
- The bot must be added as an **administrator** to both the source Telegram group and the destination channel
- MetaTrader 5 terminal (for running the EA client)

---

## Installation & Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/kumawat-aditya/telegram-signal-copier.git
cd telegram-signal-copier
```

### 2. Create the database

```sql
CREATE DATABASE telegram_copier;
CREATE USER 'trade_amplification'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON telegram_copier.* TO 'trade_amplification'@'localhost';
FLUSH PRIVILEGES;
```

JPA is configured to auto-manage schema via Hibernate (`spring.jpa.hibernate.ddl-auto`). The `users` table will be created automatically on first startup.

### 3. Configure environment variables

Copy the example below and export the variables in your shell (or configure them in your IDE run profile):

```bash
export TELEGRAM_BOT_TOKEN="<your-bot-token>"
export TELEGRAM_GROUP_ID=<source-group-id>       # negative number, e.g. -4772601408
export TELEGRAM_CHANNEL_ID=<destination-channel-id>  # negative number
```

For local development you may also edit `src/main/resources/application-dev.properties` directly (see [Environment Variables](#environment-variables) below).

### 4. Switch to the `dev` profile (optional)

The active profile defaults to `prod`. Override it for local work:

```bash
export SPRING_PROFILES_ACTIVE=dev
```

or add `-Dspring.profiles.active=dev` to your Maven command.

### 5. Build and run

```bash
./mvnw spring-boot:run
```

Or build a fat JAR and run it:

```bash
./mvnw clean package -DskipTests
java -jar target/telegram-copier.jar
```

---

## Environment Variables

| Variable                     | Profile | Description                                                                                  |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`         | prod    | The HTTP API token issued by Telegram BotFather                                              |
| `TELEGRAM_GROUP_ID`          | prod    | Numeric ID of the **source** Telegram group where signals are posted                         |
| `TELEGRAM_CHANNEL_ID`        | prod    | Numeric ID of the **destination** Telegram channel to mirror content to                      |
| `spring.datasource.url`      | both    | JDBC URL for the MariaDB instance (default: `jdbc:mariadb://localhost:3306/telegram_copier`) |
| `spring.datasource.username` | both    | Database username                                                                            |
| `spring.datasource.password` | both    | Database password                                                                            |

> **Note:** In the `dev` profile all values are set directly in `application-dev.properties`. In `prod`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_GROUP_ID`, and `TELEGRAM_CHANNEL_ID` **must** be injected as OS environment variables.

---

## Deploying to Production (AWS EC2)

1. Build the fat JAR locally and transfer it:

   ```bash
   ./mvnw clean package -DskipTests
   scp -i telegram-copier-key.pem target/telegram-copier.jar \
       ec2-user@<your-ec2-host>:/home/ec2-user/
   ```

2. On the EC2 instance, create a `systemd` service unit at `/etc/systemd/system/telegram-copier.service`:

   ```ini
   [Unit]
   Description=Telegram Copier Spring Boot Application
   After=network.target

   [Service]
   User=ec2-user
   WorkingDirectory=/home/ec2-user
   ExecStart=/usr/bin/java -jar /home/ec2-user/telegram-copier.jar
   Environment="TELEGRAM_BOT_TOKEN=<token>"
   Environment="TELEGRAM_GROUP_ID=<group-id>"
   Environment="TELEGRAM_CHANNEL_ID=<channel-id>"
   SuccessExitStatus=143
   Restart=always
   StandardOutput=journal
   StandardError=journal
   TimeoutStopSec=20

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable telegram-copier
   sudo systemctl start telegram-copier
   sudo systemctl status telegram-copier
   ```

4. Monitor logs:
   ```bash
   tail -f /home/ec2-user/telegram-copier-errors.log
   sudo journalctl -u telegram-copier.service -b
   ```

---

## Installing the MT5 Expert Advisor

1. Copy `mt5_scripts/Telegram.ex5` (compiled) or `Telegram.mq5` (source) into your MT5 `Experts/` directory.
2. In MT5, open **Tools → Options → Expert Advisors** and whitelist the server URL (e.g. `http://<server-ip>:9090/`).
3. Attach the EA to any chart. Configure the inputs:
   - `Lots` — base lot size (default `0.1`)
   - `NoOfTrades` — how many sets of trades to open per signal (default `1`)
   - `TOn` — trailing stop target (`Target_1`, `Target_2`, or `NON`)
4. The EA will detect your MetaTrader account login number automatically and use it as the identifier when polling the server.

---

## Folder Structure

```
telegram-copier/
├── cmd.txt                          # Deployment cheat-sheet (commands)
├── db_config.txt                    # DB setup notes
├── pom.xml                          # Maven build descriptor
├── mt5_scripts/
│   ├── Telegram.mq5                 # MT5 EA source (MQL5)
│   └── Telegram.ex5                 # MT5 EA compiled binary
├── src/
│   └── main/
│       ├── java/com/tradeAmplification/telegram_copier/
│       │   ├── TelegramCopierApplication.java   # Entry point
│       │   ├── entity/
│       │   │   └── User.java                    # JPA entity
│       │   ├── exception/                       # Exception hierarchy
│       │   ├── Manager/
│       │   │   └── SignalManager.java           # In-memory signal queue
│       │   ├── model/
│       │   │   └── Signal.java                  # Signal DTO
│       │   ├── repository/
│       │   │   └── UserRepository.java          # Spring Data JPA repo
│       │   ├── restcontroller/
│       │   │   └── SignalPollingController.java  # MT5 polling endpoint
│       │   ├── service/
│       │   │   ├── BackupService(Impl).java     # JSON backup/restore
│       │   │   ├── SignalService.java           # Signal broadcast façade
│       │   │   ├── UserService.java             # User CRUD interface
│       │   │   └── UserServiceImpl.java
│       │   └── telegram/
│       │       └── TelegramBot.java             # Bot logic & admin commands
│       └── resources/
│           ├── application.properties           # Profile selector
│           ├── application-dev.properties       # Local dev config
│           └── application-prod.properties      # Production config
└── target/
    └── telegram-copier.jar                      # Deployable fat JAR
```

---

## Quick Links

- [Architecture & Data Flow](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
