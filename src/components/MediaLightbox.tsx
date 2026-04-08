import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

interface MediaLightboxProps {
  type: "image" | "video";
  src: string;
  alt?: string;
  caption?: string;
  children: React.ReactNode;
}

export default function MediaLightbox({
  type,
  src,
  alt,
  caption,
  children,
}: MediaLightboxProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const blockWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", blockWheel, { passive: false });
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", blockWheel);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      {/* Trigger wrapper */}
      <div
        className="relative group/media cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {children}
        {/* Expand icon — top right on hover */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-md bg-bg/70 backdrop-blur-sm border border-border-subtle text-text-muted opacity-0 group-hover/media:opacity-100 transition-opacity duration-200 hover:text-text-primary hover:border-border-hover z-10"
          aria-label="Expand"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Expanded view */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8"
            onClick={close}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-bg/90 backdrop-blur-md" />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[90vw] max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {caption && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                      <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted font-mono">
                        {caption}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={close}
                  className="p-1.5 text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs font-mono rounded border border-border-subtle hover:border-border-hover"
                  aria-label="Close"
                >
                  <span className="hidden md:inline uppercase tracking-wider text-[10px]">
                    ESC
                  </span>
                  <X size={14} />
                </button>
              </div>

              {/* Media content */}
              <div className="rounded-xl overflow-hidden border border-border-subtle bg-[#08080c] shadow-2xl shadow-black/40">
                {type === "image" ? (
                  <img
                    src={src}
                    alt={alt || ""}
                    className="w-full h-auto max-h-[80vh] object-contain select-none"
                    draggable={false}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[80vh]"
                    style={{ outline: "none" }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
