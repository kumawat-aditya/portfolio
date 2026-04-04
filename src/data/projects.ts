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
}

export const projects: Project[] = [
  {
    slug: "ant-meta-bots",
    title: "ANT Meta Bots",
    subtitle: "ML-Powered Options Trading Platform",
    thesis:
      "This system doesn't just generate trading signals. It executes them, monitors them, and manages the entire trade lifecycle — from signal to exit — with zero human intervention and zero double-execution.",
    priority: "flagship",
    accentColor: "#3b82f6",
    stack: ["Python", "FastAPI", "React", "WebSocket", "SQLite", "Docker"],
    github: "private",
    metrics: {
      scale: "Multiple bots, live feeds, and signal streams — all concurrent",
      latency: "1-second execution cycles across all core systems",
      reliability: "Zero double-execution in production",
      automation: "Fully automated — signal to exit",
    },
    highlights: [
      "Full trade lifecycle management",
      "1-second async execution engine",
      "Zero double-execution guarantee",
    ],
    whatItDoes:
      "End-to-end algorithmic trading platform. ML model generates signals from futures data using Lorentzian k-NN. The system selects options strikes, places orders, monitors fills, manages stop-losses and take-profits, and exits positions — all in real time, without human touch.",
    architecture: [
      "End-to-end pipeline: futures data → ML signal → options execution",
      "Dual live data feeds — futures for signal generation, options for execution monitoring",
      "Multi-bot architecture — each bot runs independently with its own strategy instance",
      "Session-based lifecycle management with controlled trade isolation",
    ],
    engineering: [
      "Unified async Watchdog engine replaced a fragile multi-component setup",
      "Fill verification pipeline with fallback and emergency handlers",
      "SQLite persistence with automatic crash recovery",
      "React dashboard with WebSocket for real-time monitoring and manual override",
    ],
    challenges: [
      "Race conditions in high-frequency signal processing — solved with explicit state machines",
      "State consistency across async operations during live market volatility",
      "Reliable fill verification when exchange APIs had intermittent delays",
    ],
    failures: [
      "Early versions had state desynchronization across threads — signals fired but trades didn't track correctly",
      "Duplicate executions under rapid signal changes before the watchdog engine existed",
      "Initial multi-component architecture was too fragile for production conditions",
    ],
    tradeoffs: [
      "Decoupled architecture added coordination complexity, but eliminated cascading failures",
      "SQLite over PostgreSQL — simpler deployment, acceptable write concurrency for single-machine operation",
      "Chose reliability over raw speed — every execution cycle validates state before acting",
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
      "multi-agent",
      "async",
      "trading",
      "state-management",
      "ml",
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
      { dimension: "Execution cycle", value: "1-second async loop" },
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
  },
  {
    slug: "signal-distribution",
    title: "Signal Distribution Infrastructure",
    subtitle: "Real-Time Trading Signal Broadcasting",
    thesis:
      "Production-grade infrastructure that parses unstructured trading signals from Telegram, validates them, and routes execution commands to individual MetaTrader accounts — each with their own access controls and trade parameters.",
    priority: "major",
    accentColor: "#22d3ee",
    stack: ["Java", "Spring Boot", "WebSocket", "MQL5", "Telegram Bot API"],
    github: "private",
    metrics: {
      scale: "Multiple users and signal streams concurrently",
      latency: "Near real-time message processing and distribution",
      reliability: "Auto-reconnect and self-healing recovery",
      automation: "Automated signal parsing to trade execution",
    },
    highlights: [
      "High-performance signal parsing",
      "Per-user distribution logic",
      "MetaTrader EA execution layer",
    ],
    whatItDoes:
      "Parses multi-target trading signals from Telegram groups, deduplicates and validates them, routes per-user execution commands, and places trades through MetaTrader EAs with automated order management and trailing stop-loss.",
    architecture: [
      "Java server parsing multi-target signals from Telegram channels",
      "Per-user distribution with signal deduplication and MetaTrader ID verification",
      "Controlled broadcast routing to individual user accounts",
      "MetaTrader EA execution with automated order placement and trailing SL",
    ],
    engineering: [
      "Admin-only Telegram bot for client provisioning and access control",
      "Persistent state storage with self-healing recovery on crash",
      "Signal format normalization across inconsistent Telegram message structures",
      "Transition from isolated trading bots to distributed trading infrastructure",
    ],
    challenges: [
      "Parsing unstructured Telegram messages with wildly varying signal formats",
      "Ensuring delivery under Telegram API rate limits without missing critical trades",
      "MetaTrader connection stability across different broker environments",
    ],
    failures: [
      "Wrong signal parsing due to format variation caused incorrect trade placement",
      "Telegram API connection drops during high-activity periods",
      "Duplicate signal execution before deduplication layer was built",
    ],
    tradeoffs: [
      "Flexible parsing vs strict signal structure — chose adaptive parsing with validation fallbacks",
      "Real-time delivery vs validation overhead — added validation without blocking execution",
    ],
    improvements: [
      "Message queue for guaranteed delivery under high load",
      "Web dashboard for real-time signal monitoring",
      "Signal performance tracking and analytics",
    ],
    insight:
      "External APIs are unreliable by default. Systems must be built assuming failure at any point.",
    relatedLab: [],
    tags: ["event-driven", "telegram", "distributed", "real-time", "backend"],
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
  },
  {
    slug: "qubiforge",
    title: "QubiForge",
    subtitle: "Multi-Layer Trading Strategy Pipeline",
    thesis:
      "A five-layer data pipeline that converts raw OHLC data into ML-ready strategy datasets. Processes 570M+ rows in under 10 minutes on hardware that couldn't even hold the full dataset in memory.",
    priority: "major",
    accentColor: "#f59e0b",
    stack: [
      "Python",
      "Pandas",
      "NumPy",
      "Numba",
      "XGBoost",
      "Parallel Processing",
    ],
    github: "https://github.com/kumawat-aditya/trading_strategy_finder",
    metrics: {
      scale: "570M+ rows processed (~57 crore records)",
      latency: "8-9 hours → under 10 minutes",
      reliability: "Chunk-based processing — survives memory limits",
      automation: "Fully configurable via single config file",
    },
    highlights: [
      "570M+ rows processed",
      "8hrs → 10 minutes optimization",
      "Five-layer pipeline architecture",
    ],
    whatItDoes:
      "Converts raw trading data through five pipeline layers (Bronze → Diamond) into actionable strategy models. Each layer adds complexity — from SL/TP grid simulation to XGBoost model training — while processing ~57 crore rows with parallel computation.",
    architecture: [
      "Bronze Layer: SL/TP grid simulation — millions of trade outcome combinations",
      "Silver Layer: 200+ technical indicators + advanced support/resistance modeling",
      "Gold Layer: Rolling-window feature normalization with price-relative scaling",
      "Platinum Layer: Decision Tree rule mining → XGBoost model experimentation",
      "Diamond Layer: Strategy evaluation engine (Profit Factor, Max Drawdown, cost modeling)",
    ],
    engineering: [
      "Optimized pipeline from 8-9 hours to under 10 minutes — 50x improvement",
      "Parallelized processing across ~57 crore rows using Numba JIT and multiprocessing",
      "Restructured pipeline as a stream, not a batch — process and flush in chunks",
      "Switched from CSV to Parquet for efficient I/O under memory constraints",
    ],
    challenges: [
      "Memory management when processing 570M+ rows on hardware that couldn't hold the full dataset",
      "Identifying computational bottlenecks across five distinct pipeline stages",
      "Balancing parallelization overhead vs actual speedup for varying dataset sizes",
    ],
    failures: [
      "First version ran for 8+ hours and frequently crashed with out-of-memory errors at Silver layer",
      "CSV-based I/O created bottlenecks that negated computation optimizations",
    ],
    tradeoffs: [
      "Memory usage vs computation speed — chose streaming chunks over loading full datasets",
      "Precomputation vs flexibility — heavy precomputation traded for faster experimentation cycles",
    ],
    improvements: [
      "Stream processing for real-time strategy evaluation",
      "GPU-accelerated feature computation with RAPIDS",
      "Distributed processing with Dask for multi-machine workloads",
    ],
    insight:
      "Performance optimization isn't about finding one bottleneck. It's about understanding how data flows through your system and removing friction at every stage.",
    relatedLab: ["scaling-570m-rows"],
    tags: [
      "data-engineering",
      "ml",
      "big-data",
      "parallel-processing",
      "optimization",
    ],
    proofCapsules: [
      {
        claim: "570M+ rows processed in under 10 minutes",
        evidence:
          "Previous version took 8-9 hours. Numba JIT + multiprocessing + Parquet I/O brought it under 10 minutes — same data, same output.",
        source: "metric",
      },
      {
        claim: "Runs on hardware that can't hold the full dataset in memory",
        evidence:
          "Pipeline restructured as a stream — each layer processes and flushes chunks instead of loading everything. Parquet replaced CSV to eliminate I/O bottlenecks.",
        source: "architecture",
      },
    ],
    constraints: [
      { dimension: "Data volume", value: "570M+ rows (~57 crore records)" },
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
        title: "Out-of-memory crash at Silver layer",
        timeline: [
          "Full dataset loaded into memory at Bronze layer",
          "Silver layer added 200+ technical indicators per row",
          "Memory usage spiked beyond available RAM",
          "Process killed by OS — entire pipeline lost",
        ],
        fix: "Restructured pipeline as a stream. Each layer processes chunks independently and flushes to Parquet before next layer reads. Switched from CSV to Parquet for 10x I/O improvement.",
        outcome:
          "Pipeline completes reliably on limited hardware. No memory-related crashes since restructure.",
      },
    ],
    whyThisArchitecture:
      "Five-layer separation (Bronze → Diamond) isolates compute concerns. Bronze does raw simulation, Silver adds features, Gold normalizes, Platinum mines rules, Diamond trains models. Each layer has different memory/compute profiles — separating them allows per-layer optimization without affecting others.",
  },
  {
    slug: "stella",
    title: "Stella",
    subtitle: "Scalable E-Commerce Backend",
    thesis:
      "Multi-role backend architecture with separate authentication domains for users and sellers. Architecture-first design inspired by real-world e-commerce ecosystems.",
    priority: "supporting",
    accentColor: "#22c55e",
    stack: ["Java", "Spring Boot", "JWT", "Razorpay", "MySQL"],
    github: "https://github.com/kumawat-aditya/stella",
    metrics: {
      scale: "Multi-role system — users, sellers, admin",
      latency: "Fast API responses with Spring Boot",
      reliability: "Clean layered architecture with separation of concerns",
      automation: "Full lifecycle from product upload to order completion",
    },
    highlights: [
      "Dual authentication domains",
      "Seller + User ecosystem",
      "Payment integration with Razorpay",
    ],
    whatItDoes:
      "Full backend for an e-commerce platform. Separate JWT-based authentication for Users and Sellers. Product management, dynamic search, cart operations, order lifecycle tracking, and payment processing.",
    architecture: [
      "Separate authentication domains for Users and Sellers (JWT-based)",
      "Seller dashboard APIs: product upload, media handling, review management",
      "User-side systems: dynamic search, cart management, order lifecycle tracking",
    ],
    engineering: [
      "Razorpay payment gateway integration with webhook verification",
      "Clean layered architecture with strict separation of concerns",
      "Designed for modular extension without breaking existing flows",
      "Architecture-first approach — planned before coded",
    ],
    challenges: [
      "Clean separation between seller and user contexts without code duplication",
      "Handling concurrent cart operations and inventory consistency",
      "Razorpay webhook verification for reliable payment confirmation",
    ],
    failures: [
      "Early iterations had over-coupled services — changes in seller flow broke user flow",
      "Database query inefficiencies surfaced under simulated load",
    ],
    tradeoffs: [
      "Flexibility vs complexity in role separation — chose clean boundaries over shared shortcuts",
      "Feature richness vs maintainability — limited initial scope to maintain code quality",
    ],
    improvements: [
      "Event sourcing for order lifecycle tracking",
      "Caching layer for product search performance",
      "Notification system for order status updates",
    ],
    insight:
      "Good backend architecture is about planning before coding, not fixing after.",
    relatedLab: [],
    tags: ["backend", "architecture", "ecommerce", "api-design", "database"],
    proofCapsules: [
      {
        claim: "Two-phase payment verification with Razorpay",
        evidence:
          "Orders are only confirmed after HMAC signature verification from Razorpay callback. Prevents payment-state mismatch.",
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
  },
  {
    slug: "elastic-dca",
    title: "Elastic DCA",
    subtitle: "Deterministic Trading Automation",
    thesis:
      "A re-architected trading system that separates backend logic from MetaTrader execution. Step-based pipeline ensures deterministic state management across two independent runtimes that must stay in sync.",
    priority: "major",
    accentColor: "#8b5cf6",
    stack: ["MQL5", "Python", "FastAPI", "React", "WebSocket", "SQLite"],
    github: "https://github.com/kumawat-aditya/elastic-dca-trader",
    metrics: {
      scale: "Multiple grid systems and trade flows",
      latency: "Real-time tick-level processing",
      reliability: "Deterministic execution — crash-recoverable",
      automation: "Fully automated grid trading with risk controls",
    },
    highlights: [
      "Decoupled execution engine",
      "Deterministic trade management",
      "Advanced risk controls",
    ],
    whatItDoes:
      "Fully rebuilt trading system separating backend logic from MT5 execution. Step-based pipeline ensures every trade lifecycle action is deterministic. Supports grid systems, hedge triggers, and basket-level TP/SL — all managed through a React dashboard.",
    architecture: [
      "Decoupled FastAPI backend — owns all trading logic, independent of MT5",
      "Step-based execution pipeline for deterministic lifecycle management",
      "Independent grid systems for buy/sell with full isolation",
      "Modular service architecture for scalable extension",
    ],
    engineering: [
      "Database-backed state replaced file-based persistence (goodbye CSV corruption)",
      "Tick queue processing with staleness checks for real-time consistency",
      "Bulk action dispatching to EA for optimized execution",
      "Environment-driven configuration for flexible deployment",
    ],
    challenges: [
      "Maintaining state consistency between FastAPI backend and MQL5 EA across network failures",
      "Designing a step-based pipeline that handles all edge cases in trade lifecycle",
      "Reliable tick queue processing under varying market volatility",
    ],
    failures: [
      "Version 1 was a 2000+ line MQL5 monolith with CSV state — crashed during volatile markets and lost money",
      "PnL mismatches between server and MT5 caused by incorrect trade mapping",
      "No recovery strategy in the original design — crashes meant manual reconstruction",
    ],
    tradeoffs: [
      "Server authority vs terminal authority — chose server as source of truth with terminal as execution layer",
      "Real-time accuracy vs system complexity — added tick queue to bridge the gap",
    ],
    improvements: [
      "Multi-asset support for portfolio-level grid management",
      "Performance analytics dashboard",
      "Automated parameter optimization system",
    ],
    insight:
      "Synchronization between independent systems requires shared contracts, not direct control.",
    relatedLab: ["deterministic-execution", "mistakes-elastic-dca"],
    tags: [
      "real-time",
      "synchronization",
      "trading",
      "distributed",
      "state-consistency",
    ],
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
  },
  {
    slug: "rubiks-solver",
    title: "Rubik's Cube Solver",
    subtitle: "Multi-Threaded CFOP Engine",
    thesis:
      "A computational engine that represents Rubik's Cube state in 3D, implements the complete CFOP solving algorithm, and uses multi-threaded search to solve any configuration in under 2 seconds.",
    priority: "supporting",
    accentColor: "#f43f5e",
    stack: ["C++", "OOP", "Multithreading", "Algorithm Optimization"],
    github: "https://github.com/kumawat-aditya/rubix-cube-solver",
    metrics: {
      scale: "10,000+ solution paths evaluated per solve",
      latency: "~2 seconds per solve on legacy hardware",
      reliability: "Consistently solves under 42 moves",
      automation: "Fully automated — input state, get solution",
    },
    highlights: [
      "Custom 3D state engine",
      "CFOP algorithm implementation",
      "~2 second solve time",
    ],
    whatItDoes:
      "A computational engine that models Rubik's Cube state in 3D arrays, implements the full CFOP solving method (Cross, F2L, OLL, PLL), and uses multi-threaded search to find optimal solutions.",
    architecture: [
      "Custom 3D cube state representation engine using array-based modeling",
      "CFOP algorithm implementation — Cross, F2L, OLL, PLL stages",
      "Multi-threaded optimization search across solution space",
      "Polymorphism-driven modular architecture for algorithm variants",
    ],
    engineering: [
      "CLI visualization with color-coded cube output",
      "Solves within ~2 seconds on legacy hardware",
      "10,000+ solution paths evaluated per execution",
      "7-month build — persistence on long-term problem solving",
    ],
    challenges: [
      "Efficient 3D state representation that supports fast move operations",
      "F2L pair detection across all cube orientations",
      "Balancing thread count vs overhead for optimal search performance",
    ],
    failures: [
      "Inefficient state transitions in early design — solve times were minutes, not seconds",
      "Initial single-threaded approach was too slow for practical use",
    ],
    tradeoffs: [
      "Search depth vs performance — limited depth for sub-2s solves at cost of optimality",
      "Accuracy vs computation time — chose good-enough over perfect solutions",
    ],
    improvements: [
      "Kociemba two-phase algorithm for near-optimal solutions",
      "3D WebGL visualization",
      "Support for arbitrary NxN cube sizes",
    ],
    insight:
      "Breaking complex systems into smaller deterministic steps makes them solvable.",
    relatedLab: [],
    tags: [
      "algorithms",
      "c++",
      "multithreading",
      "optimization",
      "problem-solving",
    ],
    proofCapsules: [
      {
        claim: "Solves any valid configuration in under 2 seconds",
        evidence:
          "Multi-start search across 6 cube orientations. Evaluates 10,000+ candidate paths per solve using CFOP pipeline.",
        source: "metric",
      },
    ],
    constraints: [
      { dimension: "State space", value: "~43 quintillion possible states" },
      { dimension: "Solve time", value: "<2 seconds on legacy hardware" },
      { dimension: "Move optimality", value: "Consistently under 42 moves" },
    ],
    incidents: [],
    whyThisArchitecture:
      "CFOP breaks the massive state space into four constrained sub-problems (Cross → F2L → OLL → PLL). Each phase has a bounded search space. Multi-start across orientations approximates global optimum without exhaustive search.",
  },
];
