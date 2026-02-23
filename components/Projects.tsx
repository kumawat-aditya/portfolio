import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Github, ExternalLink, ChevronDown, X, Lock } from "lucide-react";
import content from "../data/content.json";

interface Project {
  title: string;
  stack: string[];
  description: string;
  github: string;
  highlights: string[];
  details?: {
    architecture?: string[];
    engineering?: string[];
  };
}

const Projects: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedTech, setExpandedTech] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  // Remove popup state

  // Load projects from JSON
  const projects: Project[] = content.projects;
  const sectionContent = content.sections.projects;

  // Detect mobile viewport (debounced)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    // Set initial value immediately
    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleGithubClick = (github: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (github && github !== "private") {
      window.open(github, "_blank", "noopener,noreferrer");
    }
  };

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

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (isPaused || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isDragging, projects.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      } else {
        setCurrentIndex(
          (prev) => (prev - 1 + projects.length) % projects.length,
        );
      }
      setIsDragging(false);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 5000);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  // Touch handlers for mobile swipe (refs — no re-renders)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      } else {
        // Swipe right - previous
        setCurrentIndex(
          (prev) => (prev - 1 + projects.length) % projects.length,
        );
      }
    }
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Calculate card position and styles
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff =
      ((diff + projects.length + Math.floor(projects.length / 2)) %
        projects.length) -
      Math.floor(projects.length / 2);

    const isCenter = normalizedDiff === 0;
    const isAdjacent = Math.abs(normalizedDiff) === 1;

    // Use percentage-based translate for responsive side cards
    const translateAmount = normalizedDiff * 380; // Fixed pixel offset for side cards

    return {
      transform: `translateX(${translateAmount}px) scale(${isCenter ? 1 : 0.85})`,
      opacity: isCenter ? 1 : isAdjacent ? 0.45 : 0,
      zIndex: isCenter ? 30 : isAdjacent ? 20 : 10,
      pointerEvents: isCenter ? ("auto" as const) : ("none" as const),
      transition: "transform 0.5s ease-out",
    };
  };

  return (
    <>
      <section
        id="projects"
        className="min-h-screen pt-32 pb-24 border-t border-white/5 overflow-visible"
      >
        {/* Section Header */}
        <div className="px-6 sm:px-12 lg:px-24 2xl:px-32 max-w-[1400px] 2xl:max-w-[1600px] mx-auto mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-400">
              {sectionContent.label}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream-100 mb-6 tracking-tight">
            {sectionContent.title}
          </h2>
          <p className="text-cream-500/60 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
            {sectionContent.description}
          </p>
        </div>

        {/* Carousel Container - Full Width */}
        <div className="w-full overflow-visible">
          <div
            ref={carouselRef}
            className="relative cursor-grab active:cursor-grabbing select-none max-w-[1400px] 2xl:max-w-[1600px] mx-auto"
            style={{ height: "560px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsPaused(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
              {projects.map((project, index) => {
                const isTechExpanded = expandedTech.has(index);
                const displayStack = isTechExpanded
                  ? project.stack
                  : project.stack.slice(0, 3);
                const hasMoreTech = project.stack.length > 3;
                const isCenter = index === currentIndex;
                const cardStyle = getCardStyle(index);

                return (
                  <div
                    key={index}
                    className="absolute w-[320px] md:w-[400px] lg:w-[480px]"
                    style={{
                      ...cardStyle,
                      willChange: isCenter ? "transform" : "auto",
                    }}
                  >
                    <div
                      className="group relative rounded-2xl p-6 md:p-8 overflow-hidden h-[480px] flex flex-col bg-white/5 backdrop-blur-md backdrop-saturate-150 border border-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]"
                      style={{
                        transition:
                          "box-shadow 0.5s ease, border-color 0.3s ease, background 0.5s ease",
                      }}
                    >
                      {/* Glow Effect - Hidden on mobile */}
                      {!isMobile && (
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      )}

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                        {displayStack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-medium text-accent-400 bg-accent-500/10 rounded-md border border-accent-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {hasMoreTech && isCenter && (
                          <button
                            onClick={(e) => toggleTechExpand(index, e)}
                            className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-medium text-cream-500/40 bg-white/5 rounded-md border border-white/10 hover:border-accent-500/30 hover:text-accent-400 transition-all duration-300 flex items-center gap-1"
                          >
                            {isTechExpanded
                              ? "Less"
                              : `+${project.stack.length - 3}`}
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-300 ${isTechExpanded ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-cream-100 mb-4 tracking-tight leading-tight relative z-10">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-cream-500/50 text-sm leading-relaxed mb-5 relative z-10 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2 mb-6 relative z-10 flex-1 overflow-hidden">
                        {project.highlights.slice(0, 3).map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-sm text-cream-500/40 group-hover:text-cream-500/60 transition-colors duration-300"
                          >
                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500/50 group-hover:bg-accent-400 transition-colors duration-300 flex-shrink-0" />
                            <span className="leading-relaxed line-clamp-2">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-white/5 relative z-10 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          className="flex items-center gap-2 text-sm font-medium text-cream-500/50 hover:text-accent-400 transition-colors duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={(e) => handleGithubClick(project.github, e)}
                          className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                            project.github === "private"
                              ? "text-cream-500/30 cursor-not-allowed"
                              : "text-cream-500/50 hover:text-accent-400"
                          }`}
                          disabled={project.github === "private"}
                          title={
                            project.github === "private"
                              ? "This project's source code is private."
                              : "View on GitHub"
                          }
                        >
                          {project.github === "private" ? (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Private</span>
                            </>
                          ) : (
                            <>
                              <Github className="w-4 h-4" />
                              <span>Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* No popup for private projects. Tooltip on button instead. */}

        {/* Dot Indicators Only */}
        <div className="flex justify-center gap-2 mt-4 px-6 sm:px-12 lg:px-24 2xl:px-32 max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-accent-500 w-8"
                  : "bg-white/20 hover:bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Project Details Modal - Fixed to viewport center using Portal */}
      {selectedProject &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div
              className="glass-card group relative w-[90vw] max-w-3xl max-h-[80vh] rounded-2xl p-6 md:p-8 border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect - Hidden on mobile */}
              {!isMobile && (
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream-500/60 hover:text-cream-100 transition-colors duration-300 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content - scrollable */}
              <div className="relative z-10 overflow-y-auto max-h-[70vh] pr-2">
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedProject.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-medium text-accent-400 bg-accent-500/10 rounded-md border border-accent-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-cream-100 mb-4 tracking-tight leading-tight">
                  {selectedProject.title}
                </h3>

                {/* Description */}
                <p className="text-cream-500/50 text-sm leading-relaxed mb-6">
                  {selectedProject.description}
                </p>

                {/* Details Grid */}
                {selectedProject.details && (
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {selectedProject.details.architecture && (
                      <div>
                        <h4 className="text-[10px] font-bold text-accent-400/80 uppercase tracking-widest mb-3 pb-2 border-b border-accent-500/20">
                          System Architecture
                        </h4>
                        <ul className="space-y-2">
                          {selectedProject.details.architecture.map(
                            (item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-cream-500/40 group-hover:text-cream-500/60 transition-colors duration-300"
                              >
                                <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500/50 group-hover:bg-accent-400 transition-colors duration-300 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                    {selectedProject.details.engineering && (
                      <div>
                        <h4 className="text-[10px] font-bold text-accent-400/80 uppercase tracking-widest mb-3 pb-2 border-b border-accent-500/20">
                          Engineering Highlights
                        </h4>
                        <ul className="space-y-2">
                          {selectedProject.details.engineering.map(
                            (item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-cream-500/40 group-hover:text-cream-500/60 transition-colors duration-300"
                              >
                                <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500/50 group-hover:bg-accent-400 transition-colors duration-300 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button
                    onClick={(e) =>
                      handleGithubClick(selectedProject.github, e)
                    }
                    className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                      selectedProject.github === "private"
                        ? "text-cream-500/30 cursor-not-allowed"
                        : "text-cream-500/50 hover:text-accent-400"
                    }`}
                    disabled={selectedProject.github === "private"}
                    title={
                      selectedProject.github === "private"
                        ? "This project's source code is private."
                        : "View on GitHub"
                    }
                  >
                    {selectedProject.github === "private" ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Private</span>
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-2 text-sm font-medium text-cream-500/50 hover:text-accent-400 transition-colors duration-300"
                  >
                    <X className="w-4 h-4" />
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Projects;
