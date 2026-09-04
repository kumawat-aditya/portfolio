"use client";

import { MarginNote, Readout, SceneTag } from "@/components/primitives/marks";
import { PulseTrace } from "@/components/objects/PulseTrace";
import { getElapsedMs, useHeartbeat } from "@/lib/heartbeat";
import { person } from "@/content/site";

/* ============================================================================
   07 — THE DOOR, LEFT OPEN                                             [warm]
   ----------------------------------------------------------------------------
   No "let's work together", no contact form, no buttons, no social icons in
   circles. Three plain underlined links and a receipt.

   The receipt is the point: the corner has been counting since you arrived,
   and here it tells you exactly how long you stayed and how many laps you
   witnessed. Then it admits, in the margin, that the loop is not actually
   immortal — which is the honest version of the joke.
   ========================================================================= */

const LINKS = [
  { label: "email", value: person.email, href: `mailto:${person.email}` },
  { label: "github", value: person.github.replace("https://", ""), href: person.github },
  {
    label: "linkedin",
    value: person.linkedin.replace("https://www.", ""),
    href: person.linkedin,
  },
];

const stayed = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
};

export function Closing() {
  const ticks = useHeartbeat();

  return (
    <footer
      aria-label="Ways in"
      className="relative flex min-h-[92svh] flex-col justify-between overflow-clip px-[6vw] pt-[12vh] pb-[16vh]"
    >
      <div>
        <SceneTag index="07">the door, left open</SceneTag>

        {/* the last line uses the whole room, because there is nothing after it */}
        <h2 className="voice-display text-giant mt-[8vh] text-ink">
          <span className="block">The lights</span>
          <span className="block md:pl-[34%]">stay on.</span>
        </h2>
      </div>

      <div className="mt-[10vh]">
        <PulseTrace className="mb-9" />

        <div className="flex flex-col gap-y-10 md:flex-row md:items-end md:justify-between md:gap-x-16">
          {/* ---- three plain links, no chrome ---------------------------
              stacked on a phone: the longest of these URLs does not fit
              beside its label at any readable size */}
          <ul className="flex flex-col gap-3.5">
            {LINKS.map((link) => (
              <li
                key={link.label}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <Readout className="sm:w-16 sm:shrink-0">{link.label}</Readout>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="voice-prose group text-ink underline decoration-rule decoration-1 underline-offset-[6px] transition-colors hover:text-vermillion-ink hover:decoration-vermillion"
                >
                  {link.value}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block opacity-0 transition-all duration-300 ease-[var(--ease-instrument)] group-hover:translate-x-1 group-hover:opacity-60"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* ---- the receipt -------------------------------------------- */}
          <div className="md:max-w-[30ch] md:text-right">
            <Readout tone="ink" className="block tabular-nums">
              you stayed {stayed(getElapsedMs())} · {ticks} laps
            </Readout>
            <MarginNote lean={1.5} className="mt-4 block">
              somewhere a loop is still running.
              <br />
              not this one. this one stops
              <br />
              when you close the tab.
            </MarginNote>
          </div>
        </div>

        <p className="voice-readout mt-[10vh] text-ink-faint">
          {person.name} · {person.location} · built by hand, mostly at night
        </p>
      </div>
    </footer>
  );
}
