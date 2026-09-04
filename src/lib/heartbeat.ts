"use client";

import { useSyncExternalStore } from "react";

/* ============================================================================
   THE HEARTBEAT
   ----------------------------------------------------------------------------
   One 1Hz clock for the whole site. The corner readout, the pulse travelling
   through the 3D machine, and the closing tick count all read from this — so
   they are genuinely the same loop rather than three things that look similar.

   1Hz because that is the real cycle time of the systems in content.json:
   "strict 1-second cooperative loops", "1Hz state evaluation".

   Implemented as an external store rather than context so that a tick only
   re-renders the two or three components that actually display it. The 3D
   scene doesn't subscribe at all — it reads getBeatPhase() inside useFrame.
   ========================================================================= */

let ticks = 0;
let originMs = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

/** self-correcting so the beat never drifts away from wall time */
const schedule = () => {
  const sinceOrigin = performance.now() - originMs;
  timer = setTimeout(
    () => {
      ticks += 1;
      emit();
      schedule();
    },
    1000 - (sinceOrigin % 1000),
  );
};

const start = () => {
  if (originMs !== 0) return;
  originMs = performance.now();
  schedule();
};

const subscribe = (listener: () => void) => {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearTimeout(timer);
      timer = null;
      // keep `ticks` and `originMs`: the loop is conceptually still running
      schedule();
    }
  };
};

const getTicks = () => ticks;
const getServerTicks = () => 0;

/** for anything that wants to derive its own value from the beat */
export { subscribe as subscribeToBeat, getTicks as readTicks };

/** how far through the current second we are, 0..1 — for frame-rate animation */
export const getBeatPhase = () => {
  if (originMs === 0) return 0;
  return ((performance.now() - originMs) % 1000) / 1000;
};

/** milliseconds since the first component subscribed to the beat */
export const getElapsedMs = () =>
  originMs === 0 ? 0 : performance.now() - originMs;

/** re-renders once per second. Use sparingly and only on small components. */
export const useHeartbeat = () =>
  useSyncExternalStore(subscribe, getTicks, getServerTicks);
