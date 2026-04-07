==========================================================================
V1:
==========================================================================

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

2. Visual Comfort (Feel)
- Soft dark theme
- Rounded nodes (card-like feel)
- Consistent color palette per domain
- Icons where useful
- Nothing should visually "shout"

---

NODE DESIGN RULES:

- Keep labels short and human-readable
- Avoid long descriptions
- Prefer:
  "Strategy" over long technical names

---

DEPTH INJECTION RULES (CRITICAL):

The diagram must NOT feel overly simplified.

Inject controlled technical depth:

1. Micro-detail inside nodes (only where valuable)
   - Add 1 short hint (3–5 words max)
   - Example:
     Strategy (stateful, Lorentzian)
     Execution (order routing + retry)

2. Edge-level intelligence
   - Label only important flows
   - Example:
     signals, validated events, filtered orders

3. Selective expansion
   - Expand ONLY 1–2 critical components
   - Example:
     Strategy → Feature → Signal → Risk

4. Priority-based detailing
   - Focus on:
     Strategy / Core Logic
     Execution
     Monitoring / Watchdog

5. Avoid flooding
   - Depth should feel discovered, not dumped

---

GROUPING RULES:

- Use subgraphs lightly
- Maintain breathing space
- Avoid heavy visual containers

---

FLOW RULES:

- Main flow must be clear in 3–5 seconds
- Secondary systems must not clutter
- Annotations must NOT compete with primary flow

---

DELIVERABLE REQUIREMENTS:

1. Choose best Mermaid diagram type (prefer flowchart)
2. Produce a clean, modern, UI-like diagram
3. Must:
   - Look complex but feel simple
   - Be readable instantly
   - Reveal depth on closer inspection

---

MENTAL MODEL:

First glance → clarity  
Second glance → depth  
Third glance → sophistication  

Design for discovery, not explanation.

---

Now generate the diagram accordingly.

==========================================================================
V2:
==========================================================================
You are not just generating a diagram. You are designing a visual story of a system.

The goal is not just clarity — it is guided understanding.

---

INTENT:

The viewer should not scan randomly.

They should be visually guided like this:
Entry → Flow → Decision → Action → Outcome

The diagram should feel like:
“A story unfolding from left to right.”

---

VISUAL STORYTELLING RULES:

1. Define a Clear Entry Point
- The starting node must be visually obvious
- Example: UI / User / Input
- It should feel like “this is where I begin”

2. Strong Directional Flow
- Maintain a dominant direction (left → right preferred)
- Avoid backtracking unless absolutely necessary

3. Progressive Disclosure
- Each step reveals slightly more system depth
- Do NOT show everything at once

4. Visual Hierarchy Through Position
- Important components:
  - Centered or on main path
- Supporting components:
  - Slightly off-axis

5. The “Main Path” Must Be Sacred
- Primary flow should feel like a straight journey
- Side systems (DB, logs, monitoring):
  - Visually secondary
  - Slightly detached

6. Controlled Branching
- Decisions or splits should feel intentional
- Avoid chaotic branching trees

7. End With a Clear Outcome
- Final nodes must feel like a result:
  Execution / Response / External System

---

EMOTIONAL FLOW:

The diagram should create:

Start → Curiosity  
Middle → Understanding  
End → Confidence  

---

STYLE RULES:

- Soft, modern UI-like appearance
- Rounded nodes
- Consistent spacing
- No visual noise

---

AVOID:

- Equal weight to all nodes
- Random placement
- Flat, lifeless structure

---

DELIVERABLE:

- Choose best Mermaid diagram type
- Create a diagram that:
  - Guides the eye naturally
  - Feels like a journey
  - Explains without overwhelming

---

MENTAL MODEL:

“If the user scrolls quickly, they still understand the flow.”

“If they slow down, the system tells its story.”

---

Now generate the diagram as a visual narrative.

==========================================================================
V3:
==========================================================================
You are not just generating a diagram. You are creating a signature visual style that is consistent across all system diagrams.

This diagram must feel like part of a recognizable design language.

---

INTENT:

The viewer should subconsciously feel:
“All of this was designed by the same engineer.”

---

SIGNATURE STYLE RULES:

1. Consistent Structural Pattern
Always follow:

Input → Interface → Core → Decision → Execution → External

Even if adapted, the pattern should be recognizable.

---

2. Domain-Based Color Identity

Assign consistent colors:

- UI / Input → Soft Blue
- API / Interface → Cyan
- Core Logic / Strategy → Purple
- Execution / Actions → Green
- Monitoring / Watchdog → Orange
- External Systems → Gray

Never randomize colors.

---

3. Reusable Component Naming

Use consistent naming across diagrams:

- “Strategy” (not Signal Engine / Algo randomly)
- “Execution”
- “Watchdog”
- “Gateway”

This builds familiarity.

---

4. Signature Minimalism

- Clean nodes
- No long text blocks
- Always slightly under-explained rather than over-explained

---

5. Distinct Core Highlighting

Core system (Strategy / Logic) should ALWAYS:
- Be slightly more detailed OR
- Slightly more central

This becomes your signature emphasis.

---

6. Consistent Edge Language

Always use similar terms:
- signals
- events
- orders
- state updates

Avoid random terminology variation.

---

7. Balanced Symmetry

- Maintain visual balance
- Avoid chaotic layouts
- Diagrams should feel “engineered”, not “drawn”

---

8. Subtle Complexity Pattern

Each diagram should include:
- 1 expanded component
- 1 annotated flow
- 1 secondary system (DB / monitoring)

This becomes your repeatable pattern.

---

DELIVERABLE:

- Choose best Mermaid diagram type
- Produce a diagram that:
  - Feels consistent with a larger system family
  - Has a recognizable structure
  - Looks like part of a personal design system

---

MENTAL MODEL:

“This is not just a diagram.”

“This is how this person thinks.”

---

Now generate the diagram with a consistent signature style.