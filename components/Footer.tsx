import React from "react";
import { Github, Linkedin, Mail, FileText, Heart } from "lucide-react";
import content from "../data/content.json";

const personal = content.personal;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 bg-gradient-to-t from-gray-950 to-transparent border-t border-white/5">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto px-6 sm:px-12 lg:px-24 2xl:px-32 3xl:px-40">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-cream-100 font-bold text-lg tracking-tighter">
              {personal.name.split(" ")[0]}.
            </span>
            <span className="text-cream-100/40 text-sm font-mono tracking-wide">
              © {currentYear} · All rights reserved
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-2 text-cream-100/50 hover:text-accent-400 transition-colors duration-300 text-sm"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </a>

            <span className="w-1 h-1 rounded-full bg-white/10"></span>

            <a
              href={personal.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream-100/50 hover:text-accent-400 transition-colors duration-300 text-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            <span className="w-1 h-1 rounded-full bg-white/10"></span>

            <a
              href={personal.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream-100/50 hover:text-accent-400 transition-colors duration-300 text-sm"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>

            <span className="w-1 h-1 rounded-full bg-white/10"></span>

            <a
              href={personal.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream-100/50 hover:text-accent-400 transition-colors duration-300 text-sm"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Resume</span>
            </a>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-8 pt-8 border-t border-white/5 flex justify-center">
          <p className="text-cream-100/30 text-xs font-mono tracking-wider flex items-center gap-2">
            Designed & Built with{" "}
            <Heart className="w-3 h-3 text-accent-500/50" /> using React &
            Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
