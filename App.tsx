import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Evolution from "./components/Evolution";
import Expertise from "./components/Expertise";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Memoize child components to prevent re-renders from parent state changes
const MemoHero = memo(Hero);
const MemoProjects = memo(Projects);
const MemoEvolution = memo(Evolution);
const MemoExpertise = memo(Expertise);
const MemoExperience = memo(Experience);
const MemoContact = memo(Contact);
const MemoFooter = memo(Footer);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Refs for custom cursor (direct DOM manipulation — no React re-renders)
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRafRef = useRef<number>(0);

  // Custom cursor: update via refs + rAF (zero React re-renders)
  useEffect(() => {
    let cursorRafId: number;
    let prevX = 0;
    let prevY = 0;

    const updateCursorPosition = () => {
      const { x, y } = mouseRef.current;
      // Only update DOM if position actually changed
      if (x !== prevX || y !== prevY) {
        prevX = x;
        prevY = y;
        if (cursorRef.current) {
          cursorRef.current.style.left = `${x}px`;
          cursorRef.current.style.top = `${y}px`;
        }
        if (cursorDotRef.current) {
          cursorDotRef.current.style.left = `${x}px`;
          cursorDotRef.current.style.top = `${y}px`;
        }
      }
      cursorRafId = requestAnimationFrame(updateCursorPosition);
    };
    cursorRafId = requestAnimationFrame(updateCursorPosition);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!cursorRef.current || !cursorDotRef.current) return;

      if (target.closest('.cursor-grab, [draggable="true"]')) {
        cursorRef.current.classList.remove("hover");
        cursorRef.current.classList.add("grabbing");
        cursorDotRef.current.classList.add("grabbing");
      } else if (target.closest('a, button, [role="button"]')) {
        cursorRef.current.classList.add("hover");
        cursorRef.current.classList.remove("grabbing");
        cursorDotRef.current.classList.remove("grabbing");
      } else {
        cursorRef.current.classList.remove("hover", "grabbing");
        cursorDotRef.current.classList.remove("grabbing");
      }
    };

    const onMouseClick = () => {
      if (!cursorRef.current) return;
      cursorRef.current.classList.add("click");
      setTimeout(() => {
        cursorRef.current?.classList.remove("click");
      }, 300);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("click", onMouseClick);

    return () => {
      cancelAnimationFrame(cursorRafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("click", onMouseClick);
    };
  }, []);

  // Glass card mouse glow: throttled via rAF, only update hovered card
  useEffect(() => {
    let rafId: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const updateGlassCards = () => {
      // Find the card the mouse is currently over
      const hoveredCard = document
        .elementFromPoint(lastMouseX, lastMouseY)
        ?.closest(".glass-card") as HTMLElement | null;
      if (hoveredCard) {
        const rect = hoveredCard.getBoundingClientRect();
        hoveredCard.style.setProperty(
          "--mouse-x",
          `${lastMouseX - rect.left}px`,
        );
        hoveredCard.style.setProperty(
          "--mouse-y",
          `${lastMouseY - rect.top}px`,
        );
      }
      rafId = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(updateGlassCards);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container,
      lerp: 0.075,
      smoothWheel: true,
    });

    let lenisRafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(raf);
    };
    lenisRafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(lenisRafId);
      lenis.destroy();
    };
  }, []);

  // Fade-in animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    // Delay to ensure DOM is ready
    setTimeout(() => {
      const sections = document.querySelectorAll(".fade-in-section");
      sections.forEach((section) => observer.observe(section));
    }, 100);

    return () => observer.disconnect();
  }, []);

  // Theme toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <main
      className={`w-full h-screen relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-black" : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"}`}
    >
      {/* Custom Cursor — positioned via refs, not React state */}
      <div ref={cursorRef} className="custom-cursor">
        <span className="cursor-line cursor-line-top" />
        <span className="cursor-line cursor-line-right" />
        <span className="cursor-line cursor-line-bottom" />
        <span className="cursor-line cursor-line-left" />
      </div>
      <div ref={cursorDotRef} className="custom-cursor-dot" />

      {/* Ambient Background Light */}
      <div
        className={`fixed top-0 left-0 w-full h-[600px] pointer-events-none z-0 transition-opacity duration-500 ${isDarkMode ? "bg-gradient-to-b from-blue-900/15 via-blue-950/5 to-transparent" : "bg-gradient-to-b from-blue-100/50 via-blue-50/30 to-transparent"}`}
      />

      {/* Navbar with theme toggle */}
      <Navbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />

      <div
        ref={scrollContainerRef}
        className="scroll-container relative z-10 overflow-y-auto overflow-x-hidden h-screen"
      >
        {/* Section 1: Hero */}
        <div className="fade-in-section">
          <MemoHero />
        </div>

        {/* Section 2: Projects */}
        <div className="fade-in-section">
          <MemoProjects />
        </div>

        {/* Section 3: Evolution */}
        <div className="fade-in-section">
          <MemoEvolution />
        </div>

        {/* Section 4: Technical Expertise */}
        <div className="fade-in-section">
          <MemoExpertise />
        </div>

        {/* Section 5: Professional Experience */}
        <div className="fade-in-section">
          <MemoExperience />
        </div>

        {/* Section 6: Contact */}
        <div className="fade-in-section">
          <MemoContact />
        </div>

        {/* Section 7: Footer */}
        <MemoFooter />
      </div>
    </main>
  );
};

export default App;
