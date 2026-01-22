import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface TimelineData {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  points: string[];
  tech: string[];
}

const Evolution: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const history: TimelineData[] = [
    {
      year: "2022",
      title: "Foundations in Web Development",
      description:
        "Began with structured frontend engineering, focusing on strict layout systems and clean code organization.",
      points: [
        "Mastered Grid & Flexbox layout systems",
        "Built architectural course projects (Omnifood)",
        "Parallel study of C++ for memory-level understanding",
      ],
      tech: ["HTML/CSS", "Git", "C++", "Layouts"],
    },
    {
      year: "2023",
      title: "Algorithmic Systems & Performance",
      description:
        "Shifted from interface-building to computational system design. Built a high-performance Rubik's Cube Solver.",
      points: [
        "Designed complete 3D cube state representation engine",
        "Implemented CFOP algorithms (Cross, F2L, OLL, PLL)",
        "Achieved ~2-second solve time via multi-threaded search",
      ],
      tech: ["C++", "Algorithms", "Multithreading", "Data Structures"],
    },
    {
      year: "Early 2024",
      title: "Backend Architecture & Auth",
      subtitle: "Worinwell Internship",
      description:
        "Transitioned to backend engineering. Architecture-first thinking became central to my development philosophy.",
      points: [
        "Built full CRUD Employee Management System with JWT",
        "Designed 'Stella' – an Amazon-inspired multi-role backend",
        "Integrated payment gateways and complex schemas",
      ],
      tech: ["Java", "Spring Boot", "REST APIs", "JWT"],
    },
    {
      year: "Late 2024",
      title: "Trading Systems & Infrastructure",
      subtitle: "Trade Amplification",
      description:
        "Entered the niche of algorithmic trading. Focus shifted to latency sensitivity and execution reliability.",
      points: [
        "Built automated trading bots and real-time signal infrastructure",
        "Engineered self-healing backend servers with state recovery",
        "Implemented structured signal formatting",
      ],
      tech: ["MQL5", "WebSockets", "Automation", "Distributed Systems"],
    },
    {
      year: "2025",
      title: "Applied AI & ML Research",
      subtitle: "Qubitron Labs",
      description:
        "Moved from rule-based automation into structured AI frameworks and large-scale ML research infrastructure.",
      points: [
        "Developed 'Elisa' using Rasa-based conversational AI",
        "Engineered 'QubiForge' pipeline processing 57 crore rows",
        "Built Bronze to Diamond layered data architecture",
      ],
      tech: ["Python", "Rasa", "NLP", "XGBoost", "Pandas"],
    },
    {
      year: "2025 — 2026",
      title: "Advanced Trading Engineering",
      description:
        "Merging trading system design with model interpretation and fullstack execution engineering.",
      points: [
        "Built Elastic DCA System with fullstack automation",
        "Implemented Lorentzian Classification logic from Pine Script",
        "Enhanced configurability and reversal logic",
      ],
      tech: ["MQL5", "React", "System Design", "ML Integration"],
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.5;
      const relativeY = triggerPoint - rect.top;
      const currentHeight = Math.max(0, Math.min(relativeY, rect.height));
      setLineHeight(currentHeight);
    };

    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <section
      id="evolution"
      className="min-h-screen px-6 sm:px-12 lg:px-24 max-w-[1400px] mx-auto pt-32 pb-24 border-t border-white/5"
    >
      {/* Section Header */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-400">
            My Journey
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream-100 mb-6 tracking-tight">
          Evolution
        </h2>
        <p className="text-cream-500/60 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
          From interfaces to intelligent systems. A timeline of technical
          growth.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="max-w-4xl relative" ref={containerRef}>
        {/* Background Line */}
        <div className="absolute left-[15px] md:left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        {/* Active Bright Line */}
        <div
          className="absolute left-[15px] md:left-[19px] top-0 w-px bg-gradient-to-b from-accent-500 to-accent-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{
            height: `${lineHeight}px`,
            transition: "height 0.1s linear",
          }}
        >
          {/* Glowing Tip */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,1),0_0_30px_rgba(59,130,246,0.5)]" />
        </div>

        {/* Timeline Items */}
        <div className="relative z-10 space-y-8">
          {history.map((item, index) => {
            const isExpanded = expandedItems.has(index);
            const isActive =
              lineHeight > (itemRefs.current[index]?.offsetTop ?? 0);

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="relative flex gap-6 md:gap-10 group"
              >
                {/* Timeline Node - Glowing Star Dot */}
                <div className="flex flex-col items-center flex-shrink-0 w-8 md:w-10">
                  <div
                    className={`relative w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_rgba(255,255,255,0.5),0_0_40px_rgba(59,130,246,0.4)]"
                        : "bg-gray-600/50 border border-white/20"
                    }`}
                  >
                    {/* Inner glow core */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
                        <div className="absolute -inset-2 bg-white/20 rounded-full blur-md" />
                        <div className="absolute -inset-4 bg-accent-500/10 rounded-full blur-xl" />
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 pb-8 transition-all duration-500 ${isActive ? "opacity-100" : "opacity-40"}`}
                >
                  {/* Header */}
                  <div className="mb-4">
                    <span
                      className={`font-mono text-xs md:text-sm tracking-widest uppercase transition-colors duration-500 ${isActive ? "text-accent-400" : "text-gray-600"}`}
                    >
                      {item.year}
                    </span>
                    <h3
                      className={`text-xl md:text-2xl font-bold tracking-tight mt-1 transition-colors duration-500 ${isActive ? "text-cream-100" : "text-gray-500"}`}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <span className="text-cream-500/50 font-medium text-sm mt-1 block">
                        {item.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm md:text-base leading-relaxed mb-4 transition-colors duration-500 ${isActive ? "text-cream-500/60" : "text-gray-600"}`}
                  >
                    {item.description}
                  </p>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className={`flex items-center gap-2 text-xs font-medium mb-4 transition-colors duration-300 ${
                      isActive
                        ? "text-cream-500/50 hover:text-accent-400"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`grid transition-all duration-500 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      {/* Points */}
                      <ul className="mb-4 space-y-2">
                        {item.points.map((point, i) => (
                          <li
                            key={i}
                            className={`flex items-start text-sm transition-colors duration-500 ${isActive ? "text-cream-500/50" : "text-gray-700"}`}
                          >
                            <span className="mr-3 mt-1.5 w-1 h-1 rounded-full bg-accent-500 flex-shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.tech.map((t, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-mono border px-2 py-1 rounded-md transition-colors duration-500 ${
                              isActive
                                ? "text-accent-400/70 border-accent-500/20 bg-accent-500/5"
                                : "text-gray-700 border-white/5 bg-transparent"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Evolution;
