import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ScrollReveal";

const contexts = [
  "System Design",
  "Trading Infrastructure",
  "Backend Engineering",
  "Performance Optimization",
  "ML Pipelines",
  "Just Saying Hi",
];

export default function Contact() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PageTransition>
      <section className="pt-32 pb-24 md:pb-32 min-h-dvh">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left – Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-display font-bold tracking-tight text-text-primary mb-5">
                  Let's talk.
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-md">
                  Building something that needs to be reliable? Got a system
                  that's breaking under load? Or just want to talk about trading
                  infrastructure?
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  What's this about?
                </p>
                <div className="flex flex-wrap gap-2">
                  {contexts.map((ctx) => (
                    <button
                      key={ctx}
                      onClick={() => setSelected(selected === ctx ? null : ctx)}
                      className={`text-xs font-mono px-3 py-2 rounded-lg border transition-all duration-200 ${
                        selected === ctx
                          ? "border-accent-blue/50 bg-accent-blue/10 text-accent-blue"
                          : "border-border-subtle text-text-muted hover:border-border-hover hover:text-text-secondary"
                      }`}
                    >
                      {ctx}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono">
                  Or reach out directly
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:kumawataditya105@gmail.com"
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent-blue transition-colors group"
                  >
                    <Mail
                      size={16}
                      className="text-text-muted group-hover:text-accent-blue transition-colors"
                    />
                    kumawataditya105@gmail.com
                  </a>
                  <a
                    href="https://github.com/kumawat-aditya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent-blue transition-colors group"
                  >
                    <Github
                      size={16}
                      className="text-text-muted group-hover:text-accent-blue transition-colors"
                    />
                    github.com/kumawat-aditya
                  </a>
                  <a
                    href="https://www.linkedin.com/in/adityakumawat105"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent-blue transition-colors group"
                  >
                    <Linkedin
                      size={16}
                      className="text-text-muted group-hover:text-accent-blue transition-colors"
                    />
                    linkedin.com/in/adityakumawat105
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right – Form */}
            <ScrollReveal delay={0.2}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const subject = selected
                    ? `[Portfolio] ${selected}`
                    : "[Portfolio] Contact";
                  const body = formData.get("message") as string;
                  const name = formData.get("name") as string;
                  window.location.href = `mailto:kumawataditya105@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\n\n${body}`)}`;
                }}
                className="glass-card p-8 space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-bg-surface/50 border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-blue/50 transition-colors"
                    placeholder="What should I call you?"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-bg-surface/50 border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-blue/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {selected && (
                  <div className="text-xs text-accent-blue font-mono bg-accent-blue/5 border border-accent-blue/20 rounded-lg px-4 py-2.5">
                    Context: {selected}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-mono"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-bg-surface/50 border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-blue/50 transition-colors resize-none"
                    placeholder="Tell me about the problem you're solving..."
                  />
                </div>

                <button
                  type="submit"
                  className="glow-btn w-full inline-flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Send size={14} /> Send Message
                </button>

                <p className="text-[10px] text-text-muted/50 text-center">
                  Opens your email client. No data stored.
                </p>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
