import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";
import { labPosts } from "../data/lab";

const featured = labPosts[0];
const rest = labPosts.slice(1);

const difficultyColor: Record<string, string> = {
  intermediate: "text-accent-amber",
  advanced: "text-accent-rose",
  beginner: "text-accent-green",
};

export default function Lab() {
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
            <h1 className="text-display font-bold tracking-tight text-text-primary mb-5">
              Lab
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              Field notes from building production systems. Not tutorials —
              honest accounts of what breaks, what scales, and what I'd do
              differently.
            </p>
          </motion.div>

          {/* Featured Post */}
          {featured && (
            <ScrollReveal>
              <div className="glass-card p-8 md:p-10 mb-12 hover:border-accent-purple/20 transition-all duration-400">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-[10px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded ${featured.status === "published" ? "bg-accent-green/10 text-accent-green" : "bg-accent-amber/10 text-accent-amber"}`}
                  >
                    {featured.status}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">
                    {featured.readTime}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${difficultyColor[featured.difficulty] || "text-text-muted"}`}
                  >
                    {featured.difficulty}
                  </span>
                </div>

                <h2 className="text-headline font-bold tracking-tight text-text-primary mb-3">
                  {featured.title}
                </h2>
                <p className="text-text-secondary leading-relaxed max-w-2xl mb-6">
                  {featured.preview}
                </p>

                <div className="space-y-4 text-sm text-text-secondary leading-relaxed max-w-2xl">
                  {featured.content.map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border-subtle">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-text-muted bg-bg-surface/60 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Other Posts */}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {rest.map((post, i) => (
                <ScrollReveal key={post.slug} delay={i * 0.1}>
                  <div className="glass-card p-6 h-full flex flex-col hover:border-border-hover transition-all duration-400">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-[10px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded ${post.status === "published" ? "bg-accent-green/10 text-accent-green" : "bg-accent-amber/10 text-accent-amber"}`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">
                        {post.readTime}
                      </span>
                      <span
                        className={`text-[10px] font-mono ${difficultyColor[post.difficulty] || "text-text-muted"}`}
                      >
                        {post.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-text-primary mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed flex-1">
                      {post.preview}
                    </p>

                    <div className="space-y-3 mt-4">
                      {post.content
                        .slice(0, 2)
                        .map((paragraph: string, i: number) => (
                          <p
                            key={i}
                            className="text-sm text-text-secondary leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border-subtle">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-text-muted bg-bg-surface/60 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
