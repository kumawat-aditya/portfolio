import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import ScrollReveal from "../components/ScrollReveal";

const timeline = [
  {
    year: "2022",
    title: "Foundations in Structured Systems",
    description:
      "Started with frontend and C++. The real focus was structure — understanding how systems are organized, not just how they look.",
    tech: ["HTML/CSS", "C++", "Git"],
  },
  {
    year: "2023",
    title: "Shift to Computational Systems",
    description:
      "Moved from UI to logic-heavy systems. Built a full Rubik's Cube solver engine in pure C++17 — correctness and efficiency over visuals.",
    tech: ["C++17", "Algorithms", "State-Space Search"],
  },
  {
    year: "Early 2024",
    title: "Backend Architecture",
    description:
      "Shifted into backend engineering. Systems fail not because of code, but because of improper state and boundary structures. Strict 3-tier architecture, JWT auth, payment flows.",
    tech: ["Java 17", "Spring Boot", "REST APIs", "MariaDB"],
  },
  {
    year: "Late 2024",
    title: "Real-Time & Distributed Systems",
    description:
      "Built event-driven pipelines parsing unstructured Telegram signals for MT5 queues. Translated Pine Script algorithms into Python/MQL5 with strict parity.",
    tech: ["Java 21", "MQL5", "Python", "Telegram API"],
  },
  {
    year: "2025",
    title: "Scale & Performance",
    description:
      "Processing hundreds of millions of trade combinations on commodity hardware (Ryzen 5 5600X, 16GB RAM). Numba JIT, Parquet chunking, strict memory mapping.",
    tech: ["Python", "Numba", "Parquet", "XGBoost"],
  },
  {
    year: "2025–2026",
    title: "System Synchronization",
    description:
      "Solved keeping a stateless terminal synchronized with an authoritative server over unreliable networks. Deterministic state contracts, not isolated scripts.",
    tech: ["Python", "FastAPI", "MQL5", "WebSockets"],
  },
  {
    year: "2026",
    title: "Cooperative Async Systems",
    description:
      "Single-process concurrency — 4 parallel lifecycles on one thread without race conditions. Strict phase-based execution with cooperative async.",
    tech: ["Python", "asyncio", "FastAPI", "WebSockets"],
  },
];

const patterns = [
  {
    label: "State as source of truth",
    text: "Every system I build has an explicit state machine. ANT Meta Bots tracks trade lifecycle through signal → execution → monitoring → exit with no implicit transitions. If the state file says 'no position', the engine trusts it — not memory.",
    source: "ANT Meta Bots, Elastic DCA",
  },
  {
    label: "Idempotent operations",
    text: "Every trade execution, every DCA buy, every pipeline run can be retried without side effects. Zero double-execution guarantees come from hash-based deduplication and state checks before every action.",
    source: "ANT Meta Bots, Signal Distribution",
  },
  {
    label: "Fail explicitly, recover automatically",
    text: "Elastic DCA v1 had a JSON corruption bug that silently dropped state. The fix wasn't just SQLite — it was adding checksums, write-ahead logging, and making every failure loud. Silent failures are the ones that cost money.",
    source: "Elastic DCA, ANT Meta Bots",
  },
  {
    label: "Constraints before features",
    text: "Quant Discovery Pipeline processes hundreds of millions of combinations on a Ryzen 5 5600X with 16GB RAM. That constraint shaped the entire architecture — chunk-based processing, Numba JIT, Parquet streaming. The constraint was the design.",
    source: "Quant Discovery Pipeline, Stella",
  },
];

export default function About() {
  return (
    <PageTransition>
      <SEO
        title="About — Backend & Systems Engineer"
        description="I'm Aditya Kumawat. I build backend systems and trading infrastructure that work under real-world pressure. State machines, idempotent operations, and constraint-driven design."
        path="/about"
      />
      <section className="pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 md:mb-16 max-w-3xl"
          >
            <h1 className="text-display font-bold tracking-tight text-text-primary mb-6">
              About
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-5">
              I'm Aditya Kumawat. I build backend systems and trading
              infrastructure that work under real-world pressure.
            </p>
            <p className="text-base text-text-muted leading-relaxed">
              Not a full-stack generalist. Not chasing frameworks. I go deep on
              systems that need to be reliable, fast, and correct — the kind
              where failure isn't a bug report, it's real money lost.
            </p>
          </motion.div>

          {/* Patterns I Default To */}
          <ScrollReveal>
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 max-w-[60px] bg-accent-blue/40" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Patterns I Default To
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {patterns.map((p, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="glass-card p-6 h-full flex flex-col">
                      <h3 className="text-sm font-semibold text-text-primary mb-3 font-mono">
                        {p.label}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed flex-1">
                        {p.text}
                      </p>
                      <p className="text-[10px] font-mono text-accent-blue/50 mt-4 pt-3 border-t border-border-subtle">
                        Derived from: {p.source}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <ScrollReveal>
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 max-w-[60px] bg-accent-purple/40" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Evolution
                </span>
              </div>

              <div className="space-y-0">
                {timeline.map((entry, i) => (
                  <ScrollReveal key={i} delay={i * 0.08}>
                    <div className="grid md:grid-cols-12 gap-4 md:gap-8 py-6 border-b border-border-subtle group">
                      <div className="md:col-span-2">
                        <span className="font-mono text-sm font-semibold text-accent-blue">
                          {entry.year}
                        </span>
                      </div>
                      <div className="md:col-span-3">
                        <h3 className="text-sm font-semibold text-text-primary">
                          {entry.title}
                        </h3>
                      </div>
                      <div className="md:col-span-7">
                        <p className="text-sm text-text-muted leading-relaxed">
                          {entry.description}
                        </p>
                        {entry.tech && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {entry.tech.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-mono text-text-muted/60 bg-bg-surface/40 px-1.5 py-0.5 rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Current Focus */}
          <ScrollReveal>
            <div className="max-w-3xl 2xl:max-w-4xl">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px flex-1 max-w-[60px] bg-accent-green/40" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Current Focus
                </span>
              </div>

              <div className="glass-card p-8">
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Right now I'm deep in{" "}
                    <strong className="text-text-primary">
                      algorithmic trading infrastructure
                    </strong>{" "}
                    — building systems that coordinate multiple ML agents,
                    process millions of data rows, and execute trades with
                    deterministic reliability.
                  </p>
                  <p>
                    The interesting problems are in the orchestration: how do
                    you keep multiple independent systems in sync without race
                    conditions? How do you recover from partial failures without
                    losing state? How do you make systems that are correct{" "}
                    <em>and</em> fast?
                  </p>
                  <p className="text-text-muted text-sm">
                    B.C.A (2022–2025) · Building full-time alongside academics.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal>
            <div className="mt-20 text-center">
              <Link
                to="/contact"
                className="glow-btn inline-flex items-center gap-2 text-sm font-medium"
              >
                Let's Talk <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
