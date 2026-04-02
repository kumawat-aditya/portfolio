import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface MetricItem {
  value: string;
  numericPart: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
}

const metrics: MetricItem[] = [
  {
    value: "570M+",
    numericPart: 570,
    prefix: "",
    suffix: "M+",
    label: "rows processed",
    description: "Data pipeline throughput",
  },
  {
    value: "50×",
    numericPart: 50,
    prefix: "",
    suffix: "×",
    label: "faster pipeline",
    description: "8hrs → 10 minutes",
  },
  {
    value: "1s",
    numericPart: 1,
    prefix: "",
    suffix: "s",
    label: "execution cycles",
    description: "Trading engine latency",
  },
  {
    value: "0",
    numericPart: 0,
    prefix: "",
    suffix: "",
    label: "double-executions",
    description: "Production reliability",
  },
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
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
              <div className="text-xs text-text-muted/70 hidden md:block">
                {m.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
