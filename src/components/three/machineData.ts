/* ============================================================================
   THE MACHINE — shape and story
   ----------------------------------------------------------------------------
   The loop from the systems in content.json: a fixed 1Hz tick ingests data,
   evaluates state, emits actions, broadcasts the result, and comes back round.
   A watchdog sits off to one side doing nothing except watching, until it has
   to do everything.

   Shared by the WebGL scene and the drawn (mobile / reduced-motion) scene so
   both tell exactly the same story.
   ========================================================================= */

export type MachineNode = {
  id: string;
  label: string;
  /** the machine's own annotation for this stage */
  note: string;
  /** resting position in the separated state */
  at: [number, number, number];
};

/**
 * The five stages of the loop, in order — index doubles as position on the
 * curve, so the travelling pulse arrives at stage i at exactly t = i/5.
 *
 * Laid out wide and shallow: the drawing lives in the upper two thirds of the
 * frame so the bottom band stays free for the captions.
 */
export const LOOP: MachineNode[] = [
  { id: "tick", label: "TICK", note: "1s", at: [-4.7, 1.55, -0.3] },
  { id: "ingest", label: "INGEST", note: "feed", at: [-1.15, 2.3, -1.7] },
  { id: "evaluate", label: "EVALUATE", note: "state", at: [2.9, 1.3, -2.3] },
  { id: "act", label: "ACT", note: "queue", at: [4.1, -1.15, -1.0] },
  { id: "broadcast", label: "BROADCAST", note: "socket", at: [0.4, -2.25, 0.3] },
];

/** not part of the loop. that is the whole point of it. */
export const WATCHER: MachineNode = {
  id: "watchdog",
  label: "WATCHDOG",
  note: "10s timeout",
  at: [-4.25, -1.3, 1.5],
};

/** which stage fails, and therefore which one the watchdog has to resurrect */
export const FAILING_INDEX = 3; // ACT

/* --------------------------------------------------------------------------
   Story beats, as scroll progress windows. The captions and the 3D scene read
   from the same numbers, so they can never drift out of sync.
   -------------------------------------------------------------------------- */

export type Beat = {
  from: number;
  to: number;
  /** the machine's log line for this beat */
  log: string;
  /** what the author says about it */
  said: string;
  /** an afterthought in the margin, if this beat deserves one */
  aside?: string;
  tone?: "normal" | "alarm" | "recovered";
};

export const BEATS: Beat[] = [
  {
    from: 0,
    to: 0.17,
    log: "system · 1 object",
    said: "From the outside it looks like one thing.",
  },
  {
    from: 0.17,
    to: 0.4,
    log: "system · 5 stages + 1 observer",
    said: "It is five stages, a clock, and something watching.",
    aside: "the watcher does nothing for hours.",
  },
  {
    from: 0.4,
    to: 0.56,
    log: "loop · running · 1 lap / second",
    said: "Every second it runs the same lap. Forever, ideally.",
  },
  {
    from: 0.56,
    to: 0.71,
    log: "act · no response · state frozen",
    said: "Then one stage stops answering.",
    aside: "okay… interesting.",
    tone: "alarm",
  },
  {
    from: 0.71,
    to: 0.87,
    log: "watchdog · hard reset · t+10s",
    said: "The thing that was doing nothing does the only thing that matters.",
    tone: "alarm",
  },
  {
    from: 0.87,
    to: 1.001,
    log: "loop · running · recovered",
    said: "Nobody was awake for any of this.",
    aside: "this is the part I actually enjoy.",
    tone: "recovered",
  },
];

/* --------------------------------------------------------------------------
   Interpolation helpers, shared by both renderers
   -------------------------------------------------------------------------- */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** where progress `p` sits inside the window [a,b], clamped */
export const span = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a));

/** smootherstep — no visible start or stop */
export const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
