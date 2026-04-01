import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/systems", label: "Systems" },
  { to: "/lab", label: "Lab" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/70 border-b border-white/[0.04]">
      <div className="max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1800px] mx-auto px-6 3xl:px-8 h-16 3xl:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-text-primary link-hover"
        >
          aditya<span className="text-accent-blue">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors duration-200 link-hover ${
                location.pathname === link.to
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/kumawat-aditya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-1.5 rounded-full border border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-blue/40 transition-all duration-200"
          >
            GitHub
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.04] bg-[#0a0a0f]/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm py-2 transition-colors ${
                  location.pathname === link.to
                    ? "text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
