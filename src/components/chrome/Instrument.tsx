"use client";

import { useEffect, useRef, useState } from "react";
import { useHeartbeat, getElapsedMs } from "@/lib/heartbeat";
import { useJaipurPrecise } from "@/lib/clock";

/* ============================================================================
   THE INSTRUMENT
   ----------------------------------------------------------------------------
   The one piece of persistent chrome. It sits in the bottom-left corner for
   the entire visit, quietly counting, and it never asks for anything.

   It exists because every system in content.json runs on a fixed loop while
   nobody watches it. This is that loop, made audible-ish. When the page goes
   completely still in the quiet scenes, this is the only thing still moving —
   which is the point.
   ========================================================================= */

const clock = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

/**
 * Every scene marker sits at its section's top-left, and this thing is pinned
 * to the bottom-left, so each one scrolls straight through it. Rather than move
 * either of them somewhere worse, the instrument notices and steps aside — it
 * is a small object being mildly inconvenienced, which is on brand.
 */
const useDodge = (ref: React.RefObject<HTMLElement | null>) => {
  const [dodging, setDodging] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const self = ref.current?.getBoundingClientRect();
      if (!self) return;

      const clash = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scene-tag]"),
      ).some((tag) => {
        const box = tag.getBoundingClientRect();
        if (box.width === 0) return false;
        return (
          box.left < self.right + 16 &&
          box.right > self.left - 16 &&
          box.top < self.bottom + 12 &&
          box.bottom > self.top - 12
        );
      });

      setDodging((was) => (was === clash ? was : clash));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return dodging;
};

export function Instrument() {
  const ticks = useHeartbeat();
  const jaipur = useJaipurPrecise();
  const ref = useRef<HTMLElement>(null);
  const dodging = useDodge(ref);

  return (
    <aside
      ref={ref}
      className={`instrument pointer-events-none fixed bottom-4 left-4 z-[100] flex select-none items-end gap-2.5 transition-[opacity,transform] duration-500 ease-instrument sm:bottom-6 sm:left-6 ${
        dodging ? "translate-y-1 opacity-0" : "opacity-100"
      }`}
      aria-label="Site heartbeat"
    >
      {/* the beat. re-mounted every second, which restarts the keyframes */}
      <span
        key={ticks}
        data-pulse
        aria-hidden="true"
        className="mb-[0.3rem] block size-[5px] shrink-0 bg-live"
        style={{ animation: "beat 1s var(--ease-instrument) forwards" }}
      />

      <div className="voice-readout leading-[1.55] text-ink-faint">
        {/* screen readers get the summary once, not a per-second stream */}
        <span className="sr-only">
          This page runs a one second loop. It has completed {ticks} cycles since
          you arrived.
        </span>

        <div aria-hidden="true" className="hidden sm:block">
          loop 1s
        </div>
        <div aria-hidden="true" className="tabular-nums">
          <span className="sm:hidden">1s · </span>
          {clock(getElapsedMs())}
          <span className="text-rule"> · </span>
          {ticks}
          <span className="hidden sm:inline"> ticks</span>
        </div>
        <div aria-hidden="true" className="hidden tabular-nums sm:block">
          jaipur {jaipur ?? "--:--:--"}
        </div>
      </div>
    </aside>
  );
}
