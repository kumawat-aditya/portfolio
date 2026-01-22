import React, { useEffect, useState } from "react";
import { ArrowRight, Github, MapPin } from "lucide-react";
import Button from "./Button";

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getTransitionClass = (delay: string) => {
    return `transition-all duration-1000 ease-out transform ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    } ${delay}`;
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-[1400px] mx-auto pt-20"
    >
      <div className="max-w-5xl w-full">
        {/* Name */}
        <h1
          className={`${getTransitionClass("delay-100")} text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-cream-100 mb-8`}
        >
          Aditya Kumawat
        </h1>

        {/* Role & Meta */}
        <div
          className={`${getTransitionClass("delay-200")} flex flex-wrap items-center gap-y-3 gap-x-6 text-cream-500/70 mb-10 text-base sm:text-lg font-medium`}
        >
          <span className="text-cream-200">
            Backend & Intelligent Systems Engineer
          </span>

          <span className="hidden sm:block w-1.5 h-1.5 bg-accent-500/50 rounded-full"></span>

          <div className="flex items-center gap-2 text-cream-500/50">
            <MapPin className="w-4 h-4" />
            <span>Jaipur, India</span>
          </div>
        </div>

        {/* Positioning Statement */}
        <p
          className={`${getTransitionClass("delay-300")} text-xl sm:text-2xl lg:text-3xl text-cream-500/50 leading-relaxed max-w-4xl font-normal mb-14 tracking-tight`}
        >
          I design{" "}
          <span className="text-cream-100">trading infrastructure</span>,
          real-time automation systems, and data-driven backend architectures
          that integrate
          <span className="text-cream-100"> machine learning</span> with
          execution reliability.
        </p>

        {/* Action Buttons */}
        <div
          className={`${getTransitionClass("delay-500")} flex flex-col sm:flex-row items-start sm:items-center gap-5`}
        >
          <Button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Projects
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              window.open("https://github.com/yourusername", "_blank")
            }
          >
            <Github className="w-5 h-5 mr-2" />
            GitHub
          </Button>

          <div className="mt-4 sm:mt-0 sm:ml-4">
            <Button variant="ghost">
              Resume
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
