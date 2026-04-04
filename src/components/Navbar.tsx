import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useScrollDirection } from "../hooks/useScrollDirection";

const links = [
  { to: "/", label: "Home" },
  { to: "/systems", label: "Systems" },
  { to: "/lab", label: "Lab" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { direction, atTop } = useScrollDirection();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const hidden = direction === "down" && !atTop && !open;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`backdrop-blur-xl border-b transition-colors duration-300 ${atTop ? "bg-transparent border-transparent" : "bg-bg/80 border-border-subtle"}`}
      >
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-mono text-sm font-semibold tracking-tight text-text-primary"
          >
            aditya<span className="text-accent-blue">_</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[13px] tracking-wide transition-colors link-hover ${
                  location.pathname === l.to
                    ? "text-text-primary font-medium"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-bg/95 backdrop-blur-xl border-b border-border-subtle">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-sm py-2 transition-colors ${
                  location.pathname === l.to
                    ? "text-text-primary"
                    : "text-text-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
