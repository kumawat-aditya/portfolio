export interface LabPost {
  slug: string;
  title: string;
  preview: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
  status: "published" | "wip";
  relatedProject: string | null;
  series: string | null;
  size?: "featured" | "standard" | "compact";
}

export const labPosts: LabPost[] = [
  {
    slug: "why-trading-bots-fail",
    title: "Why most trading bots fail in real markets",
    preview:
      "Backtesting is a comfortable lie. Here's what actually breaks when real money is on the line.",
    date: "2026",
    readTime: "7 min",
    tags: ["Trading", "Systems", "Architecture"],
    status: "published",
    relatedProject: "ant-meta-bots",
    series: null,
    size: "featured",
    content: [
      "Every developer who builds a trading bot makes the same mistake: they optimize for backtesting performance. The strategy looks great on historical data. Then they deploy it.",
      "Here's what breaks: latency. Fill rates. Slippage. API rate limits. Exchange downtime. Partial fills. State corruption during restarts.",
      "I learned this building ANT Meta Bots. The ML model was generating solid signals. But the execution layer was fragile. Signals would fire, orders would submit, but fills wouldn't confirm. The bot would re-enter positions it already had.",
      "The fix wasn't better ML. It was better engineering. I built a unified async Watchdog engine that managed the entire lifecycle: signal → validation → execution → fill verification → monitoring → exit. Every state transition was explicit.",
      "Zero double-execution guarantees. Not because the math was perfect, but because the state machine was.",
      "The real insight: in production trading systems, engineering reliability matters more than signal quality. A mediocre signal with bulletproof execution beats a perfect signal with fragile infrastructure.",
    ],
  },
  {
    slug: "json-state-corruption-incident",
    title: "The day JSON state corruption lost me money",
    preview:
      "Elastic DCA v1 crashed during a volatile market. State files corrupted. Real money lost. Here's the full incident report.",
    date: "2025",
    readTime: "5 min",
    tags: ["Incident", "Trading", "State Management"],
    status: "published",
    relatedProject: "elastic-dca",
    series: "elastic-dca-series",
    size: "standard",
    content: [
      "This is a real incident from Elastic DCA v1. Not a hypothetical — this happened, and it cost me.",
      "Timeline: 2025, volatile market session. Elastic DCA v1 was running — MQL5 EA with state.json for persistence. Strict trade ↔ server mapping was attempted, but buy-side and sell-side logic were tangled together without proper isolation.",
      "14:32 — Market spiked sharply. The system needed to update state for multiple grid rows simultaneously. The EA crashed mid-write to the json state file.",
      "14:33 — EA restarted automatically. But the state file was partially written. Some entries had correct data, others were truncated. The system read this corrupted state and believed it held positions that no longer existed.",
      "14:35 — The system attempted to close phantom positions. MetaTrader returned errors. The system interpreted these errors as temporary failures and queued retries.",
      "14:41 — I noticed the anomalies manually. Stopped the system. Spent 20 minutes reconciling actual positions against what the system believed. Closed everything manually. Net loss from the incident.",
      "Root cause: file-based persistence has no transaction guarantees. A crash during write leaves state in an inconsistent state. The system had no integrity checks, no checksums, no recovery mechanism. It trusted the file blindly.",
      "The fix wasn't incremental. I rebuilt the entire system. Replaced JSON with SQLite — atomic writes, transaction support, crash recovery built in. Moved all trading logic from MQL5 to a Python/FastAPI backend. The EA became a stateless executor.",
    ],
  },
  {
    slug: "scaling-pipeline",
    title: "Scaling a data pipeline from ~1.5 days to 30 minutes",
    preview:
      "Processing hundreds of millions of trade combinations on a Ryzen 5 5600X with 16GB RAM. The fix wasn't one thing — it was understanding data flow.",
    date: "2025",
    readTime: "6 min",
    tags: ["Performance", "Data Engineering", "Python"],
    status: "published",
    relatedProject: "qubiforge",
    series: null,
    size: "standard",
    content: [
      "The task: process hundreds of millions of (candle, SL, TP) trade combinations through a five-layer pipeline. Bronze → Silver → Gold → Platinum → Diamond. Each layer adds complexity.",
      "The first version ran for roughly 1.5 days on my Ryzen 5 5600X with 16GB RAM. On a good day. On a bad day, it would crash with OOM at the Silver layer when 300+ indicators expanded each row's memory footprint.",
      "The breakthrough wasn't one thing — it was a sequence of structural changes. Vectorized operations replaced loops. Numba JIT compiled the inner simulation kernels to near-C performance. Multiprocessing split the workload across cores.",
      "But the real insight was architectural: I restructured the pipeline so each layer could process and flush data in chunks to Parquet instead of holding everything in memory. The pipeline became a stream, not a batch.",
      "Parquet replaced CSV — that alone was a dramatic I/O improvement. IterativeDMatrix streaming allowed XGBoost training without loading the full feature matrix.",
      "End result: ~30 minutes. Same data. Same output. Same hardware.",
      "The lesson: performance optimization isn't about finding one bottleneck. It's about understanding how data flows through your system and removing friction at every stage. The constraint (16GB RAM) shaped the entire architecture.",
    ],
  },
  {
    slug: "deterministic-execution",
    title: "Designing a deterministic execution engine",
    preview:
      'When your system manages real money, "it usually works" isn\'t good enough.',
    date: "2025",
    readTime: "8 min",
    tags: ["Architecture", "State Machines", "Engineering"],
    status: "published",
    relatedProject: "elastic-dca",
    series: "elastic-dca-series",
    size: "compact",
    content: [
      "Elastic DCA started as a messy MQL5-only system. Everything lived in the EA: logic, state, configuration. When it broke, debugging was a nightmare because state was scattered.",
      "I re-architected it with one principle: every trade lifecycle step must be deterministic. Given the same state and the same input, the system must always produce the same output.",
      "The new architecture: FastAPI backend owns all trading logic. MQL5 EA is just an execution layer — it receives commands and reports back. SQLite persists every state transition.",
      "The step-based pipeline was the key insight. Instead of continuous monitoring, the system processes discrete steps: receive tick → evaluate conditions → generate actions → dispatch to EA → verify execution. Each step is atomic and recoverable.",
      "If the system crashes mid-step, it can resume exactly where it left off. No lost trades. No phantom positions. No manual intervention.",
    ],
  },
  {
    slug: "mistakes-elastic-dca",
    title: "Mistakes I made building Elastic DCA",
    preview:
      "The first version was held together with duct tape and hope. Then the market moved.",
    date: "2025",
    readTime: "5 min",
    tags: ["Lessons", "Refactoring", "Failure"],
    status: "published",
    relatedProject: "elastic-dca",
    series: "elastic-dca-series",
    size: "compact",
    content: [
      "Version 1 of Elastic DCA had MQL5 handling execution with state.json for persistence. Configuration was hardcoded. No separation between buy-side and sell-side logic.",
      "It worked. Barely. Until it didn't. A crash during a volatile market left the system in desync — it thought it had positions it didn't. Manual cleanup. Lost money.",
      "Mistake #1: File-based persistence without transactions. state.json can corrupt on crash. Should have used a database from day one.",
      "Mistake #2: Monolithic execution. When everything lives in one file, a bug in grid calculation can crash your risk management. Isolation isn't optional in systems that handle money.",
      "Mistake #3: No recovery strategy. The system assumed it would never crash. It did. And there was no way to reconstruct state from what was on disk.",
      "The rebuild took weeks, but the result was worth it: a decoupled, database-backed, step-based system that survives crashes, network failures, and my own bugs.",
    ],
  },
  {
    slug: "cross-language-parity",
    title: "Porting Pine Script is not a syntax translation",
    preview:
      "Converting a TradingView strategy to Python/MQL5 means reverse-engineering an entire hidden execution model.",
    date: "2024",
    readTime: "6 min",
    tags: ["Algorithms", "Cross-Platform", "ML"],
    status: "published",
    relatedProject: "lorentzian-ml",
    series: null,
    size: "standard",
    content: [
      "I needed to run a Lorentzian KNN trading strategy in Python and MQL5. The original was Pine Script on TradingView. 'Just translate the syntax' — that was the initial assumption. It was wrong.",
      "Pine Script isn't a normal programming language. It executes once per bar. Each bar carries implicit state that survives between executions. Indicators accumulate internal state that's never exposed to the user. TradingView manages memory, history access, and execution timing behind the scenes.",
      "The first Python translation 'worked' — it produced numbers. But those numbers diverged from TradingView's output after a few hundred bars. The culprit: floating-point drift in RMA/EMA calculations caused by subtle differences in how Pine Script initializes indicator state.",
      "The fix: I built explicit per-bar state objects. Every S_BarData record carries its full intermediate indicator state. No global accumulators. O(1) step-forward calculations. This made the behavior identical across all three platforms.",
      "Hardest part: Pine Script's built-in ta.rma() and ta.ema() functions use initialization logic that isn't documented anywhere. I had to reverse-engineer it by comparing outputs bar-by-bar against TradingView.",
      "Result: 100% deterministic parity across Pine Script, MQL5, and Python. The Python module now powers ANT Meta Bots' signal engine in production.",
    ],
  },
  {
    slug: "cooperative-async-vs-threading",
    title: "When cooperative async beats multithreading",
    preview:
      "Four independent subsystems running on a single thread. No race conditions. No locks. Here's why.",
    date: "2026",
    readTime: "5 min",
    tags: ["Concurrency", "Architecture", "Python"],
    status: "published",
    relatedProject: "ant-meta-bots",
    series: null,
    size: "standard",
    content: [
      "ANT Meta Bots runs four concurrent subsystems: API server, BotInstanceManager, LiveFeedManager, and Watchdog. They all share state. They all run on a single thread via Python asyncio.",
      "The conventional wisdom says: use threading or multiprocessing for concurrency. But these subsystems share a lot of mutable state — bot configurations, trade positions, signal buffers. Multithreading would require locks everywhere. Locks introduce deadlock risk and performance overhead.",
      "Cooperative async on a single event loop means: only one coroutine runs at any moment. State mutations are never concurrent. No locks needed. No race conditions possible within a single await boundary.",
      "The constraint: each subsystem must yield control within its 1-second execution cycle. If one subsystem blocks, everything stalls. This forced a strict discipline — every I/O call must be async, every computation must be bounded.",
      "The result: four subsystems that share state freely, update it safely, and never interfere with each other. The system has run in production with zero concurrency-related bugs.",
      "When I separated state mutation (Watchdog) from data ingestion (LiveFeedManager) on strict 1-second boundaries, the architecture clicked. Single-thread async with strict phase boundaries prevents the class of bugs that multithreading introduces.",
    ],
  },
  {
    slug: "voice-pipeline-isolation",
    title: "Why voice assistants fail without strict pipeline isolation",
    preview:
      "A single microphone, three competing subsystems, and a feedback loop that made the assistant talk to itself. Here's what broke and why isolation isn't optional.",
    date: "2025",
    readTime: "6 min",
    tags: ["Architecture", "Voice AI", "Failure"],
    status: "published",
    relatedProject: "elisa",
    series: null,
    size: "standard",
    content: [
      "ELISA has three subsystems that all want the microphone: the wake word listener, the VAD speech recorder, and the TTS output. They cannot run concurrently on a single audio device. The first version tried — and failed immediately.",
      "The failure mode was subtle. TTS would speak a response. The speakers would output audio. The wake word listener would detect that audio as a new activation. ELISA would start responding to herself in an infinite loop.",
      "The obvious fix — disable the listener during TTS — wasn't enough. Audio hardware doesn't release instantly. PyAudio streams need explicit termination and a yield period before another subsystem can claim the device.",
      "I implemented a strict serialization protocol: forcefully terminate the active PyAudio stream, yield the device, enforce a 3-second cooldown after TTS, then re-initialize the wake word listener. Sequential access, not concurrent.",
      "The deeper problem was inter-service state. The wake word listener runs in the Assistant layer. TTS runs in a Docker container. They communicate over HTTP. There's no shared memory, no event bus, no way for TTS to signal 'I'm about to speak' to the listener in real time.",
      "The solution was architectural: the orchestrator owns the hardware access schedule. It coordinates which subsystem has the microphone at any given moment. The subsystems don't talk to each other — they report to the orchestrator, and the orchestrator serializes access.",
      "Lesson: in multi-service audio systems, the microphone is a shared resource with exclusive access semantics. Treat it like a mutex, not like a file descriptor.",
    ],
  },
  {
    slug: "rule-based-nlp-boundaries",
    title: "Where rule-based NLP breaks compared to LLMs",
    preview:
      "Dependency parsing works perfectly — until the input is slightly ambiguous. Then the entire downstream pipeline collapses. Here's the exact boundary.",
    date: "2025",
    readTime: "5 min",
    tags: ["NLP", "Architecture", "AI Foundations"],
    status: "published",
    relatedProject: "nlp-command-engine",
    series: null,
    size: "compact",
    content: [
      "I built a classical NLP command engine to understand exactly where rule-based systems stop working. The answer: sooner than you'd expect, and more catastrophically.",
      "The pipeline extracts structured JSON from natural language commands using Stanza's dependency tree as the single source of truth. For well-formed sentences — 'Schedule a meeting with John tomorrow at 3pm' — it works perfectly. Every extraction is traceable to a specific dependency relation.",
      "The failure mode is cascading. If Stanza produces an incorrect dependency parse — which happens on real, messy human input — every downstream extraction is wrong. Semantic roles are misassigned. Temporal expressions are missed. The output JSON is structurally valid but semantically garbage.",
      "There's no recovery. Unlike an LLM that can use contextual understanding to compensate for parse errors, a rule-based system has no fallback. The dependency tree is the only source of truth. If it's wrong, everything is wrong.",
      "The most revealing failure: implicit meaning. 'Remind me about the thing' — there's no entity to extract, no temporal expression, and the pronoun 'the thing' requires conversational context that doesn't exist in a stateless pipeline.",
      "This isn't a criticism of classical NLP. It's a precise mapping of its failure boundary. Modern systems collapse tokenization, parsing, NER, and semantic understanding into a single neural pass for a reason — the intermediate representations are lossy bottlenecks.",
    ],
  },
];
