<div align="center">
  <h1>Aditya Kumawat — Portfolio</h1>
  <p><b>Backend & Intelligent Systems Engineer</b></p>
  <p>
    <a href="https://kumawat-aditya.github.io/portfolio" target="_blank">Live Demo</a> ·
    <a href="#features">Features</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#theming">Theming</a>
  </p>
</div>

---

## ✨ Overview

A modern, interactive portfolio website for Aditya Kumawat, showcasing expertise in backend engineering, trading systems, AI/data engineering, and scalable infrastructure. Built with React 19, TypeScript, Vite, and Tailwind CSS v4 (build-time), featuring smooth Lenis scrolling, dark/light themes, glassmorphic UI, and full 2K resolution support.

---

## 🏗️ Structure & Sections

- **Data-Driven Content:** All site content (bio, projects, skills, experience, links, etc.) is managed via `/data/content.json` for easy updates and localization.
- **Hero:** Name, role, location, and positioning statement (from JSON).
- **Projects:** Carousel of major projects, each with GitHub links (public or private), tech stack, highlights, and architecture details. Private repos show a disabled button with tooltip.
- **Evolution:** Timeline of technical growth, skills, and milestones (from JSON).
- **Expertise:** Capabilities across backend, trading, AI/data, infrastructure, and performance (from JSON).
- **Experience:** Career history with technical details for each role/internship (from JSON).
- **Contact:** Email, social links, and location (from JSON).
- **Footer:** Copyright, quick links, and tech credits.

---

## 🚀 Features

- **JSON-Driven Content:** All portfolio data is loaded from `/data/content.json` for simple content management.
- **Configurable Theme System:** All colors, gradients, glass effects, and cursor styles are driven by CSS custom properties in `styles/theme.css`. Switch between dark and light themes or create entirely new color schemes by editing one file.
- **Private/Public GitHub Links:** Each project card shows a GitHub button. If the repo is private, the button is disabled and shows a tooltip.
- **Custom Cursor & Glassmorphic Cards:** Interactive UI with DOM-ref-based mouse tracking (zero React re-renders) and frosted glass effects.
- **Smooth Scrolling:** Lenis smooth scroll library with proper rAF lifecycle management.
- **Dark/Light Theme Toggle:** Seamless theme switching with full style overrides via CSS custom properties.
- **Animated Section Reveal:** IntersectionObserver-based fade-in animations.
- **Responsive Design:** Fully mobile-friendly, with dedicated breakpoints for mobile, tablet, desktop, 1440p, and 2K (2560px) displays.
- **2K Resolution Support:** All containers scale to `max-w-[2000px]` at the `3xl` (1920px+) breakpoint, with wider card/content layouts.
- **Project Carousel:** Auto-advancing, draggable, touch-friendly, and expandable project cards with responsive sizing.
- **Performance Optimized:** All components memoized, scroll handlers rAF-throttled, backdrop-filter values tuned, and CSS transitions target specific properties only.
- **Contact & Socials:** Direct email, GitHub, LinkedIn, and resume download (resume link from JSON, works on GitHub Pages).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling:** Tailwind CSS v4 (build-time via `@tailwindcss/vite`), CSS custom properties for theming
- **Smooth Scroll:** Lenis
- **Icons:** Lucide React
- **Deployment:** GitHub Pages (via `gh-pages`)

---

## 📁 Project Structure

```
├── App.tsx                # Main app layout, cursor, Lenis scroll, theme toggle
├── index.tsx              # React entry point (imports styles/main.css)
├── index.html             # Minimal HTML skeleton (no inline CSS)
├── types.ts               # Shared TypeScript types
├── components/            # All major UI sections
│   ├── Hero.tsx           # Landing section
│   ├── Projects.tsx       # Carousel + project modal
│   ├── Evolution.tsx      # Growth timeline
│   ├── Expertise.tsx      # Skills grid
│   ├── Experience.tsx     # Career history
│   ├── Contact.tsx        # Contact CTA
│   ├── Footer.tsx         # Footer
│   ├── Navbar.tsx         # Navigation bar
│   └── Button.tsx         # Reusable button component
├── styles/
│   ├── main.css           # Master CSS: Tailwind imports, @theme tokens, all custom styles
│   └── theme.css          # Configurable color theme (CSS custom properties)
├── theme/
│   └── colors.ts          # TypeScript reference for all color tokens
├── data/
│   └── content.json       # All portfolio content (bio, projects, skills, links)
├── public/
│   └── resume.pdf         # Resume file
├── doc/                   # Planning, content, and performance analysis docs
├── package.json           # Scripts and dependencies
├── tsconfig.json          # TypeScript config
└── vite.config.ts         # Vite config (Tailwind + React plugins, GitHub Pages base)
```

---

## 🎨 Theming

The entire color scheme is configurable via **`styles/theme.css`**. This file contains CSS custom properties for both dark and light themes.

### How It Works

1. **`styles/theme.css`** — Edit this file to change any color. Variables include:
   - Background & gradients (`--bg-primary`, `--gradient-blob-*`)
   - Glass card appearance (`--card-bg`, `--card-blur`, `--card-shadow`, etc.)
   - Custom cursor colors (`--cursor-line-color`, `--cursor-dot-bg`, etc.)
   - Selection styling (`--selection-bg`, `--selection-text`)
   - Glow effects (`--glow-1`, `--glow-2`, `--glow-3`)

2. **`styles/main.css`** — Contains the `@theme` block that defines Tailwind color tokens (cream, accent, gray) and all custom styles. Imports both Tailwind and `theme.css`.

3. **`theme/colors.ts`** — TypeScript reference documenting all tokens for programmatic use.

### Creating a Custom Theme

Edit `styles/theme.css` and modify the CSS custom properties in the `:root, html.dark {}` block (dark theme) or `html.light {}` block (light theme). No other file changes needed.

### Responsive Breakpoints

| Breakpoint | Width  | Usage             |
| ---------- | ------ | ----------------- |
| `sm:`      | 640px  | Mobile landscape  |
| `md:`      | 768px  | Tablet            |
| `lg:`      | 1024px | Desktop           |
| `2xl:`     | 1536px | Large monitors    |
| `3xl:`     | 1920px | 2K / QHD displays |

---

## 🧑‍💻 Getting Started

**Prerequisites:** Node.js (v18+ recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run locally:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

**Content Management:**

- Edit all portfolio content in `/data/content.json` (bio, projects, skills, experience, links, resume, etc.).
- For private GitHub projects, set `"github": { "url": "", "private": true }` in the JSON.
- Resume link should be just the filename (e.g., `"resume": "resume.pdf"`).

---

## 📬 Contact

- **Email:** kumawataditya105@gmail.com
- **GitHub:** [github.com/kumawat-aditya](https://github.com/kumawat-aditya)
- **LinkedIn:** [linkedin.com](https://linkedin.com)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE) (add if applicable).
