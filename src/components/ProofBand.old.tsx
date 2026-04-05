import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface MetricItem {
  value: string;
  numericPart: number;
  prefix: string;
  suffix: string;
  label: string;
  proof: string;
}

const metrics: MetricItem[] = [
  {
    value: "570M+",
    numericPart: 570,
    prefix: "",
    suffix: "M+",
    label: "rows processed",
    proof: "QubiForge five-layer pipeline — 8hrs → 10min",
  },
  {
    value: "1s",
    numericPart: 1,
    prefix: "",
    suffix: "s",
    label: "execution cycles",
    proof: "ANT Meta Bots Watchdog — tick-level trading loop",
  },
  {
    value: "0",
    numericPart: 0,
    prefix: "",
    suffix: "",
    label: "double-executions",
    proof: "Session-based state machine with trade ID dedup",
  },
  {
    value: "2750",
    numericPart: 2750,
    prefix: "",
    suffix: "",
    label: "bars trained per bot",
    proof: "Lorentzian k-NN history — logged on every startup",
  },
];

const logSnippet = [
  {
    time: "06:48:34",
    text: "Breakout confirmed for SHORT at 67584.82 | Executing order...",
  },
  {
    time: "06:48:35",
    text: "Trade OPENED: SHORT P-BTC-67500-030426 @ 917.00 | TP: 2109.10 | SL: 687.75",
  },
  { time: "18:45:38", text: "Trade CLOSED (WIN): TP_HIT | Net PnL: +0.46" },
];

function CountUp({
  target,
  suffix,
  prefix,
  duration = 1.5,
}: {
  target: number;
  suffix: string;
  prefix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    if (target === 0) {
      setCount(0);
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function ProofBand() {
  return (
    <section className="border-y border-border-subtle bg-bg-secondary/30">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 py-10 md:py-14">
        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-8">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center space-y-1"
            >
              <div className="font-mono text-3xl md:text-4xl font-bold gradient-text tabular-nums">
                <CountUp
                  target={m.numericPart}
                  suffix={m.suffix}
                  prefix={m.prefix}
                />
              </div>
              <div className="text-[11px] uppercase tracking-widest text-text-muted font-medium">
                {m.label}
              </div>
              <div className="text-[10px] text-text-muted/60 hidden md:block font-mono">
                {m.proof}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live log snippet — proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-border-subtle pt-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="status-dot bg-accent-green" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono">
              From actual production logs — ANT Meta Bots
            </span>
          </div>
          <div className="font-mono text-[11px] space-y-0.5 text-text-muted/80 overflow-x-auto">
            {logSnippet.map((line, i) => (
              <div key={i} className="flex gap-3 whitespace-nowrap">
                <span className="text-text-muted/50 shrink-0">{line.time}</span>
                <span
                  className={
                    i === 2 ? "text-accent-green/80" : "text-text-secondary/70"
                  }
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
