import React, { useEffect, useState, useRef } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Evolution from "./components/Evolution";
import Expertise from "./components/Expertise";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Update glass card mouse position
    const handleGlassCards = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".glass-card");
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousemove", handleGlassCards);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousemove", handleGlassCards);
    };
  }, []);

  // Lenis-style smooth scroll implementation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.075; // Lower = smoother, slower
    let rafId: number;
    let isScrolling = false;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const smoothScroll = () => {
      // Get the current scroll target
      const diff = Math.abs(targetScroll - currentScroll);
      
      if (diff > 0.5) {
        currentScroll = lerp(currentScroll, targetScroll, ease);
        container.scrollTop = currentScroll;
        isScrolling = true;
      } else {
        currentScroll = targetScroll;
        isScrolling = false;
      }

      rafId = requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const maxScroll = container.scrollHeight - container.clientHeight;
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY));
    };

    const handleScroll = () => {
      if (!isScrolling) {
        currentScroll = container.scrollTop;
        targetScroll = container.scrollTop;
      }
    };

    // Handle smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const element = document.querySelector(href);
          if (element) {
            const elementTop = (element as HTMLElement).offsetTop;
            targetScroll = elementTop;
          }
        }
      }
    };

    // Initialize
    currentScroll = container.scrollTop;
    targetScroll = container.scrollTop;
    rafId = requestAnimationFrame(smoothScroll);

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleAnchorClick);

    // Handle touch devices (use native scroll)
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) {
      container.removeEventListener('wheel', handleWheel);
    }

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleAnchorClick);
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

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main
      className={`w-full h-screen relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
    >
      {/* Custom Cursor */}
      <div
        className={`custom-cursor ${isHovering ? "hover" : ""}`}
        style={{ left: mousePosition.x, top: mousePosition.y }}
      />
      <div
        className="custom-cursor-dot"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      />

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
          <Hero />
        </div>

        {/* Section 2: Projects */}
        <div className="fade-in-section">
          <Projects />
        </div>

        {/* Section 3: Evolution */}
        <div className="fade-in-section">
          <Evolution />
        </div>

        {/* Section 4: Technical Expertise */}
        <div className="fade-in-section">
          <Expertise />
        </div>

        {/* Section 5: Professional Experience */}
        <div className="fade-in-section">
          <Experience />
        </div>

        {/* Section 6: Contact */}
        <div className="fade-in-section">
          <Contact />
        </div>

        {/* Section 7: Footer */}
        <Footer />
      </div>
    </main>
  );
};

export default App;
