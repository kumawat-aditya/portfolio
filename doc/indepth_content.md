---

# 🔹 Navigation Panel Design

### Suggested Links

| Label                  | Target                                     |
| ---------------------- | ------------------------------------------ |
| Home                   | Scroll to hero                             |
| Projects               | Scroll to selected projects                |
| Evolution              | Scroll to timeline / engineering evolution |
| Skills                 | Scroll to capabilities section             |
| Experience             | Scroll to experience section               |
| Contact                | Scroll to contact section                  |
| LinkedIn/GitHub/Resume | External links (small icons or text)       |

---

# 🔹 SECTION 1: Hero (The Hook)

## 🎨 Layout Direction

**Left-aligned. Clean. Wide spacing.**

Desktop:

```
[ Name ]
[ Role ]
[ 2–3 line positioning statement ]

[ Primary Button ]  [ Secondary Button ]
```

Right side:
Empty space or ultra-subtle abstract gradient.
No big illustration.
No floating SVG mess.

---

# 🔹 Final Hero Content (Premium Version)

### Name (Big, Bold)

**Aditya Kumawat**

---

### Role (Medium Weight, Muted)

Backend & Intelligent Systems Engineer

---

### Positioning Statement (Tight, Architectural)

I design trading infrastructure, real-time automation systems, and data-driven backend architectures that integrate machine learning with execution reliability.

---

### Action Buttons

[ View Projects ]  ← Primary (solid accent color)

[ GitHub ]  ← Outline style
[ Resume ]  ← Text or subtle button

---

# 🧩 Optional Micro-Detail (Very Subtle)

Under your name, extremely subtle:

Jaipur, India
Open to Remote Opportunities

Small. Light gray. Professional.

---

# 🔹 SECTION 2: Projects

These represent systems designed for scale, performance, or architectural depth.

---

## 1️⃣ Real-Time Trading Signal Distribution Infrastructure

**Java • Spring Boot • WebSocket • MQL5 • Telegram Bot API**

A production-grade distributed trading execution system built for automated signal broadcasting and account-level execution.

### System Architecture

* High-performance Java server parsing multi-target trading signals from Telegram groups
* Per-user distribution logic with:

  * Signal deduplication
  * MetaTrader ID verification
  * Controlled broadcast routing
* Execution layer using MetaTrader EA:

  * Automated order placement
  * Trailing stop-loss
  * Risk management enforcement
* Structured signal formatting for Telegram channels

### Infrastructure Engineering

* Admin-only Telegram bot for:

  * Client provisioning
  * Access control
  * Backup management
* Persistent state storage
* Self-healing recovery after server restarts

**Positioning:**
Transition from trading bots to distributed trading infrastructure.

---

## 2️⃣ QubiForge – Multi-Layer Trading Strategy Data Pipeline

**Python • Pandas • NumPy • Numba • XGBoost • Parallel Processing**

A configurable AI data generation and strategy mining pipeline designed for large-scale trading research.

### Layered Data Architecture

* **Bronze Layer:**
  SL/TP grid simulation generating millions of trade outcome combinations

* **Silver Layer:**
  200+ technical indicators + advanced support/resistance modeling

* **Gold Layer:**
  Rolling-window feature normalization
  Cross-normalization of static indicators using price-relative scaling

* **Platinum Layer:**
  Decision Tree rule mining → later XGBoost model experimentation

* **Diamond Layer:**
  Strategy evaluation engine (Profit Factor, Max Drawdown, cost modeling)

### Performance Engineering

* Optimized pipeline from 8–9 hours → ~10 minutes
* Parallelized processing across large datasets (~57 crore rows)
* Fully configurable via a single centralized configuration file

Designed for large-scale model training under constrained infrastructure.

---

## 3️⃣ Stella – Scalable E-Commerce Backend Architecture

**Java • Spring Boot • JWT • Razorpay • MySQL**

A multi-role backend architecture inspired by Amazon’s seller-user ecosystem.

### Core Design

* Separate authentication domains for Users and Sellers (JWT-based)
* Seller dashboard APIs:

  * Product upload
  * Media handling
  * Review management
* User-side systems:

  * Dynamic search
  * Cart management
  * Order lifecycle tracking

### Engineering Highlights

* Razorpay payment gateway integration
* Clean layered architecture with separation of concerns
* Designed for scalability and modular extension

**Focus:** Architecture-first backend design.

---

## 4️⃣ Elastic DCA Trading System (Fullstack Automation)

**MQL5 • Python • React**

A grid-based automated trading system enabling controlled position scaling and equity-based risk management.

### Capabilities

* Dollar-gap based automated entries
* Dynamic lot management
* Target systems:

  * Equity target
  * Balance target
  * Fixed dollar exit
* Hedge-loss recovery logic
* Start-limit entry system
* Real-time UI for monitoring P&L and trade states

Bridged backend automation with interactive trading control.

---

## 5️⃣ Rubik’s Cube 3x3x3 Solver (Multi-Threaded Engine)

**C++ • OOP • Multithreading • Algorithm Optimization**

A CFOP-based high-performance cube-solving engine built with a fully modular C++ architecture.

### Technical Depth

* Custom 3D cube representation engine
* CFOP algorithm implementation (Cross, F2L, OLL, PLL)
* Multi-threaded optimization search
* CLI visualization with color-coded output
* Polymorphism-driven modular architecture

Solves within ~2 seconds on legacy hardware.

---

# 🎨 How This Section Should Look (UI Direction)

Now the important part — presentation.

### Layout Option (Recommended):

Structure:

Project Title
Tech stack (small muted line)
Short one-line positioning
↓
Two-column layout on desktop:

Left: System Architecture / Capabilities
Right: Engineering Highlights / Depth

On mobile → stacked cleanly.

---

### Design Rules

* Big typography for titles
* Soft shadow cards
* No bright colors
* Accent only on tech stack

---

### Interaction

* Slight elevation on hover
* “View Details” expands extra technical breakdown
* GitHub link if public

---

# 🔹 SECTION 3: Evolution

## From Interfaces to Intelligent Systems

---

## 2022 — Foundations in Structured Web Development

Began with structured frontend engineering through Jonas Schmedtmann’s course.

**Core Skills Built**

* HTML, CSS
* Grid & Flexbox layout systems
* jQuery
* Git version control

**Projects**

* Omnifood (course architecture project)
* Frontend Mentor challenges:

  * News Home Page (Jan 2023)
  * Space Tourism (Feb 2023)

Parallel to this, I was rigorously studying C++, strengthening algorithmic thinking and memory-level understanding of computation.

This phase built discipline in layout systems, clean structure, and code organization.

---

## 2023 — Algorithmic Systems & Performance Engineering

Curiosity around matrix theory and cube mechanics led to building a full 3x3x3 Rubik’s Cube Solver in C++.

**Engineering Depth**

* Designed complete 3D cube state representation
* Implemented CFOP (Cross, F2L, OLL, PLL) algorithm
* Multi-threaded optimization search
* Polymorphic modular architecture
* CLI visualization with color-coded output

Achieved ~2-second solve time on legacy hardware.

This marked the shift from interface-building to computational system design and performance optimization.

---

## Early–Mid 2024 — Backend Architecture & Authentication Design

### Worinwell Internship

* Built full CRUD-based Employee Management System
* Designed REST APIs
* Implemented JWT-based role authentication
* Separated frontend and backend layers

### Independent Architecture Work — Stella

* Designed Amazon-inspired multi-role backend
* Implemented seller dashboard APIs
* Integrated Razorpay payment gateway
* Built layered architecture with separation of concerns

Architecture-first thinking became central to my development philosophy.

---

## Late 2024 — Trading Systems & Real-Time Infrastructure

### Trade Amplification

Entered algorithmic trading and automation engineering.

**Technologies**

* MQL4 / MQL5
* Pine Script
* Forex market mechanics
* Indicator-based systems (EMA, SMA, Bollinger Bands, S/R)

**Built**

* Automated trading bots
* Real-time signal distribution infrastructure
* Telegram-driven execution systems
* Self-healing backend server with state recovery

This phase introduced:

* Latency sensitivity
* Execution reliability
* Risk automation
* Distributed signal architecture

Shifted from backend APIs → live trading infrastructure.

---

## 2025 — Applied AI & Intelligent Systems Engineering

Started with rule-based Python automation, then moved into structured AI frameworks.

### Elisa Assistant

* Rasa-based conversational AI
* Whisper.cpp voice pipeline
* Dockerized dependency isolation
* NLP processing (tokenization, POS, NER, dependency parsing)
* Structured JSON extraction from natural language
* GPU acceleration integration

Also experimented with building a custom NLP engine to deeply understand linguistic structuring and semantic extraction.

This phase strengthened understanding of how intelligent systems process language internally.

---

## 2025 — Large-Scale ML Research Infrastructure

### Qubitron Labs

Built an advanced multi-layer trading data generation pipeline.

**System Architecture**

* Bronze → Diamond layered design
* 57 crore row structured dataset
* Decision Tree rule mining
* XGBoost experimentation
* Backtest cost realism (spread, slippage, commission)

**Performance Engineering**

* Reduced runtime from 8–9 hours → ~10 minutes
* Heavy parallelization using Python
* Config-driven pipeline design

Also developed:

* Visual training dataset generator (30-candle windows with indicator overlays)
* 27GB labeled dataset (QubiForge)

Focused heavily on:

* Feature engineering
* Time-series normalization
* Strategy validation modeling

This stage deepened ML systems thinking under constrained infrastructure.

---

## 2025–2026 — Advanced Trading Strategy Engineering

Continued high-level projects with Trade Amplification.

**Elastic DCA System**

* Fullstack automation (MQL5 + Python + React)
* Dollar-gap grid logic
* Equity/balance-based targeting
* Hedge-loss recovery
* Real-time UI monitoring

**Lorentzian Classification Implementation**

* Converted TradingView Pine Script into optimized MQL5
* Implemented kernel smoothing reversal logic
* Enhanced configurability beyond original implementation

This phase merged:
Trading system design + model interpretation + execution engineering.

---

# Evolution Summary

Progression:

Frontend systems
→ Algorithmic optimization
→ Backend architecture
→ Trading infrastructure
→ AI & data-driven modeling

Current Focus:

Building intelligent backend systems that combine automation reliability with machine learning-driven decision logic.

---

# 🎨 UI Direction for Timeline Section

Now, very important — how this should look visually.

### Layout: Editorial Vertical Timeline

Left side:
A thin vertical line with subtle dots marking years.

Right side:
Content blocks with:

Year (small uppercase, muted)
Section Title (bold)
Description (tight paragraphs)

No big paragraphs.
Plenty of whitespace.
No loud colors.

---

### Animation (Subtle)

* Vertical line draws as user scrolls.
* Each year block fades in from right.
* No sliding chaos.

---

# 🔹 SECTION 4: Capabilities

## Technical Expertise

Layout: 2-column grid (desktop) / stacked (mobile)
Each block = Title + 1-line positioning statement + bullet depth.

No logos. No skill bars. No percentages.

---

## 1️⃣ Backend & Distributed Systems

**Designing scalable backend architectures and real-time infrastructure.**

* Java (Spring Boot)
* REST API design
* JWT authentication & RBAC
* WebSocket-based real-time systems
* Multi-role system architecture
* Layered backend design
* State persistence & recovery logic

This is your core identity layer.

---

## 2️⃣ Trading Systems & Automation

**Building latency-aware automated trading infrastructure.**

* MQL4 / MQL5
* Pine Script strategy translation
* MetaTrader EA development
* Signal distribution systems
* Risk management automation
* Grid & DCA execution logic
* Kernel smoothing & reversal detection logic

This differentiates you from 95% of backend engineers.

---

## 3️⃣ AI & Data Engineering

**Designing data pipelines and intelligent decision systems.**

* Python (Pandas, NumPy, Numba)
* Decision Trees & XGBoost
* Feature engineering for time-series
* Parallel data processing
* NLP (Tokenization, NER, Dependency Parsing)
* Model training workflow design
* Dataset generation pipelines
* Transformer fundamentals

Notice: We don’t claim “AI Expert.”
We show system-level AI engineering.

---

## 4️⃣ Infrastructure & Deployment

**Deploying production systems across cloud and self-managed environments.**

* AWS (EC2, deployment workflows)
* Bluehost hosting
* Docker & containerization
* Linux server management
* CI-ready Git workflows
* Backup & recovery handling

This section gives companies operational trust.

---

## 5️⃣ Performance & Systems Thinking

This is optional — but for you, it adds weight.

**Optimizing systems under real-world constraints.**

* Multithreaded C++ systems
* Execution time optimization (8h → 10min pipeline)
* Memory-aware processing
* Config-driven architecture
* Large-scale dataset handling (~57 crore rows)

Most developers never show this thinking.

---

# UI Structure Recommendation

Each capability block:

* Slight gray background on hover
* Smooth 150ms transition
* Clean border radius
* No heavy shadow

Title: Medium bold
Subtext: Muted gray
Bullets: Clean minimal spacing

---

# Ordering Strategy

Order matters psychologically.

Place them like this:

1. Backend & Distributed Systems
2. Trading Systems & Automation
3. AI & Data Engineering
4. Infrastructure & Deployment
5. Performance & Systems Thinking

This tells a story:

He builds systems
→ He handles trading complexity
→ He understands AI
→ He deploys them
→ He optimizes them

That’s senior-engineer positioning.

---

# 🎨 Experience Section — Structure & UI

## Layout Concept

Full-width clean section.
Large title:

> **Professional Experience**

Each company appears as a **distinct expandable card**.

Not timeline.
Not cramped resume blocks.
Structured engineering summary.

---

# 🧱 Card Structure (Per Company)

### Top (Always Visible)

**Company Name** (Bold, Large)
Role (Medium weight)
Duration (Right aligned or subtle under role)

Then 3 sharp bullets.

Then:

`[ View Technical Details ]` → Expands.

---

# 💼 Experience #1

## Trade Amplification

*(This should come first — it's your strongest practical experience.)*

### Visible Summary

**Trading Systems Developer**
Aug 2024 – Present

* Built automated trading systems using MQL4/MQL5
* Developed real-time signal broadcasting infrastructure
* Designed backend services using Java, Spring Boot, and Python

Then expand.

---

### Expanded Technical Details

Inside expansion, structured blocks:

#### 🔹 Trading Automation

* Designed Elastic DCA logic with dynamic recovery models
* Implemented execution control using MqlTradeRequest / MqlTradeResult
* Optimized trade management under live market latency conditions

#### 🔹 Signal Infrastructure

* Built Telegram signal distribution bots
* Designed subscription validation systems
* Implemented WebSocket-based broadcasting

#### 🔹 Backend Systems

* Built Spring Boot services for automation workflows
* Integrated MySQL-based persistence layers
* Developed project-based paid system architecture

This shows:
You were not “just coding bots”.
You were building systems.

---

# 💼 Experience #2

## Qubitron Labs

Now this one must be handled carefully and intelligently.

Do NOT say:
“They didn’t trust my work.”

Reframe it professionally.

---

### Visible Summary

**AI Research & Data Engineering Intern**
Sept 2025 – Jan 2026

* Designed data pipelines for trading AI experimentation
* Engineered large-scale feature extraction workflows
* Conducted research on model training and fine-tuning workflows

Then expand.

---

### Expanded Technical Details

Now this is where you flex.

#### 🔹 Data Engineering

* Processed ~57 crore OHLC records
* Engineered feature pipelines including:

  * TA-Lib indicators
  * Custom support/resistance detection
  * SMA / EMA (200+ variations)
* Implemented normalization using close-relative scaling
* Transformed features into percentage & basis-point representations

#### 🔹 Model Research

* Trained Decision Tree models for rule-based strategy discovery
* Migrated experiments to XGBoost for improved generalization
* Designed level-based trade probability pipeline

#### 🔹 Vision Model Fine-Tuning

* Prepared 27GB chart image dataset
* Structured labeled prediction datasets
* Researched Qwen 3VL fine-tuning process
* Designed dataset formatting for GPU-based supervised training

#### 🔹 Infrastructure Constraints

* Work paused due to limited GPU infrastructure availability

This phrasing:

* Shows scale
* Shows research maturity
* Shows constraints were infra-based
* Shows you understand ML lifecycle

Very strong signal.

---

# 💼 Experience #3

## WorinWell (Internship)

Keep this lighter.

### Visible Summary

**Java Spring Boot Intern**
May 2024 – July 2024

* Built Employee Management System
* Developed dynamic website using Spring Boot & Bootstrap
* Implemented REST APIs with database integration

Expanded:
Short backend implementation details.

---

# 🎨 UI Animation Style

* Cards fade-in on scroll.
* Expansion uses smooth height animation (300ms).
* No bouncing, no flashy transitions.

This section must feel:
Professional.
Controlled.
Structured.

---

# 🎨 Contact Section — Structure & UI

## Goal

* Low friction communication
* Reinforce your positioning (Backend + Trading + AI)
* End on ambition, not availability

---

# 🧱 Layout Style

Centered.
Lots of whitespace.
No heavy background graphics.
Maybe very subtle gradient or noise texture.

Large heading.

Short statement.

Primary contact action.

Minimal social row.

That’s it.

---

# ✨ Section Title

Instead of just:

“Contact”

Use something stronger:

* **Let’s Build Intelligent Systems**
* **Let’s Work on Something Meaningful**
* **Open to Engineering Conversations**

I recommend:

> **Let’s Build Intelligent Systems**

It aligns with your direction.

---

# 📝 Core Copy (Short + Powerful)

You do NOT want long paragraphs here.

Something like:

> I’m currently focused on backend architecture, trading automation, and intelligent system design.
>
> If you’re building scalable systems, trading infrastructure, or AI-driven platforms — let’s talk.

Short. Directional. Clear.

---

# 🎯 Primary Action

Your email should be the hero.

Large button or bold clickable text:

📩 [kumawataditya105@gmail.com](mailto:kumawataditya105@gmail.com)

Design style options:
Solid accent background button.

Example:

On hover → underline slides in from left.

Very subtle. Premium.

---

# 🔗 Secondary Row

Minimal icon row:

* GitHub
* LinkedIn
* Resume (PDF)
* Portfolio (if separate domain)

Keep them small.
Monochrome icons.
On hover → accent color.

No bouncing. No spinning.

---

# 🧠 Optional Add-On (High-End Touch)

Under email, small muted text:

> Based in Jaipur, India. Open to remote opportunities.

This makes you globally reachable.

---

# 🎬 Animation Style

Very minimal.

* Section fades in softly.
* Email button slightly elevates on hover.
* Maybe subtle glow on accent color.
* No typing animations.
* No moving particles.

This section should feel calm and confident.

---

# 🔹 Footer — Why & How

### Purpose

1. **Redundant access to contact info**
2. **External links (LinkedIn, GitHub, Resume, Email)**
3. **Legal or small personal note** (optional)
4. **Visual “grounding”** — balances whitespace and layout

---

### Suggested Content

**Minimalist Example:**

```
© 2026 Aditya Kumawat | 
Email: kumawataditya105@gmail.com | 
LinkedIn | GitHub | Resume
```

---

### Styling & Vibe

* Background: Slightly darker than main page or fully black
* Height: ~60–80px
* No heavy graphics, icons only if very subtle
* Clean typography, same as rest of site

---

### Animation (Optional)

* Fade in on scroll
* Slight underline slide on hover over links
* No popups or sticky behavior — keep it grounded

---
