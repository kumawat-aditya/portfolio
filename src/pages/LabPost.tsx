import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { labPosts } from "../data/lab";
import { projects } from "../data/projects";

export default function LabPost() {
  const { slug } = useParams();
  const post = labPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-dvh flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-headline font-bold text-text-primary">
              Post not found
            </h1>
            <Link
              to="/lab"
              className="text-accent-blue text-sm hover:underline"
            >
              ← Back to Lab
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const project = post.relatedProject
    ? projects.find((p) => p.slug === post.relatedProject)
    : null;
  const accentColor = project?.accentColor || "#3b82f6";

  // Find the most insightful paragraph for blockquote treatment
  const insightIdx =
    post.content.length > 3
      ? post.content.slice(2).reduce((best, p, i) => {
          if (p.length < post.content[best].length && p.length > 60)
            return i + 2;
          return best;
        }, 2)
      : -1;

  return (
    <PageTransition>
      <article className="pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Lab
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-[10px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded ${
                  post.status === "published"
                    ? "bg-accent-green/10 text-accent-green"
                    : "bg-accent-amber/10 text-accent-amber"
                }`}
              >
                {post.status}
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                {post.readTime}
              </span>
              {post.date && (
                <span className="text-[10px] text-text-muted font-mono">
                  {post.date}
                </span>
              )}
            </div>

            <h1 className="text-headline font-bold tracking-tight text-text-primary mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              {post.preview}
            </p>

            {project && (
              <Link
                to={`/systems/${project.slug}`}
                className="inline-flex items-center gap-2 text-[11px] font-mono text-accent-blue/70 hover:text-accent-blue transition-colors mb-8"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                {project.title}
              </Link>
            )}

            <div className="h-px bg-border-subtle mb-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-5"
          >
            {post.content.map((paragraph, i) =>
              i === insightIdx ? (
                <blockquote
                  key={i}
                  className="border-l-2 pl-5 py-1 text-text-primary/90 italic text-base leading-relaxed"
                  style={{ borderColor: accentColor }}
                >
                  {paragraph}
                </blockquote>
              ) : (
                <p
                  key={i}
                  className="text-text-secondary leading-relaxed text-base"
                >
                  {paragraph}
                </p>
              ),
            )}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10 pt-6 border-t border-border-subtle"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-text-muted bg-bg-surface/60 px-2.5 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {project && (
              <div className="mt-6">
                <Link
                  to={`/systems/${project.slug}`}
                  className="glass-card p-5 block group hover:border-accent-blue/20 transition-all"
                >
                  <span className="text-[9px] uppercase tracking-widest text-text-muted font-mono block mb-2">
                    Related System
                  </span>
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                    {project.title}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {project.subtitle}
                  </p>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </article>
    </PageTransition>
  );
}
