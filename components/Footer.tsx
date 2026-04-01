import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.04] bg-bg/50 backdrop-blur-sm">
      <div className="max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1800px] mx-auto px-6 3xl:px-8 py-12 3xl:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left */}
          <div className="space-y-3">
            <Link to="/" className="text-lg font-semibold tracking-tight">
              aditya<span className="text-accent-blue">.</span>
            </Link>
            <p className="text-sm text-text-secondary max-w-xs">
              Building systems that make decisions in real time.
            </p>
          </div>

          {/* Center - Nav */}
          <div className="flex gap-6 text-sm text-text-secondary">
            <Link
              to="/systems"
              className="hover:text-text-primary transition-colors"
            >
              Systems
            </Link>
            <Link
              to="/lab"
              className="hover:text-text-primary transition-colors"
            >
              Lab
            </Link>
            <Link
              to="/about"
              className="hover:text-text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right - Social */}
          <div className="flex gap-4">
            <a
              href="https://github.com/kumawat-aditya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/adityakumawat105"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:kumawataditya105@gmail.com"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Aditya Kumawat. Built with intention.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
