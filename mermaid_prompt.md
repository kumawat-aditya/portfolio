You are not just generating a diagram. You are designing a visual system that communicates a real, running architecture without overwhelming the viewer.

FIRST — Understand the Intent:

This diagram is for a portfolio that should feel like:
“This person builds real systems. I can SEE it.”

NOT:
- A corporate architecture document
- A textbook diagram
- A cluttered system dump

The diagram must feel:
- Effortless to look at
- Slightly intriguing
- Not mentally exhausting
- Clean but not over-simplified

It should create curiosity, not pressure.

---

CORE DESIGN PRINCIPLE:

Balance these two forces:

1. Spatial Clarity (Structure)
- Strong left → right or top → bottom flow
- Logical system layering (UI → API → Core → Execution → External)
- Clean grouping of related components
- No chaotic or crossing edges
- No unnecessary loops or redundant arrows

2. Visual Comfort (Feel)
- Soft dark theme (no harsh contrast)
- Rounded nodes (card-like feel)
- Consistent color palette per domain
- Icons where useful (reduce reading effort)
- No aggressive visual hierarchy (nothing should "shout")

---

CRITICAL REQUIREMENT:

Combine BOTH:

- The STRUCTURE of a well-organized system diagram
- The VISUAL STYLE of a soft, modern, UI-like diagram

NOT:
- Structure-only (boring, corporate)
- Style-only (pretty but confusing)

---

NODE DESIGN RULES:

- Keep labels short and human-readable
- Avoid long technical descriptions inside nodes
- Prefer:
  "Strategy" over "Lorentzian Strategy (build_history / process_new_candle)"

- Use icons to reduce cognitive load where possible
- Maintain consistent node sizes (avoid visual spikes)

---

GROUPING RULES:

- Use subgraphs, but do NOT let them dominate the visual
- Subgraphs = subtle grouping, not heavy containers
- Maintain breathing space between sections

---

FLOW RULES:

- Primary flow must be instantly understandable in 3–5 seconds
- Example:
  UI → API → Bots → Strategy → Watchdog → Execution → Exchange

- Secondary flows (DB, monitoring, etc.) should not clutter the main path

---

AVOID:

- Dense vertical stacking
- Overlapping arrows
- Self-loop arrows unless absolutely necessary
- Too much text inside nodes
- Bright or high-contrast color clashes

---

DELIVERABLE REQUIREMENTS:

1. First, decide the BEST Mermaid diagram type:
   - flowchart (preferred for architecture)
   - or C4 / architecture diagrams if better suited

2. Then generate a diagram that:
   - Has clean spatial alignment
   - Uses soft, consistent styling
   - Feels like a product UI, not documentation

3. The result should:
   - Look complex but feel simple
   - Be readable in seconds
   - Invite deeper exploration

---

MENTAL MODEL:

Design it like:
“If someone scrolls fast, they still get the system.”

And if they slow down:
“They discover depth.”

---

Now take the provided system and generate the diagram accordingly.
