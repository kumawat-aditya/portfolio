"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MarginNote, Readout, Rule } from "@/components/primitives/marks";
import { catalog, PULLS_TO_DRAWER, roomVoice } from "@/lib/theme";

/* ============================================================================
   THE OTHER ROOMS
   ----------------------------------------------------------------------------
   Opened by pulling the plumb five times. Not a settings panel. A specimen
   sheet of every palette that already exists in theme.json.
   ========================================================================= */

export function RoomDrawer({
  open,
  current,
  pulls,
  onChoose,
  onClose,
}: {
  open: boolean;
  current: string;
  pulls: number;
  onChoose: (name: string) => void;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=closed]:animate-[veil-out_240ms_ease-in] data-[state=open]:animate-[veil-in_320ms_ease-out] fixed inset-0 z-[110] bg-night/70" />
        <Dialog.Content
          aria-describedby={undefined}
          className="data-[state=closed]:animate-[drawer-out_280ms_cubic-bezier(0.6,0.05,0.15,1)] data-[state=open]:animate-[drawer-in_520ms_cubic-bezier(0.16,1,0.3,1)] fixed inset-x-0 bottom-0 z-[111] flex max-h-[calc(86*var(--vh))] flex-col bg-paper-raised"
          style={{
            clipPath:
              "polygon(0 calc(2.6 * var(--vw)), 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-6 px-[calc(6*var(--vw))] pt-[calc(5.5*var(--vw))] pb-4 sm:pt-[calc(3.6*var(--vw))]">
            <Readout className="pt-1">
              {pulls} pulls · {catalog.length} rooms
            </Readout>
            <Dialog.Close className="voice-machine text-ink-faint underline decoration-rule decoration-1 underline-offset-[5px] hover:text-vermillion-ink hover:decoration-vermillion">
              leave it
            </Dialog.Close>
          </div>

          <div className="quiet-scroll min-h-0 flex-1 overflow-y-auto px-[calc(6*var(--vw))] pb-[calc(8*var(--vh))]">
            <Dialog.Title className="voice-display text-loud text-ink">
              you kept pulling.
            </Dialog.Title>
            <MarginNote lean={-1.8} className="mt-4 block max-w-[36ch]">
              {pulls >= PULLS_TO_DRAWER * 2
                ? "still at it. the drawer was never locked."
                : "five pulls. that is usually enough."}
            </MarginNote>

            <p className="voice-prose mt-8 max-w-[52ch]">
              These are the rooms the site already knows. Pick one. The plumb
              will still cycle them if you cannot leave it alone.
            </p>

            <ul className="mt-[calc(8*var(--vh))] grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-[calc(4*var(--vw))]">
              {catalog.map((theme) => {
                const voice = roomVoice[theme.name] ?? {
                  title: theme.name,
                  note: theme.scheme,
                };
                const selected = theme.name === current;
                return (
                  <li key={theme.name}>
                    <button
                      type="button"
                      onClick={() => {
                        onChoose(theme.name);
                        onClose();
                      }}
                      className="group w-full text-left"
                    >
                      <span
                        aria-hidden="true"
                        className="block h-[4.5rem] w-full"
                        style={{
                          background: `linear-gradient(90deg, ${theme.accent.vermillion} 0 4px, ${theme.surface.paper} 4px 72%, ${theme.surface.paperDeep} 72%)`,
                        }}
                      />
                      <Rule className="mt-3" ticks={false} />
                      <span className="mt-3 flex items-baseline justify-between gap-4">
                        <span className="voice-display text-say text-ink transition-colors group-hover:text-vermillion-ink">
                          {voice.title}
                        </span>
                        {selected ? (
                          <Readout tone="live">this one</Readout>
                        ) : (
                          <Readout>open it</Readout>
                        )}
                      </span>
                      <span className="voice-prose mt-2 block">{voice.note}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
