"use client";

import {
  HandMark,
  MarginNote,
  Readout,
  SceneTag,
} from "@/components/primitives/marks";
import { gsap, useSceneTimeline } from "@/lib/motion";
import { belief } from "@/content/site";

const evidenceWords = belief.evidence.quote.split(/\s+/);

/* ============================================================================
   02 — A CORRECTION                                                 [curious]
   ----------------------------------------------------------------------------
   The page holds still and corrects itself in front of you.

   The sentence starts naive. A pen crosses the wrong ending, keeps going, and
   the real answer is written at the end of that line — one gesture, not a
   loop back to the mistake. Then a system he built is quoted as proof, word
   by word, and only after that does the honest aside arrive.

   Holding the viewport still is what makes it feel like a thought rather than
   a slide.
   ========================================================================= */

export function Belief() {
  const scope = useSceneTimeline(({ scope: section }) => {
    const media = gsap.matchMedia(section);

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-strike] path", { strokeDashoffset: 0, opacity: 1 });
      gsap.set(
        ["[data-insertion]", "[data-stamp]", "[data-evidence]", "[data-aside]"],
        { opacity: 1, y: 0, rotate: 0 },
      );
      gsap.set("[data-wrong]", { opacity: 0.4 });
      gsap.set("[data-evidence-word]", { opacity: 1 });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const build = (pin: boolean) =>
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: pin ? "top top" : "top 80%",
              end: pin ? "+=250%" : "bottom 90%",
              pin,
              scrub: 0.7,
              anticipatePin: pin ? 1 : 0,
            },
          })
          // pen crosses the wrong ending, then a short continuation of that
          // same wave, then the head is drawn from where the line stopped.
          // offsets are real path lengths — a unitless pathLength fights GSAP
          // and the stroke pops in instead of drawing
          .to("[data-strike-core]", { strokeDashoffset: 0, duration: 1.1 })
          .to("[data-wrong]", { opacity: 0.4, duration: 0.8 }, 0.3)
          .to("[data-strike-extend]", { strokeDashoffset: 0, duration: 0.52 }, 1.14)
          .to("[data-strike-arrow]", { opacity: 1, duration: 0.04 }, 1.7)
          .to("[data-strike-arrow]", { strokeDashoffset: 0, duration: 0.26 }, 1.7)
          .fromTo(
            "[data-insertion]",
            { opacity: 0, y: 14, rotate: -4.5 },
            { opacity: 1, y: 0, rotate: -2.2, duration: 0.75 },
            2.02,
          )
          .to("[data-stamp]", { opacity: 1, duration: 0.4 }, 3.35)
          .fromTo(
            "[data-evidence]",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55 },
            3.65,
          )
          // opacity only — the resting colour is the prose colour, not a
          // brighter ink the tween has to invent
          .fromTo(
            "[data-evidence-word]",
            { opacity: 0.34 },
            { opacity: 1, duration: 0.22, stagger: 0.065 },
            4.0,
          )
          .fromTo(
            "[data-aside]",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 },
            5.25,
          );

      // measure in user units so the dash matches the stroke GSAP scrubs
      section.querySelectorAll("[data-strike] path").forEach((node) => {
        const path = node as SVGGeometryElement;
        const length = path.getTotalLength();
        if (!length) return;
        // gap longer than the stroke, offset parked inside that gap,
        // so an endpoint cannot paint before the pen moves
        gsap.set(path, {
          strokeDasharray: `${length} ${length + 2}`,
          strokeDashoffset: length + 1,
        });
      });
      gsap.set("[data-strike-arrow]", { opacity: 0 });

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
      className="relative flex min-h-[calc(100*var(--vh))] flex-col justify-center px-[calc(6*var(--vw))] py-[calc(14*var(--vh))]"
    >
      <SceneTag index="02" className="absolute top-[calc(8*var(--vh))] left-[calc(6*var(--vw))]">
        a correction
      </SceneTag>

      <div className="relative">
        <h2 className="voice-display text-loud max-w-[13ch] text-ink sm:max-w-none">
          Systems fail because
          <br className="hidden sm:block" />{" "}
          <span className="relative mb-[4.75rem] block whitespace-nowrap md:mb-0 md:inline-block">
            <span className="relative inline-block">
              <span data-wrong className="text-ink">
                bad code
              </span>
              <svg
                data-strike
                aria-hidden="true"
                viewBox="0 0 200 18"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-[-3%] top-[44%] h-[0.5em] w-[106%] overflow-visible text-vermillion"
              >
                <path
                  data-strike-core
                  d="M1 11C36 5 92 14 150 6c17-2 34-3 48-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.14"
                  strokeLinecap="butt"
                  strokeDasharray="400"
                  strokeDashoffset="400"
                />
              </svg>
              {/* same viewBox height and the same x-scale as the strike, so
                  the wave that leaves "bad code" is the same pen, not a new one.
                  x=0 here is the strike's end point (198, 5). */}
              <svg
                data-strike
                aria-hidden="true"
                viewBox="-8 0 112 18"
                preserveAspectRatio="none"
                className="pointer-events-none absolute top-[44%] hidden h-[0.5em] overflow-visible text-vermillion md:block"
                style={{
                  left: "calc(106% * 190 / 200 - 3%)",
                  width: "calc(106% * 112 / 200)",
                }}
              >
                <path
                  data-strike-extend
                  d="M-5 4.29C24 8.43 48 13.2 90 7.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.14"
                  strokeLinecap="butt"
                  strokeDasharray="400"
                  strokeDashoffset="400"
                />
                <path
                  data-strike-arrow
                  d="M80.4 11.17 90 7.1 78.4 6.11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.14"
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  strokeDasharray="400"
                  strokeDashoffset="400"
                  opacity="0"
                />
              </svg>
              <span
                data-insertion
                className="pointer-events-none absolute top-full left-0 mt-5 origin-left opacity-0 md:top-[0.08em] md:left-[calc(149.64%+0.32em)] md:mt-0 md:w-max"
              >
                <span className="voice-margin block whitespace-nowrap text-[clamp(1.15rem,calc(2.3*var(--vw)),1.9rem)] leading-[1.15]">
                  the boundaries
                  <br />
                  between them
                </span>
              </span>
            </span>
            .
          </span>
        </h2>

        <div data-stamp className="mt-10 opacity-0">
          <Readout>
            corrected · early 2024 · has not needed correcting since
          </Readout>
        </div>
      </div>

      <figure
        data-evidence
        className="mt-[calc(9*var(--vh))] flex max-w-[52ch] gap-4 opacity-0 md:mt-[calc(12*var(--vh))]"
      >
        <HandMark
          kind="bracket"
          width={12}
          className="shrink-0 self-stretch text-rule"
        />
        <div>
          <blockquote className="voice-prose">
            <span data-evidence-word className="opacity-35">
              &ldquo;
            </span>
            {evidenceWords.map((word, i) => (
              <span key={`${word}-${i}`} data-evidence-word className="opacity-35">
                {word}
                {i < evidenceWords.length - 1 ? " " : ""}
              </span>
            ))}
            <span data-evidence-word className="opacity-35">
              &rdquo;
            </span>
          </blockquote>
          <figcaption className="mt-2.5">
            <Readout>
              what {belief.evidence.from.toLowerCase()} taught me
            </Readout>
          </figcaption>
        </div>
      </figure>

      <span
        data-aside
        className="mt-[calc(12*var(--vh))] block max-w-[26ch] self-end text-right opacity-0 md:absolute md:right-[calc(6*var(--vw))] md:bottom-[calc(11*var(--vh))] md:mt-0"
      >
        <MarginNote lean={1.8} className="block text-right">
          I still write the bug first.
          <br />I just find it faster now.
        </MarginNote>
      </span>
    </section>
  );
}
