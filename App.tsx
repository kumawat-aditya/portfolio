import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Systems from "./pages/Systems";
import SystemDetail from "./pages/SystemDetail";
import Lab from "./pages/Lab";
import About from "./pages/About";
import Contact from "./pages/Contact";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Custom cursor
  useEffect(() => {
    let prevX = 0;
    let prevY = 0;

    const updateCursor = () => {
      const { x, y } = mouseRef.current;
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
      requestAnimationFrame(updateCursor);
    };
    const rafId = requestAnimationFrame(updateCursor);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!cursorRef.current) return;

      if (target.closest('a, button, [role="button"], input, textarea')) {
        cursorRef.current.classList.add("hover");
      } else {
        cursorRef.current.classList.remove("hover");
      }
    };

    const onMouseClick = () => {
      if (!cursorRef.current) return;
      cursorRef.current.classList.add("click");
      setTimeout(() => cursorRef.current?.classList.remove("click"), 300);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("click", onMouseClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("click", onMouseClick);
    };
  }, []);

  // Glass card mouse glow
  useEffect(() => {
    let rafId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const updateGlow = () => {
      const card = document
        .elementFromPoint(lastX, lastY)
        ?.closest(".glass-card") as HTMLElement | null;
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${lastX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${lastY - rect.top}px`);
      }
      rafId = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(updateGlow);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Fade-in observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const observe = () => {
      document
        .querySelectorAll(".fade-in-section")
        .forEach((el) => observer.observe(el));
    };

    // Delay to let routes render
    setTimeout(observe, 100);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor">
        <span className="cursor-line cursor-line-top" />
        <span className="cursor-line cursor-line-right" />
        <span className="cursor-line cursor-line-bottom" />
        <span className="cursor-line cursor-line-left" />
      </div>
      <div ref={cursorDotRef} className="custom-cursor-dot" />

      <ScrollToTop />
      <Navbar />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/systems" element={<Systems />} />
          <Route path="/systems/:slug" element={<SystemDetail />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/portfolio">
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
