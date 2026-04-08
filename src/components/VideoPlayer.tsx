import { useRef, useState, useCallback } from "react";
import { PictureInPicture2, Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export default function VideoPlayer({
  src,
  caption,
  autoPlay = true,
  loop = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(false);
  const [pipSupported] = useState(
    () =>
      "pictureInPictureEnabled" in document && document.pictureInPictureEnabled,
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        // Unmute for PiP so it's useful
        video.muted = false;
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP not available or user denied
    }
  }, []);

  return (
    <div
      className="rounded-lg overflow-hidden border border-border-subtle bg-bg-surface/30 group/vid relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted
        playsInline
        preload="metadata"
        className="w-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Hover controls overlay */}
      <div
        className={`absolute inset-0 flex items-end justify-between p-3 transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,12,0.7) 0%, transparent 50%)",
        }}
      >
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-bg-surface/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {pipSupported && (
          <button
            onClick={togglePiP}
            className="p-2 rounded-full bg-bg-surface/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:text-accent-blue transition-colors flex items-center gap-1.5"
            aria-label="Picture in Picture"
          >
            <PictureInPicture2 size={14} />
            <span className="text-[9px] font-mono uppercase tracking-wider hidden sm:inline">
              PiP
            </span>
          </button>
        )}
      </div>

      {caption && (
        <div className="px-4 py-2 border-t border-border-subtle">
          <p className="text-[10px] font-mono text-text-muted">{caption}</p>
        </div>
      )}
    </div>
  );
}
