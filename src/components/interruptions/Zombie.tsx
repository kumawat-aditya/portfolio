"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";

/* ============================================================================
   AN INTERRUPTION
   ----------------------------------------------------------------------------
   Once per visit, a stray position from a session that already ended wanders
   in from the edge of the screen, has a look around, and gets cleaned up by
   something you can't see.

   This is an inside joke from content.json rather than a mascot: "orphaned or
   zombie positions" that persist from previous sessions, detected by UUID
   session tags and swept away. It fires exactly once, so it reads as an event
   rather than as decoration.
   ========================================================================= */

export function Zombie() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (fired || prefersReducedMotion()) return;
    const element = sentinel.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFired(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-30% 0px -30% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fired]);

  useEffect(() => {
    if (!fired || !scope.current) return;
    let cancelled = false;

    const run = async () => {
      const glide = { duration: 1.8, ease: [0.16, 1, 0.3, 1] } as const;

      // arrives from off-screen, slightly too fast, then overshoots to a stop
      await animate("[data-orphan]", { x: -300, opacity: 1 }, glide);
      if (cancelled) return;

      // has a look around
      await animate(
        "[data-orphan]",
        { rotate: [0, -7, 6, -2, 0], x: -336, y: -26 },
        { duration: 2.1, ease: "easeInOut" },
      );
      if (cancelled) return;

      await animate("[data-orphan-tag]", { opacity: 1 }, { duration: 0.4 });
      if (cancelled) return;

      // something notices
      await animate(
        "[data-sweep]",
        { opacity: [0, 1, 1, 0], x: [-30, 190] },
        { duration: 0.75, ease: "easeIn" },
      );
      if (cancelled) return;

      animate(
        "[data-orphan]",
        { opacity: 0, scaleX: 0.7, filter: "blur(1px)" },
        { duration: 0.22 },
      );
      await animate("[data-verdict]", { opacity: 1 }, { duration: 0.35 });
      if (cancelled) return;

      await animate(
        "[data-verdict]",
        { opacity: 0 },
        { duration: 0.9, delay: 2.6 },
      );
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [fired, animate, scope]);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-0" />

      <div
        ref={scope}
        aria-hidden="true"
        className="pointer-events-none fixed top-[58svh] right-0 z-[80] select-none"
      >
        <div className="relative">
          <div data-orphan className="translate-x-full opacity-0">
            <div className="relative border border-dashed border-vermillion/70 bg-paper/80 px-2.5 py-1.5">
              <span className="voice-readout block text-vermillion-ink">
                pos · a3f9d1
              </span>
              {/* the sweep that ends it */}
              <span
                data-sweep
                className="absolute inset-y-[-6px] left-0 w-px bg-vermillion opacity-0"
              />
            </div>
            <span
              data-orphan-tag
              className="voice-margin mt-1 block whitespace-nowrap opacity-0"
            >
              from yesterday&rsquo;s session
            </span>
          </div>

          <span
            data-verdict
            className="voice-readout absolute top-0 right-[3vw] w-max whitespace-nowrap text-ink-faint opacity-0"
          >
            watchdog · 1 orphan cleared
          </span>
        </div>
      </div>
    </>
  );
}
