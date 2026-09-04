"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Readout, Rule } from "@/components/primitives/marks";
import type { Project } from "@/content/site";

/* ============================================================================
   THE DRAWER
   ----------------------------------------------------------------------------
   "open it" — the deep writing lives here rather than on the homepage, so the
   wall can stay sparse and still be honest.

   Everything inside is verbatim from content.json: the problem, why it was
   hard, what was traded away, what broke, what it taught him. The headings are
   the only editorial layer, and they are written the way he'd say them.

   Radix Dialog handles focus trapping, Escape, scroll locking and aria wiring.
   The visuals are entirely ours — a drawer pulled out of the desk, cut in at
   the same angle as the dark scene, no rounded corners, no shadow, no blur.
   ========================================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 first:mt-0">
      <Readout tone="alarm" className="block">
        {label}
      </Readout>
      <Rule className="mt-1.5 mb-3 max-w-24" ticks={false} />
      {children}
    </div>
  );
}

function Listed({ items }: { items: string[] }) {
  return (
    <ul className="voice-prose space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.62em] size-[3px] shrink-0 bg-vermillion"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpecimenDrawer({
  project,
  index,
  total,
  onClose,
}: {
  project: Project | null;
  index: number;
  total: number;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open={project !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=closed]:animate-[veil-out_240ms_ease-in] data-[state=open]:animate-[veil-in_320ms_ease-out] fixed inset-0 z-[110] bg-ink/55" />
        <Dialog.Content
          aria-describedby={undefined}
          className="data-[state=closed]:animate-[drawer-out_280ms_cubic-bezier(0.6,0.05,0.15,1)] data-[state=open]:animate-[drawer-in_520ms_cubic-bezier(0.16,1,0.3,1)] fixed inset-x-0 bottom-0 z-[111] flex h-[90svh] flex-col bg-paper-raised"
          style={{ clipPath: "polygon(0 2.6vw, 100% 0, 100% 100%, 0 100%)" }}
        >
          {project ? (
            <>
              {/* ---- drawer front ------------------------------------ */}
              <div className="flex shrink-0 items-start justify-between gap-6 px-[6vw] pt-[5.5vw] pb-4 sm:pt-[3.6vw]">
                <Readout className="pt-1">
                  spec. {String(index + 1).padStart(2, "0")} / {total}
                </Readout>
                <Dialog.Close className="voice-machine group flex items-center gap-2 text-ink-faint transition-colors hover:text-vermillion-ink">
                  close
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 ease-[var(--ease-instrument)] group-hover:translate-y-0.5"
                  >
                    ↓
                  </span>
                </Dialog.Close>
              </div>

              {/* ---- contents ---------------------------------------- */}
              <div className="quiet-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-[6vw] pb-[14vh]">
                <Dialog.Title className="voice-display text-loud max-w-[26ch] text-ink">
                  {project.name}
                </Dialog.Title>
                <Readout className="mt-3 block max-w-[52ch]">
                  {project.fullTitle}
                </Readout>

                <p className="voice-prose mt-6 max-w-[62ch] text-ink">
                  {project.description}
                </p>

                <div className="mt-12 grid gap-x-[6vw] gap-y-2 md:grid-cols-2">
                  <div>
                    <Field label="the problem">
                      <p className="voice-prose max-w-[56ch]">{project.problem}</p>
                    </Field>
                    <Field label="why it was hard">
                      <p className="voice-prose max-w-[56ch]">{project.whyHard}</p>
                    </Field>
                    <Field label="what it actually does">
                      <p className="voice-prose max-w-[56ch]">{project.behaviour}</p>
                    </Field>
                  </div>

                  <div>
                    <Field label="what I traded away">
                      <Listed items={project.tradeoffs} />
                    </Field>
                    <Field label="what broke">
                      <Listed items={project.failurePoints} />
                    </Field>
                  </div>
                </div>

                {/* ---- the payoff, set like a pull quote --------------- */}
                <div className="mt-16 max-w-[34ch] md:max-w-[44ch]">
                  <Readout tone="alarm" className="block">
                    what I kept
                  </Readout>
                  <p className="voice-display text-say mt-4 text-ink">
                    {project.learned}
                  </p>
                </div>

                {/* ---- built with: a sentence, not a badge wall -------- */}
                <div className="mt-16 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
                  <div className="max-w-[46ch]">
                    <Readout className="block">built with</Readout>
                    <p className="voice-prose mt-1.5 text-ink">
                      {project.stack.join("  ·  ")}
                    </p>
                  </div>

                  {project.github.startsWith("http") ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="voice-machine group inline-flex items-baseline gap-2 text-ink underline decoration-rule decoration-1 underline-offset-[6px] transition-colors hover:text-vermillion-ink hover:decoration-vermillion"
                    >
                      read the source
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 ease-[var(--ease-instrument)] group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  ) : (
                    <p className="voice-margin shrink-0">
                      this one belongs to someone else. ask me about it.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
