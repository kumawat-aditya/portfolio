"use client";

import { useEffect, useRef } from "react";
import { FAILING_INDEX, LOOP, WATCHER } from "@/components/three/machineData";
import { gsap, useSceneTimeline } from "@/lib/motion";
import { colors } from "@/lib/theme";

/* ============================================================================
   THE MACHINE — drawn
   ----------------------------------------------------------------------------
   Mobile, and anyone who asked for reduced motion, get this instead of WebGL.

   It is not a screenshot of the 3D scene. It is a different composition of the
   same idea: a closed circuit, drawn as a single continuous path, with the
   stage names set inside the loop so you can see it come back round. Portrait
   wants a circuit; landscape wanted an exploded axonometric.
   ========================================================================= */

const RUN_TOP = 52;
const RUN_X = 262;
const STAGE_Y = [100, 180, 260, 340, 420];

const LOOP_PATH = `M ${RUN_X} ${RUN_TOP} V 470 Q ${RUN_X} 505 227 505 H 87 Q 52 505 52 470 V 87 Q 52 52 87 52 Z`;

export function MachineDrawn({ reduced }: { reduced: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGRectElement>(null);
  const runtime = useRef({ alive: 0, stalled: 0 });

  /* --- the pulse: its own rAF loop so the scrubbed timeline only has to
         describe *state*, not position ------------------------------------ */
  useEffect(() => {
    if (reduced) return;
    const path = pathRef.current;
    const pulse = pulseRef.current;
    if (!path || !pulse) return;

    const total = path.getTotalLength();
    const stallAt = (STAGE_Y[FAILING_INDEX] - RUN_TOP - 26) / total;
    let frame = 0;

    const tick = () => {
      const { alive, stalled } = runtime.current;
      const lap = (performance.now() / 1000) % 1;
      const t = stalled > 0.5 ? stallAt : lap;
      const point = path.getPointAtLength(t * total);
      pulse.setAttribute("x", String(point.x - 3.5));
      pulse.setAttribute("y", String(point.y - 3.5));
      pulse.setAttribute("opacity", String(alive));
      pulse.setAttribute("fill", stalled > 0.5 ? colors.machine.alarm : colors.machine.live);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  const scope = useSceneTimeline(({ scope: element, reduced: isReduced }) => {
    const section = element.closest("[data-machine]");
    if (!section) return;

    if (isReduced) {
      gsap.set("[data-drawn-path]", { strokeDashoffset: 0, opacity: 0.4 });
      gsap.set("[data-drawn-stage]", { opacity: 1 });
      gsap.set("[data-drawn-watcher]", { opacity: 1 });
      gsap.set("[data-drawn-sight]", { opacity: 0.25 });
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    timeline
      // 1. one object → a circuit
      .fromTo(
        "[data-drawn-path]",
        { strokeDashoffset: 1, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.42, duration: 1.6 },
        0,
      )
      .fromTo(
        "[data-drawn-stage]",
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.9, stagger: 0.22 },
        0.5,
      )
      .fromTo(
        "[data-drawn-watcher]",
        { opacity: 0 },
        { opacity: 1, duration: 0.7 },
        1.5,
      )
      .fromTo(
        "[data-drawn-sight]",
        { opacity: 0 },
        { opacity: 0.22, duration: 0.6 },
        1.8,
      )
      // 2. the loop starts running
      .to(runtime.current, { alive: 1, duration: 0.4 }, 2.4)
      // 3. one stage stops answering
      .to(runtime.current, { stalled: 1, duration: 0.01 }, 3.5)
      .to(
        "[data-drawn-stage='3']",
        { x: 26, y: 16, rotate: 5, duration: 0.8, ease: "power2.in" },
        3.5,
      )
      .to("[data-drawn-stage='3'] [data-ink]", { fill: colors.machine.alarm, duration: 0.4 }, 3.5)
      .to("[data-drawn-stage='3'] [data-edge]", { stroke: colors.machine.alarm, duration: 0.4 }, 3.5)
      .to("[data-drawn-stage='4']", { opacity: 0.3, duration: 0.6 }, 3.7)
      .fromTo("[data-drawn-break]", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 3.8)
      // 4. the watcher stops watching and acts
      .to("[data-drawn-sight='3']", { opacity: 0.95, duration: 0.4 }, 4.6)
      .to(
        "[data-drawn-sight='3'] line",
        { strokeDasharray: "40 0", stroke: colors.machine.alarm, duration: 0.4 },
        4.6,
      )
      .to("[data-drawn-watcher] [data-edge]", { stroke: colors.machine.alarm, duration: 0.3 }, 4.6)
      // 5. reset
      .to(
        "[data-drawn-stage='3']",
        { x: 0, y: 0, rotate: 0, duration: 0.9, ease: "back.out(2)" },
        5.3,
      )
      .to("[data-drawn-stage='3'] [data-ink]", { fill: colors.machine.paper, duration: 0.5 }, 5.5)
      .to("[data-drawn-stage='3'] [data-edge]", { stroke: colors.machine.edge, duration: 0.5 }, 5.5)
      .to("[data-drawn-stage='4']", { opacity: 1, duration: 0.5 }, 5.5)
      .to("[data-drawn-break]", { opacity: 0, duration: 0.3 }, 5.5)
      .to(runtime.current, { stalled: 0, duration: 0.01 }, 5.8)
      .to("[data-drawn-sight='3'] line", { stroke: colors.machine.edge, duration: 0.4 }, 6)
      .to("[data-drawn-sight='3']", { opacity: 0.22, duration: 0.4 }, 6)
      .to("[data-drawn-watcher] [data-edge]", { stroke: colors.machine.edge, duration: 0.4 }, 6);

    return () => timeline.scrollTrigger?.kill();
  }, [reduced]);

  return (
    // the captions live along the bottom of the stage, so the drawing is only
    // allowed the room above them — otherwise the watcher's label and the
    // caption print on top of each other on a phone
    <div
      ref={scope}
      className="flex h-full w-full items-center justify-center pt-[9svh] pb-[28svh]"
    >
      <svg
        viewBox="0 0 330 560"
        className="h-full max-h-[76svh] w-full"
        aria-hidden="true"
      >
        {/* the circuit, drawn as one continuous path */}
        <path
          ref={pathRef}
          data-drawn-path
          d={LOOP_PATH}
          fill="none"
          stroke={colors.machine.edge}
          strokeWidth="1"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          opacity="0"
        />

        {/* the watcher's sightlines */}
        {[1, 2, 3, 4].map((index) => (
          <g key={`sight-${index}`} data-drawn-sight={index} opacity="0">
            <line
              x1="118"
              y1="462"
              x2={RUN_X - 12}
              y2={STAGE_Y[index]}
              stroke={colors.machine.edge}
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          </g>
        ))}

        {/* an engineering break mark where the circuit stops conducting */}
        <g data-drawn-break opacity="0">
          <path
            d={`M ${RUN_X - 7} ${STAGE_Y[FAILING_INDEX] + 22} l 14 -8`}
            stroke={colors.machine.alarm}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d={`M ${RUN_X - 7} ${STAGE_Y[FAILING_INDEX] + 30} l 14 -8`}
            stroke={colors.machine.alarm}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>

        {/* the five stages, labelled inside the loop */}
        {LOOP.map((node, index) => (
          <g key={node.id} data-drawn-stage={index} opacity="0">
            <rect
              data-edge
              x={RUN_X - 5}
              y={STAGE_Y[index] - 5}
              width="10"
              height="10"
              fill={colors.surface.night}
              stroke={colors.machine.edge}
              strokeWidth="1"
            />
            <text
              data-ink
              x={RUN_X - 18}
              y={STAGE_Y[index] - 1}
              textAnchor="end"
              fill={colors.machine.paper}
              style={{
                fontFamily: "var(--font-plex-mono)",
                fontSize: 11,
                letterSpacing: 1.7,
                fontWeight: 500,
              }}
            >
              {node.label}
            </text>
            <text
              x={RUN_X - 18}
              y={STAGE_Y[index] + 12}
              textAnchor="end"
              fill={colors.machine.note}
              style={{
                fontFamily: "var(--font-plex-mono)",
                fontSize: 8.5,
                letterSpacing: 1.1,
              }}
            >
              {node.note}
            </text>
          </g>
        ))}

        {/* the watcher: inside the loop, off to one side, doing nothing */}
        <g data-drawn-watcher opacity="0">
          <rect
            data-edge
            x="103"
            y="457"
            width="10"
            height="10"
            fill={colors.surface.night}
            stroke={colors.machine.edge}
            strokeWidth="1"
          />
          <text
            x="121"
            y="461"
            fill={colors.machine.paper}
            style={{
              fontFamily: "var(--font-plex-mono)",
              fontSize: 11,
              letterSpacing: 1.7,
              fontWeight: 500,
            }}
          >
            {WATCHER.label}
          </text>
          <text
            x="121"
            y="474"
            fill={colors.machine.note}
            style={{
              fontFamily: "var(--font-plex-mono)",
              fontSize: 8.5,
              letterSpacing: 1.1,
            }}
          >
            {WATCHER.note}
          </text>
        </g>

        {/* the signal */}
        <rect
          ref={pulseRef}
          width="7"
          height="7"
          fill={colors.machine.live}
          opacity="0"
          x="-10"
          y="-10"
        />
      </svg>
    </div>
  );
}
