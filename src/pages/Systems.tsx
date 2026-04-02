import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";
import { projects } from "../data/projects";

export default function Systems() {
  return (
    <PageTransition>
      <section className="pt-32 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
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

          {/* Project Grid */}
          <div className="space-y-6">
            {projects.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.05}>
                <Link to={`/systems/${project.slug}`} className="block group">
                  <div
                    className={`glass-card p-6 md:p-8 hover:border-border-hover transition-all duration-500 ${project.priority === "flagship" ? "md:p-10" : ""}`}
                  >
                    <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
                      {/* Left column */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: project.accentColor }}
                          />
                          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                            {project.priority === "flagship"
                              ? "★ Flagship"
                              : project.tags[0]}
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
                          {project.subtitle}
                        </p>

                        <p className="text-sm text-text-muted leading-relaxed">
                          {project.thesis.length > 160
                            ? project.thesis.slice(0, 160) + "…"
                            : project.thesis}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-accent-blue font-medium pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Read the full story <ArrowUpRight size={14} />
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="md:col-span-5 space-y-4">
                        {/* Stack */}
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

                        {/* Key metric */}
                        <div className="p-4 rounded-lg bg-bg-surface/40 border border-border-subtle">
                          <div className="text-[10px] uppercase tracking-widest text-text-muted font-mono mb-1">
                            {Object.keys(project.metrics)[0]}
                          </div>
                          <div className="text-sm text-text-primary">
                            {Object.values(project.metrics)[0]}
                          </div>
                        </div>

                        {/* One challenge */}
                        {project.challenges[0] && (
                          <div className="text-xs text-text-muted leading-relaxed border-l-2 border-accent-amber/30 pl-3">
                            <span className="text-[9px] uppercase tracking-widest text-accent-amber/70 font-mono block mb-1">
                              Challenge
                            </span>
                            {project.challenges[0].length > 100
                              ? project.challenges[0].slice(0, 100) + "…"
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
      </section>
    </PageTransition>
  );
}
