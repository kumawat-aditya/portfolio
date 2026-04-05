You are performing a FINAL transformation of a systems engineering portfolio website.

This is NOT a redesign from scratch.
This is a high-precision upgrade to push the site into top 1% quality.

The website already has:
- Strong personality
- Real system depth
- Good structure
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

- content.json → complete structured raw project data
- project_{project_name}/
    - README.md
    - ARCHITECTURE.md (contains mermaid diagrams)
    - images/videos/logs directly in folder (no fixed subfolder structure)

Example:
project_ant_meta_bots/
    - ARCHITECTURE.md
    - dashboard.png
    - logs.txt
    - running_bot_details_along_with_trades.png

project_elastic_dca/
    - demo.mp4
    - dashboard.png

RULES:
- DO NOT invent anything
- DO NOT create fake proof
- ONLY use what exists
- File names describe their content → use them intelligently
- If something is missing → SKIP gracefully

System must support:
- partial proof (some projects have more, some less)
- future extensibility (new files may be added later)

---

🧠 CORE GOAL

The site should feel like:

“This person builds real systems. I can SEE it.”

NOT:
- blog
- resume
- corporate portfolio

---

⚠️ NON-NEGOTIABLE STYLE RULES

DO NOT:
- Kill personality
- Make it corporate
- Over-polish language
- Replace strong human lines

MAINTAIN:
- Curious tone
- Honest failures
- Slight mystery
- System-first thinking

---

## 🔥 TASK 1: FULL CONTENT REWRITE

Rewrite ALL website content using updated raw_data/content.json.

Requirements:
- Reflect updated projects
- Include newly added project automatically
- Remove outdated claims
- Keep same human + engineering tone

IMPORTANT:
- Do NOT exaggerate
- Do NOT aggressively highlight unverifiable metrics

Specifically:
- De-emphasize “570M rows”
- If mentioned → contextual only
- Use real timeline:
    - initial: ~1.5 days
    - optimized: ~30 minutes
    - hardware: Ryzen 5 5600X, 16GB RAM

---

## 🎯 TASK 2: HERO REPOSITIONING

Problem:
Site feels trading-focused → wrong first impression

Fix:

Primary identity:
→ Backend Engineer / Systems Engineer / Software Developer

Trading:
→ Secondary (badge / subtle signal)

Goal:
User should NOT think:
“He only does trading”

But instead:
“He builds systems (trading is one domain)”

---

## 🧱 TASK 3: VISUAL PROOF INTEGRATION

Extract and use:

1. ARCHITECTURE.md
→ parse mermaid diagrams → render clean visuals

2. Images / Screenshots
→ dashboard, charts, bot details, CLI outputs

3. Videos
→ demos where available

4. Logs
→ short, meaningful snippets only

Guidelines:
- Show visuals where they add clarity
- Avoid dumping everything
- Let each project present what it actually has
- Missing elements should NOT break layout

---

## 🔴 TASK 4: PROOFBAND REBUILD

Current issues:
- Breaks momentum
- Contains weak/unverified claims
- Feels disconnected visually (especially on 2K)

You MUST:
- Remove current implementation
- Rebuild using ONLY real, verifiable data

New direction:
- Few strong proof moments (not many weak ones)
- Must map to real artifacts (logs, outputs, etc)
- Tight spacing → no dead gap after hero

---

## 🟠 TASK 5: DEAD ZONE REMOVAL (2K+ ONLY)

Important:
Problem exists mainly on large screens

Fix:
- Reduce excessive vertical/horizontal gaps
- Improve section transitions
- Avoid large empty dark areas

DO NOT:
- Break mobile layouts
- Over-compress smaller screens

---

## 🟡 TASK 6: SYSTEM DETAIL REWORK

Problem:
Too text-heavy → low engagement

Fix direction:
- Structure rewrite

- Lead with visuals where possible
- Break long text into structured blocks
- Avoid large paragraphs

Add engagement:
- “What broke”
- “Why it was hard”
- “Failure moments”

Sidebar:
- Improve interaction (smooth scroll, active state if useful)
- Use space better if possible
- BUT do not force unnecessary content

---

## 🟢 TASK 7: LAB PAGE REBUILD

Replace current Lab content.

New source:
→ insights from content.json

Each post should reflect:
- real problem
- why it was difficult
- what failed
- what changed

NOT:
- generic blogs

Visual improvements:
- Avoid identical card repetition
- Add variation (size, tags, structure)

---

## 🔵 TASK 8: VISUAL DENSITY (LARGE SCREENS ONLY)

Important:
Low density issue is only on 2K / 4K

Fix:
- Better horizontal usage
- Reduce empty margins
- Use visuals + structured blocks to fill space meaningfully

---

## 🟣 TASK 9: SYSTEM LIST INTERACTION (NEW IDEA)

Enhance systems list (home/systems page):

Current:
- Left = title + description + proof
- Right = metrics

Upgrade:

When hovering a system card:
→ Show related image/video from project folder
→ Slide/overlay into right side
→ Smooth, premium motion
→ Disappear on hover out

Rules:
- Use actual project visuals
- Do NOT disrupt readability
- Keep interaction subtle, not flashy

Goal:
Make systems feel alive without changing structure

---

## 🟤 TASK 10: PROJECT HIERARCHY (AUTO DECISION)

Priority is NOT provided.

You must infer:

- flagship
- core
- supporting

Based on:
- depth
- complexity
- system impact
- evolution timeline in content.json

---

## ⚪ TASK 11: CONTACT PAGE FIX

Problem:
- Empty space on large screens
- Footer positioning issues

Fix:
- Improve visual balance
- Ensure page does not feel incomplete

DO NOT:
- Force rigid layout instructions
- Break existing layout system

You may:
- Add subtle content (status, note, etc)
- Adjust spacing intelligently

---

## 🧪 FINAL VALIDATION CHECK

Ensure:

- No fake data
- All proof comes from raw_data
- Visuals used where available
- No large empty zones on 2K
- Hero shows backend/system identity first
- Trading is secondary
- Site still feels human

---

## 🎯 END GOAL

The final site should:

- Hook instantly
- Feel alive
- Show real systems visually
- Maintain personality
- Remove skepticism
- Be enjoyable to explore

If done correctly:

HR → Shortlist  
Engineer → Trust + Interview  
Visitor → Explore deeply  

---

Take your time.

Think like:
You are turning this into a product-level portfolio, not a template.