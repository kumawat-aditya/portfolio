import cursorFile from "@/config/cursors.json";
import siteConfig from "@/config/site.json";

/* ============================================================================
   CURSORS
   ----------------------------------------------------------------------------
   Families live in src/config/cursors.json. Which one is live is chosen in
   src/config/site.json (`cursor` id). The drawing is a following mark, not a
   CSS url() — CSS cursors cannot buzz, clip, or change shape.

   Set `"cursor": "system"` in site.json to leave the OS pointer alone.
   ========================================================================= */

export type CursorId =
  | "carpenter-pencil"
  | "ruling-pen"
  | "eraser-crumb"
  | "torn-paper"
  | "system";

export type CursorState =
  | "default"
  | "pointer"
  | "pressed"
  | "blocked"
  | "text"
  | "wait";

export type CursorFamily = {
  id: CursorId;
  name: string;
  size: number;
  hotspot: [number, number];
};

export const cursorCatalog = cursorFile.families as CursorFamily[];

export const activeCursorId = siteConfig.cursor as CursorId;

const available = () => cursorCatalog.map((family) => family.id).join(", ");

export function pickCursor(id: string): CursorFamily {
  const found = cursorCatalog.find((family) => family.id === id);
  if (!found) {
    throw new Error(
      `Unknown cursor "${id}". Available: ${available() || "(none)"}.`,
    );
  }
  return found;
}

export function applyCursor(id: CursorId) {
  const root = document.documentElement;
  if (id === "system") {
    root.removeAttribute("data-cursor");
    return;
  }
  pickCursor(id);
  root.dataset.cursor = id;
}

const POINTER = "a[href], button, [role='button'], summary, label[for], select, [data-cursor-target='pointer'], .cursor-pointer";

export function readCursorState(
  x: number,
  y: number,
  pressed: boolean,
): CursorState {
  const stack = document.elementsFromPoint(x, y);
  let node: Element | null = null;
  for (const entry of stack) {
    if (entry.closest("[data-cursor-layer]")) continue;
    node = entry;
    break;
  }

  while (node && node !== document.documentElement) {
    if (node.matches("[aria-busy='true'], .cursor-wait, .cursor-progress")) {
      return "wait";
    }
    if (node.matches(":disabled, [aria-disabled='true'], .cursor-not-allowed")) {
      return "blocked";
    }
    if (
      node.matches(
        "input:not([type='button']):not([type='submit']):not([type='reset']), textarea, [contenteditable='true'], .cursor-text",
      )
    ) {
      return "text";
    }
    if (node.matches(POINTER)) {
      return pressed ? "pressed" : "pointer";
    }
    node = node.parentElement;
  }

  return pressed ? "pressed" : "default";
}
