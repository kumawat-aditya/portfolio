import { useEffect, useRef, useState } from "react";

const LOG_ENTRIES = [
  { type: "SIG", text: "LONG signal detected → BANKNIFTY FUT", level: "info" },
  { type: "EXEC", text: "ATM strike selected → 48200CE", level: "action" },
  {
    type: "FILL",
    text: "order filled @ ₹245.50 — position active",
    level: "success",
  },
  { type: "MON", text: "trailing SL set → ₹238.00", level: "warn" },
  { type: "SYS", text: "watchdog cycle #1847 — 0 anomalies", level: "muted" },
  { type: "DATA", text: "processing 12.4M rows — Bronze layer", level: "info" },
  { type: "PERF", text: "Silver layer complete — 847ms", level: "success" },
  {
    type: "SYNC",
    text: "state checkpoint — 4 positions active",
    level: "info",
  },
  {
    type: "RISK",
    text: "basket PnL: +₹12,450 — within limits",
    level: "success",
  },
  {
    type: "SIG",
    text: "signal validation — no entry conditions met",
    level: "muted",
  },
  { type: "NET", text: "WebSocket heartbeat — 12ms latency", level: "muted" },
  { type: "DB", text: "SQLite checkpoint — state persisted", level: "info" },
  { type: "EXEC", text: "partial fill detected — retry queued", level: "warn" },
  {
    type: "FILL",
    text: "retry successful — full position confirmed",
    level: "success",
  },
  { type: "SYS", text: "cycle #1848 — all systems nominal", level: "muted" },
  {
    type: "DATA",
    text: "Gold layer normalization — 3.2M features",
    level: "info",
  },
  { type: "MON", text: "trailing SL adjusted → ₹241.00", level: "action" },
  { type: "SIG", text: "SHORT signal generated — evaluating", level: "info" },
];

const LEVEL_COLORS: Record<string, string> = {
  info: "text-accent-cyan",
  action: "text-accent-blue",
  success: "text-accent-green",
  warn: "text-accent-amber",
  muted: "text-text-muted",
};

const TYPE_COLORS: Record<string, string> = {
  SIG: "text-accent-cyan",
  EXEC: "text-accent-blue",
  FILL: "text-accent-green",
  MON: "text-accent-amber",
  SYS: "text-text-muted",
  DATA: "text-accent-purple",
  PERF: "text-accent-green",
  SYNC: "text-accent-blue",
  RISK: "text-accent-green",
  NET: "text-text-muted",
  DB: "text-text-muted",
};

function getTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

interface LogLine {
  id: number;
  time: string;
  type: string;
  text: string;
  level: string;
}

export default function SystemTerminal() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    // Add initial lines
    const initial: LogLine[] = [];
    for (let i = 0; i < 6; i++) {
      const entry = LOG_ENTRIES[i % LOG_ENTRIES.length];
      initial.push({ id: idRef.current++, time: getTime(), ...entry });
    }
    setLines(initial);

    indexRef.current = 6;

    const interval = setInterval(
      () => {
        const entry = LOG_ENTRIES[indexRef.current % LOG_ENTRIES.length];
        indexRef.current++;

        setLines((prev) => {
          const next = [
            ...prev,
            { id: idRef.current++, time: getTime(), ...entry },
          ];
          return next.length > 12 ? next.slice(-12) : next;
        });
      },
      1800 + Math.random() * 1200,
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="glass-card overflow-hidden font-mono text-[11px] 2xl:text-[13px] leading-relaxed w-full max-w-lg 2xl:max-w-xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle bg-bg-secondary/50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-rose/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-amber/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green/60" />
        </div>
        <span className="text-text-muted ml-2 text-[10px]">
          system.log — live
        </span>
        <span className="ml-auto status-dot bg-accent-green" />
      </div>

      {/* Log body */}
      <div
        ref={containerRef}
        className="px-4 py-3 h-[240px] 2xl:h-[320px] overflow-y-auto space-y-1 scrollbar-none"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex gap-2 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
          >
            <span className="text-text-muted shrink-0">{line.time}</span>
            <span
              className={`shrink-0 w-10 text-right ${TYPE_COLORS[line.type] || "text-text-muted"}`}
            >
              {line.type}
            </span>
            <span className={LEVEL_COLORS[line.level] || "text-text-secondary"}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
