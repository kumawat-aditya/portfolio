"use client";

import { useSyncExternalStore } from "react";
import { readTicks, subscribeToBeat } from "./heartbeat";

/* ============================================================================
   THE JAIPUR CLOCK
   ----------------------------------------------------------------------------
   The site knows what time it is where Aditya lives, and says something about
   it. The 05:30 and 17:00 boundaries are real: they are the session boundary
   and the force-close time of the trading systems in content.json.

   This is the opening's small strangeness — the page appears to know something
   it has no business knowing.
   ========================================================================= */

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  hour12: false,
});

export type JaipurMoment = {
  time: string;
  hour: number;
  aside: string;
};

/** what is plausibly happening there right now, said plainly */
const asideFor = (hour: number): string => {
  if (hour < 5) return "I'm asleep. The loops are not.";
  if (hour < 6) return "A new session just opened without asking me.";
  if (hour < 9) return "Chai first. Then the logs.";
  if (hour < 12) return "Markets are open, so something is polling.";
  if (hour < 15) return "Too hot to argue with a race condition.";
  if (hour < 17) return "Everything force-closes at 17:00. Not long now.";
  if (hour < 20) return "Positions closed. Now the interesting part.";
  return "This is usually when I actually build things.";
};

export const readJaipur = (): JaipurMoment => {
  const now = new Date();
  const hour = Number(partsFormatter.format(now));
  return { time: formatter.format(now), hour, aside: asideFor(hour) };
};

const preciseFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/*
 * Both readings are derived from the heartbeat rather than from their own
 * timers, so the clock and the corner pulse can never disagree. They are read
 * through useSyncExternalStore and memoised against the tick, because
 * getSnapshot has to return the same value every time it is asked within a
 * single beat or React will re-render forever chasing the wall clock.
 */
let momentTick = -1;
let momentValue: JaipurMoment | null = null;

const readMoment = (): JaipurMoment | null => {
  if (readTicks() !== momentTick) {
    momentTick = readTicks();
    momentValue = readJaipur();
  }
  return momentValue;
};

let preciseTick = -1;
let preciseValue: string | null = null;

const readPrecise = (): string | null => {
  if (readTicks() !== preciseTick) {
    preciseTick = readTicks();
    preciseValue = preciseFormatter.format(new Date());
  }
  return preciseValue;
};

const serverNull = () => null;

/**
 * Null until mounted, so the server and the client never disagree about what
 * time it is. Scenes treat the null frame as "the line hasn't arrived yet",
 * which is also how it reads visually.
 */
export const useJaipur = (): JaipurMoment | null =>
  useSyncExternalStore(subscribeToBeat, readMoment, serverNull);

/** hh:mm:ss in Jaipur, for the instrument readout */
export const useJaipurPrecise = (): string | null =>
  useSyncExternalStore(subscribeToBeat, readPrecise, serverNull);
