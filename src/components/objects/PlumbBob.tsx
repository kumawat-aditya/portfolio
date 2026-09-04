"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/* ============================================================================
   PLUMB BOB
   ----------------------------------------------------------------------------
   A machined weight hanging into the opening scene on a thread, against a
   dotted line marking true vertical, with a live angle readout beside it.

   It is a real damped pendulum: scrolling gives it angular impulse, the cursor
   shoulders it aside, friction settles it. Nothing on the page depends on it.

   It earns its place three times over: it is an instrument for checking
   whether things are straight, which is the entire personality of the person
   whose site this is; it is the first proof that the page will react to you;
   and the readout turns idle fiddling into information, which is the reward
   for being curious about it.
   ========================================================================= */

const GRAVITY = 0.0015; // restoring force toward vertical
const FRICTION = 0.9885; // it settles, but it takes its time
const MAX_SPEED = 0.05;
const CURSOR_RADIUS = 190;

export function PlumbBob({ className = "" }: { className?: string }) {
  const armRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef<HTMLSpanElement>(null);
  const [length, setLength] = useState(300);
  const [nudged, setNudged] = useState(false);

  /* the thread is as long as the room allows */
  useEffect(() => {
    const measure = () =>
      setLength(Math.round(Math.max(190, Math.min(400, window.innerHeight * 0.4))));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const arm = armRef.current;
    const pivot = pivotRef.current;
    if (!arm || !pivot) return;

    let angle = 0.05; // it does not start level
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
      velocity = Math.max(
        -MAX_SPEED,
        Math.min(MAX_SPEED, velocity + amount),
      );
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

      // the cursor shoulders it out of the way
      const bobX = pivotX + Math.sin(angle) * length;
      const bobY = pivotY + Math.cos(angle) * length;
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

      // the readout only writes when the displayed value actually changes
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

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [length]);

  return (
    <div
      ref={pivotRef}
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 w-0 ${className}`}
    >
      {/* true vertical, for the weight to disagree with */}
      <div
        className="absolute top-0 left-0 w-px"
        style={{
          height: length + 74,
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--color-rule) 0 3px, transparent 3px 9px)",
          opacity: 0.55,
        }}
      />

      {/* the reading, held level while everything else swings */}
      <div
        className="absolute left-4 flex items-baseline gap-2 whitespace-nowrap transition-opacity duration-1000"
        style={{ top: length + 34, opacity: nudged ? 1 : 0.8 }}
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
        className="origin-top will-change-transform"
        style={{ transform: "rotate(2.9deg)" }}
      >
        <div className="mx-auto w-px bg-graphite/70" style={{ height: length }} />
        <svg
          viewBox="0 0 24 66"
          width="30"
          className="mx-auto -mt-px block text-ink"
        >
          <path d="M9.2 0h5.6v4.8H9.2z" fill="currentColor" />
          <path
            d="M12 4.4c7.1 5.5 9.3 14.8 0 34.6C2.7 19.2 4.9 9.9 12 4.4Z"
            fill="currentColor"
          />
          <path d="M12 38.8v25" stroke="currentColor" strokeWidth="1.2" />
          {/* one machined highlight, so it reads as metal and not a blob */}
          <path
            d="M9.5 9.6c-1.6 4.1-1.5 9.6.5 15.7"
            stroke="var(--color-paper-raised)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
