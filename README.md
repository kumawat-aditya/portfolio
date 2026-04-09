# Aditya Kumawat — Systems Engineer Portfolio

A proof-driven engineering portfolio showcasing real-time trading systems, ML pipelines, and backend infrastructure built for production pressure.

**Not a template. Not a blog theme.** Every system featured here ran in production or solved a real engineering problem — with documented architecture, constraints, tradeoffs, and incident reports.

**[→ Live Site](https://kumawat-aditya.github.io/portfolio/)**

---

## What Makes This Different

- **Real systems, not demos** — Each project includes actual production logs, architecture diagrams, and failure post-mortems
- **Proof-driven design** — Metrics, incident timelines, and constraint tables replace vague feature lists
- **Engineering depth** — Full case studies with "Why This Architecture", "What Broke", and "What I'd Rebuild" sections
- **Lab notes** — Honest field accounts of what breaks in production, not polished tutorials

---

## Tech Stack

| Layer         | Technology                |
| ------------- | ------------------------- |
| Framework     | React 19                  |
| Build Tool    | Vite 6                    |
| Styling       | TailwindCSS 4             |
| Animation     | Framer Motion             |
| Smooth Scroll | Lenis                     |
| Icons         | Lucide React              |
| Routing       | React Router v7           |
| Hosting       | GitHub Pages              |
| CI/CD         | GitHub Actions (optional) |

---

## Features

- **7 full system case studies** with architecture, engineering decisions, challenges, and proof capsules
- **Lab section** with field notes from building production systems
- **Interactive terminal** simulating live trading system logs
- **Responsive design** optimized for mobile through 4K displays
- **Code-split routes** for fast initial page load
- **Full SEO stack** — structured data (JSON-LD), Open Graph, Twitter Cards, sitemap
- **Smooth animations** with reduced-motion support
- **Custom cursor** (desktop) with hover interactions

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev
```

Open [http://localhost:3000/portfolio/](http://localhost:3000/portfolio/)

---

## Build & Deploy

```bash
# Type-check + production build
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages (builds first via predeploy)
npm run deploy
```

---

## Project Structure

```
├── public/
│   ├── projects/          # Project assets (images, videos, diagrams)
│   ├── sitemap.xml
│   ├── robots.txt
│   └── 404.html           # SPA redirect for GitHub Pages
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SEO.tsx         # Per-page meta tag management
│   │   ├── SystemTerminal.tsx
│   │   ├── ProofBand.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── PageTransition.tsx
│   │   ├── MediaLightbox.tsx
│   │   ├── ImageLightbox.tsx
│   │   └── VideoPlayer.tsx
│   ├── pages/
│   │   ├── Home.tsx        # Hero + flagship + lab teaser
│   │   ├── Systems.tsx     # All systems overview
│   │   ├── SystemDetail.tsx # Full case study with sidebar nav
│   │   ├── Lab.tsx         # Field notes listing
│   │   ├── LabPost.tsx     # Individual lab article
│   │   ├── About.tsx       # Timeline + engineering patterns
│   │   └── Contact.tsx     # Contact form (mailto-based)
│   ├── data/
│   │   ├── projects.ts     # System case study data
│   │   └── lab.ts          # Lab post content
│   ├── hooks/
│   │   └── useScrollDirection.ts
│   └── styles/
│       └── main.css        # Design system + responsive overrides
├── index.html              # Entry point with SEO + structured data
├── vite.config.ts
└── package.json
```

---

## Performance

| Metric                  | Target                               |
| ----------------------- | ------------------------------------ |
| Initial JS (main chunk) | ~263 KB (83 KB gzip)                 |
| Vendor chunks           | Split: react, framer-motion, ui      |
| Route splitting         | All non-home routes lazy-loaded      |
| Font loading            | `display: swap`, optimized weights   |
| Images                  | Lazy loaded, meaningful alt text     |
| Videos                  | `preload="metadata"`, muted autoplay |
| CSS                     | Tailwind purge, ~57 KB               |

---

## SEO Implementation

- Per-page `<title>` and `<meta description>` via lightweight SEO component
- Open Graph tags for link previews (LinkedIn, Slack, Discord)
- Twitter Card (summary_large_image) for Twitter/X shares
- JSON-LD structured data: Person, WebSite, SoftwareApplication schemas
- `sitemap.xml` with all routes and priority weighting
- `robots.txt` allowing full crawl access
- Semantic HTML with proper heading hierarchy
- Clean URL structure: `/systems/ant-meta-bots`, `/lab/json-state-corruption-incident`

---

## Future Improvements

- [ ] Pre-render routes for full SSR SEO (e.g., via vite-plugin-ssr or Astro migration)
- [ ] WebP/AVIF image conversion pipeline for further asset optimization
- [ ] RSS feed for Lab posts
- [ ] Analytics integration (privacy-respecting, e.g., Plausible)
- [ ] Performance monitoring (Web Vitals reporting)
- [ ] Dark/light theme toggle (current: dark only)

---

## License

This project is personal portfolio work. The code structure and design system may be referenced, but project content and data are proprietary.

---

Built by [Aditya Kumawat](https://github.com/kumawat-aditya) with React & Tailwind.
