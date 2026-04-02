import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { labPosts } from "../data/lab";

export default function Footer() {
  const latestPost = labPosts[0];

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Identity */}
          <div className="space-y-4">
            <Link to="/" className="font-mono text-sm font-semibold">
              aditya<span className="text-accent-blue">_</span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              Building systems that make decisions under real-world pressure.
            </p>
          </div>

          {/* From the Lab */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest text-text-muted font-medium">
              From the Lab
            </h4>
            {latestPost && (
              <Link to="/lab" className="block group">
                <p className="text-sm text-text-secondary group-hover:text-accent-blue transition-colors leading-relaxed">
                  {latestPost.title}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {latestPost.readTime} read
                </p>
              </Link>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest text-text-muted font-medium">
              Connect
            </h4>
            <div className="flex gap-5">
              <a
                href="https://github.com/kumawat-aditya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/adityakumawat105"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:kumawataditya105@gmail.com"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
            <div className="flex gap-6 text-[13px] text-text-muted pt-2">
              <Link
                to="/systems"
                className="hover:text-text-secondary transition-colors"
              >
                Systems
              </Link>
              <Link
                to="/lab"
                className="hover:text-text-secondary transition-colors"
              >
                Lab
              </Link>
              <Link
                to="/about"
                className="hover:text-text-secondary transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:text-text-secondary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border-subtle text-center">
          <p className="text-[11px] text-text-muted tracking-wide">
            Built with intention. Not with templates.
          </p>
        </div>
      </div>
    </footer>
  );
}
