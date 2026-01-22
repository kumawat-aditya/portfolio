import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Github,
  ExternalLink,
  ChevronDown,
  X,
} from "lucide-react";

interface Project {
  title: string;
  stack: string[];
  description: string;
  highlights: string[];
  details?: {
    architecture?: string[];
    engineering?: string[];
  };
}

const Projects: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedTech, setExpandedTech] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const projects: Project[] = [
    {
      title: "Real-Time Trading Signal Distribution",
      stack: ["Java", "Spring Boot", "WebSocket", "MQL5", "Telegram API"],
      description:
        "A production-grade distributed trading execution system for automated signal broadcasting and account-level execution.",
      highlights: [
        "High-performance Java server with signal deduplication",
        "MetaTrader EA with automated order placement",
        "Self-healing recovery with persistent state storage",
      ],
      details: {
        architecture: [
          "High-performance Java server parsing multi-target trading signals",
          "Per-user distribution logic with MetaTrader ID verification",
          "Execution layer using MetaTrader EA with trailing stop-loss",
          "Structured signal formatting for Telegram channels",
        ],
        engineering: [
          "Admin-only Telegram bot for client provisioning",
          "Access control and backup management",
          "Persistent state storage with self-healing recovery",
        ],
      },
    },
    {
      title: "QubiForge – Strategy Data Pipeline",
      stack: [
        "Python",
        "Pandas",
        "NumPy",
        "XGBoost",
        "Numba",
        "Parallel Processing",
      ],
      description:
        "A configurable AI data generation and strategy mining pipeline designed for large-scale trading research.",
      highlights: [
        "Bronze to Diamond layered data architecture",
        "Optimized from 8-9 hours to ~10 minutes",
        "Processed ~57 crore rows with parallelization",
      ],
      details: {
        architecture: [
          "Bronze Layer: SL/TP grid simulation with millions of combinations",
          "Silver Layer: 200+ technical indicators + S/R modeling",
          "Gold Layer: Rolling-window feature normalization",
          "Platinum Layer: Decision Tree rule mining → XGBoost",
          "Diamond Layer: Strategy evaluation engine",
        ],
        engineering: [
          "Optimized pipeline from 8–9 hours → ~10 minutes",
          "Parallelized processing across ~57 crore rows",
          "Fully configurable via centralized configuration",
        ],
      },
    },
    {
      title: "Stella – E-Commerce Architecture",
      stack: ["Java", "Spring Boot", "JWT", "Razorpay", "MySQL"],
      description:
        "A multi-role backend architecture inspired by Amazon's seller-user ecosystem.",
      highlights: [
        "Separate JWT auth domains for Users and Sellers",
        "Razorpay payment gateway integration",
        "Clean layered architecture with separation of concerns",
      ],
      details: {
        architecture: [
          "Separate authentication domains for Users and Sellers",
          "Seller dashboard APIs: Product upload, Media handling",
          "User-side: Dynamic search, Cart, Order lifecycle",
        ],
        engineering: [
          "Razorpay payment gateway integration",
          "Clean layered architecture with separation of concerns",
          "Designed for scalability and modular extension",
        ],
      },
    },
    {
      title: "Elastic DCA Trading System",
      stack: ["MQL5", "Python", "React"],
      description:
        "A grid-based automated trading system with controlled position scaling and equity-based risk management.",
      highlights: [
        "Dollar-gap based automated entries",
        "Equity, Balance, and Fixed dollar exit targets",
        "Real-time UI for monitoring P&L and trade states",
      ],
      details: {
        architecture: [
          "Dollar-gap based automated entries",
          "Dynamic lot management system",
          "Equity, Balance, and Fixed dollar exit targets",
          "Hedge-loss recovery logic",
        ],
        engineering: [
          "Start-limit entry system",
          "Real-time UI for monitoring P&L",
          "Bridged backend automation with interactive control",
        ],
      },
    },
    {
      title: "Rubik's Cube 3x3x3 Solver",
      stack: ["C++", "OOP", "Multithreading", "Algorithms"],
      description:
        "A CFOP-based high-performance cube-solving engine with fully modular C++ architecture.",
      highlights: [
        "Custom 3D cube representation engine",
        "CFOP algorithm (Cross, F2L, OLL, PLL)",
        "~2 second solve on legacy hardware",
      ],
      details: {
        architecture: [
          "Custom 3D cube state representation engine",
          "CFOP algorithm implementation (Cross, F2L, OLL, PLL)",
          "Multi-threaded optimization search",
        ],
        engineering: [
          "CLI visualization with color-coded output",
          "Polymorphism-driven modular architecture",
          "Solves within ~2 seconds on legacy hardware",
        ],
      },
    },
  ];

  const toggleTechExpand = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTech((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Auto-advance carousel every 5 seconds with infinite loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, projects.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const scrollByAmount = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Get visible cards (previous, current, next) for infinite carousel
  const getVisibleProjects = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + projects.length) % projects.length;
      result.push({
        project: projects[index],
        position: i,
        actualIndex: index,
      });
    }
    return result;
  };

  return (
    <>
      <section
        id="projects"
        className="min-h-screen pt-32 pb-24 border-t border-white/5"
      >
        {/* Section Header */}
        <div className="px-6 sm:px-12 lg:px-24 max-w-[1400px] mx-auto mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
              Featured Work
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 tracking-tight">
            Projects
          </h2>
          <p className="text-cream/60 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
            Engineering solutions designed for scale, performance, and
            reliability.
          </p>
        </div>

        {/* Carousel Container - Center focused */}
        <div
          className="relative flex items-center justify-center gap-6 px-6 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {getVisibleProjects().map(({ project, position, actualIndex }) => {
            const isTechExpanded = expandedTech.has(actualIndex);
            const displayStack = isTechExpanded
              ? project.stack
              : project.stack.slice(0, 3);
            const hasMoreTech = project.stack.length > 3;
            const isCenter = position === 0;

            return (
              <div
                key={`${actualIndex}-${position}`}
                className={`flex-shrink-0 transition-all duration-500 ease-out ${
                  isCenter
                    ? "w-[380px] md:w-[480px] scale-100 opacity-100 z-20"
                    : "w-[320px] md:w-[380px] scale-90 opacity-50 z-10"
                }`}
                style={{
                  transform: isCenter
                    ? "scale(1)"
                    : `scale(0.85) translateX(${position * 20}px)`,
                }}
              >
                <div
                  className={`glass-card h-full rounded-2xl p-6 md:p-8 transition-all duration-500 relative overflow-hidden ${
                    isCenter ? "shadow-[0_0_60px_rgba(59,130,246,0.15)]" : ""
                  }`}
                >
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                    {displayStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-medium text-accent bg-accent/10 rounded-md border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {hasMoreTech && (
                      <button
                        onClick={(e) => toggleTechExpand(actualIndex, e)}
                        className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-medium text-cream/40 bg-white/5 rounded-md border border-white/10 hover:border-accent/30 hover:text-accent transition-all flex items-center gap-1"
                      >
                        {isTechExpanded
                          ? "Less"
                          : `+${project.stack.length - 3}`}
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${isTechExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-cream mb-4 tracking-tight leading-tight transition-colors relative z-10">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-cream/50 text-sm leading-relaxed mb-6 relative z-10">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-6 relative z-10">
                    {project.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-cream/40 transition-colors"
                      >
                        <span className="mr-3 mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5 relative z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-cream/50 hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-cream/50 hover:text-accent transition-colors">
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls - Bottom Center */}
        <div className="flex flex-col items-center gap-6 mt-8">
          {/* Dot Indicators */}
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-accent w-6"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Arrow Controls - Always enabled for infinite loop */}
          <div className="flex gap-4">
            <button
              onClick={() => scrollByAmount("left")}
              className="p-3 rounded-full border border-white/10 bg-white/5 transition-all duration-300 text-cream hover:bg-white/10 hover:border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByAmount("right")}
              className="p-3 rounded-full border border-white/10 bg-white/5 transition-all duration-300 text-cream hover:bg-white/10 hover:border-white/20"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="glass-card max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream/60 hover:text-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs uppercase tracking-wider font-mono font-medium text-accent bg-accent/10 rounded-lg border border-accent/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-cream mb-4 tracking-tight">
              {selectedProject.title}
            </h3>

            {/* Description */}
            <p className="text-cream/60 text-base leading-relaxed mb-8">
              {selectedProject.description}
            </p>

            {/* Details Grid */}
            {selectedProject.details && (
              <div className="grid md:grid-cols-2 gap-8">
                {selectedProject.details.architecture && (
                  <div>
                    <h4 className="text-xs font-bold text-accent/80 uppercase tracking-widest mb-4 pb-2 border-b border-accent/20">
                      System Architecture
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.details.architecture.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-sm text-cream/60"
                        >
                          <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedProject.details.engineering && (
                  <div>
                    <h4 className="text-xs font-bold text-accent/80 uppercase tracking-widest mb-4 pb-2 border-b border-accent/20">
                      Engineering Highlights
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.details.engineering.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-sm text-cream/60"
                        >
                          <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-cream rounded-lg hover:bg-white transition-colors">
                <Github className="w-4 h-4" />
                <span>View Code</span>
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-cream/60 border border-white/10 rounded-lg hover:border-white/20 hover:text-cream transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
