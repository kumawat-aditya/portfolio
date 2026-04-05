import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";
import { labPosts, LabPost } from "../data/lab";
import { projects } from "../data/projects";

const featured = labPosts.filter((p) => p.size === "featured");
const standard = labPosts.filter((p) => p.size === "standard");
const compact = labPosts.filter((p) => p.size === "compact");

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded ${
        status === "published"
          ? "bg-accent-green/10 text-accent-green"
          : "bg-accent-amber/10 text-accent-amber"
      }`}
    >
      {status}
    </span>
  );
}

function ProjectLink({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  return (
    <Link
      to={`/systems/${slug}`}
      className="text-[10px] text-accent-blue/70 font-mono hover:text-accent-blue transition-colors"
    >
      → {project.title}
    </Link>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[10px] font-mono text-text-muted bg-bg-surface/60 px-2 py-1 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ post }: { post: LabPost }) {
  const project = post.relatedProject
    ? projects.find((p) => p.slug === post.relatedProject)
    : null;
  const accentColor = project?.accentColor || "#3b82f6";

  // Find the most insightful paragraph (shortest after the first two)
  const insightIdx =
    post.content.length > 3
      ? post.content.slice(2).reduce((best, p, i) => {
          if (p.length < post.content[best].length && p.length > 60)
            return i + 2;
          return best;
        }, 2)
      : -1;

  return (
    <div className="glass-card p-8 md:p-10 hover:border-accent-purple/20 transition-all duration-400 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={post.status} />
        <span className="text-[10px] text-text-muted font-mono">
          {post.readTime}
        </span>
        {post.relatedProject && <ProjectLink slug={post.relatedProject} />}
      </div>

      <h2 className="text-headline font-bold tracking-tight text-text-primary mb-3">
        {post.title}
      </h2>
      <p className="text-text-secondary leading-relaxed max-w-2xl mb-6">
        {post.preview}
      </p>

      <div className="space-y-4 text-sm text-text-secondary leading-relaxed max-w-2xl">
        {post.content.map((paragraph, i) =>
          i === insightIdx ? (
            <blockquote
              key={i}
              className="border-l-2 pl-4 py-1 text-text-primary/90 italic"
              style={{ borderColor: accentColor }}
            >
              {paragraph}
            </blockquote>
          ) : (
            <p key={i}>{paragraph}</p>
          ),
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border-subtle">
        <Tags tags={post.tags} />
      </div>
    </div>
  );
}

function StandardCard({ post }: { post: LabPost }) {
  const project = post.relatedProject
    ? projects.find((p) => p.slug === post.relatedProject)
    : null;
  const accentColor = project?.accentColor || "#3b82f6";

  return (
    <div className="glass-card p-6 h-full flex flex-col hover:border-border-hover transition-all duration-400 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-0.5 h-full opacity-40"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-center gap-3 mb-3">
        <StatusBadge status={post.status} />
        <span className="text-[10px] text-text-muted font-mono">
          {post.readTime}
        </span>
      </div>

      <h3 className="text-base font-semibold text-text-primary mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-4">
        {post.preview}
      </p>

      <div className="space-y-3 flex-1">
        {post.content.slice(0, 2).map((paragraph, i) => (
          <p key={i} className="text-sm text-text-secondary leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {post.relatedProject && (
        <div className="mt-4 pt-3 border-t border-border-subtle">
          <ProjectLink slug={post.relatedProject} />
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border-subtle">
        <Tags tags={post.tags} />
      </div>
    </div>
  );
}

function CompactCard({ post }: { post: LabPost }) {
  return (
    <div className="glass-card p-5 h-full flex flex-col hover:border-border-hover transition-all duration-400">
      <div className="flex items-center gap-2 mb-2">
        <StatusBadge status={post.status} />
        <span className="text-[10px] text-text-muted font-mono">
          {post.readTime}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-text-primary mb-1.5">
        {post.title}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed flex-1">
        {post.preview}
      </p>

      {post.relatedProject && (
        <div className="mt-3 pt-2 border-t border-border-subtle">
          <ProjectLink slug={post.relatedProject} />
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-border-subtle">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono text-text-muted bg-bg-surface/60 px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Lab() {
  return (
    <PageTransition>
      <section className="pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 md:mb-16"
          >
            <h1 className="text-display font-bold tracking-tight text-text-primary mb-4">
              Lab
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              Field notes from building production systems. Not tutorials —
              honest accounts of what breaks, what scales, and what I'd do
              differently.
            </p>
          </motion.div>

          {/* Featured */}
          {featured.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Deep Dive
                </span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
              {featured.map((post) => (
                <ScrollReveal key={post.slug}>
                  <div className="mb-10">
                    <FeaturedCard post={post} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Standard — 2 col */}
          {standard.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Field Notes
                </span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {standard.map((post, i) => (
                  <ScrollReveal key={post.slug} delay={i * 0.08}>
                    <StandardCard post={post} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {/* Compact — 3 col */}
          {compact.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Quick Takes
                </span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {compact.map((post, i) => (
                  <ScrollReveal key={post.slug} delay={i * 0.06}>
                    <CompactCard post={post} />
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
