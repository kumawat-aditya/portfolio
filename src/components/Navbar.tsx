import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;

      const target = event.target as Node | null;
      if (target && navRef.current && !navRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const hidden = direction === "down" && !atTop && !open;

  return (
    <nav
      ref={navRef}
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.3 },
            }}
            className="md:hidden bg-bg/95 backdrop-blur-xl border-b border-border-subtle overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{
                    delay: 0.1 + i * 0.06,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`text-sm py-2 block transition-colors ${
                      location.pathname === l.to
                        ? "text-text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
