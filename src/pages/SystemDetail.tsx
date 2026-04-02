import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";
import { projects } from "../data/projects";
import { labPosts } from "../data/lab";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "engineering", label: "Engineering" },
  { id: "challenges", label: "Challenges" },
  { id: "failures", label: "Failures" },
  { id: "tradeoffs", label: "Tradeoffs" },
  { id: "improvements", label: "What I'd Rebuild" },
];

export default function SystemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-dvh flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-headline font-bold text-text-primary">
              System not found
            </h1>
            <Link
              to="/systems"
              className="text-accent-blue text-sm hover:underline"
            >
              ← Back to systems
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const relatedPosts = labPosts.filter((p) =>
    project.relatedLab.includes(p.slug),
  );

  return (
    <PageTransition>
      {/* Header */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.accentColor }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.2em] font-mono"
                style={{ color: project.accentColor }}
              >
                {project.priority}
              </span>
            </div>

            <h1 className="text-display font-bold tracking-tight text-text-primary mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl leading-relaxed mb-6">
              {project.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono text-text-muted bg-bg-surface/60 px-2.5 py-1 rounded border border-border-subtle"
                >
                  {t}
                </span>
              ))}
            </div>

            {project.github && project.github !== "private" && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
              >
                <Github size={14} /> View Source <ExternalLink size={12} />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24 space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-[13px] text-text-muted hover:text-text-primary py-1.5 transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-9 space-y-16">
              {/* Overview */}
              <ScrollReveal>
                <div id="overview" className="scroll-mt-24 space-y-6">
                  <SectionLabel>Overview</SectionLabel>
                  <p className="text-text-secondary leading-relaxed text-base">
                    {project.thesis}
                  </p>
                  <p className="text-text-secondary leading-relaxed text-base">
                    {project.whatItDoes}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {Object.entries(project.metrics).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-4 rounded-lg bg-bg-surface/50 border border-border-subtle"
                      >
                        <div className="text-[9px] uppercase tracking-widest text-text-muted font-mono mb-1">
                          {key}
                        </div>
                        <div className="text-sm text-text-primary font-medium">
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {project.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-xs font-mono px-3 py-1.5 rounded-full border border-border-subtle text-text-secondary"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Architecture */}
              <ScrollReveal>
                <div id="architecture" className="scroll-mt-24 space-y-4">
                  <SectionLabel>Architecture</SectionLabel>
                  <ul className="space-y-3">
                    {project.architecture.map((a, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-text-secondary text-sm leading-relaxed"
                      >
                        <span className="text-accent-blue font-mono text-xs mt-0.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Engineering */}
              <ScrollReveal>
                <div id="engineering" className="scroll-mt-24 space-y-4">
                  <SectionLabel>Engineering Decisions</SectionLabel>
                  <ul className="space-y-3">
                    {project.engineering.map((e, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-text-secondary text-sm leading-relaxed"
                      >
                        <span className="text-accent-green font-mono text-xs mt-0.5 shrink-0">
                          →
                        </span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Challenges */}
              <ScrollReveal>
                <div id="challenges" className="scroll-mt-24 space-y-4">
                  <SectionLabel>Challenges</SectionLabel>
                  <div className="space-y-4">
                    {project.challenges.map((c, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-accent-amber/40 pl-4 py-1"
                      >
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {c}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Failures */}
              <ScrollReveal>
                <div id="failures" className="scroll-mt-24 space-y-4">
                  <SectionLabel>What Broke</SectionLabel>
                  <div className="space-y-4">
                    {project.failures.map((f, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-accent-rose/40 pl-4 py-1"
                      >
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {f}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Tradeoffs */}
              <ScrollReveal>
                <div id="tradeoffs" className="scroll-mt-24 space-y-4">
                  <SectionLabel>Tradeoffs</SectionLabel>
                  <div className="space-y-4">
                    {project.tradeoffs.map((t, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-accent-purple/40 pl-4 py-1"
                      >
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {t}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Improvements */}
              <ScrollReveal>
                <div id="improvements" className="scroll-mt-24 space-y-4">
                  <SectionLabel>What I'd Rebuild</SectionLabel>
                  <ul className="space-y-3">
                    {project.improvements.map((imp, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-text-secondary text-sm leading-relaxed"
                      >
                        <span className="text-accent-cyan font-mono text-xs mt-0.5 shrink-0">
                          ◆
                        </span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Insight */}
              <ScrollReveal>
                <div className="p-6 md:p-8 rounded-xl border border-accent-blue/20 bg-accent-blue/5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-accent-blue font-mono mb-3">
                    Insight
                  </p>
                  <p className="text-text-primary text-lg leading-relaxed font-medium">
                    "{project.insight}"
                  </p>
                </div>
              </ScrollReveal>

              {/* Related Lab */}
              {relatedPosts.length > 0 && (
                <ScrollReveal>
                  <div className="space-y-4">
                    <SectionLabel>Related from the Lab</SectionLabel>
                    <div className="grid gap-4">
                      {relatedPosts.map((post) => (
                        <Link
                          key={post.slug}
                          to="/lab"
                          className="glass-card p-5 block group hover:border-accent-purple/20 transition-all"
                        >
                          <p className="text-sm font-medium text-text-primary group-hover:text-accent-purple transition-colors">
                            {post.title}
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {post.readTime} · {post.difficulty}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-title font-bold tracking-tight text-text-primary flex items-center gap-3">
      <span className="w-6 h-px bg-border-hover" />
      {children}
    </h2>
  );
}
