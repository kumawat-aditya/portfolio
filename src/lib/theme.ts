import type { CSSProperties } from "react";
import siteConfig from "@/config/site.json";
import themeFile from "@/config/theme.json";

/* ============================================================================
   COLOUR THEME
   ----------------------------------------------------------------------------
   Palettes live in src/config/theme.json (`colorTheme` array).
   Which palette is live is chosen in src/config/site.json (`colorTheme` name).
   Visitors can also cycle rooms by pulling the plumb.

   Rooms:
     base / afterhours / noon / monsoon / blueprint / proof / watch

   To add a theme: duplicate the `base` object in the array, rename it, change
   the colours. Then set `"colorTheme": "that-name"` in site.json.
   ========================================================================= */

export type ColorTheme = {
  name: string;
  scheme: "light" | "dark";
  surface: {
    /** page ground — warm paper */
    paper: string;
    /** elevated sheets: drawer, shelf, selection text */
    paperRaised: string;
    /** unused reserve, a step darker than paper */
    paperDeep: string;
    /** the one place the room goes dark (machine scene) */
    night: string;
    /** unused reserve, a step up from night */
    nightRaised: string;
  };
  ink: {
    /** primary text */
    default: string;
    /** prose, secondary reading */
    soft: string;
    /** smallest usable label colour (AA on paper) */
    faint: string;
    /** hairlines only, never text */
    rule: string;
    /** light pigment for captions sitting on the night wedge */
    onNight: string;
  };
  accent: {
    /** diagrams, structure, blueprint */
    graphite: string;
    /** state change, failure, emphasis at large sizes */
    vermillion: string;
    /** same voice, small text (5:1 on paper) */
    vermillionInk: string;
    /** the heartbeat */
    live: string;
  };
  atmosphere: {
    /** fibre wash at the top of the page */
    paperWashLight: string;
    /** fibre wash at the bottom of the page */
    paperWashDeep: string;
    /** faint live glow inside the night wedge */
    nightGlow: string;
    /** grain overlay strength — dark grounds need less tooth */
    grainOpacity: string;
  };
  machine: {
    /** labels sitting on dark plates */
    paper: string;
    /** node plates */
    plate: string;
    /** 3D circuit hairlines */
    line: string;
    /** 2D circuit stroke */
    edge: string;
    /** dim lamps, projection lines */
    dim: string;
    /** stage notes in the drawn scene */
    note: string;
    /** pulse while the loop is running (brighter than accent.live) */
    live: string;
    /** failure, stall, the watchdog acting */
    alarm: string;
    /** handwritten asides on night */
    aside: string;
  };
};

export const catalog = themeFile.colorTheme as ColorTheme[];

const available = () => catalog.map((theme) => theme.name).join(", ");

/** how the rooms introduce themselves — presentation, not new facts */
export const roomVoice: Record<string, { title: string; note: string }> = {
  base: {
    title: "paper",
    note: "the room as it arrived.",
  },
  afterhours: {
    title: "after hours",
    note: "the shop lights are off.",
  },
  noon: {
    title: "noon",
    note: "Jaipur in full sun. the paper went yellow.",
  },
  monsoon: {
    title: "monsoon",
    note: "the sheet took on water and did not quite dry.",
  },
  blueprint: {
    title: "blueprint",
    note: "before it was a site it was a drawing.",
  },
  proof: {
    title: "proof",
    note: "one more pass before the plate.",
  },
  watch: {
    title: "watch",
    note: "the loop is still running. nobody else is.",
  },
};

export const ROOM_STORAGE_KEY = "aditya-room";
export const ROOM_UNLOCK_KEY = "aditya-room-drawer";
export const ROOM_PULLS_KEY = "aditya-room-pulls";
export const PULLS_TO_DRAWER = 5;

function pickTheme(name: string): ColorTheme {
  const found = catalog.find((theme) => theme.name === name);
  if (!found) {
    throw new Error(
      `Unknown colorTheme "${name}". Available: ${available() || "(none)"}.`,
    );
  }
  return found;
}

/** the name written in site.json — the switch */
export const activeThemeName = siteConfig.colorTheme;

/** the resolved palette */
export const activeTheme = pickTheme(activeThemeName);

/** shorthand for components that just need the colours */
export const colors = activeTheme;

/** CSS custom properties applied to <html>, which Tailwind tokens read */
export function themeToCssVars(theme: ColorTheme): CSSProperties {
  return {
    "--color-paper": theme.surface.paper,
    "--color-paper-raised": theme.surface.paperRaised,
    "--color-paper-deep": theme.surface.paperDeep,
    "--color-night": theme.surface.night,
    "--color-night-raised": theme.surface.nightRaised,
    "--color-ink": theme.ink.default,
    "--color-ink-soft": theme.ink.soft,
    "--color-ink-faint": theme.ink.faint,
    "--color-rule": theme.ink.rule,
    "--color-on-night": theme.ink.onNight,
    "--color-graphite": theme.accent.graphite,
    "--color-vermillion": theme.accent.vermillion,
    "--color-vermillion-ink": theme.accent.vermillionInk,
    "--color-live": theme.accent.live,
    "--color-paper-wash-light": theme.atmosphere.paperWashLight,
    "--color-paper-wash-deep": theme.atmosphere.paperWashDeep,
    "--color-night-glow": theme.atmosphere.nightGlow,
    "--grain-opacity": theme.atmosphere.grainOpacity,
    "--color-machine-paper": theme.machine.paper,
    "--color-machine-plate": theme.machine.plate,
    "--color-machine-line": theme.machine.line,
    "--color-machine-edge": theme.machine.edge,
    "--color-machine-dim": theme.machine.dim,
    "--color-machine-note": theme.machine.note,
    "--color-machine-live": theme.machine.live,
    "--color-machine-alarm": theme.machine.alarm,
    "--color-machine-aside": theme.machine.aside,
  } as CSSProperties;
}

export const themeCssVars = themeToCssVars(activeTheme);

export function applyTheme(name: string) {
  const theme = pickTheme(name);
  const root = document.documentElement;
  root.dataset.colorTheme = theme.name;
  root.dataset.scheme = theme.scheme;
  root.style.colorScheme = theme.scheme;

  const vars = themeToCssVars(theme);
  for (const [key, value] of Object.entries(vars)) {
    if (typeof value === "string") root.style.setProperty(key, value);
  }

  try {
    localStorage.setItem(ROOM_STORAGE_KEY, theme.name);
  } catch {
    /* private mode — the room still changes for this visit */
  }

  return theme;
}

export function nextThemeName(current: string): string {
  const index = catalog.findIndex((theme) => theme.name === current);
  const from = index >= 0 ? index : 0;
  return catalog[(from + 1) % catalog.length]?.name ?? current;
}

/** payload for a blocking inline script so a stored room does not flash paper */
export const themeHydrateCatalog = Object.fromEntries(
  catalog.map((theme) => [
    theme.name,
    { scheme: theme.scheme, vars: themeToCssVars(theme) },
  ]),
);

export function themeHydrateScript(): string {
  return `(function(){try{var k=${JSON.stringify(ROOM_STORAGE_KEY)};var n=localStorage.getItem(k);var c=${JSON.stringify(themeHydrateCatalog)};if(!n||!c[n])return;var h=document.documentElement;h.setAttribute("data-color-theme",n);h.setAttribute("data-scheme",c[n].scheme);h.style.colorScheme=c[n].scheme;var v=c[n].vars;for(var p in v){if(Object.prototype.hasOwnProperty.call(v,p))h.style.setProperty(p,v[p]);}}catch(e){}})();`;
}
