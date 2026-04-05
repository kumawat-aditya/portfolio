## 🧠 MASTER REFINEMENT PROMPT (CONTINUATION MODE)

You are not starting fresh.

You are entering an **advanced portfolio system mid-refinement**.

This is a **systems-first portfolio**, not a UI project.

Your job is to **fix perception, trust, and visual clarity** — not redesign everything.

---

## 🔥 CONTEXT YOU MUST RESPECT

This portfolio is designed as:

**Hook → Curiosity → Personality → Proof → Depth**

It intentionally avoids:

* corporate tone
* resume-style layouts
* generic UI patterns

The creator is a:
→ backend / systems engineer
→ builds real systems (state machines, async systems, reliability-heavy)

⚠️ Trading is ONLY a domain — NOT identity

---

## ⚠️ NON-NEGOTIABLE STYLE RULES

DO NOT:

* Make things corporate
* Remove human tone
* Over-polish language
* Replace raw/system explanations with marketing text

MAINTAIN:

* curiosity
* slight mystery
* real engineering depth
* visible imperfection (controlled, intentional)

---

## 🎯 YOUR OBJECTIVE

Fix **high-impact perception issues**:

* Increase **trust**
* Improve **visual proof**
* Remove **UI awkwardness**
* Fix **interaction quality**
* Eliminate **dead space (2K screens)**

---

# 🧩 TASKS (EXECUTION REQUIRED)

---

## ✅ TASK 1 — FIX FLAGSHIP IMAGE (CRITICAL)

### Problem:

* Image looks **pasted**
* Huge **empty space inside card**
* No layout integration
* Feels like decoration, not proof

### Goal:

Make image feel like:
→ **part of the system**
→ **alive**
→ **contextual proof**

### Fix Direction:

* Do NOT keep it as a static right-side block
* Convert into **layered system panel**

### Implementation Ideas:

* Place image inside a **glass / depth container**
* Add:

  * soft glow edges
  * slight perspective tilt
  * subtle parallax on hover
* Crop intelligently → focus on meaningful UI parts
* Overlay:

  * tiny labels (e.g. “live logs”, “execution panel”)
* Remove empty space by:

  * increasing scale
  * tighter grid alignment

### Output Expectation:

User should feel:
→ “This is a running system, not a screenshot”

---

## ✅ TASK 2 — FIX HOVER IMAGE INTERACTION (VERY IMPORTANT)

### Problem:

* Current hover image is:

  * unclear
  * badly positioned
  * visually confusing
  * no direction

### Original Intent (MUST FOLLOW):

Image should:
→ appear from **bottom-right edge**
→ expand slightly **outside the card**
→ create **3D depth illusion**

---

### Required Behavior:

On hover:

1. Image emerges from:
   → bottom-right corner of card

2. Animation:

   * translateY(-20px to -40px)
   * translateX(10px to 20px)
   * slight scale (1.03–1.06)
   * smooth easing (cubic-bezier)

3. Position:

   * partially outside card bounds
   * overlaps layout slightly (intentional)

4. Styling:

   * rounded corners (clean, premium)
   * soft shadow
   * slight blur background glow

5. Content clarity:

   * auto-select best image (not random)
   * ensure readable crop

---

### Output Expectation:

User should feel:
→ “Oh this is alive”
→ “I can peek into the system”

NOT:
→ “What is that blurry thing?”

---

## ✅ TASK 3 — FIX SIDEBAR SCROLL (UX BUG)

### Problem:

* Clicking sidebar jumps instantly

### Fix:

* Implement **smooth scroll behavior**

### Requirements:

* animated scroll
* proper offset (for sticky headers)
* no jump cuts

---

## ✅ TASK 4 — REMOVE FAKE V1 CLAIMS (TRUST CRITICAL)

### Problem:

Fake claim exists:
→ “2000+ lines MQL + CSV system”

This DESTROYS trust.

---

### Replace With REAL STORY:

V1 reality:

* MQL + server architecture existed
* state.json used for persistence
* strict trade ↔ server mapping attempted
* major flaws:

  * desync between MT5 and server
  * repeated execution loops
  * unrecoverable emergency states
  * manual reset required
  * no modularization
  * single-file backend

---

### Action:

* Remove ALL fake mentions across site
* Replace with:
  → short, honest “what broke” narrative

---

### Output Expectation:

Engineer reaction:
→ “Okay, this guy actually built and failed systems”

---

## ✅ TASK 5 — FIX BACK NAVIGATION BUG

### Problem:

Back button returns:
→ previous scroll position INSIDE same page

NOT:
→ systems page

---

### Fix:

* Back should:
  → always go to Systems page (or landing if applicable)

### Implementation:

* override browser history behavior
  OR
* explicitly route

---

## ✅ TASK 6 — ARCHITECTURE DIAGRAM PIPELINE (HIGH IMPACT)

### Goal:

Turn:
→ Mermaid diagrams (ARCHITECTURE.md)

Into:
→ **beautiful rendered images**

---

### You MUST:

1. Scan:
   `/raw_data/project_*/ARCHITECTURE.md`

2. Extract:

   * all mermaid blocks

3. Build Python script that:

   * parses mermaid
   * renders diagrams
   * outputs high-res PNG

---

### Requirements:

* clean layout
* dark theme matching site
* high resolution (2K ready)
* proper spacing

---

### Output Path:

Save inside each project:

```
/raw_data/project_x/diagrams/
```

---

### Then:

Integrate into UI:

* show in SystemDetail
* NOT hidden in text
* make it visible early

---

## ✅ TASK 7 — VIDEO AUTO-PLAY (GIF-LIKE)

### Problem:

Videos feel static

### Fix:

* autoplay
* loop
* muted
* no controls (default)

---

### Output:

Feels like:
→ living preview
→ not a video player

---

## ✅ TASK 8 — FULL VISUAL QA LOOP (VERY IMPORTANT)

You MUST:

1. Open:
   [http://localhost:3000/portfolio](http://localhost:3000/portfolio)

2. Iterate through:

   * landing page
   * systems page
   * EACH system detail page
   * lab page

---

### For EACH page:

Check:

* empty space (2K screen)
* bad image placement
* broken scaling
* unclear visuals
* poor hierarchy

---

### Then:

* fix
* reload
* re-evaluate

---

### Loop until:

You reach:
→ **Top 1% visual quality**
→ premium feel
→ no awkward spacing

---

## ✅ TASK 9 — LAB PAGE VISUAL FIX

### Problem:

* feels generic
* low visual depth

### Fix:

* add:

  * logs
  * system fragments
  * micro visuals
* break monotony

---

## ✅ TASK 10 — SELF-CRITIC LOOP (MANDATORY)

After all fixes:

You must:

1. Revisit site as:

   * engineer
   * recruiter
   * curious visitor

2. Ask:

   * Does this feel real?
   * Is proof visible?
   * Is anything fake-looking?
   * Is anything confusing?

3. Improve again

Repeat until:
→ No weak spots remain

---

## 🧠 FINAL EXPECTATION

The site should feel like:

* A **real system lab**
* Not a portfolio
* Not a template
* Not a UI showcase

---

## 🚨 FAILURE CONDITIONS

You FAILED if:

* visuals still feel pasted
* hover interaction still confusing
* fake claims remain
* layout still empty on 2K
* systems don’t feel real

---

## ✅ SUCCESS SIGNAL

An experienced engineer should think:

→ “This person has actually built and debugged real systems”

---

Proceed step by step.

Do NOT rush.

Do NOT skip visual validation.

---
