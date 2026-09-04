"use client";

import { HandMark, MarginNote, Readout, Rule } from "@/components/primitives/marks";

/* ============================================================================
   04 — NOTHING HAPPENS HERE                                           [quiet]
   ----------------------------------------------------------------------------
   No animation, no 3D, one hairline and two sentences.

   It exists because the scene before it was the loudest thing on the page. If
   the maximalism never stops it stops being maximalism. This is the valve.

   It is also where the corner readout finally gets pointed at: after watching
   a system fail and fix itself, the fact that something has been counting in
   the corner the whole time stops being decoration.
   ========================================================================= */

export function Breath() {
  return (
    <section
      aria-label="A quiet moment"
      className="relative flex min-h-[82svh] flex-col justify-center px-[6vw]"
    >
      {/* a rule that starts at the edge of the page and stops in mid-air */}
      <Rule className="absolute top-1/2 left-0 w-[46%] md:w-[58%]" />

      <div className="mt-[6vh] max-w-[30ch] md:ml-[52%] md:max-w-[26ch]">
        <p className="voice-display text-say text-ink">
          Most of what I&rsquo;ve built is doing that right now.
        </p>
        <Readout className="mt-4 block">
          without me · without a dashboard · without asking
        </Readout>
      </div>

      {/* the payoff for the thing that has been counting since you arrived */}
      <div className="absolute bottom-[14vh] left-[6vw] flex items-end gap-1 md:bottom-[18vh]">
        <HandMark
          kind="arrow-down-left"
          width={34}
          className="mb-1 shrink-0 text-vermillion opacity-75"
        />
        <MarginNote lean={-2.6} className="max-w-[22ch] leading-tight">
          that corner isn&rsquo;t decoration.
        </MarginNote>
      </div>
    </section>
  );
}
