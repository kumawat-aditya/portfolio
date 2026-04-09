import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import SystemTerminal from "../components/SystemTerminal";
import ProofBand from "../components/ProofBand";
import ScrollReveal from "../components/ScrollReveal";
import { projects } from "../data/projects";
import { labPosts } from "../data/lab";

const flagship = projects.find((p) => p.priority === "flagship")!;
const secondary = projects.filter((p) => p.priority === "major").slice(0, 3);

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
      <SEO
        title="Systems Engineer — Backend & Trading Infrastructure"
        description="I build backend systems that don't break. Real-time trading platforms, ML pipelines, and production infrastructure designed for zero downtime and autonomous operation."
        path="/"
      />
      {/* ─── Hero ─── */}
      {/* <section className="min-h-dvh flex items-center relative overflow-hidden"> */}
      <section className="min-h-[auto] lg:min-h-[85dvh] flex items-center relative overflow-hidden">
        {/* <section className="min-h-[85dvh] flex items-center relative overflow-hidden"> */}
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 15% 40%, rgba(59,130,246,0.07), transparent 60%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(139,92,246,0.04), transparent 60%)",
          }}
        />

        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 w-full py-24 lg:py-28">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left – Content */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="lg:col-span-3 space-y-7"
            >
              {/* Identity badges */}
              <motion.div
                variants={item}
                className="flex flex-wrap items-center gap-3"
              >
                <span className="text-[10px] uppercase tracking-[0.15em] font-mono px-2.5 py-1 rounded border border-accent-blue/30 bg-accent-blue/5 text-accent-blue">
                  Backend Engineer
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-mono px-2.5 py-1 rounded border border-accent-purple/30 bg-accent-purple/5 text-accent-purple">
                  Systems Engineer
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-mono px-2.5 py-1 rounded border border-border-subtle text-text-muted">
                  Trading Systems
                </span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-display font-bold tracking-tight leading-[0.95] text-text-primary"
              >
                I build backend
                <br />
                <span className="gradient-text">
                  systems that
                  <br />
                  don't break.
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed"
              >
                State machines with zero double-execution. Data pipelines tuned
                for commodity hardware. Systems designed to run unsupervised —
                and recover on their own.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-4 pt-1">
                <Link
                  to="/systems"
                  className="glow-btn inline-flex items-center gap-2 text-sm font-medium"
                >
                  Explore Systems <ArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-secondary transition-colors px-4 py-3"
                >
                  About me <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* Status line */}
              <motion.div
                variants={item}
                className="flex items-center gap-2 pt-2"
              >
                <span className="status-dot bg-accent-green" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-mono">
                  Open to remote opportunities · Based in Jaipur, India
                </span>
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

      {/* ─── Proof Band — tight, no gap ─── */}
      <ProofBand />

      {/* ─── Flagship System ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px flex-1 max-w-[60px] bg-accent-blue/40" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                Flagship
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link to={`/systems/${flagship.slug}`} className="block group">
              <div className="glass-card p-8 md:p-10 hover:border-accent-blue/30 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-2.5 md:gap-10">
                  <div className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: flagship.accentColor }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                        {flagship.tags.slice(0, 3).join(" · ")}
                      </span>
                      {flagship.lastActive && (
                        <span className="text-[9px] font-mono text-accent-green/80 border border-accent-green/20 bg-accent-green/5 px-2 py-0.5 rounded flex items-center gap-1.5">
                          <span className="status-dot bg-accent-green" />
                          {flagship.lastActive}
                        </span>
                      )}
                    </div>
                    <h2 className="text-headline font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors">
                      {flagship.title}
                    </h2>
                    <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                      {flagship.thesis.length > 200
                        ? flagship.thesis.slice(0, 200) + "…"
                        : flagship.thesis}
                    </p>

                    {/* Proof capsule */}
                    {flagship.proofCapsules[0] && (
                      <div className="border-l-2 border-accent-green/40 pl-3 py-1">
                        <span className="text-[9px] uppercase tracking-widest text-accent-green/70 font-mono block mb-1">
                          Proof — {flagship.proofCapsules[0].source}
                        </span>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {flagship.proofCapsules[0].evidence}
                        </p>
                      </div>
                    )}

                    {/* Metrics grid — moved to left column */}
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(flagship.metrics)
                        .slice(0, 4)
                        .map(([key, val]) => (
                          <div
                            key={key}
                            className="space-y-1 p-3 rounded-lg bg-bg-surface/50"
                          >
                            <div className="text-[9px] uppercase tracking-widest text-text-muted font-mono">
                              {key}
                            </div>
                            <div className="text-xs text-text-primary leading-snug">
                              {val}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="hidden md:inline-flex items-center gap-2 text-sm text-accent-blue font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Deep dive <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <div className="space-y-3.5 md:space-y-4 border-t border-border-subtle mt-0 pt-3 md:border-t-0 md:mt-0 md:pt-0">
                    {/* Flagship image — layered system panel */}
                    {flagship.media.images[0] && (
                      <div className="relative group/img">
                        {/* Glow background */}
                        <div
                          className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
                          style={{
                            background: `radial-gradient(ellipse at center, ${flagship.accentColor}22, transparent 70%)`,
                          }}
                        />
                        {/* Glass container with perspective */}
                        <div
                          className="relative rounded-xl overflow-hidden border border-border-subtle bg-bg-surface/40 backdrop-blur-sm shadow-2xl shadow-black/20 transition-transform duration-500 group-hover:scale-[1.02]"
                          style={{
                            transform:
                              "perspective(800px) rotateY(-2deg) rotateX(1deg)",
                          }}
                        >
                          <img
                            src={flagship.media.images[0].src}
                            alt={flagship.media.images[0].alt}
                            className="w-full h-auto opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                            loading="lazy"
                          />
                          {/* Overlay labels */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="text-[8px] font-mono uppercase tracking-wider text-accent-green/90 bg-bg/70 backdrop-blur-sm px-2 py-0.5 rounded border border-accent-green/20">
                              ● live system
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <span className="text-[8px] font-mono text-text-muted/70 bg-bg/70 backdrop-blur-sm px-2 py-0.5 rounded border border-border-subtle">
                              {flagship.media.images[0].caption ||
                                "execution panel"}
                            </span>
                          </div>
                          {/* Subtle scan line effect */}
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent-blue/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                      </div>
                    )}

                    {flagship.challenges[0] && (
                      <div className="text-xs text-text-muted leading-relaxed border-l-2 border-accent-amber/30 pl-3">
                        <span className="text-[9px] uppercase tracking-widest text-accent-amber/70 font-mono block mb-1">
                          Core Challenge
                        </span>
                        {flagship.challenges[0].length > 120
                          ? flagship.challenges[0].slice(0, 120) + "…"
                          : flagship.challenges[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Core Systems ─── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px flex-1 max-w-[60px] bg-border-subtle" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                Core systems
              </span>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {secondary.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.08}>
                <Link
                  to={`/systems/${project.slug}`}
                  className="block group h-full"
                >
                  <div className="glass-card p-6 h-full flex flex-col hover:border-border-hover transition-all duration-400 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.accentColor }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                        {project.tags[0]}
                      </span>
                    </div>
                    <h3 className="text-title font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">
                      {project.thesis.length > 120
                        ? project.thesis.slice(0, 120) + "…"
                        : project.thesis}
                    </p>

                    {/* Key constraint */}
                    {project.constraints[0] && (
                      <div className="pt-3 border-t border-border-subtle">
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-accent-blue font-mono shrink-0">
                            →
                          </span>
                          <span className="text-text-muted">
                            <span className="text-text-secondary font-medium">
                              {project.constraints[0].dimension}:
                            </span>{" "}
                            {project.constraints[0].value}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                to="/systems"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors font-medium"
              >
                View all {projects.length} systems <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Lab Teaser ─── */}
      <section className="border-t border-border-subtle py-20 md:py-28 bg-bg-secondary/30">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
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
            <p className="text-text-secondary max-w-xl mb-10">
              Not tutorials. Not best practices. Honest accounts of what
              actually breaks when you ship to production.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {labPosts.slice(0, 3).map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.08}>
                <Link
                  to={`/lab/${post.slug}`}
                  className="glass-card p-6 block group hover:border-accent-purple/20 transition-all duration-400 h-full flex flex-col"
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
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-purple transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed flex-1">
                    {post.preview}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-headline font-bold tracking-tight text-text-primary mb-5">
              Got a system that needs building?
            </h2>
            <p className="text-text-secondary text-lg max-w-lg mx-auto mb-8">
              I'm open to backend challenges, infrastructure work, and systems
              that actually matter.
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
