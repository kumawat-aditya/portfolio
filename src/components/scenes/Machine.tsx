"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { MarginNote, Readout, SceneTag } from "@/components/primitives/marks";
import { MachineDrawn } from "./MachineDrawn";
import { BEATS } from "@/components/three/machineData";
import {
  gsap,
  useCapableViewport,
  useNearViewport,
  useReducedMotion,
  useSceneTimeline,
} from "@/lib/motion";

const MachineCanvas = dynamic(() => import("@/components/three/MachineCanvas"), {
  ssr: false,
});

/* ============================================================================
   03 — UNDER THE HOOD                                          [dense/absurd]
   ----------------------------------------------------------------------------
   The only place the room goes dark, entered through a hard diagonal cut
   rather than a fade, because you are being taken somewhere.

   The story: a system looks like one object → it is five stages and a watcher
   → the loop runs → one stage stops answering → the thing that had been doing
   nothing resets it → nobody was awake for any of it.

   Every beat here is something content.json actually describes: the 1s
   cooperative loop, the action queue, the WebSocket broadcast, and the EA
   timeout watcher that force-resets state after ten seconds of silence.

   Desktop gets WebGL. Everything else gets a drawn version of the same story —
   not a still, not a fallback message. A different composition.
   ========================================================================= */

const TONE = {
  normal: "text-live",
  alarm: "text-[#e0603f]",
  recovered: "text-live",
} as const;

export function Machine() {
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);
  const [glGaveUp, setGlGaveUp] = useState(false);
  const capable = useCapableViewport();
  const reduced = useReducedMotion();
  const { ref: stageRef, near } = useNearViewport<HTMLDivElement>("30%");

  const scope = useSceneTimeline(({ scope: section }) => {
    // one scrub drives the 3D progress ref and the caption index together, so
    // the drawing and the words can never disagree about which beat it is
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const index = BEATS.findIndex(
            (b) => self.progress >= b.from && self.progress < b.to,
          );
          if (index !== -1)
            setBeat((current) => (current === index ? current : index));
        },
      },
    });

    // the persistent chrome re-inks itself while this scene owns the viewport
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          document.documentElement.dataset.room = self.isActive
            ? "night"
            : "paper";
        },
      },
    });

    return () => {
      delete document.documentElement.dataset.room;
    };
  });

  const current = BEATS[beat];

  return (
    <section
      ref={scope}
      data-machine
      aria-label="Under the hood"
      className="on-night relative"
      style={{ height: "420svh" }}
    >
      {/* the room, cut into the page at an angle */}
      <div
        aria-hidden="true"
        className="wedge-in absolute inset-0 bg-night"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(90,168,123,0.055), transparent 70%)",
        }}
      />

      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-clip px-[6vw] pt-[7vh] pb-[15vh]"
      >
        {/* ---- the drawing --------------------------------------------- */}
        <div className="pointer-events-none absolute inset-0">
          {capable === true && !glGaveUp ? (
            <MachineCanvas
              progress={progress}
              active={near}
              onExhausted={() => setGlGaveUp(true)}
            />
          ) : capable !== null ? (
            <MachineDrawn reduced={reduced} />
          ) : null}
        </div>

        {/* ---- where you are ------------------------------------------- */}
        <div className="relative z-10 flex items-start justify-between gap-6">
          <SceneTag index="03" tone="paper">
            under the hood
          </SceneTag>
          <Readout tone="paper" className="hidden text-right sm:block">
            elastic dca v4 / ant meta bots
            <br />
            <span className="opacity-60">drawn from content.json</span>
          </Readout>
        </div>

        {/* ---- what is happening --------------------------------------- */}
        <div className="relative z-10 max-w-[42ch]">
          <AnimatePresence mode="wait">
            <motion.div
              key={beat}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`size-[5px] shrink-0 ${
                    current.tone === "alarm" ? "bg-[#e0603f]" : "bg-live"
                  }`}
                />
                <span
                  className={`voice-readout ${
                    TONE[current.tone ?? "normal"]
                  } tabular-nums`}
                >
                  {current.log}
                </span>
              </div>

              <p className="voice-display text-say text-paper/95">{current.said}</p>

              {current.aside ? (
                <MarginNote
                  lean={-1.8}
                  className="mt-4 block !text-[#e07a5f]"
                >
                  {current.aside}
                </MarginNote>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
