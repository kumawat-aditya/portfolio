"use client";

import { useState } from "react";
import {
  HandMark,
  MarginNote,
  Readout,
  Rule,
  SceneTag,
} from "@/components/primitives/marks";
import { SpecimenDrawer } from "@/components/work/SpecimenDrawer";
import { featuredProjects, projects, shelfProjects } from "@/content/site";
import type { Project } from "@/content/site";
import { gsap, useSceneTimeline } from "@/lib/motion";

/* ============================================================================
   05 — THE WALL                                                       [dense]
   ----------------------------------------------------------------------------
   Work, discovered rather than listed. No cards, no grid of equal rectangles,
   no tech-logo wall, no "View Project" buttons.

   Each piece is an instrument label: a name, one honest line about the part
   that was hard, and the single number that defines the system. The numbers
   are doing the persuading — "~43 quintillion states, under 2s, 0
   dependencies" needs no adjectives.

   Every specimen is deliberately a different size and sits on a different part
   of the grid, so the eye has an order to follow instead of a list to scan.
   ========================================================================= */

/** explicit, hand-set placement — the variation is the composition */
const PLACEMENT = [
  {
    cell: "md:col-start-1 md:col-span-7 md:row-start-1",
    title: "text-loud",
    lean: 0,
    offset: "",
  },
  {
    cell: "md:col-start-9 md:col-span-4 md:row-start-1",
    title: "text-say",
    lean: -1.3,
    offset: "md:mt-[26vh]",
  },
  {
    cell: "md:col-start-2 md:col-span-7 md:row-start-2",
    title: "text-loud",
    lean: 0.5,
    offset: "md:-mt-[6vh]",
  },
  {
    cell: "md:col-start-9 md:col-span-4 md:row-start-2",
    title: "text-say",
    lean: 1.6,
    offset: "md:mt-[16vh]",
  },
  {
    cell: "md:col-start-1 md:col-span-11 md:row-start-3",
    title: "text-giant",
    lean: 0,
    offset: "md:mt-[6vh]",
  },
] as const;

/**
 * The system's own stages, drawn as a hairline chain. No boxes: boxed labels
 * become badges, and a wall of identical pills is exactly what this page is
 * trying not to be. Just words with wires between them.
 */
function Chain({ steps }: { steps: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-y-1.5">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center">
          {i > 0 ? (
            <span
              aria-hidden="true"
              className="mx-2 h-px w-5 bg-rule sm:mx-2.5 sm:w-7"
            />
          ) : null}
          <span className="voice-readout text-ink-faint">{step}</span>
        </span>
      ))}
    </div>
  );
}

function Specimen({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const place = PLACEMENT[index];

  return (
    <article
      data-specimen
      className={`group relative ${place.cell} ${place.offset} mt-[12vh] first:mt-0 md:mt-0`}
      style={{ transform: `rotate(${place.lean}deg)` }}
    >
      <div className="transition-transform duration-500 ease-[var(--ease-instrument)] group-hover:-translate-y-1.5">
        <div className="flex items-baseline gap-3">
          <Readout>spec. {String(index + 1).padStart(2, "0")}</Readout>
          <Rule className="w-10 translate-y-[-0.25em] shrink-0" ticks={false} />
        </div>

        <h3
          className={`voice-display ${place.title} mt-2 text-ink transition-colors duration-500 group-hover:text-vermillion-ink`}
        >
          {project.name}
        </h3>

        <p className="voice-prose mt-4 max-w-[34ch] text-ink-soft">
          {project.honest}
        </p>

        {project.chain ? <Chain steps={project.chain} /> : null}

        <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <Readout tone="ink" className="tabular-nums">
            {project.readout}
          </Readout>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="voice-machine mt-5 inline-flex items-baseline gap-2 text-ink-faint underline decoration-rule decoration-1 underline-offset-[6px] transition-colors after:absolute after:inset-0 after:content-[''] hover:text-vermillion-ink hover:decoration-vermillion"
        >
          open it
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-[var(--ease-instrument)] group-hover:translate-x-1"
          >
            →
          </span>
          <span className="sr-only">— {project.name}</span>
        </button>
      </div>
    </article>
  );
}

export function WorkWall() {
  const [open, setOpen] = useState<number | null>(null);

  const scope = useSceneTimeline(({ scope: section, reduced }) => {
    if (reduced) return;

    // the wall assembles as you arrive at it: each specimen settles from a
    // slightly different direction, because nothing on a real wall is hung
    // by a machine
    gsap.utils.toArray<HTMLElement>("[data-specimen]").forEach((element, i) => {
      const fromX = i % 2 === 0 ? -18 : 22;
      gsap.from(element, {
        opacity: 0,
        x: fromX,
        y: 26,
        rotate: (i % 2 === 0 ? 1 : -1) * 2.4,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%" },
      });
    });

    // the shelf rows below arrive as a run, like a printer feeding paper
    gsap.from("[data-shelf-row]", {
      opacity: 0,
      x: -14,
      duration: 0.6,
      stagger: 0.07,
      ease: "power2.out",
      scrollTrigger: { trigger: "[data-shelf]", start: "top 85%" },
    });

    void section;
  });

  return (
    <section
      ref={scope}
      id="work"
      aria-label="Selected work"
      className="relative px-[6vw] pt-[12vh] pb-[16vh]"
    >
      {/* the wall itself */}
      <div
        aria-hidden="true"
        className="field-grid pointer-events-none absolute inset-0 opacity-70"
      />

      <header className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <SceneTag index="05">things I kept</SceneTag>
          <h2 className="voice-display text-loud mt-4 max-w-[18ch] text-ink">
            {projects.length} systems.
            <br />
            {featuredProjects.length} worth stopping at.
          </h2>
        </div>
        <MarginNote lean={1.4} className="max-w-[24ch] pb-2">
          the numbers are the interesting part.
        </MarginNote>
      </header>

      <Rule className="relative mt-8 mb-[10vh]" />

      {/* ---- the five ---------------------------------------------------- */}
      <div className="relative grid md:grid-cols-12 md:gap-x-[3vw]">
        {featuredProjects.map((project, index) => (
          <Specimen
            key={project.slug}
            project={project}
            index={index}
            onOpen={() => setOpen(index)}
          />
        ))}
      </div>

      {/* ---- and the rest of the shelf ----------------------------------- */}
      <div data-shelf className="relative mt-[18vh]">
        <div className="flex items-end gap-1">
          <Readout>the rest of the shelf</Readout>
          <HandMark
            kind="arrow-down-right"
            width={26}
            className="-mb-2 shrink-0 text-vermillion opacity-65"
          />
        </div>

        {/* the shelf sits on its own sheet, so its hairlines read as rows
            rather than competing with the graph paper behind the wall */}
        <ul className="relative mt-5 bg-paper-raised/70">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -left-[6vw] -right-[6vw] -z-10 bg-paper-raised/70"
          />
          {shelfProjects.map((project, i) => {
            const index = featuredProjects.length + i;
            return (
              <li key={project.slug} data-shelf-row>
                <Rule ticks={false} />
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  className="group flex w-full flex-col items-start gap-1 py-4 text-left transition-colors hover:bg-paper-raised/70 md:flex-row md:items-baseline md:gap-6 md:py-3.5"
                >
                  <Readout className="w-14 shrink-0 pt-1 md:pt-0">
                    spec. {String(index + 1).padStart(2, "0")}
                  </Readout>
                  <span className="voice-display w-full max-w-none text-[clamp(1.15rem,2.2vw,1.7rem)] leading-none text-ink transition-colors group-hover:text-vermillion-ink md:w-[13em] md:shrink-0">
                    {project.name}
                  </span>
                  <Readout tone="ink" className="tabular-nums md:flex-1">
                    {project.readout}
                  </Readout>
                  <span
                    aria-hidden="true"
                    className="voice-machine hidden shrink-0 text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:block"
                  >
                    open it →
                  </span>
                </button>
              </li>
            );
          })}
          <Rule ticks={false} />
        </ul>
      </div>

      <SpecimenDrawer
        project={open === null ? null : projects[open]}
        index={open ?? 0}
        total={projects.length}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
