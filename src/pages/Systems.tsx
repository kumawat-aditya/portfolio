import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import ScrollReveal from "../components/ScrollReveal";
import { projects, type Project } from "../data/projects";

const flagship = projects.filter((p) => p.priority === "flagship");
const major = projects.filter((p) => p.priority === "major");
const supporting = projects.filter((p) => p.priority === "supporting");

function SystemCard({
  project,
  variant,
  onHover,
}: {
  project: Project;
  variant: "flagship" | "major" | "supporting";
  onHover?: (slug: string | null) => void;
}) {
  const firstImage = project.media.images[0];

  if (variant === "flagship") {
    return (
      <Link
        to={`/systems/${project.slug}`}
        className="block group"
        onMouseEnter={() => onHover?.(project.slug)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className="glass-card p-8 md:p-10 hover:border-accent-blue/30 transition-all duration-500">
          <div className="grid md:grid-cols-12 gap-2.5 md:gap-8 items-start">
            <div className="md:col-span-7 space-y-3.5 md:space-y-4">
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
                {project.lastActive && (
                  <span className="text-[9px] font-mono text-accent-green/80 border border-accent-green/20 bg-accent-green/5 px-2 py-0.5 rounded flex items-center gap-1.5">
                    <span className="status-dot bg-accent-green" />
                    {project.lastActive}
                  </span>
                )}
              </div>

              <h2 className="text-title font-bold tracking-tight text-text-primary group-hover:text-accent-blue transition-colors">
                {project.title}
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
                {project.thesis}
              </p>

              {project.proofCapsules[0] && (
                <div className="border-l-2 border-accent-green/40 pl-3 py-1">
                  <span className="text-[9px] uppercase tracking-widest text-accent-green/70 font-mono block mb-1">
                    Proof
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {project.proofCapsules[0].evidence.length > 150
                      ? project.proofCapsules[0].evidence.slice(0, 150) + "…"
                      : project.proofCapsules[0].evidence}
                  </p>
                </div>
              )}

              {/* Metrics grid — moved to left column */}
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
                      <div className="text-xs text-text-primary">{val}</div>
                    </div>
                  ))}
              </div>

              <div className="hidden md:flex items-center gap-2 text-sm text-accent-blue font-medium pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Read the full story <ArrowUpRight size={14} />
              </div>
            </div>

            <div className="md:col-span-5 space-y-3.5 md:space-y-4 border-t border-border-subtle mt-0 pt-3 md:border-t-0 md:mt-0 md:pt-0">
              {/* Preview image — parallax zoom */}
              {firstImage && (
                <div className="relative group/img">
                  <div
                    className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
                    style={{
                      background: `radial-gradient(ellipse at center, ${project.accentColor}22, transparent 70%)`,
                    }}
                  />
                  <div
                    className="relative rounded-xl overflow-hidden border border-border-subtle bg-bg-surface/40 backdrop-blur-sm shadow-2xl shadow-black/20 transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{
                      transform:
                        "perspective(800px) rotateY(-2deg) rotateX(1deg)",
                    }}
                  >
                    <img
                      src={firstImage.src}
                      alt={firstImage.alt}
                      className="w-full h-auto opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-accent-green/90 bg-bg/70 backdrop-blur-sm px-2 py-0.5 rounded border border-accent-green/20">
                        ● live system
                      </span>
                    </div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent-blue/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>
              )}

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
    );
  }

  if (variant === "major") {
    return (
      <Link
        to={`/systems/${project.slug}`}
        className="block group relative hover:z-[30]"
        onMouseEnter={() => onHover?.(project.slug)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className="glass-card p-6 md:p-8 hover:border-border-hover transition-all duration-500 relative">
          <div className="grid md:grid-cols-12 gap-2.5 md:gap-8 items-start">
            <div className="md:col-span-7 space-y-3 relative z-10">
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

              <div className="hidden md:flex items-center gap-2 text-sm text-accent-blue font-medium pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Read the full story <ArrowUpRight size={14} />
              </div>
            </div>

            <div className="md:col-span-5 space-y-3 relative z-10 transition-opacity duration-[250ms] group-hover:opacity-0 border-t border-border-subtle mt-0 pt-3 md:border-t-0 md:mt-0 md:pt-0">
              {/* Stack tags */}
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

              {/* Primary metric */}
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
                  <span className="text-accent-blue font-mono shrink-0">→</span>
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

        {/* Image reveal — sibling of glass-card so it can overflow above the card's top border */}
        {firstImage && (
          <div className="hidden md:block absolute right-[5%] bottom-1 w-[30%] h-[110%] pointer-events-none z-20 overflow-hidden">
            <div
              className="hidden md:block absolute h-full top-0 pointer-events-none z-20 overflow-hidden rounded-t-xl translate-y-[100%] group-hover:-translate-y-0 transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "calc(100% - 2rem)",
                borderTop: `1px solid ${project.accentColor}`,
                borderLeft: `1px solid ${project.accentColor}`,
                borderRight: `1px solid ${project.accentColor}`,
              }}
            >
              {/* Image fills the full container */}
              <div className="absolute inset-0">
                <img
                  src={firstImage.src}
                  alt={firstImage.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}
      </Link>
    );
  }

  // Supporting
  return (
    <Link
      to={`/systems/${project.slug}`}
      className="block group h-full"
      onMouseEnter={() => onHover?.(project.slug)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="glass-card p-6 h-full hover:border-border-hover transition-all duration-400 relative overflow-hidden">
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
        <p className="text-sm text-text-muted leading-relaxed mb-4">
          {project.subtitle}
        </p>
        <div className="pt-3 border-t border-border-subtle">
          <p className="text-xs text-text-muted font-mono">
            {project.stack.slice(0, 4).join(" · ")}
          </p>
        </div>

        {/* Hover image for supporting */}
        {firstImage && (
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="w-full h-full translate-y-[100%] group-hover:translate-y-0 transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              <img
                src={firstImage.src}
                alt={firstImage.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-sm font-bold text-text-primary mb-1">
                  {project.title}
                </h3>
                <p className="text-[10px] text-text-muted font-mono">
                  {project.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Systems() {
  const [, setHovered] = useState<string | null>(null);

  return (
    <PageTransition>
      <SEO
        title="Systems — Production Engineering Portfolio"
        description="Deep-dive case studies of production systems: trading platforms, ML pipelines, real-time infrastructure. Each with architecture, proof, and incident reports."
        path="/systems"
      />
      <section className="pt-32 pb-20 md:pb-28">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 md:mb-16"
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
            <div className="mb-14">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-accent-blue/40" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                    Flagship Systems
                  </span>
                </div>
              </ScrollReveal>

              <div className="space-y-5">
                {flagship.map((project, i) => (
                  <ScrollReveal key={project.slug} delay={i * 0.05}>
                    <SystemCard
                      project={project}
                      variant="flagship"
                      onHover={setHovered}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {/* ─── Core Systems ─── */}
          {major.length > 0 && (
            <div className="mb-14">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-accent-purple/40" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                    Core Systems
                  </span>
                </div>
              </ScrollReveal>

              <div className="space-y-5">
                {major.map((project, i) => (
                  <ScrollReveal key={project.slug} delay={i * 0.05}>
                    <SystemCard
                      project={project}
                      variant="major"
                      onHover={setHovered}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {/* ─── Supporting Work ─── */}
          {supporting.length > 0 && (
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-border-subtle" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                    Supporting Work
                  </span>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-5">
                {supporting.map((project, i) => (
                  <ScrollReveal key={project.slug} delay={i * 0.05}>
                    <SystemCard
                      project={project}
                      variant="supporting"
                      onHover={setHovered}
                    />
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
