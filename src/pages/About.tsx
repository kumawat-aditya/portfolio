import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";

const timeline = [
  {
    year: "2022",
    title: "First Lines of Code",
    description:
      "Started with C++ and Python. Wrote bad code, broke things, learned fast.",
  },
  {
    year: "2023",
    title: "Backend Systems",
    description:
      "Built REST APIs, learned database design, shipped my first production backend. Discovered I liked systems more than UI.",
  },
  {
    year: "2024",
    title: "Trading Infrastructure",
    description:
      "Went deep into algorithmic trading. Built real-time execution systems, ML signal pipelines, and multi-agent architectures handling live market data.",
  },
  {
    year: "2025",
    title: "Scale & Reliability",
    description:
      "Processing 570M+ rows. Deterministic execution engines. Systems that run unsupervised and don't break when it matters.",
  },
  {
    year: "Next",
    title: "What's Ahead",
    description:
      "Event-driven architectures. Horizontal scaling. Building systems that other engineers want to work on.",
  },
];

const thinking = [
  {
    label: "Systems First",
    text: "I think in state machines, execution paths, and failure modes. The first question is always: what happens when this breaks?",
  },
  {
    label: "Production Reality",
    text: "Demo day is not production. I build for the 3 AM edge case, not the happy path presentation.",
  },
  {
    label: "Honest Engineering",
    text: "Every system has tradeoffs. I document failures because that's where the real learning is.",
  },
];

export default function About() {
  return (
    <PageTransition>
      <section className="pt-32 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 max-w-3xl"
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

          {/* How I Think */}
          <ScrollReveal>
            <div className="mb-24">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px flex-1 max-w-[60px] bg-accent-blue/40" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  How I Think
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {thinking.map((t, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="glass-card p-6 h-full">
                      <h3 className="text-sm font-semibold text-text-primary mb-3 font-mono">
                        {t.label}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {t.text}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <ScrollReveal>
            <div className="mb-24">
              <div className="flex items-center gap-3 mb-10">
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
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Current Focus */}
          <ScrollReveal>
            <div className="max-w-3xl">
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
                    B.Tech CSE (2022–2026) · Building full-time alongside
                    academics.
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
