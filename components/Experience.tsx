import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Briefcase, Calendar } from "lucide-react";
import content from "../data/content.json";

interface DetailSection {
  title: string;
  items: string[];
}

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  summary: string[];
  details: DetailSection[];
}

const experiences: ExperienceItem[] = content.experience;
const sectionContent = content.sections.experience;

const Experience: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section
      id="experience"
      className="min-h-screen px-6 sm:px-12 lg:px-24 2xl:px-32 3xl:px-40 max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto pt-32 pb-24 border-t border-white/5"
    >
      {/* Section Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(59,130,239,0.5)]"></div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-400">
            {sectionContent.label}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream-100 mb-6 tracking-tight">
          {sectionContent.title}
        </h2>
        <p className="text-cream-500/60 font-light text-lg md:text-xl max-w-2xl 3xl:max-w-3xl leading-relaxed">
          {sectionContent.description}
        </p>
      </div>

      {/* Experience Cards */}
      <div className="space-y-6">
        {experiences.map((exp, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="group glass-card bg-white/5 backdrop-blur-md backdrop-saturate-150 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.08)] relative overflow-hidden"
              style={{
                transition:
                  "box-shadow 0.5s ease, border-color 0.3s ease, background 0.5s ease",
              }}
            >
              {/* Glow Effect - White consistent with other cards */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-cream-100 tracking-tight mb-2">
                    {exp.company}
                  </h3>
                  <div className="flex items-center gap-3 text-accent-400 font-medium">
                    <Briefcase className="w-4 h-4" />
                    <span>{exp.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-cream-500/50 font-mono text-xs uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.duration}
                </div>
              </div>

              {/* Summary */}
              <ul className="space-y-3 mb-6 relative z-10">
                {exp.summary.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-cream-500/60 text-base leading-relaxed"
                  >
                    <span className="mr-4 mt-2 w-1.5 h-1.5 rounded-full bg-accent-500/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Expand Button */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex items-center gap-2 text-sm font-medium text-cream-500/40 hover:text-accent-400 transition-colors group/btn tracking-wide relative z-10"
              >
                <span>
                  {isExpanded ? "Hide Details" : "View Technical Details"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expandable Content */}
              <div
                className={`grid transition-all duration-500 ease-out relative z-10 ${
                  isExpanded
                    ? "grid-rows-[1fr] mt-6 opacity-100"
                    : "grid-rows-[0fr] mt-0 opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exp.details.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-bold text-accent-400/80 uppercase tracking-widest mb-4 pb-2 border-b border-accent-500/20">
                          {section.title}
                        </h4>
                        <ul className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="text-sm text-cream-500/50 leading-relaxed flex items-start"
                            >
                              <span className="text-accent-500 mr-3 mt-1 text-[8px]">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Experience;
