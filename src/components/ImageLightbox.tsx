import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  title?: string;
  children?: React.ReactNode;
}

export default function ImageLightbox({
  src,
  alt,
  title,
  children,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDist = useRef(0);

  const close = useCallback(() => {
    setOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const clampZoom = useCallback((z: number) => Math.min(Math.max(z, 1), 5), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Block wheel scroll globally to stop Lenis smooth scroll from moving the page
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

  // Scroll wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom((prev) => {
        const next = clampZoom(prev + delta);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    },
    [clampZoom],
  );

  // Mouse drag for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...pan };
    },
    [zoom, pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: panStart.current.x + (e.clientX - dragStart.current.x),
        y: panStart.current.y + (e.clientY - dragStart.current.y),
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for pinch zoom + drag
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist.current = Math.hypot(dx, dy);
      } else if (e.touches.length === 1 && zoom > 1) {
        setIsDragging(true);
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        panStart.current = { ...pan };
      }
    },
    [zoom, pan],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastTouchDist.current > 0) {
          const scale = dist / lastTouchDist.current;
          setZoom((prev) => {
            const next = clampZoom(prev * scale);
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
          });
        }
        lastTouchDist.current = dist;
      } else if (e.touches.length === 1 && isDragging) {
        setPan({
          x: panStart.current.x + (e.touches[0].clientX - dragStart.current.x),
          y: panStart.current.y + (e.touches[0].clientY - dragStart.current.y),
        });
      }
    },
    [isDragging, clampZoom],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchDist.current = 0;
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="group/lb relative w-full text-left cursor-zoom-in"
        aria-label={`Expand ${title || alt}`}
      >
        {children}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-bg/0 group-hover/lb:bg-bg/40 transition-all duration-300 rounded-lg">
          <div className="opacity-0 group-hover/lb:opacity-100 transform scale-90 group-hover/lb:scale-100 transition-all duration-300 flex items-center gap-2 bg-bg-surface/80 backdrop-blur-sm border border-border-subtle px-3 py-1.5 rounded-full">
            <ZoomIn size={14} className="text-accent-blue" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
              Expand
            </span>
          </div>
        </div>
      </button>

      {/* Lightbox */}
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
              {/* Top bar: title + controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {title && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                      <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted font-mono">
                        {title}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {zoom > 1 && (
                    <span className="text-[10px] font-mono text-text-muted">
                      {Math.round(zoom * 100)}%
                    </span>
                  )}
                  <button
                    onClick={() => setZoom((z) => clampZoom(z + 0.5))}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded border border-border-subtle hover:border-border-hover"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const next = clampZoom(zoom - 0.5);
                      setZoom(next);
                      if (next === 1) setPan({ x: 0, y: 0 });
                    }}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded border border-border-subtle hover:border-border-hover"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  {zoom > 1 && (
                    <button
                      onClick={resetZoom}
                      className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded border border-border-subtle hover:border-border-hover"
                      aria-label="Reset zoom"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  <button
                    onClick={close}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs font-mono rounded border border-border-subtle hover:border-border-hover ml-2"
                    aria-label="Close"
                  >
                    <span className="hidden md:inline uppercase tracking-wider text-[10px]">
                      ESC
                    </span>
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Image with zoom + pan */}
              <div
                ref={containerRef}
                className="rounded-xl overflow-hidden border border-border-subtle bg-[#08080c] shadow-2xl shadow-black/40"
                style={{
                  cursor:
                    zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={() => {
                  if (zoom > 1) resetZoom();
                  else setZoom(2.5);
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto max-h-[80vh] object-contain select-none"
                  draggable={false}
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transition: isDragging
                      ? "none"
                      : "transform 0.15s ease-out",
                    transformOrigin: "center center",
                  }}
                />
              </div>

              {/* Zoom hint */}
              {zoom === 1 && (
                <div className="mt-2 text-center">
                  <span className="text-[9px] font-mono text-text-muted/50 uppercase tracking-wider">
                    Scroll to zoom · Double-click to enlarge · Pinch on touch
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
