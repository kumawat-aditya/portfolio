"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CursorMark } from "@/components/chrome/CursorMark";
import {
  activeCursorId,
  pickCursor,
  readCursorState,
  type CursorState,
} from "@/lib/cursors";

/* ============================================================================
   CURSOR LAYER
   ----------------------------------------------------------------------------
   Hides the OS pointer on fine pointers and draws the configured mark so it
   can change size, colour, and shape — CSS url() cursors cannot.
   ========================================================================= */

export function CursorLayer() {
  const family = pickCursor(activeCursorId);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<CursorState>("default");

  useEffect(() => {
    if (family.id === "system") return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncReady = () => setReady(fine.matches);
    syncReady();
    fine.addEventListener("change", syncReady);

    let pressed = false;

    const sample = (x: number, y: number) => {
      setSeen(true);
      setPos({ x, y });
      setState(readCursorState(x, y, pressed));
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      sample(event.clientX, event.clientY);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pressed = event.buttons === 1;
      sample(event.clientX, event.clientY);
    };
    const onUp = (event: PointerEvent) => {
      pressed = false;
      sample(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      document.documentElement.removeAttribute("data-cursor-active");
      fine.removeEventListener("change", syncReady);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [family.id]);

  useEffect(() => {
    if (seen) document.documentElement.dataset.cursorActive = "";
  }, [seen]);

  if (family.id === "system" || !ready || !seen) return null;

  const [hx, hy] = family.hotspot;

  return (
    <div
      data-cursor-layer
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-200 will-change-transform"
      style={
        {
          width: family.size,
          height: family.size,
          transform: `translate3d(${pos.x - hx}px, ${pos.y - hy}px, 0)`,
          "--cursor-ox": `${(hx / family.size) * 100}%`,
          "--cursor-oy": `${(hy / family.size) * 100}%`,
        } as CSSProperties
      }
    >
      <CursorMark
        family={family.id as Exclude<typeof family.id, "system">}
        state={state}
      />
    </div>
  );
}
