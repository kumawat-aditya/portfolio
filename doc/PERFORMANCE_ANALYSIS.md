# Performance Analysis — Portfolio Website

> Comprehensive audit identifying all areas causing lag, jank, excessive CPU/GPU usage, and poor runtime performance.

## ✅ Resolution Status

**All issues identified below have been resolved.** Here is a summary of fixes applied:

| Issue                                 | Resolution                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Infinite rAF loop (smooth scroll)     | Replaced with **Lenis** smooth scroll library with proper rAF lifecycle            |
| mousemove → setState → full re-render | Cursor now uses **DOM refs** — zero React state updates on mouse move              |
| Glass card DOM query on mousemove     | Throttled via `requestAnimationFrame`, uses `elementFromPoint` + `.closest()`      |
| backdrop-filter blur(40px)            | Reduced to `blur(16px)` across all glass elements                                  |
| CDN Tailwind (runtime JIT)            | Migrated to **Tailwind CSS v4 build-time** via `@tailwindcss/vite` plugin          |
| Fixed background + SVG noise          | Removed `background-attachment: fixed` and SVG noise texture                       |
| Dual scroll systems                   | Removed CSS smooth scroll; Lenis handles all scrolling                             |
| will-change on all carousel cards     | Only applied to the **center card**                                                |
| Evolution scroll handler              | Wrapped in **rAF throttling** with `{ passive: true }`                             |
| Navbar scroll handler                 | DOM query cached, wrapped in **rAF throttling** with `{ passive: true }`           |
| transition: all on glass cards        | Changed to specific properties: `box-shadow, border-color, background`             |
| No React.memo                         | All child components wrapped in `React.memo()`                                     |
| Import maps conflicting with Vite     | Import maps **removed** from `index.html`                                          |
| ~400 lines of !important overrides    | Moved to external CSS files; overrides work **without !important** (unlayered CSS) |
| Inline SVG noise                      | Removed entirely                                                                   |
| All CSS inline in index.html          | Externalized to `styles/main.css` + `styles/theme.css`                             |
| Projects.tsx touch state re-renders   | `touchStartX`/`touchEndX` converted from `useState` to `useRef`                    |
| Resize listener not debounced         | Added 150ms debounce to resize listener                                            |

---

## Table of Contents

1. [Critical Issues (High Impact)](#1-critical-issues-high-impact)
2. [Major Issues (Medium-High Impact)](#2-major-issues-medium-high-impact)
3. [Moderate Issues (Medium Impact)](#3-moderate-issues-medium-impact)
4. [Minor Issues (Low Impact)](#4-minor-issues-low-impact)
5. [Architecture-Level Concerns](#5-architecture-level-concerns)
6. [Summary & Priority Matrix](#6-summary--priority-matrix)

---

## 1. Critical Issues (High Impact)

### 1.1 — Infinite `requestAnimationFrame` Loop (Smooth Scroll)

**File:** `App.tsx` — Lines 80–140

The custom "Lenis-style" smooth scroll implementation runs a `requestAnimationFrame` loop **permanently** — even when the user is not scrolling.

```ts
const smoothScroll = () => {
  const diff = Math.abs(targetScroll - currentScroll);
  if (diff > 0.5) {
    currentScroll = lerp(currentScroll, targetScroll, ease);
    container.scrollTop = currentScroll; // ← Forces layout recalculation EVERY FRAME
    isScrolling = true;
  } else {
    currentScroll = targetScroll;
    isScrolling = false;
  }
  rafId = requestAnimationFrame(smoothScroll); // ← NEVER STOPS
};
```

**Why this kills performance:**

- `requestAnimationFrame` fires ~60 times/sec (or 120+ on high-refresh monitors) **forever**, even when idle.
- Every frame reads `container.scrollHeight`, `container.clientHeight` and sets `container.scrollTop`.
- Setting `scrollTop` triggers a **forced synchronous layout reflow** in the browser, which is one of the most expensive operations possible. Doing this 60-120 times per second continuously is devastating.
- The `isScrolling` flag doesn't stop the loop — it only changes a variable. The rAF loop is **never cancelled** until component unmount.
- Combined with `e.preventDefault()` on wheel events, this **disables native hardware-accelerated scrolling** and replaces it with a JavaScript-driven scroll that is fundamentally slower.

**Impact:** This alone can cause 100% of the observed lag. Native browser scrolling is GPU-composited and essentially free; this JS implementation forces the main thread to do all the work.

---

### 1.2 — `mousemove` Triggers React State Update on EVERY Pixel

**File:** `App.tsx` — Lines 20–22, 67

```ts
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

const updateCursor = (e: MouseEvent) => {
  setMousePosition({ x: e.clientX, y: e.clientY }); // ← State update every pixel
};

window.addEventListener("mousemove", updateCursor);
```

**Why this kills performance:**

- `mousemove` fires **hundreds of times per second** when the mouse moves.
- Each `setMousePosition` call creates a **new object `{ x, y }`**, triggering a React re-render of the **entire `App` component** and all its children.
- Since `App` contains `<Hero>`, `<Projects>`, `<Evolution>`, `<Expertise>`, `<Experience>`, `<Contact>`, and `<Footer>`, **every single component re-renders on every pixel of mouse movement**.
- This means the entire Virtual DOM is diffed and reconciled hundreds of times per second.
- The cursor position is only used by 2 small `<div>` elements (the custom cursor), but it causes the entire component tree to re-render.

**Impact:** This is the second most destructive issue. On a complex page with many DOM nodes, this creates massive, continuous jank.

---

### 1.3 — `mousemove` Queries ALL `.glass-card` Elements and Sets CSS Properties

**File:** `App.tsx` — Lines 48–57

```ts
const handleGlassCards = (e: MouseEvent) => {
  const cards = document.querySelectorAll(".glass-card"); // ← DOM query every pixel
  cards.forEach((card) => {
    const rect = (card as HTMLElement).getBoundingClientRect(); // ← Forces layout
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
    (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
  });
};
```

**Why this kills performance:**

- `document.querySelectorAll(".glass-card")` scans the entire DOM on every `mousemove` event.
- `getBoundingClientRect()` forces a **layout reflow** for each card.
- If there are N glass cards visible, this performs N layout thrashes per mouse movement.
- This runs on the **same** `mousemove` event as the cursor update (issue 1.2), compounding the damage.
- These cards also have `backdrop-filter: blur(40px) saturate(180%)` (see issue 2.1), making each repaint extremely expensive.

**Impact:** Direct DOM manipulation + layout thrashing on every mouse pixel movement.

---

## 2. Major Issues (Medium-High Impact)

### 2.1 — Heavy `backdrop-filter` on Multiple Elements

**File:** `index.html` — CSS Styles

```css
.glass-card {
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
}
```

And the navbar:

```css
backdrop-blur-xl backdrop-saturate-180     /* Tailwind classes = blur(24px) saturate(180%) */
```

And project cards each have:

```
backdrop-blur-xl backdrop-saturate-150     /* On EVERY project card */
```

**Why this hurts:**

- `backdrop-filter: blur()` is one of the **most GPU-expensive CSS properties**. It must composite the content behind the element, apply a Gaussian blur, then render the element on top.
- `blur(40px)` is a very large blur radius — each pixel samples a 80×80 area.
- Multiple stacked `backdrop-filter` elements create **layered GPU compositing passes**.
- When glass cards are continuously re-rendered (due to mouse tracking CSS variable updates), these blur operations re-execute on every repaint.
- On low-end GPUs or integrated graphics, this alone can drop frame rates to <30fps.

**Affected components:** Navbar, all glass-card elements (Expertise cards, Experience cards, Project cards, modals).

---

### 2.2 — `body::before` Full-Screen Fixed Pseudo-Element with Layered Gradients

**File:** `index.html` — CSS

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    radial-gradient(
      ellipse 60% 40% at 50% 0%,
      rgba(59, 130, 246, 0.13),
      transparent
    ),
    radial-gradient(
      circle at 20% 80%,
      rgba(139, 92, 246, 0.09),
      transparent 35%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(34, 211, 238, 0.08),
      transparent 30%
    );
  pointer-events: none;
  z-index: 1;
}
```

Plus `body` itself has **5 stacked background images** including a noise SVG:

```css
body {
  background-image:
    radial-gradient(...), radial-gradient(...), radial-gradient(...),
    radial-gradient(...), url("data:image/svg+xml,...noise...");
  background-attachment: fixed;
}
```

**Why this hurts:**

- `background-attachment: fixed` forces the browser to **repaint the entire background** on every scroll event, because fixed backgrounds don't move with the content.
- The noise texture is an inline SVG with `feTurbulence` filter — this is **generated procedurally on every repaint**.
- Combined, this creates 8 layered gradient/pattern renders on every scroll frame.
- The `body::before` pseudo-element with `position: fixed` and `z-index: 1` creates an additional compositing layer over the entire viewport.

---

### 2.3 — Carousel Cards Use `will-change: transform` on All Cards Simultaneously

**File:** `Projects.tsx` — Line ~178

```tsx
style={{
  ...cardStyle,
  willChange: "transform",  // ← Applied to ALL project cards
}}
```

**Why this hurts:**

- `will-change: transform` promotes each element to its own GPU compositing layer.
- When applied to ALL project cards (not just the visible ones), it creates **N GPU layers** for N projects.
- Each layer consumes VRAM and compositing time, even for cards with `opacity: 0` that are not visible.
- Combined with the backdrop-filter on each card, this multiplies GPU memory usage.

---

### 2.4 — CDN Tailwind CSS (Runtime JIT Compilation)

**File:** `index.html` — Line 10

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Why this hurts:**

- The CDN version of Tailwind runs a **JIT compiler in the browser** at runtime.
- It scans the DOM for class names and generates CSS on-the-fly.
- This adds significant JavaScript execution overhead on page load.
- It also means Tailwind config is evaluated at runtime (the inline `<script>tailwind.config = {...}</script>`).
- Every DOM mutation potentially triggers Tailwind's observer to regenerate styles.
- Production sites should use build-time CSS generation (PostCSS plugin), which the Vite setup already supports but isn't being used — instead, the HTML loads the CDN version.

---

### 2.5 — Dual Scroll Systems Conflict

**File:** `App.tsx` + `index.html`

The CSS says:

```css
.scroll-container {
  scroll-behavior: smooth; /* ← CSS-native smooth scroll */
}
```

But App.tsx implements its own JS smooth scroll with `e.preventDefault()` on wheel events, which **blocks** the CSS smooth scroll. So:

- CSS `scroll-behavior: smooth` is declared but never used (the JS intercepts wheel events).
- The `e.preventDefault()` on the `wheel` event disables native scroll entirely.
- The JS then manually sets `scrollTop` via lerp interpolation.

This means:

1. Browser tries to enable smooth scrolling (CSS).
2. JS prevents the wheel event.
3. JS manually drives scroll via `scrollTop` assignment (forcing reflow).
4. Two competing systems = confusion and wasted computation.

---

## 3. Moderate Issues (Medium Impact)

### 3.1 — `mouseover` Event Handler Does DOM Traversal with `.closest()`

**File:** `App.tsx` — Lines 25–37

```ts
const handleMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('.cursor-grab, [draggable="true"]')) { ... }
  else if (target.closest('a, button, [role="button"]')) { ... }
};
```

**Why this hurts:**

- `mouseover` fires on **every element** the cursor passes over (it bubbles).
- `.closest()` traverses up the DOM tree for each call.
- Two `.closest()` calls per `mouseover` event = 2 DOM tree traversals per element hovered.
- Combined with the `mousemove` state updates (issue 1.2), this adds more main thread work.

---

### 3.2 — Evolution Timeline Scroll Handler with DOM Queries

**File:** `Evolution.tsx` — Lines 47–65

```ts
const handleScroll = () => {
  if (!containerRef.current) return;
  const rect = containerRef.current.getBoundingClientRect(); // Forces layout
  // ... calculations ...
  setLineHeight(currentHeight); // React state update on every scroll frame
};

const scrollContainer = document.querySelector(".scroll-container"); // DOM query
scrollContainer.addEventListener("scroll", handleScroll);
```

**Why this hurts:**

- `getBoundingClientRect()` forces layout recalculation on every scroll event.
- `setLineHeight()` triggers a React re-render of the Evolution component on every scroll frame.
- The scroll event fires at ~60fps during scrolling, so this creates 60 state updates + re-renders per second.
- No throttling or `requestAnimationFrame` batching is applied.

---

### 3.3 — Navbar Scroll Handler with DOM Query

**File:** `Navbar.tsx` — Lines 17–40

```ts
const handleScroll = () => {
  const scrollContainer = document.querySelector(".scroll-container"); // DOM query on every scroll
  if (scrollContainer) {
    setIsScrolled(scrollContainer.scrollTop > 10);
  }
};
```

**Why this hurts:**

- `document.querySelector(".scroll-container")` runs on every scroll event.
- The query itself is inside the handler, not cached.
- `setIsScrolled()` triggers a re-render even if the value doesn't change (React compares boolean, but the DOM query is still wasteful).

---

### 3.4 — Fade-In Observer Uses `setTimeout` for DOM Readiness

**File:** `App.tsx` — Lines 155–168

```ts
setTimeout(() => {
  const sections = document.querySelectorAll(".fade-in-section");
  sections.forEach((section) => observer.observe(section));
}, 100);
```

**Why this hurts:**

- Using `setTimeout` with a magic number (100ms) is fragile and can miss elements or observe elements that aren't yet fully rendered.
- If the DOM takes longer than 100ms to render (likely on slow devices), sections won't be observed.
- This should use a `MutationObserver` or be integrated into React's lifecycle properly.

---

### 3.5 — Multiple Transition Properties on Glass Cards

**File:** `index.html` — CSS

```css
.glass-card {
  transition:
    all 0.5s ease,
    box-shadow 0.5s ease,
    border-color 0.3s ease,
    backdrop-filter 0.5s ease,
    -webkit-backdrop-filter 0.5s ease,
    background 0.5s ease;
}
```

**Why this hurts:**

- `transition: all` is an anti-pattern — it transitions **every CSS property** that changes, including `width`, `height`, and layout-triggering properties.
- Transitioning `backdrop-filter` is extremely GPU-expensive since the blur must be interpolated frame-by-frame.
- Transitioning `background` with gradients causes continuous gradient recalculation.
- Combined with the glass-card mouse tracking (issue 1.3), these transitions fire constantly.

---

### 3.6 — Animated Pseudo-Elements on Glass Cards (Radial Gradient Hover)

**File:** `index.html` — CSS

```css
.glass-card::before {
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(59, 130, 246, 0.12),
    transparent 40%
  );
  transition: opacity 0.5s ease;
}
```

**Why this hurts:**

- The `--mouse-x` and `--mouse-y` CSS variables are updated on every `mousemove` (issue 1.3).
- This forces the browser to **re-render the radial gradient** on every mouse movement for **every glass card**.
- A 600px radius radial gradient is computationally expensive to render repeatedly.

---

## 4. Minor Issues (Low Impact)

### 4.1 — `animate-pulse` on Timeline Node

**File:** `Evolution.tsx` — Line ~123

```tsx
<div className="absolute inset-0 bg-white rounded-full animate-pulse" />
```

- CSS `animate-pulse` runs indefinitely on active timeline nodes.
- Multiple active nodes = multiple infinite animations.
- Impact is small since these are tiny elements, but they add to overall GPU composition work.

---

### 4.2 — CSS Contains an Inline SVG Noise Texture

**File:** `index.html` — Body background

```css
url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400'...feTurbulence...%3E%3C/svg%3E")
```

- The `feTurbulence` SVG filter generates procedural noise.
- Combined with `background-attachment: fixed`, this re-renders on scroll.
- Should be replaced with a static noise image (PNG/WebP) for better performance.

---

### 4.3 — Light Theme CSS Overrides are Massive (~400 lines of `!important`)

**File:** `index.html` — CSS

The light theme is implemented via ~400 lines of CSS overrides using `html.light .class { ... !important; }` selectors. While this doesn't directly cause runtime lag, it:

- Increases style recalculation time when the theme toggles.
- Creates a massive specificity chain the browser must evaluate.
- Every theme toggle causes a full-page style recalculation across hundreds of overridden rules.

---

### 4.4 — `cursor: none !important` on Many Elements

**File:** `index.html` — CSS

```css
a,
button,
[role="button"],
input[type="submit"],
input[type="button"],
.cursor-pointer,
.cursor-grab {
  cursor: none !important;
}
```

- Hiding the native cursor and replacing it with a JS-driven custom cursor (issue 1.2) means:
  - No native cursor = no hardware cursor optimization.
  - The custom cursor's position is driven by React state, which has inherent latency compared to the OS-level hardware cursor.
  - Users will perceive ~16-33ms of cursor lag minimum, worsened by the re-render overhead.

---

### 4.5 — Import Maps Loading from `esm.sh` CDN

**File:** `index.html` — Lines 807–815

```html
<script type="importmap">
  {
    "imports": {
      "lucide-react": "https://esm.sh/lucide-react@^0.562.0",
      "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
      "react": "https://esm.sh/react@^19.2.3",
      "react/": "https://esm.sh/react@^19.2.3/"
    }
  }
</script>
```

- In dev mode (Vite), these import maps conflict with Vite's module resolution.
- In production (if deployed via `index.html` directly), every module is fetched from a remote CDN at runtime, adding network latency.
- This creates a dual-module-system where some imports come from `node_modules` and some from CDN, potentially loading React **twice**.

---

## 5. Architecture-Level Concerns

### 5.1 — No Component Memoization

None of the child components (`Hero`, `Projects`, `Evolution`, `Expertise`, `Experience`, `Contact`, `Footer`) use `React.memo()`. Since `App` re-renders on every mouse move (issue 1.2), **all children re-render too**. Wrapping them in `React.memo()` would prevent unnecessary re-renders when their props haven't changed.

### 5.2 — Custom Cursor Should Be Decoupled from React

The custom cursor position should use direct DOM manipulation (not React state) to avoid re-rendering the entire app tree. The cursor elements should be updated via `ref.current.style.left = ...` instead of `setMousePosition()`.

### 5.3 — No Code Splitting or Lazy Loading

All 7 section components are loaded eagerly. For a page this complex, `React.lazy()` with `Suspense` would reduce initial bundle size and parsing time.

### 5.4 — All CSS is Inline in `index.html`

Over 800 lines of CSS are embedded in `<style>` tags inside `index.html`. This:

- Cannot be cached separately from the HTML.
- Must be parsed in a single blocking pass.
- Should be extracted to a separate `.css` file for caching and parallel loading.

---

## 6. Summary & Priority Matrix

| Priority | Issue                                                     | File            | Impact                                   | Fix Difficulty |
| -------- | --------------------------------------------------------- | --------------- | ---------------------------------------- | -------------- |
| **P0**   | Infinite rAF loop (smooth scroll)                         | `App.tsx`       | **Critical** — constant CPU burn         | Medium         |
| **P0**   | mousemove → setState → full app re-render                 | `App.tsx`       | **Critical** — 100s of re-renders/sec    | Medium         |
| **P0**   | Glass card DOM query + getBoundingClientRect on mousemove | `App.tsx`       | **Critical** — layout thrashing          | Medium         |
| **P1**   | backdrop-filter blur(40px) on many elements               | `index.html`    | **High** — GPU saturation                | Low            |
| **P1**   | CDN Tailwind (runtime JIT)                                | `index.html`    | **High** — runtime CSS generation        | Low            |
| **P1**   | Fixed background + SVG noise texture                      | `index.html`    | **High** — repaint on scroll             | Low            |
| **P1**   | Dual scroll systems (CSS + JS) conflict                   | `App.tsx` + CSS | **High** — wasted computation            | Low            |
| **P2**   | will-change on all carousel cards                         | `Projects.tsx`  | **Medium** — excess GPU layers           | Low            |
| **P2**   | Evolution scroll handler (no throttle)                    | `Evolution.tsx` | **Medium** — 60 re-renders/sec on scroll | Low            |
| **P2**   | Navbar scroll handler (un-cached DOM query)               | `Navbar.tsx`    | **Medium** — wasteful DOM queries        | Low            |
| **P2**   | transition: all + backdrop-filter transition              | `index.html`    | **Medium** — expensive interpolation     | Low            |
| **P2**   | Glass card radial gradient re-render on mousemove         | `index.html`    | **Medium** — GPU gradient recalc         | Low            |
| **P3**   | No React.memo on child components                         | All components  | **Low-Med** — unnecessary VDom diffing   | Low            |
| **P3**   | Import maps conflicting with Vite                         | `index.html`    | **Low** — potential double-load          | Low            |
| **P3**   | ~400 lines of !important CSS overrides                    | `index.html`    | **Low** — style recalc on toggle         | Medium         |
| **P3**   | Inline SVG noise generation                               | `index.html`    | **Low** — procedural rendering cost      | Low            |

---

### Quick Fix Recommendations (Highest Impact, Lowest Effort)

1. **Remove the custom smooth scroll entirely** — use CSS `scroll-behavior: smooth` (already declared). Delete the entire `useEffect` block with the rAF loop, wheel event override, and lerp logic.

2. **Move custom cursor to direct DOM refs** — replace `setMousePosition()` with `cursorRef.current.style.transform = \`translate(${x}px, ${y}px)\``inside a`requestAnimationFrame` callback. This avoids React re-renders entirely.

3. **Throttle glass-card mouse tracking** — only update `--mouse-x`/`--mouse-y` inside a `requestAnimationFrame` callback, and only for cards currently in viewport.

4. **Remove CDN Tailwind** — use Vite's PostCSS pipeline with `@tailwindcss/vite` plugin instead.

5. **Reduce backdrop-filter blur radius** — `blur(12px)` looks nearly identical to `blur(40px)` on dark backgrounds but is 10x cheaper.

6. **Replace `background-attachment: fixed`** with a `position: fixed` container div — this avoids the fixed-background repaint penalty.

7. **Wrap child components in `React.memo()`** to prevent unnecessary re-renders from parent state changes.

---

_Generated: February 23, 2026_
