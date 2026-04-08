import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const proofPoints = [
  {
    label: "Execution cycle",
    value: "1s",
    detail: "ANT Meta Bots — 4 async subsystems, cooperative loop",
  },
  {
    label: "Double-executions",
    value: "0",
    detail: "Session-based state machine with trade ID dedup",
  },
  {
    label: "Pipeline speedup",
    value: "~1.5d → 30m",
    detail: "Quant Discovery — Numba JIT on Ryzen 5 5600X, 16GB RAM",
  },
];

const logLines = [
  {
    time: "06:48:34",
    text: "Breakout confirmed for SHORT at 67584.82 | Executing order...",
    color: "text-text-secondary/80",
  },
  {
    time: "06:48:35",
    text: "Trade OPENED: SHORT P-BTC-67500-030426 @ 917.00 | TP: 2109.10 | SL: 687.75",
    color: "text-accent-blue/80",
  },
  {
    time: "18:45:38",
    text: "Trade CLOSED (WIN): TP_HIT | Net PnL: +0.46 | Actual Exit: 81.80",
    color: "text-accent-green/80",
  },
  {
    time: "23:10:27",
    text: "Replaced EXPIRED trade 352ed08d7a14 (SHORT) with better signal",
    color: "text-accent-amber/80",
  },
];

export default function ProofBand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="border-y border-border-subtle bg-bg-secondary/20"
    >
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 py-6 md:py-8">
        <div className="grid md:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Left: Proof metrics — compact */}
          <div className="md:col-span-5 lg:col-span-4 grid grid-cols-3 sm:flex sm:flex-row md:flex-col gap-3 md:gap-3">
            {proofPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-1 md:flex-none min-w-0"
              >
                <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5">
                  <span className="font-mono text-base sm:text-lg md:text-xl font-bold gradient-text tabular-nums leading-none">
                    {p.value}
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-text-muted font-medium">
                    {p.label}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted/60 font-mono hidden md:block">
                  {p.detail}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right: Live log strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-7 lg:col-span-8 md:border-l md:border-border-subtle md:pl-6 min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="status-dot bg-accent-green" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono">
                From production logs — ANT Meta Bots
              </span>
            </div>
            <div className="font-mono text-[11px] space-y-0.5 overflow-x-auto scrollbar-none">
              {logLines.map((line, i) => (
                <div key={i} className="flex gap-3 whitespace-nowrap">
                  <span className="text-text-muted/40 shrink-0">
                    {line.time}
                  </span>
                  <span className={line.color}>{line.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
