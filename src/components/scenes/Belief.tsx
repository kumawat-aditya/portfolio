"use client";

import {
  HandMark,
  MarginNote,
  Readout,
  SceneTag,
} from "@/components/primitives/marks";
import { gsap, useSceneTimeline } from "@/lib/motion";
import { belief } from "@/content/site";

/* ============================================================================
   02 — A CORRECTION                                                 [curious]
   ----------------------------------------------------------------------------
   The page holds still and corrects itself in front of you.

   The sentence starts naive, gets struck through, and someone writes the real
   answer above it in pen. It's an editor's mark, not an animation preset — and
   it's the actual thing content.json says he learned in 2024:
   "systems fail not because of code, but because of improper state and
   boundary structures."

   This is the one scene that pins. Holding the viewport still is what makes it
   feel like a thought rather than a slide.
   ========================================================================= */

export function Belief() {
  const scope = useSceneTimeline(({ scope: section }) => {
    const media = gsap.matchMedia(section);

    // reduced motion: land on the corrected state and never move
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-strike] path", { strokeDashoffset: 0 });
      gsap.set(
        ["[data-insertion]", "[data-caret]", "[data-stamp]", "[data-evidence]"],
        { opacity: 1, y: 0 },
      );
      gsap.set("[data-wrong]", { opacity: 0.4 });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const build = (pin: boolean) =>
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: pin ? "top top" : "top 80%",
              // unpinned, the section is travelling while the correction is
              // being made, so the whole sequence has to finish well before the
              // section leaves — otherwise the last beat lands off-screen and
              // nobody on a phone ever sees the evidence
              end: pin ? "+=155%" : "bottom 90%",
              pin,
              scrub: 0.7,
              anticipatePin: pin ? 1 : 0,
            },
          })
          // the pen goes through it
          .to("[data-strike] path", { strokeDashoffset: 0, duration: 1.1 })
          .to("[data-wrong]", { opacity: 0.4, duration: 0.8 }, 0.3)
          // a caret, because something is missing
          .to("[data-caret]", { opacity: 1, duration: 0.35 }, 0.9)
          // and the real answer, written in
          .fromTo(
            "[data-insertion]",
            { opacity: 0, y: 14, rotate: -4.5 },
            { opacity: 1, y: 0, rotate: -2.2, duration: 1 },
            1.1,
          )
          .to("[data-stamp]", { opacity: 1, duration: 0.5 }, 1.9)
          .fromTo(
            "[data-evidence]",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.9 },
            2.3,
          );

      const desktop = window.matchMedia("(min-width: 768px)");
      const timeline = build(desktop.matches);
      return () => timeline.scrollTrigger?.kill();
    });

    return () => media.revert();
  });

  return (
    <section
      ref={scope}
      data-belief
      aria-label="A correction"
      className="relative flex min-h-[100svh] flex-col justify-center px-[6vw] py-[14vh]"
    >
      <SceneTag index="02" className="absolute top-[8vh] left-[6vw]">
        a correction
      </SceneTag>

      <div className="relative">
        {/* max-width lives on the heading, where `ch` resolves against the
            display face rather than against the mono body text */}
        <h2 className="voice-display text-loud max-w-[13ch] text-ink sm:max-w-none">
          Systems fail because
          <br className="hidden sm:block" />{" "}
          <span className="whitespace-nowrap">
            <span className="relative inline-block">
              <span data-wrong className="text-ink">
                bad code
              </span>
              {/* the strike, drawn on scroll */}
              <svg
                data-strike
                aria-hidden="true"
                viewBox="0 0 200 18"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-[-3%] top-[44%] h-[0.5em] w-[106%] overflow-visible text-vermillion"
              >
                <path
                  d="M1 11C36 5 92 14 150 6c17-2 34-3 48-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="230"
                  strokeDashoffset="230"
                />
              </svg>
              {/* caret: something belongs here */}
              <svg
                data-caret
                aria-hidden="true"
                viewBox="0 0 24 14"
                className="absolute -bottom-[0.3em] left-[42%] w-[0.4em] text-vermillion opacity-0"
              >
                <path
                  d="M2 13 11.6 2 22 12.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
            .
          </span>
        </h2>

        <div data-stamp className="mt-10 opacity-0">
          <Readout>
            corrected · early 2024 · has not needed correcting since
          </Readout>
        </div>

        {/* the insertion: written out in the margin with an arrow back to the
            words it replaces, the way you'd actually annotate a page */}
        <div
          data-insertion
          className="pointer-events-none mt-10 flex origin-top-left items-start gap-2 opacity-0 md:absolute md:top-[-1.5em] md:right-0 md:mt-0 md:w-[15rem] md:flex-col-reverse md:items-start lg:w-[18rem]"
        >
          <HandMark
            kind="arrow-down-left"
            width={46}
            className="mt-1 shrink-0 text-vermillion opacity-80 md:mt-0 md:ml-6"
          />
          <span className="voice-margin block text-[clamp(1.15rem,2.3vw,1.9rem)] leading-[1.1]">
            the boundaries
            <br />
            between them
          </span>
        </div>
      </div>

      {/* secondary discovery: he didn't decide this, a system taught him.
          Arrives last, so it rewards staying with the scene. */}
      <figure
        data-evidence
        className="mt-[9vh] flex max-w-[52ch] gap-4 opacity-0 md:mt-[12vh]"
      >
        <HandMark
          kind="bracket"
          width={12}
          className="shrink-0 self-stretch text-rule"
        />
        <div>
          <blockquote className="voice-prose text-ink-soft">
            &ldquo;{belief.evidence.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-2.5">
            <Readout>
              what {belief.evidence.from.toLowerCase()} taught him
            </Readout>
          </figcaption>
        </div>
      </figure>

      {/* tertiary: the honest bit, small, far away from everything else */}
      <MarginNote
        lean={1.8}
        className="mt-[12vh] block max-w-[26ch] self-end text-right md:absolute md:right-[6vw] md:bottom-[11vh] md:mt-0"
      >
        I still write the bug first.
        <br />I just find it faster now.
      </MarginNote>
    </section>
  );
}
