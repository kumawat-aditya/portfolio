You are performing a FINAL transformation of a systems engineering portfolio website.

This is NOT a redesign from scratch.
This is a high-precision upgrade to push the site into top 1% quality.

The website already has:
- Strong personality
- Real system depth
- Good structure (flagship / major / supporting)
- Honest tone

Your job is to:
Enhance → Visualize → Densify → Prove → Refine

WITHOUT breaking the personality.

---

🌐 Website
http://localhost:3000/portfolio/

---

📁 DATA SOURCE (CRITICAL)

All truth comes from:

/raw_data/

Structure:
- content.json → full structured raw project data
- project_{project_name}/
    - README.md
    - ARCHITECTURE.md (contains mermaid diagrams)
    - images/ (dashboard, demo, etc)
    - videos/
    - logs/

RULES:
- DO NOT invent anything
- DO NOT create fake proof
- ONLY use what exists in raw_data
- If proof not found → SKIP that proof type
- System must gracefully handle missing artifacts

---

🧠 CORE GOAL

The site should feel like:
> “This person builds real systems. I can SEE it.”

NOT:
- blog
- resume
- corporate portfolio

---

⚠️ NON-NEGOTIABLE STYLE RULES

DO NOT:
- Kill personality
- Remove human tone
- Make it corporate
- Over-polish language
- Replace strong lines with generic resume text

MAINTAIN:
- Curious tone
- Honest failure language
- Slight mystery
- System-first thinking

---

## 🔥 TASK 1: FULL CONTENT REWRITE (IMPORTANT)

Rewrite ALL website content using updated raw_data/content.json.

Goals:
- Reflect updated projects
- Add newly added project automatically
- Keep same personality style
- Reduce repetition
- Improve clarity slightly (but not simplify too much)

IMPORTANT:
- Do NOT exaggerate claims
- Do NOT highlight unverifiable metrics aggressively

Specifically:
- Reduce emphasis on "570M rows"
- If used → mention as contextual detail, not headline
- Mention real timeline:
  - initial: ~1.5 days
  - optimized: ~30 minutes
  - hardware: Ryzen 5 5600X, 16GB RAM

---

## 🎯 TASK 2: HERO REPOSITIONING (VERY IMPORTANT)

Current issue:
Too trading-focused → wrong first impression

Fix:

Hero should communicate:
"Backend / Systems Engineer"

NOT:
"Trading engineer"

Implementation:

- Primary identity:
  Backend Engineer / Systems Engineer / Software Developer

- Trading:
  Secondary signal (badge / subtle mention)

Example direction:
- Main headline → systems/backend
- Subtext → mentions real-time systems, infra, etc
- Trading → appears as one of domains, not identity

---

## 🧱 TASK 3: VISUAL PROOF SYSTEM (CRITICAL)

You must implement a reusable proof system across projects.

### Data Extraction Logic:

From each project folder:

1. DIAGRAMS:
- Extract mermaid diagrams from ARCHITECTURE.md
- Render them cleanly (styled, readable)
- Show at:
  - SystemDetail → Architecture section (top)

2. IMAGES:
- Use files like:
  dashboard.png, demo.png, bot_details.png, etc
- Display as:
  - Screenshot gallery OR inline sections

3. VIDEOS:
- Embed if available (demo clips)

4. LOGS:
- Use selectively (not too long)
- Highlight key lines only

---

### Display Pattern (IMPORTANT)

For each system:

If available, show in this order:

1. Diagram (top)
2. Screenshot / UI visual
3. Key logs (short)
4. Optional video

If missing → skip gracefully

---

## 🔴 TASK 4: FIX PROOFBAND (REBUILD FROM SCRATCH)

Current problem:
- Breaks momentum
- Contains unverified claims
- Poor spacing in 2K

You MUST:

- Remove current ProofBand logic
- Rebuild using ONLY verified data from raw_data

New approach:

- Show 2–4 REAL proof snippets
- Each must map to:
  - actual logs
  - real system behavior

Avoid:
- Fake metrics
- Overclaiming

Design:
- Tighter spacing
- No large empty gap after hero
- Immediate transition

---

## 🟠 TASK 5: ELIMINATE DEAD ZONES (2K+ FIX)

Important:
Issue exists mainly on large screens (2K / 4K)

Fix ONLY for large breakpoints.

### Fix these areas:

1. Hero bottom gap
→ Reduce vertical spacing

2. Section gaps
→ Tighten spacing between sections

3. Contact page
→ No empty bottom half

---

### CONTACT PAGE SOLUTION (IMPORTANT)

Problem:
- Not enough content for full height
- Removing height breaks footer

Fix:

Implement layout:

- Page wrapper = flex column
- min-h-screen
- main content = flex-grow
- footer sticks to bottom

Add subtle filler (non-noisy):
- “Currently building” line
- OR small system status note

---

## 🟡 TASK 6: SYSTEM DETAIL REWORK (HIGH IMPACT)

Problem:
- Too text heavy
- Low engagement
- Sidebar wasted

Fix:

### 1. Structure rewrite

Break sections into:

- Visual → then explanation
- Not explanation → then visuals

Use:
- diagrams first
- then explanation

---

### 2. Reduce text fatigue

Convert:
- large paragraphs → smaller blocks
- bullet dumps → structured insights

---

### 3. Add “hooks” in sections

Examples:
- “What broke”
- “The moment it failed”
- “Why this was hard”

Keep human tone.

---

### 4. Sidebar upgrade

- Add scroll spy (active section highlight)
- Smooth scroll (no jump)
- Optional:
  - system snapshot (latency, scale, etc)

---

## 🟢 TASK 7: LAB PAGE REBUILD (VERY IMPORTANT)

Replace current lab content.

New source:
raw_data → insights section

Each lab post should be based on:

- problem
- why it was hard
- failure / lesson

Format:
- Real incidents
- Not generic articles

---

### Visual Fix:

- Break 2x2 identical grid
- Add variation:
  - size differences
  - tags (incident / system / failure / scaling)
  - icons

---

## 🔵 TASK 8: ADD VISUAL DENSITY (ONLY FOR LARGE SCREENS)

Important:
Do NOT affect mobile / small screens

For ≥ 1440px:

- Increase content width usage
- Reduce empty margins
- Fill space with:
  - diagrams
  - visuals
  - structured blocks

---

## 🟣 TASK 9: SMALL BUT CRITICAL FIXES

- Improve Proof text readability (increase size slightly)
- Improve section transitions (less “floating” feeling)
- Make flagship vs others more visually distinct
- Keep hierarchy intact

---

## 🧪 FINAL VALIDATION CHECK

Before finishing, ensure:

1. No fake data introduced
2. All proof comes from raw_data
3. Visual elements exist where possible
4. No large empty spaces on 2K
5. Hero clearly says “backend/systems engineer”
6. Trading is secondary, not dominant
7. Site still feels human, not corporate

---

## 🎯 END GOAL

The final site should:

- Hook instantly
- Feel alive (not static)
- Show real systems visually
- Maintain personality
- Remove skepticism
- Be enjoyable to explore

If done correctly:

HR → Shortlist confidently  
Engineer → Trust + Interview  
Visitor → Explore deeply  

---

Do NOT rush.

Think like:
You are turning this into a product-level portfolio, not a template site.



update the prompt and fix these points:
1. first the raw_data contains data like this:
[all_father@archlinux portfolio]$ cd raw_data
[all_father@archlinux raw_data]$ tree
.
├── content.json
├── project_ant_meta_bots
│   ├── ARCHITECTURE.md
│   ├── dashboard.png
│   ├── logs.txt
│   ├── README.md
│   └── running_bot_details_along_with_trades.png
├── project_elastic_dca
│   ├── ARCHITECTURE.md
│   ├── dashboard.png
│   ├── demo.mp4
│   └── README.md
├── project_lorentzian_ml_engine
│   ├── ARCHITECTURE.md
│   ├── chart_ss_with_signals.png
│   ├── README.md
│   └── trade_states_ss.png
├── project_quant-discovery-pipeline
│   ├── ARCHITECTURE.md
│   └── readme.md
├── project_rubix_cube_solver
│   ├── ARCHITECTURE.md
│   ├── cli_ss_solving_cube.png
│   ├── Demo.mp4
│   └── README.md
├── project_stella
│   ├── ARCHITECTURE.md
│   ├── DEMO.mp4
│   ├── README.md
│   └── startup_console_image.png
└── project_telegram_signal_distributor
    ├── admin_chat_with_bot.mp4
    ├── ARCHITECTURE.md
    ├── README.md
    └── signal_forwarder_group_chat_signals.png

8 directories, 28 files
[all_father@archlinux raw_data]$ 

2. i have removed the priority mentioned in the projects detials in the raw_data/content.json so i let it on opus to decide which one to put in flagship and all. he can understant it by understanding each project form content.json also by checking when each project was made by checking the evolution data of the content.json. so he can understand everything and can easily decide.
3. also i have an idea in the systems where we show the list of the projects first so there we show the abstract data only as of now and have the title, description, proof on left and other points on right side so we can do this crazy improvement here so it looks good as it is right now but when we hover we can make the image or video of the project (if we have) to like sliding up on the right side where we have the matrics showing right now. like a curvy edged photo or image pops on the right side as overly on the text and when we hover out then hoes down as it came it will be crazy if done correctly with good visuals. So i am not telling to change any data in the current way of showing the project just adding a crazy idea of make the demo image or video poping up on the right side as the right side does not containt too important data so we can do hide it just only when hovered on. adding the current image of how system page show list of projects so that you can undertand my feeling.
4. 