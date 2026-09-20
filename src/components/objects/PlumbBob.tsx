"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useRoomTheme } from "@/components/chrome/ThemeRoot";

/* ============================================================================
   PLUMB BOB
   ----------------------------------------------------------------------------
   A machined weight hanging into the opening scene on a thread, against a
   dotted line marking true vertical, with a live angle readout beside it.

   It is a real damped pendulum: scrolling gives it angular impulse, the cursor
   shoulders it aside, friction settles it.

   Pulling it — like a wall-fan cord — changes the room. Five pulls open the
   drawer of every palette the site already has.
   ========================================================================= */

const GRAVITY = 0.0015;
const FRICTION = 0.9885;
const MAX_SPEED = 0.05;
const CURSOR_RADIUS = 190;
const PULL_EXTRA = 56;
const SNAP_IMPULSE = 0.034;

export function PlumbBob({ className = "" }: { className?: string }) {
  const { pull } = useRoomTheme();
  const armRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef<HTMLSpanElement>(null);
  const stretchRef = useRef(0);
  const heldRef = useRef(false);
  const pullFn = useRef(pull);
  pullFn.current = pull;

  const [length, setLength] = useState(300);
  const [stretch, setStretch] = useState(0);
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    const measure = () => {
      const fit =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--fit"),
        ) || 1;
      setLength(
        Math.round(
          Math.max(190 * fit, Math.min(400 * fit, window.innerHeight * 0.4)),
        ),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    stretchRef.current = stretch;
  }, [stretch]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const arm = armRef.current;
    const pivot = pivotRef.current;
    if (!arm || !pivot) return;

    let angle = 0.05;
    let velocity = 0;
    let frame = 0;
    let lastScroll = window.scrollY;
    let pivotX = 0;
    let pivotY = 0;
    let cursorX = -9999;
    let cursorY = -9999;
    let touched = false;
    let shown = "";

    const measure = () => {
      const box = pivot.getBoundingClientRect();
      pivotX = box.left + box.width / 2;
      pivotY = box.top;
    };

    const impulse = (amount: number) => {
      velocity = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velocity + amount));
      if (!touched && Math.abs(velocity) > 0.011) {
        touched = true;
        setNudged(true);
      }
    };

    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      measure();
      impulse(delta * 0.00026);
    };

    const onPointer = (event: PointerEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
    };

    const tick = () => {
      velocity += -GRAVITY * angle;

      const liveLength = length + stretchRef.current;
      const bobX = pivotX + Math.sin(angle) * liveLength;
      const bobY = pivotY + Math.cos(angle) * liveLength;
      const dx = bobX - cursorX;
      const dy = bobY - cursorY;
      const distance = Math.hypot(dx, dy);
      if (distance < CURSOR_RADIUS) {
        const push = (1 - distance / CURSOR_RADIUS) ** 2 * 0.005;
        impulse(Math.sign(dx || 1) * push);
      }

      velocity *= FRICTION;
      angle += velocity;

      const degrees = (angle * 180) / Math.PI;
      arm.style.transform = `rotate(${degrees}deg)`;

      const next = `${degrees < -0.005 ? "\u2212" : degrees > 0.005 ? "+" : "\u00b1"}${Math.abs(degrees).toFixed(2)}\u00b0`;
      if (next !== shown && angleRef.current) {
        angleRef.current.textContent = next;
        shown = next;
      }

      frame = requestAnimationFrame(tick);
    };

    measure();
    frame = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });

    const snap = () => impulse(SNAP_IMPULSE);
    window.addEventListener("plumb-snap", snap);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("plumb-snap", snap);
    };
  }, [length]);

  const release = () => {
    if (!heldRef.current) return;
    heldRef.current = false;
    setStretch(0);
    window.dispatchEvent(new Event("plumb-snap"));
    pullFn.current();
  };

  const reduced = prefersReducedMotion();

  return (
    <div
      ref={pivotRef}
      className={`absolute top-0 left-0 w-0 ${className}`}
    >
      {/* true vertical, for the weight to disagree with */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 w-px -translate-x-1/2"
        style={{
          height: length + 74,
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--color-rule) 0 3px, transparent 3px 9px)",
          opacity: 0.55,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-4 flex items-baseline gap-2 whitespace-nowrap transition-[opacity,top] duration-500"
        style={{
          top: length + stretch + 34,
          opacity: nudged ? 1 : 0.8,
        }}
      >
        <span
          ref={angleRef}
          className="voice-readout tabular-nums text-ink-faint"
        >
          &plusmn;0.00&deg;
        </span>
        <span
          className="voice-margin block transition-opacity duration-700"
          style={{ opacity: nudged ? 0.95 : 0 }}
        >
          not load-bearing.
        </span>
      </div>

      <div
        ref={armRef}
        className="pointer-events-none absolute top-0 left-1/2 flex w-0 -translate-x-1/2 origin-top flex-col items-center will-change-transform"
        style={{ transform: "rotate(2.9deg)" }}
      >
        <div
          ref={threadRef}
          className="w-px bg-graphite/70"
          style={{
            height: length + stretch,
            transition: stretch
              ? "height 180ms var(--ease-resist)"
              : "height 520ms var(--ease-arrive)",
          }}
        />
        <button
          type="button"
          aria-label="Pull the plumb to change the room"
          data-cursor-target="pointer"
          className="pointer-events-auto relative z-10 -mt-px -mx-3 block cursor-pointer touch-none border-0 bg-transparent p-3 text-ink"
          onPointerDown={(event) => {
            event.preventDefault();
            heldRef.current = true;
            setStretch(reduced ? 0 : PULL_EXTRA);
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              /* synthetic events have no capture */
            }
          }}
          onPointerUp={() => release()}
          onPointerCancel={() => release()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (heldRef.current) return;
              heldRef.current = true;
              if (!reduced) setStretch(PULL_EXTRA);
              window.setTimeout(release, reduced ? 0 : 160);
            }
          }}
        >
          <svg
            viewBox="0 0 24 66"
            width="30"
            className="block shrink-0"
            aria-hidden="true"
          >
            <path d="M9.2 0h5.6v4.8H9.2z" fill="currentColor" />
            <path
              d="M12 4.4c7.1 5.5 9.3 14.8 0 34.6C2.7 19.2 4.9 9.9 12 4.4Z"
              fill="currentColor"
            />
            <path d="M12 38.8v25" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M9.5 9.6c-1.6 4.1-1.5 9.6.5 15.7"
              stroke="var(--color-paper-raised)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
