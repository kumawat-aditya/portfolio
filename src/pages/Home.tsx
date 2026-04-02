import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import SystemTerminal from "../components/SystemTerminal";
import ProofBand from "../components/ProofBand";
import ScrollReveal from "../components/ScrollReveal";
import { projects } from "../data/projects";
import { labPosts } from "../data/lab";

const flagship = projects.find((p) => p.priority === "flagship")!;
const secondary = projects.filter((p) => p.priority === "major").slice(0, 2);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Home() {
  return (
    <PageTransition>
      {/* ─── Hero ─── */}
      <section className="min-h-dvh flex items-center relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 15% 40%, rgba(59,130,246,0.07), transparent 60%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(139,92,246,0.04), transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full py-32">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left – Content */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="lg:col-span-3 space-y-8"
            >
              <motion.div variants={item} className="flex items-center gap-2">
                <span className="status-dot bg-accent-green" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-medium font-mono">
                  Building in production
                </span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-display font-bold tracking-tight leading-[0.95] text-text-primary"
              >
                I build systems
                <br />
                <span className="gradient-text">
                  that run when
                  <br />
                  it matters.
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed"
              >
                Real-time trading infrastructure. ML pipelines processing 570M+
                rows. Backend systems built for production pressure — not demo
                day.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/systems"
                  className="glow-btn inline-flex items-center gap-2 text-sm font-medium"
                >
                  Explore Systems <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-text-secondary border border-border-subtle rounded-lg hover:border-border-hover hover:text-text-primary transition-all duration-300"
                >
                  Let's Talk
                </Link>
              </motion.div>
            </motion.div>

            {/* Right – Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:col-span-2 hidden lg:block"
            >
              <SystemTerminal />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Proof Band ─── */}
      <ProofBand />

      {/* ─── Flagship System ─── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="h-px flex-1 max-w-[60px] bg-accent-blue/40" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                Flagship
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link to={`/systems/${flagship.slug}`} className="block group">
              <div className="glass-card p-8 md:p-12 hover:border-accent-blue/30 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: flagship.accentColor }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                        {flagship.tags.slice(0, 3).join(" · ")}
                      </span>
                    </div>
                    <h2 className="text-headline font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors">
                      {flagship.title}
                    </h2>
                    <p className="text-text-secondary leading-relaxed">
                      {flagship.thesis}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-accent-blue font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Deep dive <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(flagship.metrics).map(([key, val]) => (
                      <div
                        key={key}
                        className="space-y-1 p-4 rounded-lg bg-bg-surface/50"
                      >
                        <div className="text-[10px] uppercase tracking-widest text-text-muted font-mono">
                          {key}
                        </div>
                        <div className="text-sm text-text-primary leading-snug">
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── More Systems ─── */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="h-px flex-1 max-w-[60px] bg-border-subtle" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                More systems
              </span>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {secondary.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.1}>
                <Link
                  to={`/systems/${project.slug}`}
                  className="block group h-full"
                >
                  <div className="glass-card p-6 md:p-8 h-full flex flex-col hover:border-border-hover transition-all duration-400 group">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.accentColor }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                        {project.tags[0]}
                      </span>
                    </div>
                    <h3 className="text-title font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors mb-3">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed flex-1">
                      {project.subtitle}
                    </p>
                    <div className="mt-6 pt-4 border-t border-border-subtle">
                      <p className="text-xs text-text-muted font-mono">
                        {project.stack.slice(0, 4).join(" · ")}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mt-10 text-center">
              <Link
                to="/systems"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors font-medium"
              >
                View all systems <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Lab Teaser ─── */}
      <section className="border-t border-border-subtle py-24 md:py-32 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[60px] bg-accent-purple/40" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                From the Lab
              </span>
            </div>
            <h2 className="text-headline font-bold tracking-tight text-text-primary mb-4">
              Field notes from building real systems.
            </h2>
            <p className="text-text-secondary max-w-xl mb-12">
              Not tutorials. Not best practices. Honest accounts of what
              actually breaks when you ship to production.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {labPosts.slice(0, 2).map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.1}>
                <Link
                  to="/lab"
                  className="glass-card p-6 block group hover:border-accent-purple/20 transition-all duration-400"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-[10px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded ${post.status === "published" ? "bg-accent-green/10 text-accent-green" : "bg-accent-amber/10 text-accent-amber"}`}
                    >
                      {post.status}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-purple transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {post.preview}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-headline font-bold tracking-tight text-text-primary mb-5">
              Got a system that needs building?
            </h2>
            <p className="text-text-secondary text-lg max-w-lg mx-auto mb-10">
              I'm open to infrastructure work, trading systems, and backend
              challenges that actually matter.
            </p>
            <Link
              to="/contact"
              className="glow-btn inline-flex items-center gap-2 text-sm font-medium"
            >
              Start a Conversation <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
