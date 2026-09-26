"use client";

import { useLayoutEffect } from "react";
import { CornerCallout, Readout, seatOnInstrument } from "@/components/primitives/marks";
import { gsap, ScrollTrigger, useSceneTimeline } from "@/lib/motion";

/* ============================================================================
   04 — NOTHING HAPPENS HERE                                           [quiet]
   ----------------------------------------------------------------------------
   The valve after the loudest scene. No 3D, no second system. One short pin.

   The corner note is already seated on the instrument — the arrow lands on
   the thing that has been counting since the top of the page — and the first
   part of the scroll holds it there. While it holds, the thesis rises through
   the quiet and settles. Then the pin lets go and both leave upward, into
   the wall.

   Reduced motion gets the same picture with no travel: the sentence is
   already seated, the note already on the counter.
   ========================================================================= */

export function Breath() {
  const scope = useSceneTimeline(({ scope: section }) => {

    const media = gsap.matchMedia(section);

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-thesis]", { y: 0 });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      // waiting in the quiet, below the seat it will rise to
      gsap.set("[data-thesis]", { y: "26vh" });

      const timeline = gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        // a hold, so the corner is the first thing the scroll does
        .to("[data-thesis]", { y: 0, duration: 1 }, 0.42)
        // a reading beat; release is the pin ending
        .to({}, { duration: 0.62 }, 1.42);

      return () => timeline.scrollTrigger?.kill();
    });

    return () => {
      media.revert();
    };
  });

  useLayoutEffect(() => {
    const section = scope.current;
    const anchor = section?.querySelector<HTMLElement>("[data-corner-callout]");
    if (!section || !anchor) return;

    let alive = true;
    const place = () => {
      if (alive) seatOnInstrument(section, anchor);
    };
    place();
    window.addEventListener("resize", place);
    ScrollTrigger.addEventListener("refresh", place);
    document.fonts?.ready.then(place);

    return () => {
      alive = false;
      window.removeEventListener("resize", place);
      ScrollTrigger.removeEventListener("refresh", place);
    };
  }, [scope]);

  return (
    <section
      ref={scope}
      data-breath
      aria-label="A quiet moment"
      className="relative h-[100dvh]"
    >
      <div
        data-thesis
        className="absolute top-[12svh] right-[calc(6*var(--vw))] left-[max(3.25rem,calc(7*var(--vw)))]"
      >
        <p className="voice-display text-loud max-w-[11em] text-ink">
          Most of what I&rsquo;ve built
          <br />
          is doing that right now.
        </p>
        <Readout className="mt-6 block">
          without me · without a dashboard · without asking
        </Readout>
      </div>

      <CornerCallout>that corner isn&rsquo;t decoration.</CornerCallout>
    </section>
  );
}
