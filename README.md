<div align="center">
  <h1>Aditya Kumawat — Portfolio</h1>
  <p><b>Backend & Intelligent Systems Engineer</b></p>
  <p>
    <a href="https://kumawat-aditya.github.io/portfolio" target="_blank">Live Demo</a> ·
    <a href="#features">Features</a> ·
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## ✨ Overview

This is a modern, interactive portfolio website for Aditya Kumawat, showcasing expertise in backend engineering, trading systems, AI/data engineering, and scalable infrastructure. Built with React, TypeScript, and Vite, it features smooth animations, dark/light themes, and a clean, glassmorphic UI.

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
- **Private/Public GitHub Links:** Each project card shows a GitHub button. If the repo is private, the button is disabled and shows a tooltip.
- **Custom Cursor & Glassmorphic Cards:** Interactive UI with mouse tracking and frosted glass effects.
- **Smooth Scrolling:** Lenis-style smooth scroll for a premium feel.
- **Dark/Light Theme Toggle:** Seamless theme switching with full style overrides.
- **Animated Section Reveal:** Fade-in animations as you scroll.
- **Responsive Design:** Fully mobile-friendly and accessible.
- **Project Carousel:** Auto-advancing, draggable, and expandable project cards.
- **Detailed Timeline:** Visual evolution of skills and experience.
- **Contact & Socials:** Direct email, GitHub, LinkedIn, and resume download (resume link from JSON, works on GitHub Pages).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (custom config), glassmorphism, custom animations
- **Icons:** Lucide React
- **Deployment:** GitHub Pages (via `gh-pages`)

---

## 📁 Project Structure

```
├── App.tsx                # Main app layout and logic
├── components/            # All major UI sections (Hero, Projects, Evolution, etc.)
├── data/
│   └── content.json       # All portfolio content (bio, projects, skills, links, etc.)
├── public/
│   └── resume.pdf         # Resume file (linked from JSON)
├── index.html             # HTML template with Tailwind and custom styles
├── index.tsx              # React entry point
├── package.json           # Scripts and dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config (with base for GitHub Pages)
├── types.ts               # Shared types
├── doc/                   # Planning and content docs
```

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
