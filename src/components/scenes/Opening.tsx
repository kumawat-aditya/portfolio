"use client";

import { HandMark, MarginNote, Readout, Rule } from "@/components/primitives/marks";
import { PlumbBob } from "@/components/objects/PlumbBob";
import { useJaipur } from "@/lib/clock";
import { gsap, useSceneTimeline } from "@/lib/motion";
import { person } from "@/content/site";

/* ============================================================================
   01 — ARRIVAL                                                        [quiet]
   ----------------------------------------------------------------------------
   Almost nothing happens. A masthead, a greeting built like a staircase, a
   weight hanging into the frame, and one line that knows what time it is in
   Jaipur.

   On scroll the greeting comes apart laterally instead of fading upward: the
   two halves leave in opposite directions, which reads as the room opening
   rather than as a section transition.
   ========================================================================= */

export function Opening() {
  const jaipur = useJaipur();

  const scope = useSceneTimeline(({ scope: section, reduced }) => {
    if (reduced) return;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      })
      .to("[data-greet='hi']", { xPercent: -22, yPercent: -18 }, 0)
      .to("[data-greet='im']", { xPercent: 10, yPercent: -8 }, 0)
      .to("[data-greet='name']", { xPercent: 16, yPercent: 6 }, 0)
      .to("[data-opening-aside]", { yPercent: -60, opacity: 0 }, 0)
      .to("[data-opening-hint]", { opacity: 0, duration: 0.25 }, 0);
  });

  return (
    <section
      ref={scope}
      data-opening
      aria-label="Arrival"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-clip px-[6vw] pt-6 pb-24 sm:pt-8"
    >
      {/* ---- masthead: the facts, delivered like a specimen sheet header --- */}
      <header className="relative z-20">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <Readout tone="ink" className="font-semibold">
            {person.name}
          </Readout>
          <Readout className="hidden md:block">{person.role}</Readout>
          <Readout>{person.location}</Readout>
        </div>
        <Rule className="mt-2" />
        <Readout className="mt-2 block md:hidden">{person.role}</Readout>
      </header>

      {/* ---- the measurement rail ----------------------------------------
           The right column is one vertical instrument: local time, an aside,
           then a plumb line hanging off it with a live angle. It gives the
           empty side of the composition a reason to be empty. */}
      <div className="pointer-events-none absolute top-[13vh] right-[6vw] z-20 hidden w-[15rem] md:block lg:w-[17rem]">
        <div
          data-opening-aside
          className="transition-opacity duration-1000 ease-out"
          style={{ opacity: jaipur ? 1 : 0 }}
        >
          <Readout tone="ink" className="block tabular-nums">
            {jaipur ? `${jaipur.time} in ${person.location}` : "\u00a0"}
          </Readout>
          <p className="voice-prose mt-1.5 max-w-[24ch] text-ink-soft">
            {jaipur?.aside ?? "\u00a0"}
          </p>
        </div>

        <div className="relative mt-[7vh]">
          <Readout className="block">plumb</Readout>
          <PlumbBob className="top-7 left-0" />
        </div>
      </div>

      {/* ---- the greeting ------------------------------------------------- */}
      <div className="relative z-10 flex flex-1 select-none flex-col justify-center">
        <h1 className="voice-display text-ink">
          <span
            data-greet="hi"
            className="block text-giant will-change-transform"
          >
            Hi,
          </span>
          <span
            data-greet="im"
            className="ml-[8vw] block text-giant will-change-transform"
          >
            I&rsquo;m
          </span>
          <span
            data-greet="name"
            className="-ml-[1.5vw] block text-mega will-change-transform"
          >
            Aditya.
          </span>
        </h1>

        {/* on narrow screens the rail collapses back under the greeting */}
        <div
          data-opening-aside
          className="mt-[5vh] max-w-[34ch] transition-opacity duration-1000 ease-out md:hidden"
          style={{ opacity: jaipur ? 1 : 0 }}
        >
          <Readout tone="ink" className="block tabular-nums">
            {jaipur ? `${jaipur.time} in ${person.location}` : "\u00a0"}
          </Readout>
          <p className="voice-prose mt-1.5 text-ink-soft">
            {jaipur?.aside ?? "\u00a0"}
          </p>
        </div>
      </div>

      {/* ---- the only instruction on the page ----------------------------- */}
      <footer
        data-opening-hint
        className="relative z-10 flex items-end justify-between gap-6"
      >
        <div className="flex items-end gap-3">
          <HandMark
            kind="arrow-down-right"
            width={30}
            className="mb-1 text-vermillion opacity-70"
          />
          <MarginNote lean={-1.6}>it&rsquo;s quiet for a while.</MarginNote>
        </div>
        <Readout className="hidden shrink-0 pb-1 sm:block">
          this page: 1 heartbeat, 0 trackers
        </Readout>
      </footer>
    </section>
  );
}
