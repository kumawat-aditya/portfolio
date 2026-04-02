export interface LabPost {
  slug: string;
  title: string;
  preview: string;
  date: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  content: string[];
  status: "published" | "wip";
  relatedProject: string | null;
  series: string | null;
}

export const labPosts: LabPost[] = [
  {
    slug: "scaling-570m-rows",
    title: "Scaling 570M rows without losing my mind",
    preview:
      "Started with 8 hours runtime. Ended at 10 minutes. The fix wasn't one thing — it was understanding how data flows.",
    date: "2025",
    readTime: "6 min",
    difficulty: "Advanced",
    tags: ["Performance", "Data Engineering", "Python"],
    status: "published",
    relatedProject: "qubiforge",
    series: null,
    content: [
      "The task was simple on paper: process 570 million OHLC rows through a five-layer pipeline. Bronze → Silver → Gold → Platinum → Diamond. Each layer adds complexity.",
      "The first version ran for 8-9 hours. On a good day. On a bad day, it would run out of memory at the Silver layer and I'd start over.",
      "The breakthrough wasn't one thing — it was a series of small wins. Vectorized operations replaced loops. Numba JIT compiled the inner computation kernels. Parallel processing split the workload across cores.",
      "But the real insight was structural: I restructured the pipeline so each layer could process and flush data in chunks instead of holding everything in memory. The pipeline became a stream, not a batch.",
      "End result: ~10 minutes. Same data. Same output. 50x improvement.",
      "The lesson: performance optimization isn't about finding one bottleneck. It's about understanding how data flows through your system and removing friction at every stage.",
    ],
  },
  {
    slug: "why-trading-bots-fail",
    title: "Why most trading bots fail in real markets",
    preview:
      "Backtesting is a comfortable lie. Here's what actually breaks when real money is on the line.",
    date: "2025",
    readTime: "7 min",
    difficulty: "Intermediate",
    tags: ["Trading", "Systems", "Architecture"],
    status: "published",
    relatedProject: "ant-meta-bots",
    series: null,
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
    slug: "deterministic-execution",
    title: "Designing a deterministic execution engine",
    preview:
      'When your system manages real money, "it usually works" isn\'t good enough.',
    date: "2025",
    readTime: "8 min",
    difficulty: "Advanced",
    tags: ["Architecture", "Trading", "Engineering"],
    status: "published",
    relatedProject: "elastic-dca",
    series: "elastic-dca-series",
    content: [
      "Elastic DCA started as a messy MQL5-only system. Everything lived in the EA: logic, state, configuration. When it broke, debugging was a nightmare because state was scattered across files.",
      "I re-architected it with one principle: every trade lifecycle step must be deterministic. Given the same state and the same input, the system must always produce the same output.",
      "The new architecture: FastAPI backend owns all trading logic. MQL5 EA is just an execution layer — it receives commands and reports back. SQLite persists every state transition.",
      "The step-based pipeline was the key insight. Instead of continuous monitoring, the system processes discrete steps: receive tick → evaluate conditions → generate actions → dispatch to EA → verify execution. Each step is atomic and recoverable.",
      "If the system crashes mid-step, it can resume exactly where it left off. No lost trades. No phantom positions. No manual intervention.",
      "Still exploring better ways to handle execution latency between the backend and EA. The tick queue helps, but there's room for improvement.",
    ],
  },
  {
    slug: "mistakes-elastic-dca",
    title: "Mistakes I made building Elastic DCA",
    preview:
      "The first version was held together with duct tape and hope. Then the market moved.",
    date: "2025",
    readTime: "5 min",
    difficulty: "Intermediate",
    tags: ["Lessons", "Trading", "Refactoring"],
    status: "published",
    relatedProject: "elastic-dca",
    series: "elastic-dca-series",
    content: [
      "Version 1 of Elastic DCA was a single MQL5 file with 2000+ lines. State was stored in CSV files on disk. Configuration was hardcoded. There was no separation between buy-side and sell-side logic.",
      "It worked. Barely. Until it didn't. A crash during a volatile market left the system in a state where it thought it had positions it didn't. Manual cleanup. Lost money. Bad day.",
      "Mistake #1: File-based persistence. CSV files can corrupt. They can't handle concurrent access. They don't support transactions. Should have used a database from day one.",
      "Mistake #2: Monolithic execution. When everything lives in one file, a bug in grid calculation can crash your risk management. Isolation isn't optional in systems that handle money.",
      "Mistake #3: No recovery strategy. The system assumed it would never crash. It did. And there was no way to reconstruct state from what was on disk.",
      "The rebuild took weeks, but the result was worth it: a decoupled, database-backed, step-based system that survives crashes, network failures, and my own bugs.",
    ],
  },
];
