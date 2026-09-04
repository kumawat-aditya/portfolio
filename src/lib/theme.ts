import type { CSSProperties } from "react";
import siteConfig from "@/config/site.json";
import themeFile from "@/config/theme.json";

/* ============================================================================
   COLOUR THEME
   ----------------------------------------------------------------------------
   Palettes live in src/config/theme.json (`colorTheme` array).
   Which palette is live is chosen in src/config/site.json (`colorTheme` name).

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

const catalog = themeFile.colorTheme as ColorTheme[];

const available = () => catalog.map((theme) => theme.name).join(", ");

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
    "--color-graphite": theme.accent.graphite,
    "--color-vermillion": theme.accent.vermillion,
    "--color-vermillion-ink": theme.accent.vermillionInk,
    "--color-live": theme.accent.live,
    "--color-paper-wash-light": theme.atmosphere.paperWashLight,
    "--color-paper-wash-deep": theme.atmosphere.paperWashDeep,
    "--color-night-glow": theme.atmosphere.nightGlow,
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
