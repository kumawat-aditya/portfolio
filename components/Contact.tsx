import React from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="min-h-[70vh] px-6 sm:px-12 lg:px-24 max-w-[1400px] mx-auto pt-32 pb-32 border-t border-white/5 flex flex-col items-center justify-center text-center"
    >
      <div className="max-w-3xl">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(59,130,239,0.5)]"></div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-400">
            Get In Touch
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream-100 mb-12 tracking-tight">
          Let's Build Something
        </h2>

        {/* Action Area */}
        <div className="flex flex-col items-center gap-10">
          {/* Primary Email CTA */}
          <a
            href="mailto:kumawataditya105@gmail.com"
            className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-medium text-black bg-cream-100 rounded-full transition-all duration-300 hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 focus:ring-offset-black shadow-[0_0_30px_rgba(59,130,239,0.2)] hover:shadow-[0_0_40px_rgba(59,130,239,0.3)]"
          >
            <Mail className="w-5 h-5 mr-3" />
            <span>kumawataditya105@gmail.com</span>
          </a>

          {/* Secondary Social Row */}
          <div className="flex items-center gap-8 mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-white/5 border border-white/10 text-cream-500/50 hover:text-accent-400 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-white/5 border border-white/10 text-cream-500/50 hover:text-accent-400 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-white/5 border border-white/10 text-cream-500/50 hover:text-accent-400 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>

          {/* Location Note */}
          <div className="mt-12 text-sm text-cream-500/40 font-mono tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500/70 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Based in Jaipur, India · Open to remote opportunities
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

