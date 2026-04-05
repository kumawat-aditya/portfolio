export interface ProjectMetrics {
  scale: string;
  latency: string;
  reliability: string;
  automation: string;
}

export interface ProofCapsule {
  claim: string;
  evidence: string;
  source: "log" | "architecture" | "metric" | "behavior";
}

export interface Constraint {
  dimension: string;
  value: string;
}

export interface Incident {
  title: string;
  timeline: string[];
  fix: string;
  outcome: string;
}

export interface ProjectMedia {
  images: { src: string; alt: string; caption?: string }[];
  videos: { src: string; caption?: string }[];
  diagrams?: { src: string; title: string }[];
  logSnippet?: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  thesis: string;
  priority: "flagship" | "major" | "supporting";
  accentColor: string;
  stack: string[];
  github: string;
  metrics: ProjectMetrics;
  highlights: string[];
  whatItDoes: string;
  architecture: string[];
  engineering: string[];
  challenges: string[];
  failures: string[];
  tradeoffs: string[];
  improvements: string[];
  insight: string;
  relatedLab: string[];
  tags: string[];
  proofCapsules: ProofCapsule[];
  constraints: Constraint[];
  incidents: Incident[];
  whyThisArchitecture: string;
  media: ProjectMedia;
}

const BASE = import.meta.env.BASE_URL;

export const projects: Project[] = [
  {
    slug: "ant-meta-bots",
    title: "ANT Meta Bots",
    subtitle: "ML-Powered Options Trading Platform",
    thesis:
      "An end-to-end algorithmic trading platform that generates ML-based signals from futures data, autonomously executes options trades, and manages the entire trade lifecycle — signal to exit — with zero human intervention and zero double-execution.",
    priority: "flagship",
    accentColor: "#3b82f6",
    stack: ["Python", "FastAPI", "React", "WebSocket", "SQLite", "asyncio"],
    github: "private",
    metrics: {
      scale: "4 concurrent async subsystems on a single event loop",
      latency: "1-second cooperative execution cycles",
      reliability: "Zero double-execution — explicit state machine",
      automation: "Fully autonomous — signal to exit, no human touch",
    },
    highlights: [
      "Full trade lifecycle management",
      "1-second async execution engine",
      "Zero double-execution guarantee",
      "Lorentzian k-NN ML signal generation",
    ],
    whatItDoes:
      "End-to-end algorithmic trading platform. ML model generates signals from futures data using Lorentzian k-NN classification. The system selects options strikes, places orders, monitors fills, manages stop-losses and take-profits, and exits positions — all in real time, without human touch.",
    architecture: [
      "Cohesive async Python backend with React SPA frontend, communicating via REST and native WebSockets",
      "Four concurrent async subsystems (API, BotManager, LiveFeedManager, Watchdog) executing cooperative concurrency on a single event loop",
      "Dual live data feeds — futures tick streams for breakout verification, options tick streams for TP/SL monitoring",
      "Layered persistence: SQLite for high-frequency signal/trade logs, JSON for bot configuration state",
    ],
    engineering: [
      "Translated MQL5 Lorentzian classification into Python with RSI/WT/CCI/ADX feature extraction and multi-filter boolean logic",
      "Built Unified Watchdog v4.2 implementing strict Phase 0 (Session), Phase 1 (Scanning), Phase 2 (Management) execution order",
      "Implemented custom HMAC-SHA256 API client with 3-retry exponential backoff for Delta Exchange communication",
      "Designed WebSocket push-only model broadcasting state and rolling log buffers at 2-3 second intervals",
      "React dashboard with real-time monitoring and manual override capability",
    ],
    challenges: [
      "Race conditions in high-frequency signal processing — solved with explicit state machines and phase-based execution order",
      "State consistency across async operations during live market volatility",
      "Reliable fill verification when exchange APIs had intermittent delays",
      "Managing overlapping trade sessions across 5:30 AM IST day boundaries",
    ],
    failures: [
      "Early versions had state desynchronization — signals fired but trades didn't track correctly across subsystems",
      "Duplicate executions under rapid signal changes before the Watchdog engine existed",
      "Initial multi-component architecture was too fragile for production conditions — rebuilt as cohesive async system",
      "False entries on noisy signal clusters before Best-of-N scanner was implemented",
    ],
    tradeoffs: [
      "Cohesive async cooperative concurrency vs. microservices — chose single-process to minimize inter-subsystem latency at 1-second cycles",
      "SQLite over PostgreSQL — simpler deployment, acceptable write concurrency for single-machine operation",
      "Best-of-N signal selection vs. immediate execution — trading slight entry latency for significant noise reduction",
      "Reliability over raw speed — every execution cycle validates state before acting",
    ],
    improvements: [
      "Event-driven architecture for horizontal scaling",
      "Replay system for backtesting with production execution paths",
      "Circuit breakers for cascading failure protection",
    ],
    insight:
      "True system reliability comes from controlling state transitions, not from generating better signals.",
    relatedLab: ["why-trading-bots-fail"],
    tags: [
      "real-time",
      "async",
      "trading",
      "state-management",
      "ml",
      "backend",
    ],
    proofCapsules: [
      {
        claim: "Zero double-execution in production",
        evidence:
          'Watchdog v4.2 replaces expired trades before re-entering — log: "Replaced EXPIRED trade 352ed08d7a14 (SHORT) with better signal"',
        source: "log",
      },
      {
        claim: "Full trade lifecycle automation",
        evidence:
          'Signal → breakout confirmation → execution → TP/SL → re-entry. Logged: "Trade CLOSED (WIN): TP_HIT | Net PnL: +0.46" followed by automatic re-entry.',
        source: "log",
      },
      {
        claim: "ML signal generation from 2750 candle history",
        evidence:
          'History built on startup: "✓ History built: 2750 bars" → "📊 Stored 200 initial signals"',
        source: "log",
      },
    ],
    constraints: [
      {
        dimension: "Execution cycle",
        value: "1-second async cooperative loop",
      },
      {
        dimension: "State control",
        value: "Explicit state machine — no implicit transitions",
      },
      {
        dimension: "Failure boundary",
        value: "Per-bot isolation — one bot crash doesn't affect others",
      },
      {
        dimension: "Recovery",
        value: "SQLite persistence + automatic crash recovery",
      },
    ],
    incidents: [
      {
        title: "Duplicate execution under rapid signal changes",
        timeline: [
          "ML model generated SHORT signal at 18:10:16",
          "Within seconds, another SHORT signal arrived at 18:10:22",
          "Early version would execute both — opening duplicate positions",
          "No deduplication existed for same-direction signals in same session",
        ],
        fix: "Built Unified Watchdog v4.2 with explicit session-based state machine. Each signal gets a unique trade ID. Before execution, watchdog checks for existing ACTIVE/AWAITING trades in same direction — replaces expired signals instead of stacking them.",
        outcome:
          "Zero duplicate executions since Watchdog v4.2 deployment. Logs confirm: expired trades are replaced, not duplicated.",
      },
    ],
    whyThisArchitecture:
      "Four concurrent async subsystems in a single process — BotInstanceManager, LiveFeedManager, Watchdog, and API server. The alternative was microservices, but the overhead of inter-service communication at 1-second cycles would have added latency that matters in live trading. Single process with strict async isolation gives the reliability of separation without network hops.",
    media: {
      images: [
        {
          src: `${BASE}projects/ant-meta-bots/dashboard.png`,
          alt: "ANT Meta Bots — Live trading dashboard",
          caption:
            "Real-time dashboard showing bot status, signals, and trade lifecycle",
        },
        {
          src: `${BASE}projects/ant-meta-bots/running_bot_details_along_with_trades.png`,
          alt: "ANT Meta Bots — Running bot details with active trades",
          caption:
            "Bot details panel showing active trade management and execution state",
        },
      ],
      videos: [],
      logSnippet: [
        "23:47:12 INFO ✓ History built: 2750 bars",
        "23:47:12 INFO 📊 Stored 200 initial signals",
        "06:48:34 INFO Breakout confirmed for SHORT at 67584.82 | Executing order...",
        "06:48:35 INFO Trade OPENED: SHORT P-BTC-67500-030426 @ 917.00 | TP: 2109.10 | SL: 687.75",
        "18:45:38 INFO Trade CLOSED (WIN): TP_HIT | Net PnL: +0.46 | Actual Exit: 81.80",
        "20:06:04 INFO Trade CLOSED (WIN): TRAILING_HIT | Net PnL: +0.20 | Actual Exit: 1120.00",
        "23:10:27 INFO Replaced EXPIRED trade 352ed08d7a14 (SHORT) with better signal",
        "22:10:18 INFO Re-entry crossover confirmed for LONG | Executing re-entry...",
        "22:30:46 ERROR Trade CLOSED (LOSS): REENTRY_EXHAUSTED | Total PnL: -0.16",
      ],
      diagrams: [
        {
          src: `${BASE}projects/ant-meta-bots/diagrams/diagram-3.png`,
          title: "System Architecture",
        },
        {
          src: `${BASE}projects/ant-meta-bots/diagrams/diagram-4.png`,
          title: "Database Schema",
        },
        {
          src: `${BASE}projects/ant-meta-bots/diagrams/diagram-5.png`,
          title: "Deployment Architecture",
        },
      ],
    },
  },
  {
    slug: "elastic-dca",
    title: "Elastic DCA Engine v4",
    subtitle: "Server-Centric Trading State Machine",
    thesis:
      "A three-tier, server-authoritative trading engine that transforms MetaTrader 5 into a stateless execution client. Deterministic DCA grid strategies, automated hedging, and real-time WebSocket control — all managed by a Python backend that owns every state transition.",
    priority: "major",
    accentColor: "#8b5cf6",
    stack: ["Python", "FastAPI", "MQL5", "React", "WebSocket", "SQLite"],
    github: "https://github.com/kumawat-aditya/elastic-dca-trader",
    metrics: {
      scale: "Dual independent buy/sell grid state machines",
      latency: "1-second tick-driven evaluation and response cycle",
      reliability: "Deterministic execution — crash-recoverable via SQLite",
      automation: "Full grid trading with automated hedging and risk controls",
    },
    highlights: [
      "Server-authoritative architecture — MT5 is stateless",
      "Deterministic step-based execution pipeline",
      "Crash-recoverable state persistence",
    ],
    whatItDoes:
      "A complete rebuild of a trading system that separates backend logic from MetaTrader 5 execution. The Python backend owns all trading intelligence — grid management, DCA entries, hedge triggers, TP/SL — while the MT5 EA acts as a stateless polling client. React dashboard provides real-time WebSocket control.",
    architecture: [
      "Three-tier event-driven architecture: MQL5 EA (Execution) → FastAPI Singleton Engine (State) → React UI (Control)",
      "1-second continuous tick loop managing HTTP POST ingestion, state evaluation, action generation, and WebSocket broadcasting",
      "In-memory runtime state paired with SQLite/SQLAlchemy for persisting grid configuration presets",
      "Action-queue architecture — server appends actions internally, flushes on EA's next polling request",
    ],
    engineering: [
      "Built asynchronous EA Timeout Watcher that forces hard state resets if MT5 terminal connection drops for >10 seconds",
      "Mapped live PnL and trade execution status by matching MT5 trade comments against server-side session UUIDs",
      "Implemented merge-on-update concurrency control — write-protects executed grid rows while allowing live mutation of pending targets",
      "Suppressed high-frequency Uvicorn access logs for 1Hz tick/WebSocket endpoints via custom EndpointFilters",
    ],
    challenges: [
      "Maintaining state consistency between FastAPI backend and MQL5 EA across network failures",
      "Designing a step-based pipeline that handles all edge cases in trade lifecycle",
      "Reliable tick queue processing under varying market volatility",
      "Zombie/orphan trade detection from previous sessions",
    ],
    failures: [
      "Version 1 had MQL5 + server architecture with state.json persistence — desync between MT5 and server caused repeated execution loops and lost real money",
      "PnL mismatches between server and MT5 caused by incorrect trade mapping",
      "No recovery strategy in original design — crashes meant manual position reconstruction",
      "State file corruption during rapid market moves left system unable to distinguish live positions from phantom ones",
    ],
    tradeoffs: [
      "Server authority vs terminal authority — chose server as source of truth with terminal as execution layer",
      "Pull-based action queue (avoids MT5 thread locking) vs. server-push via WebSockets (lower latency but harder MT5 integration)",
      "In-memory singleton state (zero-latency evaluation) vs. database-backed runtime state (crash recovery persistence)",
    ],
    improvements: [
      "Multi-asset support for portfolio-level grid management",
      "Performance analytics dashboard",
      "Automated parameter optimization system",
    ],
    insight:
      "Synchronization between independent systems requires shared contracts, not direct control.",
    relatedLab: [
      "csv-state-corruption-incident",
      "deterministic-execution",
      "mistakes-elastic-dca",
    ],
    tags: ["real-time", "state-machine", "distributed", "trading", "backend"],
    proofCapsules: [
      {
        claim: "Deterministic execution — crash-recoverable",
        evidence:
          "Step-based pipeline: receive tick → evaluate conditions → generate actions → dispatch to EA → verify execution. Each step is atomic. If system crashes mid-step, it resumes exactly where it left off.",
        source: "architecture",
      },
      {
        claim: "Server-centric architecture — MetaTrader is stateless",
        evidence:
          "EA polls POST /api/v1/ea/tick every second, receives {actions: [...]} back. All trading intelligence lives in Python DcaEngine singleton, not in MT5.",
        source: "architecture",
      },
    ],
    constraints: [
      {
        dimension: "Execution model",
        value: "Tick-driven step pipeline (1s cycles)",
      },
      {
        dimension: "State authority",
        value: "Server is source of truth, EA is stateless executor",
      },
      {
        dimension: "Failure recovery",
        value: "SQLite-backed state — survives crashes",
      },
      {
        dimension: "Isolation",
        value: "Independent buy/sell grid systems with isolated state machines",
      },
    ],
    incidents: [
      {
        title: "CSV state corruption during volatile market",
        timeline: [
          "Version 1 stored all state in CSV files on disk",
          "Market spiked — system needed to update state rapidly",
          "Crash during write left CSV in corrupted state",
          "System thought it had positions it didn't — manual cleanup, lost money",
        ],
        fix: "Complete rebuild: replaced CSV with SQLite database, added transactional state updates, built automatic orphan trade detection and cleanup.",
        outcome:
          "Zero state corruption incidents since migration to SQLite. System recovers automatically from crashes.",
      },
    ],
    whyThisArchitecture:
      "Server-centric because MT5 EAs have severe limitations — no persistent state, no reliable networking, no debugging tools. Moving all intelligence to Python/FastAPI gives full control over state, logging, and recovery. EA becomes a thin HTTP client that just executes instructions.",
    media: {
      images: [
        {
          src: `${BASE}projects/elastic-dca/dashboard.png`,
          alt: "Elastic DCA — Trading dashboard with grid state",
          caption:
            "React dashboard showing live grid state, PnL tracking, and trade controls",
        },
      ],
      videos: [
        {
          src: `${BASE}projects/elastic-dca/demo.mp4`,
          caption:
            "Live demo showing server-EA synchronization and grid execution",
        },
      ],
      diagrams: [
        {
          src: `${BASE}projects/elastic-dca/diagrams/diagram-1.png`,
          title: "System Architecture",
        },
        {
          src: `${BASE}projects/elastic-dca/diagrams/diagram-2.png`,
          title: "Tick Evaluation Loop",
        },
        {
          src: `${BASE}projects/elastic-dca/diagrams/diagram-3.png`,
          title: "Grid Execution Flow",
        },
        {
          src: `${BASE}projects/elastic-dca/diagrams/diagram-4.png`,
          title: "Cycle & Hedge Flow",
        },
        {
          src: `${BASE}projects/elastic-dca/diagrams/diagram-5.png`,
          title: "Database Schema",
        },
        {
          src: `${BASE}projects/elastic-dca/diagrams/diagram-6.png`,
          title: "State Model",
        },
      ],
    },
  },
  {
    slug: "signal-distribution",
    title: "Signal Distribution System",
    subtitle: "Event-Driven Trade Execution Pipeline",
    thesis:
      "An event-driven Spring Boot application that bridges unstructured Telegram trading signals with MetaTrader 5 execution via a pull-based, concurrent in-memory pipeline. Each MT5 account gets an isolated signal queue with TTL-based expiry.",
    priority: "major",
    accentColor: "#22d3ee",
    stack: [
      "Java 21",
      "Spring Boot",
      "Telegram Bot API",
      "MQL5",
      "MariaDB",
      "AWS EC2",
    ],
    github: "private",
    metrics: {
      scale: "Concurrent per-account signal isolation via ConcurrentHashMap",
      latency: "10-second polling cycle with real-time Telegram long-polling",
      reliability: "TTL-based expiry — 10s market, 10min pending orders",
      automation: "Automated signal parsing to multi-account MT5 execution",
    },
    highlights: [
      "Pull-based REST execution model",
      "Per-account concurrent signal queues",
      "7-pattern regex signal validation",
      "Stateful Telegram admin bot for CRUD",
    ],
    whatItDoes:
      "Long-polls Telegram groups, extracts and validates trade signals via multi-regex parsing, enqueues per-user execution commands, and serves validated payloads to MT5 clients polling every 10 seconds. Includes dynamic market/pending order execution, modification, and cancellation lifecycle.",
    architecture: [
      "Long-polling Telegram consumer bridging unstructured chat signals to REST-based polling API",
      "In-memory producer-consumer queue system grouping signals by MT5 account ID for isolated distribution",
      "Headless backend operated entirely via Telegram bot administrative commands and scheduled jobs",
      "JVM Virtual Threads enabled for concurrent polling request handling across registered clients",
    ],
    engineering: [
      "Enforced TTL-based signal expiry: 10 seconds for market orders, 600 seconds for pending orders",
      "Developed custom Exception Hierarchy (ApplicationException) routing user-facing vs internal errors",
      "Programmed dynamic broker-specific symbol normalization in MT5 EA (e.g., appending 'm' for Exness, '.a' for ICM)",
      "Implemented cron-scheduled JSON backup service exporting MariaDB users table to administrators",
    ],
    challenges: [
      "Parsing unstructured Telegram messages with wildly varying signal formats",
      "Ensuring delivery under Telegram API rate limits without missing critical trades",
      "Broker symbol mismatches across different MetaTrader environments",
    ],
    failures: [
      "Wrong signal parsing due to format variation caused incorrect trade placement",
      "Duplicate signal execution before deduplication layer was built",
      "Telegram API connection drops during high-activity periods caused missed signals",
    ],
    tradeoffs: [
      "Pull-based REST delivery vs. push-based WebSockets — chose pull to bypass MT5 network/firewall constraints",
      "In-memory ConcurrentLinkedQueues vs. persistent message broker — chose lightweight for ephemeral signals",
      "Stateful Telegram Bot Admin UI vs. dedicated web frontend — chosen for operational speed and reduced attack surface",
    ],
    improvements: [
      "Persistent message queue for guaranteed delivery under high load",
      "Web dashboard for real-time signal monitoring",
      "Signal performance tracking and analytics",
    ],
    insight:
      "In distributed systems integrating with external chat protocols, delivery guarantees and strict payload validation matter more than raw backend execution speed.",
    relatedLab: [],
    tags: ["event-driven", "distributed", "real-time", "backend", "java"],
    proofCapsules: [
      {
        claim: "Pull-based execution prevents delivery failures",
        evidence:
          "MT5 EAs poll GET /api/poll/{metaTraderId} every 10 seconds. Server never pushes — eliminates push failure modes entirely.",
        source: "architecture",
      },
      {
        claim: "Per-account signal isolation",
        evidence:
          "ConcurrentHashMap<String, ConcurrentLinkedQueue> — each MT5 account gets an independent signal queue. One account's failure can't block others.",
        source: "architecture",
      },
      {
        claim: "TTL-based signal expiry prevents stale execution",
        evidence:
          "Market orders expire after 10 seconds, pending orders after 10 minutes. Prevents executing outdated signals in volatile markets.",
        source: "architecture",
      },
    ],
    constraints: [
      { dimension: "Delivery model", value: "Pull-based polling (10s cycles)" },
      { dimension: "State isolation", value: "Per-account in-memory queues" },
      { dimension: "Signal TTL", value: "10s market / 10min pending orders" },
      { dimension: "Recovery", value: "systemd-managed process on AWS EC2" },
    ],
    incidents: [
      {
        title: "Duplicate execution from repeated polling",
        timeline: [
          "MT5 EA polled server and received signal",
          "Network timeout caused EA to not acknowledge receipt",
          "EA polled again — received same signal again",
          "Placed duplicate trade on account",
        ],
        fix: "Implemented idempotent polling with message ID tracking. Signal is dequeued on first poll, subsequent polls return empty.",
        outcome:
          "Zero duplicate trades after implementing message-ID-based dequeue mechanism.",
      },
    ],
    whyThisArchitecture:
      "Push-based delivery to MT5 was unreliable — connection drops during high activity, no delivery confirmation. Pull-based polling with in-memory queues was simpler and more reliable. No external message broker needed — ConcurrentLinkedQueue handles the throughput at this scale.",
    media: {
      images: [
        {
          src: `${BASE}projects/signal-distribution/signal_forwarder_group_chat_signals.png`,
          alt: "Signal Distribution — Telegram group signal forwarding",
          caption:
            "Signal forwarder parsing and distributing trades from Telegram group messages",
        },
      ],
      videos: [
        {
          src: `${BASE}projects/signal-distribution/admin_chat_with_bot.mp4`,
          caption:
            "Admin bot interaction for user management and system control",
        },
      ],
      diagrams: [
        {
          src: `${BASE}projects/signal-distribution/diagrams/diagram-1.png`,
          title: "System Architecture",
        },
        {
          src: `${BASE}projects/signal-distribution/diagrams/diagram-2.png`,
          title: "Signal Processing Flow",
        },
        {
          src: `${BASE}projects/signal-distribution/diagrams/diagram-3.png`,
          title: "Order Execution Flow",
        },
        {
          src: `${BASE}projects/signal-distribution/diagrams/diagram-4.png`,
          title: "System Deployment",
        },
      ],
    },
  },
  {
    slug: "qubiforge",
    title: "Quant Discovery Pipeline",
    subtitle: "Automated Strategy Mining System",
    thesis:
      "A high-performance, multi-layer ML pipeline that discovers statistically validated trading strategies by exhaustively simulating trades and learning patterns from enriched market data. Runs on commodity hardware (Ryzen 5 5600X, 16GB RAM) without ever loading the full dataset into memory.",
    priority: "major",
    accentColor: "#f59e0b",
    stack: [
      "Python",
      "NumPy",
      "Pandas",
      "Numba",
      "XGBoost",
      "Scikit-learn",
      "Parquet",
      "Multiprocessing",
    ],
    github: "https://github.com/kumawat-aditya/Quant-Discovery-Pipeline",
    metrics: {
      scale: "Hundreds of millions of trade combinations per run",
      latency: "~1.5 days → ~30 minutes (Ryzen 5 5600X, 16GB RAM)",
      reliability: "Chunk-based streaming — never loads full dataset in memory",
      automation: "Fully configurable via single orchestrator config",
    },
    highlights: [
      "5-layer pipeline (Bronze → Diamond)",
      "~1.5 days → ~30min optimization",
      "300+ engineered features per row",
      "Runs on 16GB RAM hardware",
    ],
    whatItDoes:
      "Converts raw OHLCV market data through five sequential pipeline layers (Bronze → Silver → Gold → Platinum → Diamond) into actionable strategy models. Bronze simulates millions of trade outcomes, Silver enriches with 300+ technical features, Gold normalizes, Platinum mines rules with Decision Trees, Diamond trains XGBoost classifiers. Each layer processes and flushes in chunks — the full dataset never exists in memory at once.",
    architecture: [
      "Sequential data pipeline (Bronze → Silver → Gold) splitting into dual terminal paths (Platinum → Diamond)",
      "Bronze layer: exhaustive multi-timeframe trade simulation across customizable SL/TP grids using multiprocessing pools",
      "Silver/Gold layers: ATR-based swing detection (ZigZag), technical indicator enrichment, strict rolling Z-score normalization",
      "Platinum/Diamond: Map-Reduce Decision Tree mining or Gold⋈Silver inner joins for XGBoost matrix construction",
    ],
    engineering: [
      "Replaced native Python loops with Numba JIT compilation — exhaustive simulation went from ~1.5 days to ~30 minutes on Ryzen 5 5600X",
      "Implemented explicit buffer flushing to PyArrow Parquet files across all layers to enforce strict peak RAM boundaries on 16GB hardware",
      "Integrated TA-Lib C library alongside pandas-native 'ta' library for comprehensive candlestick pattern recognition",
      "Centralized pipeline configuration (SL/TP ratios, normalization rules, hyper-parameters) into a single config-driven orchestrator",
    ],
    challenges: [
      "Memory management when processing massive datasets on hardware that can't hold them — redesigned as stream pipeline",
      "Identifying computational bottlenecks across five distinct pipeline stages with different CPU/memory profiles",
      "Preventing data leakage in ML normalization across temporal boundaries",
    ],
    failures: [
      "First version ran for ~1.5 days and frequently crashed with OOM errors at Silver layer when indicators expanded row size",
      "CSV-based I/O created bottlenecks that negated computation optimizations",
      "Data leakage in early normalization attempts before strict temporal train/val splits were enforced",
    ],
    tradeoffs: [
      "Interpretability (Decision Tree rules) vs. predictive power (XGBoost) — pipeline supports both terminal paths",
      "Modular layered architecture (disk I/O overhead) vs. single monolithic script (memory overflow risk)",
      "Full-memory XGBoost training (speed) vs. IterativeDMatrix streaming (16GB RAM compatibility)",
    ],
    improvements: [
      "Stream processing for real-time strategy evaluation",
      "GPU-accelerated feature computation with RAPIDS",
      "Distributed processing with Dask for multi-machine workloads",
    ],
    insight:
      "At scale, data architecture, chunking strategies, and explicit memory management matter significantly more than the complexity of the underlying ML models.",
    relatedLab: ["scaling-pipeline"],
    tags: ["data-engineering", "ml", "pipeline", "optimization", "backend"],
    proofCapsules: [
      {
        claim: "Massive dataset processed on commodity hardware",
        evidence:
          "Pipeline restructured as a stream — each layer processes and flushes chunks independently. Parquet replaced CSV. Numba JIT + multiprocessing brought simulation from ~1.5 days to ~30 minutes on Ryzen 5 5600X, 16GB RAM.",
        source: "metric",
      },
      {
        claim: "Runs on hardware that can't hold the full dataset in memory",
        evidence:
          "Explicit buffer flushing to PyArrow Parquet at every layer boundary. Peak RAM never exceeds hardware limits. Iterative XGBoost QuantileDMatrix streaming for model training.",
        source: "architecture",
      },
    ],
    constraints: [
      {
        dimension: "Hardware",
        value: "Ryzen 5 5600X, 16GB RAM — commodity machine",
      },
      {
        dimension: "Memory model",
        value: "Chunk-based streaming — never loads full dataset",
      },
      { dimension: "I/O format", value: "Parquet (replaced CSV)" },
      {
        dimension: "Compute",
        value: "Numba JIT + multiprocessing across cores",
      },
    ],
    incidents: [
      {
        title: "OOM crash at Silver layer",
        timeline: [
          "Full dataset loaded into memory at Bronze layer",
          "Silver layer added 300+ technical indicators per row",
          "Memory usage spiked beyond 16GB RAM limit",
          "Process killed by OS — entire pipeline run lost",
        ],
        fix: "Restructured pipeline as a stream. Each layer processes chunks independently and flushes to Parquet before next layer reads. Switched from CSV to Parquet for dramatically improved I/O.",
        outcome:
          "Pipeline completes reliably on 16GB hardware. No memory-related crashes since restructure.",
      },
    ],
    whyThisArchitecture:
      "Five-layer separation (Bronze → Diamond) isolates compute concerns. Bronze does raw simulation, Silver adds features, Gold normalizes, Platinum mines rules, Diamond trains models. Each layer has different memory/compute profiles — separating them allows per-layer optimization without affecting others.",
    media: {
      images: [],
      videos: [],
      diagrams: [
        {
          src: `${BASE}projects/qubiforge/diagrams/diagram-1.png`,
          title: "Complete Data Pipeline",
        },
        {
          src: `${BASE}projects/qubiforge/diagrams/diagram-2.png`,
          title: "Pipeline Flow",
        },
      ],
    },
  },
  {
    slug: "lorentzian-ml",
    title: "Lorentzian ML Engine",
    subtitle: "Cross-Platform Signal Generation System",
    thesis:
      "A cross-language, deterministic implementation of a Lorentzian-distance KNN trading strategy. Reverse-engineered from TradingView Pine Script to strict parity in MQL5 and Python — without external ML libraries. Powers the signal generation in ANT Meta Bots.",
    priority: "supporting",
    accentColor: "#ec4899",
    stack: ["Python", "MQL5", "Pine Script v5", "Algorithm Design"],
    github: "https://github.com/kumawat-aditya/lorentzian_strategy",
    metrics: {
      scale: "~2000 training bars + 500 backtest + 250 warmup (configurable)",
      latency: "Sub-millisecond inference per candle close",
      reliability: "100% deterministic cross-language parity",
      automation:
        "Stateless, pure-function library — plugs into external systems",
    },
    highlights: [
      "100% cross-language parity (Pine → MQL5 → Python)",
      "Zero external ML dependencies",
      "Lorentzian distance metric for time-series",
      "Powers ANT Meta Bots signal engine",
    ],
    whatItDoes:
      "Consumes raw OHLCV streams, initializes configurable historical data windows, and deterministically computes live directional probabilities using non-parametric KNN with Lorentzian distance. Signals are gated through dual Nadaraya-Watson kernel regression estimators and a multi-gate boolean filter pipeline before emission.",
    architecture: [
      "Three parallel, decoupled implementations sharing identical data structures across Pine Script, MQL5, and Python",
      "Three-phase pipeline: Warmup → Training → Backtest/Live on configurable historical windows",
      "Per-bar state embedding design — every bar carries its full intermediate indicator state for O(1) step-forward calculations",
    ],
    engineering: [
      "Replaced Euclidean distance with logarithmic Lorentzian distance to naturally discount black-swan outliers",
      "Optimized O(N) KNN search to O(0.75·N) via modulo-4 filtering rule to skip redundant adjacent candidates",
      "Warped neighbor selection threshold to 75th percentile of active candidate pool for high-conviction matches",
      "Target training labels assigned 4 bars in arrears — zero look-ahead bias in live prediction",
      "Rebuilt core normalization, RMA/EMA, and regression functions in standard Python — no pandas or scikit-learn",
    ],
    challenges: [
      "Replicating TradingView's implicit execution model and native indicator states in explicit, managed data structures",
      "Achieving floating-point parity across three languages with different numeric handling",
      "O(N) performance degradation during high-frequency live polling — mitigated via modulo-4 optimization",
    ],
    failures: [
      "Accumulated floating-point drift in RMA/EMA calculations caused delayed signal divergence between MT5 and Python — solved by mirroring exact per-bar state objects",
      "Look-ahead bias corrupted ML training labels during backtesting — solved by strict 4-bar delayed assignment",
      "Initial Pine Script translation treated it as syntax conversion — failed because TradingView's execution model is fundamentally different",
    ],
    tradeoffs: [
      "Zero external dependencies (complex custom math) vs. importing scikit-learn (slower, breaks cross-language parity)",
      "Fixed-size ring buffers (strict memory control) vs. dynamically growing lists (simpler but unsafe for long-running systems)",
      "Lorentzian distance (heavier log calculations) vs. Euclidean (faster but hypersensitive to price anomalies)",
    ],
    improvements: [
      "GPU-accelerated KNN search for larger training windows",
      "Online learning with adaptive training window sizing",
      "Feature importance analysis for dynamic indicator selection",
    ],
    insight:
      "Porting complex financial algorithms across languages requires mapping the hidden execution context and state-management lifecycle of the origin platform, not just translating mathematical syntax.",
    relatedLab: ["cross-language-parity"],
    tags: ["machine-learning", "algorithm-design", "cross-platform", "quant"],
    proofCapsules: [
      {
        claim: "100% deterministic cross-language parity",
        evidence:
          "Three implementations (Pine Script, MQL5, Python) produce identical signals given identical input data. Verified by mirroring exact per-bar state objects across all three runtimes.",
        source: "behavior",
      },
      {
        claim: "Zero external ML dependencies",
        evidence:
          "All normalization, EMA/RMA, KNN, kernel regression, and feature extraction rebuilt from scratch in standard Python and MQL5 — no pandas, no scikit-learn.",
        source: "architecture",
      },
    ],
    constraints: [
      {
        dimension: "Parity requirement",
        value: "100% identical outputs across Pine/MQL5/Python",
      },
      {
        dimension: "Dependencies",
        value: "Zero external ML libraries — pure standard library",
      },
      {
        dimension: "Look-ahead bias",
        value: "4-bar delayed label assignment, strict temporal splits",
      },
    ],
    incidents: [],
    whyThisArchitecture:
      "Decoupled signal generation from execution environments. The Python module acts as a stateless, pure-function library that external trading bots (like ANT Meta Bots) can import directly. Cross-language parity ensures the strategy behaves identically whether running on TradingView for visual validation or in Python for live execution.",
    media: {
      images: [
        {
          src: `${BASE}projects/lorentzian-ml/chart_ss_with_signals.png`,
          alt: "Lorentzian ML — Chart with generated trading signals",
          caption:
            "Chart showing ML-generated buy/sell signals with kernel regression confirmation",
        },
        {
          src: `${BASE}projects/lorentzian-ml/trade_states_ss.png`,
          alt: "Lorentzian ML — Trade state transitions",
          caption:
            "Signal state transitions from detection through execution lifecycle",
        },
      ],
      videos: [],
      diagrams: [
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-1.png`,
          title: "Architecture Overview",
        },
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-2.png`,
          title: "Data Flow",
        },
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-3.png`,
          title: "Three-Phase Processing Model",
        },
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-4.png`,
          title: "Bar Data Structure",
        },
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-5.png`,
          title: "Configuration Structures",
        },
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-6.png`,
          title: "Computation Pipeline",
        },
        {
          src: `${BASE}projects/lorentzian-ml/diagrams/diagram-7.png`,
          title: "Filter Pipeline",
        },
      ],
    },
  },
  {
    slug: "stella",
    title: "Stella",
    subtitle: "Transactional E-Commerce Backend",
    thesis:
      "A production-style RESTful e-commerce backend implementing a fully transactional order lifecycle, stateless JWT authentication, and strict 3-tier architectural separation. Architecture-first design with Razorpay payment integration and HMAC-SHA256 verification.",
    priority: "supporting",
    accentColor: "#22c55e",
    stack: [
      "Java 17",
      "Spring Boot 3",
      "Spring Security 6",
      "JWT",
      "MariaDB",
      "Razorpay",
    ],
    github: "https://github.com/kumawat-aditya/stella",
    metrics: {
      scale: "Multi-role system — independent buyer/seller ecosystems",
      latency: "Synchronous Spring Boot with optimized JPA queries",
      reliability: "Two-phase payment verification with HMAC-SHA256",
      automation: "Full lifecycle from product upload to order completion",
    },
    highlights: [
      "Dual JWT authentication domains",
      "HMAC-SHA256 payment verification",
      "Strict 3-tier architecture",
      "Interface-segregated service layer",
    ],
    whatItDoes:
      "Full backend for an e-commerce platform. Separate JWT-based authentication for Users and Sellers. Transactional order lifecycle managing payment through Razorpay's two-phase verification. Product management, search, cart operations, and multi-part image uploads with strict MIME validation.",
    architecture: [
      "3-tier layered Spring Boot application: Presentation → Business Logic → Data Access",
      "Stateless backend using custom JWTAuthenticationFilter and SecurityContextHolder for identity resolution",
      "Decoupled buyer/seller workflows isolated at the HTTP boundary using Spring Security hasRole() expressions",
    ],
    engineering: [
      "Two-phase payment workflow: order states (creating → created → paid) only transition after HMAC-SHA256 signature verification",
      "Global exception handling via @ControllerAdvice mapping internal exceptions to structured HTTP JSON errors",
      "Repository-driven data access using Spring Data JPA derived queries — completely abstracting raw SQL",
      "Strict DTO-to-Entity mapping preventing over-exposure of internal database schema to HTTP clients",
    ],
    challenges: [
      "Clean separation between seller and user contexts without code duplication",
      "Handling concurrent cart operations and inventory consistency",
      "Razorpay webhook verification for reliable payment confirmation under callback failures",
    ],
    failures: [
      "Early iterations had over-coupled services — changes in seller flow broke user flow",
      "Database query inefficiencies surfaced under simulated load",
      "Duplicate payment callback attempts initially processed orders twice before idempotent state checks",
    ],
    tradeoffs: [
      "Stateless JWT vs. server-side sessions — chose for RESTful API decoupling",
      "Monolithic 3-tier simplicity vs. microservices — chosen for transactional consistency",
      "Local filesystem media storage vs. S3 — chosen for zero-setup local deployment",
    ],
    improvements: [
      "Event sourcing for order lifecycle tracking",
      "Caching layer for product search performance",
      "Notification system for order status updates",
    ],
    insight:
      "In distributed transactional systems, the correctness and idempotency of state transitions matter significantly more than feature completeness.",
    relatedLab: [],
    tags: ["backend", "architecture", "ecommerce", "api-design", "java"],
    proofCapsules: [
      {
        claim: "Two-phase payment verification with Razorpay",
        evidence:
          "Orders are only confirmed after HMAC-SHA256 signature verification from Razorpay callback. Prevents payment-state mismatch and duplicate processing.",
        source: "architecture",
      },
    ],
    constraints: [
      {
        dimension: "Auth model",
        value: "Stateless JWT with dual domains (buyer/seller)",
      },
      {
        dimension: "Payment safety",
        value: "Two-phase Razorpay signature verification",
      },
      {
        dimension: "Architecture",
        value: "Strict Controller → Service → Repository layering",
      },
    ],
    incidents: [],
    whyThisArchitecture:
      "Monolithic with strict layer separation — clean enough for single-team development, simple enough for single-database consistency. Microservices would add distributed transaction complexity for a payment flow that needs atomicity.",
    media: {
      images: [
        {
          src: `${BASE}projects/stella/startup_console_image.png`,
          alt: "Stella — Spring Boot startup console",
          caption:
            "Application startup showing initialized endpoints and database connections",
        },
      ],
      videos: [
        {
          src: `${BASE}projects/stella/DEMO.mp4`,
          caption:
            "Full demo of e-commerce workflow — product listing to payment verification",
        },
      ],
      diagrams: [
        {
          src: `${BASE}projects/stella/diagrams/diagram-1.png`,
          title: "Architecture Overview",
        },
        {
          src: `${BASE}projects/stella/diagrams/diagram-2.png`,
          title: "Order Placement Data Flow",
        },
        {
          src: `${BASE}projects/stella/diagrams/diagram-4.png`,
          title: "Security Architecture",
        },
      ],
    },
  },
  {
    slug: "rubiks-solver",
    title: "Rubik's Cube Solver",
    subtitle: "State-Space Search & Optimization Engine",
    thesis:
      "A terminal-based C++17 Rubik's Cube solving engine that applies the CFOP method and multi-start local search to compute near-optimal solutions in under 2 seconds without external dependencies. Evaluates thousands of candidate paths across all 6 cube orientations.",
    priority: "supporting",
    accentColor: "#f43f5e",
    stack: ["C++17", "STL", "Algorithms", "OOP"],
    github: "https://github.com/kumawat-aditya/rubix-cube-solver",
    metrics: {
      scale: "~43 quintillion possible states — 6xN solution trees evaluated",
      latency: "~2 seconds per solve on commodity hardware",
      reliability: "Consistently solves under 42 moves",
      automation: "Fully automated — input state, get optimized solution",
    },
    highlights: [
      "Custom 3D state engine (no libraries)",
      "CFOP algorithm implementation",
      "Multi-start search across all orientations",
      "~2 second solve time",
    ],
    whatItDoes:
      "Interactively validates 54 color inputs, generates thousands of candidate CFOP solutions across all 6 cube orientations, and sequentially plays back the shortest sequence using colored terminal animation. Multi-start local search with stochastic F2L randomization approximates globally optimal move counts.",
    architecture: [
      "Single-process CLI: modular CFOP pipeline (Cross → F2L → OLL → PLL)",
      "Core state: 3D vector representation CubeMain[6][3][3] as single source of truth",
      "Orchestrator (CubeSolver) drives independent solver stages using Template Method overriding",
    ],
    engineering: [
      "Zero third-party dependencies — pure C++17 STL and ANSI escape codes for terminal rendering",
      "Custom macro-based DSL and side-rotation remapping engine for universal algorithm execution across any face",
      "Prototype copy-constructors for cheap state cloning at solver boundaries — avoids complex undo/rollback logic",
      "Iterative multi-pass move-cancellation optimizer for final solution compression",
    ],
    challenges: [
      "Efficient 3D state representation supporting fast move operations without memory leaks",
      "F2L pair detection across all cube orientations",
      "Side-rotation remapping logic initially caused incorrect state mutations on non-front faces",
    ],
    failures: [
      "Initial brute-force search exhausted memory and compute time before reaching valid solutions",
      "Redundant consecutive moves (U followed by U') bloated output — solved via static multi-pass Optimizer",
      "Single-threaded early approach was too slow for practical use — added multi-start search",
    ],
    tradeoffs: [
      "Exhaustive multi-start local search vs. heuristic pruning — chosen for optimal Cross/F2L selection",
      "Value semantics via copying full state vs. maintaining undo stack — chosen for simplicity and isolation",
      "Terminal ANSI rendering vs. external GUI — chosen for strict zero-dependency build",
    ],
    improvements: [
      "Kociemba two-phase algorithm for near-optimal solutions",
      "3D WebGL visualization",
      "Support for arbitrary NxN cube sizes",
    ],
    insight:
      "When dealing with massive state spaces, constraining the search area with domain-specific heuristics is far more efficient than pure brute-force calculation.",
    relatedLab: [],
    tags: ["algorithms", "c++", "optimization", "problem-solving"],
    proofCapsules: [
      {
        claim: "Solves any valid configuration in under 2 seconds",
        evidence:
          "Multi-start search across 6 cube orientations. Evaluates thousands of candidate paths per solve using CFOP pipeline with stochastic F2L branching.",
        source: "metric",
      },
    ],
    constraints: [
      { dimension: "State space", value: "~43 quintillion possible states" },
      { dimension: "Solve time", value: "<2 seconds on commodity hardware" },
      { dimension: "Move optimality", value: "Consistently under 42 moves" },
    ],
    incidents: [],
    whyThisArchitecture:
      "CFOP breaks the massive state space into four constrained sub-problems (Cross → F2L → OLL → PLL). Each phase has a bounded search space. Multi-start across orientations approximates global optimum without exhaustive search.",
    media: {
      images: [
        {
          src: `${BASE}projects/rubiks-solver/cli_ss_solving_cube.png`,
          alt: "Rubik's Cube Solver — CLI solving in progress",
          caption:
            "Terminal output showing CFOP solution steps with color-coded cube state",
        },
      ],
      videos: [
        {
          src: `${BASE}projects/rubiks-solver/Demo.mp4`,
          caption:
            "Full solve demonstration — input validation through optimized solution playback",
        },
      ],
      diagrams: [
        {
          src: `${BASE}projects/rubiks-solver/diagrams/diagram-1.png`,
          title: "Architecture Overview",
        },
        {
          src: `${BASE}projects/rubiks-solver/diagrams/diagram-3.png`,
          title: "Class Hierarchy",
        },
      ],
    },
  },
];
