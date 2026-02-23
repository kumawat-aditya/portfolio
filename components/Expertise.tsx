import React, { useState } from "react";
import {
  Server,
  Activity,
  Brain,
  Cloud,
  Zap,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import content from "../data/content.json";

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Server,
  Activity,
  Brain,
  Cloud,
  Zap,
};

interface SkillBlockProps {
  icon: React.ReactNode;
  title: string;
  statement: string;
  skills: string[];
  fullWidth?: boolean;
}

const SkillBlock: React.FC<SkillBlockProps> = ({
  icon,
  title,
  statement,
  skills,
  fullWidth = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMore = skills.length > 4;

  return (
    <div
      className={`glass-card group relative rounded-2xl p-6 md:p-8 hover:border-white/20 overflow-hidden ${fullWidth ? "md:col-span-2" : ""}`}
      style={{
        transition:
          "box-shadow 0.5s ease, border-color 0.3s ease, background 0.5s ease",
      }}
    >
      {/* Glow Effect - White */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon & Title Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-cream-100 tracking-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Positioning Statement */}
      <div className="mb-6 relative z-10">
        <p className="font-mono text-[11px] md:text-xs text-accent-400/80 uppercase tracking-wider leading-relaxed border-l-2 border-accent-500/30 pl-4 py-1">
          {statement}
        </p>
      </div>

      {/* Skills Grid - Smooth Expand */}
      <div
        className={`grid ${fullWidth ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"} gap-y-3 gap-x-6 relative z-10 transition-all duration-500 ease-out`}
      >
        {(isExpanded ? skills : skills.slice(0, 4)).map((skill, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-cream-500/50 group-hover:text-cream-500/70 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500/50 group-hover:bg-accent-400 transition-colors duration-300 flex-shrink-0" />
            <span className="text-sm font-light tracking-wide">{skill}</span>
          </div>
        ))}
      </div>

      {/* Expand Button */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 mt-4 text-xs font-medium text-cream-500/40 hover:text-accent-400 transition-colors duration-300 relative z-10"
        >
          <span>{isExpanded ? "Show Less" : `+${skills.length - 4} more`}</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
};

const sectionContent = content.sections.expertise;
const expertiseData = content.expertise;

const Expertise: React.FC = () => {
  return (
    <section
      id="expertise"
      className="min-h-screen px-6 sm:px-12 lg:px-24 2xl:px-32 3xl:px-40 max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto pt-32 pb-24 border-t border-white/5"
    >
      {/* Section Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expertiseData.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <SkillBlock
              key={index}
              icon={
                IconComponent ? <IconComponent className="w-5 h-5" /> : null
              }
              title={item.title}
              statement={item.statement}
              skills={item.skills}
              fullWidth={item.fullWidth}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Expertise;
