import React, { useState, useEffect } from "react";
import { Menu, X, Github, Linkedin, Sun, Moon } from "lucide-react";

interface NavbarProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, onThemeToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(".scroll-container");
      if (scrollContainer) {
        setIsScrolled(scrollContainer.scrollTop > 10);
      } else {
        setIsScrolled(window.scrollY > 10);
      }
    };

    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Projects", id: "projects" },
    { name: "Evolution", id: "evolution" },
    { name: "Expertise", id: "expertise" },
    { name: "Experience", id: "experience" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/5 backdrop-blur-xl backdrop-saturate-180 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-24 flex items-center justify-between">
          {/* Brand */}
          <div className="cursor-pointer z-50" onClick={scrollToTop}>
            <span className="text-cream-100 font-bold text-xl tracking-tighter hover:text-accent-400 transition-colors duration-300">
              Aditya.
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-cream-100/60 hover:text-cream-100 transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}

            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-100/60 hover:text-accent-400 transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-100/60 hover:text-accent-400 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>

            {/* Theme Toggle Switch */}
            <button
              onClick={onThemeToggle}
              className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 transition-all duration-300 hover:border-white/20 flex items-center px-1"
              aria-label="Toggle theme"
            >
              <div
                className={`absolute w-5 h-5 rounded-full bg-accent-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center justify-center ${
                  isDarkMode ? "left-1" : "left-8"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3 h-3 text-white" />
                ) : (
                  <Sun className="w-3 h-3 text-white" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="relative w-12 h-6 rounded-full bg-white/10 border border-white/10 transition-all duration-300 flex items-center px-0.5"
              aria-label="Toggle theme"
            >
              <div
                className={`absolute w-5 h-5 rounded-full bg-accent-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center justify-center ${
                  isDarkMode ? "left-0.5" : "left-6"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3 h-3 text-white" />
                ) : (
                  <Sun className="w-3 h-3 text-white" />
                )}
              </div>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 text-cream"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className={`text-3xl font-semibold text-cream-100/80 hover:text-cream-100 transition-all duration-300 transform ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.name}
            </button>
          ))}

          <div className="flex items-center gap-6 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-100/60 hover:text-accent-400 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-100/60 hover:text-accent-400 transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
