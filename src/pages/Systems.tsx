import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";
import { projects } from "../data/projects";

const flagship = projects.filter((p) => p.priority === "flagship");
const major = projects.filter((p) => p.priority === "major");
const supporting = projects.filter((p) => p.priority === "supporting");

export default function Systems() {
  return (
    <PageTransition>
      <section className="pt-32 pb-24 md:pb-32">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 md:mb-20"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                {projects.length} systems
              </span>
            </div>
            <h1 className="text-display font-bold tracking-tight text-text-primary mb-5">
              Systems
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              Everything here ran in production or solved a real problem. No toy
              projects. Each system has a thesis, constraints, and documented
              tradeoffs.
            </p>
          </motion.div>

          {/* ─── Flagship Systems ─── */}
          {flagship.length > 0 && (
            <div className="mb-16">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-accent-blue/40" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                    Flagship Systems
                  </span>
                </div>
              </ScrollReveal>

              <div className="space-y-6">
                {flagship.map((project, i) => (
                  <ScrollReveal key={project.slug} delay={i * 0.05}>
                    <Link
                      to={`/systems/${project.slug}`}
                      className="block group"
                    >
                      <div className="glass-card p-8 md:p-10 hover:border-accent-blue/30 transition-all duration-500">
                        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
                          <div className="md:col-span-7 space-y-4">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: project.accentColor }}
                              />
                              <span className="text-[10px] uppercase tracking-[0.2em] text-accent-blue font-mono">
                                ★ Flagship
                              </span>
                              {project.github === "private" && (
                                <span className="text-[9px] uppercase tracking-[0.15em] text-text-muted/50 font-mono border border-border-subtle px-1.5 py-0.5 rounded">
                                  Private
                                </span>
                              )}
                            </div>

                            <h2 className="text-title font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors">
                              {project.title}
                            </h2>

                            <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
                              {project.thesis}
                            </p>

                            {/* Proof capsule */}
                            {project.proofCapsules[0] && (
                              <div className="border-l-2 border-accent-green/40 pl-3 py-1">
                                <span className="text-[9px] uppercase tracking-widest text-accent-green/70 font-mono block mb-1">
                                  Proof
                                </span>
                                <p className="text-xs text-text-muted leading-relaxed">
                                  {project.proofCapsules[0].evidence.length >
                                  150
                                    ? project.proofCapsules[0].evidence.slice(
                                        0,
                                        150,
                                      ) + "…"
                                    : project.proofCapsules[0].evidence}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-accent-blue font-medium pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              Read the full story <ArrowUpRight size={14} />
                            </div>
                          </div>

                          <div className="md:col-span-5 space-y-4">
                            {/* Key metrics */}
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(project.metrics)
                                .slice(0, 4)
                                .map(([key, val]) => (
                                  <div
                                    key={key}
                                    className="p-3 rounded-lg bg-bg-surface/40 border border-border-subtle"
                                  >
                                    <div className="text-[9px] uppercase tracking-widest text-text-muted font-mono mb-1">
                                      {key}
                                    </div>
                                    <div className="text-xs text-text-primary">
                                      {val}
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {/* Challenge */}
                            {project.challenges[0] && (
                              <div className="text-xs text-text-muted leading-relaxed border-l-2 border-accent-amber/30 pl-3">
                                <span className="text-[9px] uppercase tracking-widest text-accent-amber/70 font-mono block mb-1">
                                  Core Challenge
                                </span>
                                {project.challenges[0].length > 120
                                  ? project.challenges[0].slice(0, 120) + "…"
                                  : project.challenges[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {/* ─── Major Systems ─── */}
          {major.length > 0 && (
            <div className="mb-16">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-accent-purple/40" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                    Core Systems
                  </span>
                </div>
              </ScrollReveal>

              <div className="space-y-6">
                {major.map((project, i) => (
                  <ScrollReveal key={project.slug} delay={i * 0.05}>
                    <Link
                      to={`/systems/${project.slug}`}
                      className="block group"
                    >
                      <div className="glass-card p-6 md:p-8 hover:border-border-hover transition-all duration-500">
                        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
                          <div className="md:col-span-7 space-y-3">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: project.accentColor }}
                              />
                              <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                                {project.tags[0]}
                              </span>
                              {project.github === "private" && (
                                <span className="text-[9px] uppercase tracking-[0.15em] text-text-muted/50 font-mono border border-border-subtle px-1.5 py-0.5 rounded">
                                  Private
                                </span>
                              )}
                            </div>

                            <h2 className="text-title font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors">
                              {project.title}
                            </h2>

                            <p className="text-sm text-text-muted leading-relaxed">
                              {project.thesis.length > 160
                                ? project.thesis.slice(0, 160) + "…"
                                : project.thesis}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-accent-blue font-medium pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              Read the full story <ArrowUpRight size={14} />
                            </div>
                          </div>

                          <div className="md:col-span-5 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {project.stack.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono text-text-muted bg-bg-surface/60 px-2 py-1 rounded"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="p-3 rounded-lg bg-bg-surface/40 border border-border-subtle">
                              <div className="text-[9px] uppercase tracking-widest text-text-muted font-mono mb-1">
                                {Object.keys(project.metrics)[0]}
                              </div>
                              <div className="text-xs text-text-primary">
                                {Object.values(project.metrics)[0]}
                              </div>
                            </div>

                            {project.constraints[0] && (
                              <div className="flex items-start gap-2 text-xs text-text-muted">
                                <span className="text-accent-blue font-mono shrink-0">
                                  →
                                </span>
                                <span>
                                  <span className="text-text-secondary">
                                    {project.constraints[0].dimension}:
                                  </span>{" "}
                                  {project.constraints[0].value}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {/* ─── Earlier Work ─── */}
          {supporting.length > 0 && (
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-border-subtle" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                    Earlier Work
                  </span>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-6">
                {supporting.map((project, i) => (
                  <ScrollReveal key={project.slug} delay={i * 0.05}>
                    <Link
                      to={`/systems/${project.slug}`}
                      className="block group h-full"
                    >
                      <div className="glass-card p-6 h-full hover:border-border-hover transition-all duration-400">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: project.accentColor }}
                          />
                          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                            {project.tags[0]}
                          </span>
                        </div>
                        <h3 className="text-base font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                          {project.subtitle}
                        </p>
                        <div className="mt-4 pt-3 border-t border-border-subtle">
                          <p className="text-xs text-text-muted font-mono">
                            {project.stack.slice(0, 4).join(" · ")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
