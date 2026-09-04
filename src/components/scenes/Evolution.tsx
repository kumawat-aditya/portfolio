"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { MarginNote, Readout, SceneTag } from "@/components/primitives/marks";
import { currentRole, eras } from "@/content/site";
import { gsap, ScrollTrigger, useSceneTimeline } from "@/lib/motion";

/* ============================================================================
   06 — ONE LINE                                                     [curious]
   ----------------------------------------------------------------------------
   The whole arc in content.json, 2022 to now, drawn as a single stroke that
   starts as a scribble and gradually learns to be straight.

   The argument is made by the drawing, not the copy. Three vertical truths sit
   side by side: the years (a fixed ruler, never moves), the line (wanders, then
   settles), and the tech index (dead straight the whole way down). The prose
   is dragged sideways by the line while the line is still nervous, so the
   layout itself is what stops wobbling.

   Geometry is measured from the real DOM rows rather than assumed, because the
   line is only convincing while it lines up with the years it is describing.
   ========================================================================= */

type Geometry = {
  width: number;
  height: number;
  spineX: number;
  d: string;
  /** on-curve points, monotonic in y — used to sit the pen on the line */
  samples: [number, number][];
  /** how far each era's prose had to move to stay out of the line's way, in px */
  pushes: number[];
  /** the widest the line swings at the start, reported in the callout */
  swing: number;
  tailY: number;
};

/** deterministic, so a re-measure never redraws a different scribble */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

type Row = { top: number; height: number };

function buildGeometry(
  width: number,
  rows: Row[],
  tailTop: number,
  height: number,
  spineX: number,
  gutterRight: number,
  bodyLeft: number,
  compact: boolean,
): Geometry {
  const random = seeded(20220913);
  const last = eras.length - 1;

  // the line may wander into the prose it is disturbing, but it must never
  // reach the year column — that column is the ruler, and a ruler that gets
  // scribbled on stops being one
  const ampRight = compact ? 26 : Math.min(118, (width - spineX) * 0.17);
  const ampLeft = compact
    ? 14
    : Math.max(10, Math.min(ampRight, spineX - gutterRight - 16));

  const points: [number, number][] = [];
  const pushes: number[] = [];

  rows.forEach((row, i) => {
    const precision = last > 0 ? i / last : 1;

    // two things settle at once, and both are the point: the line stops
    // swinging as wide, and stops changing its mind as often. Early work is a
    // nervous scribble; recent work is a stroke.
    const settle = (1 - precision) ** 1.8;
    const steps = compact
      ? Math.max(2, Math.round(6 - precision * 4))
      : Math.max(2, Math.round(11 - precision * 9));

    let reach = 0;

    for (let s = 0; s < steps; s += 1) {
      const y = row.top + (s / steps) * row.height;
      const swing = random() * 2 - 1;
      const deviation = swing * (swing < 0 ? ampLeft : ampRight) * settle;
      points.push([spineX + deviation, y]);
      reach = Math.max(reach, deviation);
    }

    // the prose gets out of the way by as much as the line took, so the
    // paragraphs stop being indented at the same rate the line stops
    // wandering. The proportional term keeps a little of that memory even once
    // the line is no longer close enough to hit anything, so the last few years
    // still visibly come into alignment. Nothing here is decorative.
    pushes.push(
      Math.max(reach * 0.55, spineX + reach + 20 - bodyLeft, 0),
    );
  });

  // the settled run into the closing row — the solid stroke stops here so the
  // dashed continuation underneath it is actually visible
  points.push([spineX, tailTop - 48]);
  points.push([spineX, tailTop]);

  // smooth through the points with quadratics at the midpoints
  const samples: [number, number][] = [points[0]];
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;

  for (let i = 1; i < points.length - 1; i += 1) {
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const mx = (cx + nx) / 2;
    const my = (cy + ny) / 2;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    samples.push([mx, my]);
  }

  const tip = points[points.length - 1];
  d += ` L ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`;
  samples.push(tip);

  return {
    width,
    height,
    spineX,
    d,
    samples,
    pushes,
    swing: Math.round(ampRight),
    tailY: tailTop,
  };
}

/** where the line is at a given depth — the pen has to ride the stroke */
function xAtY(samples: [number, number][], y: number) {
  if (y <= samples[0][1]) return samples[0][0];
  for (let i = 1; i < samples.length; i += 1) {
    const [x0, y0] = samples[i - 1];
    const [x1, y1] = samples[i];
    if (y <= y1) {
      const t = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
      return x0 + (x1 - x0) * t;
    }
  }
  return samples[samples.length - 1][0];
}

export function Evolution() {
  const listRef = useRef<HTMLOListElement>(null);
  const signature = useRef("");
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const clipId = `evo-reveal-${useId().replace(/:/g, "")}`;

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(
      list.querySelectorAll<HTMLLIElement>("[data-era]"),
    );
    if (items.length !== eras.length) return;

    const width = list.offsetWidth;
    const compact = width < 760;

    // the line hangs off the layout, not the other way round: find the channel
    // the layout already leaves between the years and the prose, and run the
    // spine down the middle of it
    const body = items[0].querySelector<HTMLElement>("[data-era-body]");
    const year = items[0].querySelector<HTMLElement>("[data-era-year]");

    // offsetLeft is the border box, and in the stacked layout the prose is
    // inset by its own padding rather than by a grid column — measure where the
    // text actually starts or the phone layout gets shoved off its own screen
    const bodyLeft = body
      ? body.offsetLeft + parseFloat(getComputedStyle(body).paddingLeft || "0")
      : 0;
    const gutterRight = year ? year.offsetLeft + year.offsetWidth : 0;
    const spineX = compact ? 22 : Math.max(48, (gutterRight + bodyLeft) / 2);

    const rows = items.map((item) => ({
      top: item.offsetTop,
      height: item.offsetHeight,
    }));

    const tail = list.querySelector<HTMLElement>("[data-era-tail]");
    const tailTop =
      tail?.offsetTop ?? rows[rows.length - 1].top + rows[rows.length - 1].height;
    const height = list.offsetHeight;

    // re-measuring is cheap, rebuilding the scene's timelines is not
    const next = `${width}|${height}|${spineX}|${rows.map((r) => r.top).join()}`;
    if (next === signature.current) return;
    signature.current = next;

    setGeometry(
      buildGeometry(
        width,
        rows,
        tailTop,
        height,
        spineX,
        gutterRight,
        bodyLeft,
        compact,
      ),
    );
  }, []);

  useLayoutEffect(() => {
    measure();

    const list = listRef.current;
    if (!list) return;

    // fonts landing and the column rewrapping both move the years the line is
    // supposed to be pointing at
    const observer = new ResizeObserver(() => {
      measure();
      ScrollTrigger.refresh();
    });
    observer.observe(list);

    return () => observer.disconnect();
  }, [measure]);

  const scope = useSceneTimeline(
    ({ scope: section, reduced }) => {
      if (!geometry) return;

      const clip = section.querySelector<SVGRectElement>("[data-evo-clip]");
      const pen = section.querySelector<SVGCircleElement>("[data-evo-pen]");
      const years = gsap.utils.toArray<HTMLElement>("[data-era-year]");
      if (!clip) return;

      if (reduced) {
        clip.setAttribute("height", String(geometry.height));
        pen?.setAttribute("opacity", "0");
        gsap.set(years, { opacity: 1 });
        return;
      }

      // the reveal is a clip travelling down the page, not a dash offset: it
      // keeps the drawing in step with the year you are actually reading, and
      // a scribbly stretch does not eat the scroll budget the way arc-length
      // drawing does
      const head = { y: 0 };

      gsap.to(head, {
        y: geometry.height,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          end: "bottom 80%",
          scrub: 0.4,
        },
        onUpdate: () => {
          clip.setAttribute("height", head.y.toFixed(1));
          if (!pen) return;
          const inked = head.y > 6 && head.y < geometry.height - 6;
          pen.setAttribute("opacity", inked ? "1" : "0");
          if (inked) {
            pen.setAttribute("cx", xAtY(geometry.samples, head.y).toFixed(1));
            pen.setAttribute("cy", head.y.toFixed(1));
          }
        },
      });

      // the only other motion in the scene: a year comes up to full weight as
      // the line arrives at it
      years.forEach((year) => {
        gsap.fromTo(
          year,
          { opacity: 0.26 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: year,
              start: "top 76%",
              end: "top 52%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    [geometry],
  );

  const columns =
    "md:grid-cols-[clamp(72px,12vw,168px)_minmax(0,1fr)_clamp(128px,15vw,196px)]";

  return (
    <section
      ref={scope}
      aria-label="How the work changed"
      className="relative px-[6vw] pt-[14vh] pb-[10vh]"
    >
      <header className="relative mx-auto flex max-w-[1100px] flex-wrap items-end justify-between gap-8">
        <div>
          <SceneTag index="06">one line, four years</SceneTag>
          <h2 className="voice-display text-loud mt-4 text-ink">
            It got straighter.
          </h2>
          <p className="voice-prose mt-5 max-w-[38ch]">
            Same person, mostly the same stubbornness. The difference is how
            much of it now happens on purpose.
          </p>
        </div>

        {/* a tolerance callout, the way a drawing states what it is measuring */}
        <dl className="voice-readout hidden shrink-0 text-right sm:block">
          <div className="flex items-baseline justify-end gap-3">
            <dt className="opacity-55">wander at 2022</dt>
            <dd className="text-ink">± {geometry?.swing ?? 0}px</dd>
          </div>
          <div className="mt-1.5 flex items-baseline justify-end gap-3">
            <dt className="opacity-55">wander now</dt>
            <dd className="text-vermillion">± 0px</dd>
          </div>
        </dl>
      </header>

      <div className="relative mx-auto mt-[10vh] max-w-[1100px]">
        {/* ---- the line, sized from the rows it describes ------------------ */}
        {geometry ? (
          <svg
            aria-hidden="true"
            width={geometry.width}
            height={geometry.height}
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            className="pointer-events-none absolute top-0 left-0 text-graphite"
          >
            <defs>
              <clipPath id={clipId}>
                <rect data-evo-clip x="0" y="0" width={geometry.width} height="0" />
              </clipPath>
            </defs>

            <g clipPath={`url(#${clipId})`}>
              <path
                d={geometry.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
              {/* it does not end, it just stops being certain */}
              <path
                d={`M ${geometry.spineX} ${geometry.tailY} L ${geometry.spineX} ${geometry.height}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="2 7"
                opacity="0.45"
              />
            </g>

            <circle
              data-evo-pen
              r="3"
              cx={geometry.spineX}
              cy="0"
              opacity="0"
              className="fill-vermillion"
            />
          </svg>
        ) : null}

        <ol ref={listRef} className="relative">
          {/* ---- the years ------------------------------------------------ */}
          {eras.map((era, index) => (
            <li
              key={`${era.year}-${era.title}`}
              data-era
              className={`grid items-start gap-x-[clamp(28px,4vw,60px)] py-[clamp(28px,5vh,52px)] ${columns}`}
            >
              <p
                data-era-year
                className="voice-display pl-14 text-[clamp(1.5rem,2.6vw,2.3rem)] leading-none text-ink md:pl-0 md:text-right"
              >
                {era.year}
              </p>

              <div
                data-era-body
                className="mt-3 pl-14 md:mt-0 md:ml-[clamp(24px,3.6vw,60px)] md:pl-0"
                style={
                  geometry
                    ? {
                        transform: `translateX(${geometry.pushes[index].toFixed(
                          1,
                        )}px)`,
                      }
                    : undefined
                }
              >
                <h3 className="voice-machine text-ink">{era.title}</h3>

                {era.subtitle ? (
                  <Readout tone="alarm" className="mt-1.5 block">
                    {era.subtitle}
                  </Readout>
                ) : null}

                <p className="voice-prose mt-3 max-w-[56ch]">
                  {era.description}
                </p>
              </div>

              {/* the index: the one column that is straight the whole way down.
                  Stacked, it runs inline — a phone has no margin to keep. */}
              <ul className="mt-3 flex flex-wrap gap-x-3 pl-14 md:mt-1 md:block md:pl-0 md:text-right">
                {era.tech.slice(0, 4).map((tool) => (
                  <li key={tool} className="voice-readout leading-relaxed opacity-65">
                    {tool}
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {/* the row the line leaves through */}
          <li
            data-era-tail
            className={`grid items-start gap-x-[clamp(28px,4vw,60px)] pt-[clamp(36px,7vh,72px)] pb-[clamp(48px,9vh,96px)] ${columns}`}
          >
            <span aria-hidden="true" className="hidden md:block" />
            <div className="pl-14 md:ml-[clamp(24px,3.6vw,60px)] md:pl-0">
              <MarginNote lean={-2.2}>still figuring this one out.</MarginNote>
              <Readout className="mt-3 block">
                now · {currentRole.role} at {currentRole.company}
              </Readout>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
