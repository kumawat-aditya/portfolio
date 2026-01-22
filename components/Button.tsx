import React from "react";
import { ButtonProps } from "../types";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-500/50 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide rounded-lg";

  const variants = {
    // Primary: Cream/White with blue accent on hover
    primary:
      "bg-cream-100 text-black hover:bg-white hover:shadow-[0_0_20px_rgba(59,130,239,0.3)] border border-cream-200",

    // Outline: Purple border, cream text
    outline:
      "border border-accent-500/50 text-cream-200 bg-transparent hover:border-accent-400 hover:text-cream-100 hover:bg-accent-500/10",

    // Ghost: Simple text link
    ghost:
      "text-cream-500 hover:text-accent-400 bg-transparent px-0 justify-start group",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
