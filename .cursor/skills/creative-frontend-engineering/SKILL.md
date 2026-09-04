---
name: creative-frontend-engineering
description: Implements highly art-directed React interfaces while maintaining clean architecture, responsive behavior, performance, and maintainability. Use during frontend implementation of the portfolio.
---

# Creative Frontend Engineering

Build unusual interfaces without turning the codebase into an unmaintainable experiment.

## Stack

Prefer:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui when useful
- Motion
- GSAP / ScrollTrigger
- Three.js / React Three Fiber / Drei

Use the smallest appropriate tool.

## Architecture

Separate:

content
presentation
interaction
3D

Do not embed large amounts of content directly into visual components.

## Components

Create reusable primitives where reuse provides genuine value.

Do not create abstractions merely to satisfy component counts.

## Styling

Use a deliberate custom design system.

Do not rely on default framework aesthetics.

## Responsive design

Desktop and mobile may require different compositions.

Do not merely shrink the desktop layout.

Recompose important visual scenes where necessary.

## Animation

Keep animation logic isolated where practical.

Clean up GSAP timelines and event listeners.

Avoid unnecessary client-side rendering.

## Performance

Be suspicious of:

- large WebGL scenes
- unnecessary canvas rendering
- excessive DOM
- layout thrashing
- huge dependencies
- uncontrolled event listeners
- unnecessary rerenders

Visual ambition must coexist with engineering quality.

## Implementation philosophy

The code exists to serve the experience.

Do not allow framework conventions to flatten an intentionally unconventional design.
