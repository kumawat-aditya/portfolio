/**
 * Theme Color Reference
 *
 * This file documents all configurable color tokens for the portfolio website.
 *
 * TO CUSTOMIZE THE WEBSITE THEME:
 *   Edit the CSS custom properties in  styles/theme.css
 *   That file controls: backgrounds, glass card, cursor, gradients, selection colors.
 *
 *   The Tailwind utility colors (cream, accent, gray) are defined in
 *   the @theme block inside  styles/main.css
 *
 * This TypeScript file exports the color values for programmatic use
 * (e.g., if a component needs to read a theme color in JavaScript).
 */

export const darkTheme = {
  /** Page background */
  bg: "#0a1120",

  /** Text colors */
  text: {
    primary: "#F5E6D3", // cream-500 — body text
    heading: "#FFF9E6", // cream-100 — headings
    muted: "#475569", // cream-500/60 equivalent
    subtle: "#64748b", // cream-500/40 equivalent
  },

  /** Accent palette (blue) */
  accent: {
    light: "#60A5FA", // accent-400 — hover states
    primary: "#3B82F6", // accent-500 — primary accent
    dark: "#2563EB", // accent-600 — deep accent
  },

  /** Cream palette (used by Tailwind utilities) */
  cream: {
    50: "#FFFDF5",
    100: "#FFF9E6",
    200: "#FFF3CC",
    300: "#FFEDB3",
    400: "#FFE799",
    500: "#F5E6D3",
  },

  /** Glass card */
  card: {
    bg: "rgba(10, 10, 10, 0.6)",
    blur: "16px",
    saturate: "150%",
    borderHover: "rgba(255, 255, 255, 0.15)",
    glowColor: "rgba(59, 130, 246, 0.12)",
  },

  /** Background gradients */
  gradients: {
    blob1: "rgba(59, 130, 246, 0.22)",
    blob2: "rgba(99, 102, 241, 0.16)",
    blob3: "rgba(139, 92, 246, 0.13)",
    blob4: "rgba(59, 130, 246, 0.10)",
  },

  /** Cursor */
  cursor: {
    lineColor: "rgba(147, 197, 253, 0.9)",
    dotBg: "rgba(96, 165, 250, 1)",
    hoverAccent1: "#00F5FF",
    hoverAccent2: "rgba(59, 130, 246, 1)",
  },
};

export const lightTheme = {
  /** Page background */
  bg: "#f9fafb",

  /** Text colors */
  text: {
    primary: "#0f172a",
    heading: "#0f172a",
    muted: "#475569",
    subtle: "#64748b",
  },

  /** Accent palette (deeper blue in light) */
  accent: {
    light: "#2563eb",
    primary: "#1d4ed8",
    dark: "#1e40af",
  },

  /** Glass card (dark frosted glass on light bg) */
  card: {
    bg: "rgba(30, 41, 59, 0.12)",
    blur: "16px",
    saturate: "150%",
    borderHover: "rgba(59, 130, 246, 0.4)",
    glowColor: "rgba(59, 130, 246, 0.12)",
  },

  /** Background gradients (softer) */
  gradients: {
    blob1: "rgba(59, 130, 246, 0.05)",
    blob2: "rgba(99, 102, 241, 0.04)",
    blob3: "rgba(139, 92, 246, 0.03)",
    blob4: "transparent",
  },

  /** Cursor (dark on light bg) */
  cursor: {
    lineColor: "rgba(15, 23, 42, 0.8)",
    dotBg: "rgba(15, 23, 42, 0.9)",
    hoverAccent1: "rgba(37, 99, 235, 1)",
    hoverAccent2: "rgba(37, 99, 235, 1)",
  },
};
