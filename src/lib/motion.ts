"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // hairline-thin sub-pixel work everywhere; let GSAP keep transforms on the GPU
  gsap.config({ force3D: true, nullTargetWarn: false });

  if (process.env.NODE_ENV !== "production") {
    // scroll choreography is only debuggable if you can read the triggers
    (window as unknown as Record<string, unknown>).__motion = {
      gsap,
      ScrollTrigger,
      dump: () =>
        ScrollTrigger.getAll().map((t) => ({
          id: t.vars.id ?? (t.trigger as HTMLElement)?.dataset?.scene ?? "?",
          el: (t.trigger as HTMLElement)?.tagName,
          start: Math.round(t.start),
          end: Math.round(t.end),
          progress: +t.progress.toFixed(3),
          scrub: t.vars.scrub ?? false,
        })),
    };
  }
}

export { gsap, ScrollTrigger };

/* ============================================================================
   MOTION HYGIENE
   ========================================================================= */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Media queries are external state, so they are read as external state. Doing
 * this with useState + useEffect works but renders once with the wrong answer,
 * which for the 3D scene means briefly mounting a canvas we are about to throw
 * away.
 */
const mediaStore = (query: string) => {
  let list: MediaQueryList | null = null;
  const match = () => (list ??= window.matchMedia(query));

  return {
    subscribe: (onChange: () => void) => {
      const media = match();
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    get: () => match().matches,
  };
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const CAPABLE =
  "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const reducedStore = mediaStore(REDUCED);
const capableStore = mediaStore(CAPABLE);

export const useReducedMotion = () =>
  useSyncExternalStore(reducedStore.subscribe, reducedStore.get, () => false);

/**
 * Desktop-class pointer + enough viewport to be worth the GPU. Used to decide
 * whether a scene gets its WebGL version or its drawn version — mobile gets a
 * different composition, not a broken one.
 */
export const useCapableViewport = (): boolean | null =>
  useSyncExternalStore(capableStore.subscribe, capableStore.get, () => null);

/**
 * Scoped GSAP setup with guaranteed teardown. Every scene uses this so no
 * timeline or ScrollTrigger outlives its section.
 */
export const useSceneTimeline = (
  build: (context: { scope: HTMLElement; reduced: boolean }) => void,
  deps: unknown[] = [],
) => {
  const scope = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;

    const reduced = prefersReducedMotion();
    const context = gsap.context(() => build({ scope: element, reduced }), element);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
};

/** true while the element is anywhere near the viewport — used to park WebGL */
export const useNearViewport = <T extends HTMLElement>(margin = "25%") => {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, near };
};
