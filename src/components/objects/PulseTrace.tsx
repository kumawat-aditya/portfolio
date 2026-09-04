"use client";

import { useEffect, useRef, useState } from "react";
import { useHeartbeat } from "@/lib/heartbeat";

/* ============================================================================
   PULSE TRACE
   ----------------------------------------------------------------------------
   The rule that separates the closing headline from the way out is not a rule.
   It is a recording of this visit: one mark per second, oldest on the left,
   still writing while you read it.

   The corner instrument has been counting the whole way down the page. This is
   the tape it was printing. It makes the closing receipt something you can see
   rather than a number to take on trust, and it means the last thing on the
   page is the only thing that never stopped.
   ========================================================================= */

const STEP = 10;
const HEIGHT = 44;
const BASE = HEIGHT - 1;

/**
 * Deterministic per-second amplitude, so history never rewrites itself when the
 * window is resized. Cubed, because most seconds are uneventful and a recording
 * that is uniformly busy reads as decoration rather than data.
 */
const amplitudeAt = (tick: number) => {
  const noise = Math.sin(tick * 12.9898) * 43758.5453;
  const unit = noise - Math.floor(noise);
  return 4 + unit ** 3 * 25;
};

export function PulseTrace({ className = "" }: { className?: string }) {
  const ticks = useHeartbeat();
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    setWidth(element.clientWidth);

    return () => observer.disconnect();
  }, []);

  const span = Math.max(width, 1);
  const capacity = Math.max(8, Math.floor(span / STEP));
  const oldest = Math.max(0, ticks - capacity);
  const marks = ticks - oldest;

  // the tape is anchored at the right: the newest second is always at the end
  // of the line and the recording trails off to the left, so a two minute
  // visit and a ten second one both read as an instrument rather than a
  // half-finished bar chart
  const headX = span - 3;

  let path = "";
  for (let i = 0; i < marks; i += 1) {
    const x = headX - (marks - 1 - i) * STEP;
    const top = BASE - amplitudeAt(oldest + i);
    path += `M${x.toFixed(1)} ${BASE}V${top.toFixed(1)}`;
  }

  const headTop = marks > 0 ? BASE - amplitudeAt(ticks - 1) : BASE;

  return (
    <div ref={frame} className={`relative ${className}`}>
      <svg
        width="100%"
        height={HEIGHT}
        viewBox={`0 0 ${span} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block overflow-visible text-graphite"
        // the oldest end runs off the edge rather than stopping dead
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 120px, #000)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 120px, #000)",
        }}
      >
        <line
          x1="0"
          y1={BASE}
          x2={span}
          y2={BASE}
          stroke="var(--color-rule)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={path}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.55"
          fill="none"
        />

        {marks > 0 ? (
          <g className="text-vermillion">
            <path
              d={`M${headX} ${BASE}V${headTop.toFixed(1)}`}
              stroke="currentColor"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
            <circle
              key={ticks}
              cx={headX}
              cy={headTop}
              r="2"
              className="fill-vermillion"
              style={{ animation: "beat 1s var(--ease-instrument) forwards" }}
            />
          </g>
        ) : null}
      </svg>

      <p className="voice-readout mt-2 text-right text-ink-faint">
        <span className="sr-only">
          A recording of this visit, one mark per second.
        </span>
        <span aria-hidden="true">1 hz · this visit, so far</span>
      </p>
    </div>
  );
}
