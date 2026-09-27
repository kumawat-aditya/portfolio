import type { ReactNode } from "react";

/* ============================================================================
   MARKS
   ----------------------------------------------------------------------------
   The small vocabulary every scene is drawn with: hairlines with ruler ticks,
   hand-drawn arrows, misregistered display type, margin notes.

   Deliberately not cards, not rounded boxes, not shadows.
   ========================================================================= */

type HandMarkKind =
  | "arrow-down-right"
  | "arrow-down-left"
  | "arrow-up-right"
  | "arrow-right"
  | "arrow-left"
  | "arrow-left-short"
  | "underline"
  | "ring"
  | "bracket";

/**
 * Hand-drawn marks. The paths are intentionally slightly wrong — uneven
 * curvature, overshooting arrowheads, an underline that doesn't finish flat.
 * A perfect arrow reads as UI; a crooked one reads as someone's pen.
 */
export function HandMark({
  kind,
  className = "",
  width = 44,
}: {
  kind: HandMarkKind;
  className?: string;
  width?: number;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  switch (kind) {
    case "arrow-down-right":
      return (
        <svg
          viewBox="0 0 40 40"
          width={width}
          className={className}
          aria-hidden="true"
        >
          <path d="M3 4c9.5.4 20 4.6 26.5 15.4C31 21.8 32 25 32.4 30" {...shared} />
          <path d="M26 24.4c2.2 3 4.5 5 6.6 6.4 1-2.7 2.6-5.2 4.6-7.4" {...shared} />
        </svg>
      );
    case "arrow-down-left":
      return (
        <svg
          viewBox="0 0 40 40"
          width={width}
          className={className}
          aria-hidden="true"
        >
          <path d="M37 4c-9.6.6-20.2 4.9-26.7 15.7C8.8 22 7.8 25.2 7.4 30" {...shared} />
          <path d="M14 24.6c-2.3 3-4.6 4.9-6.7 6.3-1-2.7-2.6-5.3-4.6-7.5" {...shared} />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg
          viewBox="0 0 40 40"
          width={width}
          className={className}
          aria-hidden="true"
        >
          <path d="M3 36c9.5-.5 20-4.7 26.5-15.5C31 18.1 32 15 32.4 10" {...shared} />
          <path d="M26 15.5c2.2-3 4.5-5 6.6-6.4 1 2.7 2.6 5.2 4.6 7.4" {...shared} />
        </svg>
      );
    case "arrow-right":
      return (
        <svg
          viewBox="0 0 56 18"
          width={width}
          className={className}
          aria-hidden="true"
        >
          <path d="M2 10.4c14-1.4 31-2.6 50-3.2" {...shared} />
          <path d="M44.5 2.4c2.6 2 5 3.6 7.5 4.7-2.3 1.6-4.4 3.6-6.3 6" {...shared} />
        </svg>
      );
    case "arrow-left":
      return (
        <svg
          viewBox="0 0 72 22"
          width={width}
          className={className}
          aria-hidden="true"
        >
          <path d="M70 11.6C50 9.4 28 8.8 6 12.2" {...shared} />
          <path d="M16 5.2c-3 2.4-5.8 4.2-9.2 5.6 2.6 1.5 5 3.8 7.2 6.6" {...shared} />
        </svg>
      );
    case "arrow-left-short":
      return (
        <svg
          viewBox="0 0 38 22"
          width={width}
          className={className}
          aria-hidden="true"
        >
          <path d="M36 10.6C27 9.2 16 9.4 6 12.2" {...shared} />
          <path d="M16 5.2c-3 2.4-5.8 4.2-9.2 5.6 2.6 1.5 5 3.8 7.2 6.6" {...shared} />
        </svg>
      );
    case "underline":
      return (
        <svg
          viewBox="0 0 120 12"
          width={width}
          className={className}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M2 6.5c24-3.2 56-4.4 116-2.1" {...shared} />
          <path
            d="M6 10c26-2.6 58-3.4 108-1.6"
            {...shared}
            strokeWidth={1}
            opacity={0.55}
          />
        </svg>
      );
    case "ring":
      return (
        <svg
          viewBox="0 0 120 56"
          width={width}
          className={className}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M62 4C31 2 6 12 5 27c-1 14 24 25 57 25 30 0 53-10 53-24C115 14 92 5 62 4c-4 0-8 .3-12 .8"
            {...shared}
          />
        </svg>
      );
    case "bracket":
      return (
        <svg
          viewBox="0 0 14 120"
          width={width}
          className={className}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M11 2C5.5 3 2.5 22 2.6 60c.1 37 3 56 8.4 58" {...shared} />
        </svg>
      );
  }
}

/**
 * Two margin notes, two compositions.
 * Arrival drops a diagonal onto the counter from above.
 * The quiet scene sits beside it and points in from the right.
 * The stroke leaves the words and the head meets the ticker.
 */
export type CalloutVariant = "arrival" | "quiet";

const CALLOUT: Record<
  CalloutVariant,
  { tip: { x: number; y: number }; across: number; down: number; outset?: number }
> = {
  arrival: { tip: { x: 7.4 / 40, y: 30 / 40 }, across: 0.86, down: 0.22 },
  quiet: { tip: { x: 6 / 38, y: 12.2 / 22 }, across: 1, down: 0.5, outset: 12 },
};

export function CornerCallout({
  children,
  variant,
}: {
  children: ReactNode;
  variant: CalloutVariant;
}) {
  if (variant === "arrival") {
    return (
      <div
        data-corner-callout
        data-callout="arrival"
        className="pointer-events-none absolute top-0 left-0 z-[120] flex flex-col items-start gap-2.5"
      >
        <MarginNote lean={-1.6} className="whitespace-nowrap leading-tight">
          {children}
        </MarginNote>
        <HandMark
          kind="arrow-down-left"
          width={42}
          className="mr-1 w-[2.6rem] text-vermillion"
        />
      </div>
    );
  }

  return (
    <div
      data-corner-callout
      data-callout="quiet"
      className="pointer-events-none absolute top-0 left-0 z-[120] flex items-center gap-2"
    >
      <HandMark
        kind="arrow-left-short"
        width={40}
        className="w-[2.35rem] text-vermillion"
      />
      <MarginNote lean={1.2} className="whitespace-nowrap leading-tight">
        {children}
      </MarginNote>
    </div>
  );
}

/**
 * Seats a callout so its own arrow tip meets its own point on the ticker.
 * X is against the section, so a letterboxed column still finds the
 * viewport-fixed instrument. Y is authored as if the scene fills the viewport.
 */
export function seatOnInstrument(
  section: HTMLElement,
  anchor: HTMLElement,
  variant: CalloutVariant,
) {
  const instrument = document.querySelector<HTMLElement>(".instrument");
  const arrow = anchor.querySelector<SVGSVGElement>("svg");
  if (!instrument || !arrow) return;

  const pin = instrument.getBoundingClientRect();
  const frame = section.getBoundingClientRect();
  const host = anchor.getBoundingClientRect();
  const mark = arrow.getBoundingClientRect();

  if (pin.height < 8 || pin.top < 0 || pin.top > window.innerHeight) return;
  if (mark.width < 4) return;

  const { tip, across, down, outset = 0 } = CALLOUT[variant];
  const tipX = mark.left - host.left + mark.width * tip.x;
  const tipY = mark.top - host.top + mark.height * tip.y;

  const aimX = pin.left - frame.left + pin.width * across + outset;
  const aimY = pin.top + pin.height * down;
  const left = aimX - tipX;
  const top = aimY - tipY;

  if (!Number.isFinite(left) || !Number.isFinite(top)) return;
  if (top < 0 || top > section.offsetHeight) return;

  anchor.style.left = `${left}px`;
  anchor.style.top = `${top}px`;
  anchor.style.bottom = "auto";
}

/**
 * The margin. Somebody's afterthought, written next to the thing it doubts.
 * `lean` is in degrees — never zero, because nothing handwritten is level.
 */
export function MarginNote({
  children,
  className = "",
  lean = -2.4,
  mark,
  markClassName = "",
  markWidth,
}: {
  children: ReactNode;
  className?: string;
  lean?: number;
  mark?: HandMarkKind;
  markClassName?: string;
  markWidth?: number;
}) {
  return (
    <span
      className={`voice-margin relative inline-block ${className}`}
      style={{ transform: `rotate(${lean}deg)` }}
    >
      {children}
      {mark ? (
        <HandMark
          kind={mark}
          width={markWidth}
          className={`pointer-events-none absolute ${markClassName}`}
        />
      ) : null}
    </span>
  );
}

/** the machine's voice: small, tracked out, always factual */
export function Readout({
  children,
  className = "",
  tone = "faint",
}: {
  children: ReactNode;
  className?: string;
  tone?: "faint" | "ink" | "alarm" | "live" | "paper";
}) {
  const tones = {
    faint: "text-ink-faint",
    ink: "text-ink",
    alarm: "text-vermillion-ink",
    live: "text-live",
    paper: "text-on-night/70",
  };
  return (
    <span className={`voice-readout ${tones[tone]} ${className}`}>{children}</span>
  );
}

/**
 * A hairline with ruler ticks. Structure you can see the edge of — the site's
 * substitute for borders, dividers and shadows.
 */
export function Rule({
  className = "",
  ticks = true,
  vertical = false,
}: {
  className?: string;
  ticks?: boolean;
  vertical?: boolean;
}) {
  const tickStyle = vertical
    ? {
        backgroundImage:
          "repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 11px)",
        width: "4px",
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 11px)",
        height: "4px",
      };

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none block text-rule ${className}`}
    >
      <span
        className={
          vertical
            ? "block h-full w-px bg-current"
            : "block h-px w-full bg-current"
        }
      />
      {ticks ? (
        <span className="block opacity-70" style={tickStyle} />
      ) : null}
    </span>
  );
}

/**
 * Risograph misregistration: the same word printed twice, one plate slightly
 * off. Used only on words the page wants you to distrust or notice.
 */
export function Misprint({
  children,
  className = "",
  offset = "0.06em",
  plate = "text-vermillion",
}: {
  children: ReactNode;
  className?: string;
  offset?: string;
  plate?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 select-none ${plate} misprint-plate opacity-60`}
        style={{ transform: `translate(${offset}, ${offset})` }}
      >
        {children}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}

/** a section's index card: the number and name of where you are */
export function SceneTag({
  index,
  children,
  tone = "faint",
  className = "",
}: {
  index: string;
  children: ReactNode;
  tone?: "faint" | "paper";
  className?: string;
}) {
  return (
    // tagged so the corner instrument knows to get out of the way when a scene
    // marker scrolls through its corner
    <div data-scene-tag className={`flex items-baseline gap-3 ${className}`}>
      <Readout tone={tone}>{index}</Readout>
      <span
        aria-hidden="true"
        className={`h-px w-8 translate-y-[-0.2em] ${
          tone === "paper" ? "bg-on-night/30" : "bg-rule"
        }`}
      />
      <Readout tone={tone}>{children}</Readout>
    </div>
  );
}
