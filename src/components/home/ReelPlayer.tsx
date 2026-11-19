
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

type ReelPlayerProps = {
  src: string;
  label: string;
};

export default function ReelPlayer({
  src,
  label,
}: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    video.play().catch(() => {
      setPlaying(false);
    });
  }, [src]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        setPlaying(false);
      });
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(event) =>
          setMuted(event.currentTarget.muted)
        }
        className="h-full w-full object-cover"
      />

      {/* Video controls */}
      <div
        className="absolute inset-x-0 bottom-0
          flex items-center justify-between
          bg-gradient-to-t from-black/70
          via-black/20 to-transparent
          px-4 pb-4 pt-12"
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={
            playing ? "Pause reel" : "Play reel"
          }
          className="flex h-10 w-10 items-center
            justify-center rounded-full
            border border-white/20
            bg-black/45 text-white
            backdrop-blur-sm transition-all
            hover:bg-[#9E1010]"
        >
          {playing ? (
            <Pause size={17} fill="currentColor" />
          ) : (
            <Play size={17} fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={
            muted ? "Unmute reel" : "Mute reel"
          }
          className="flex h-10 w-10 items-center
            justify-center rounded-full
            border border-white/20
            bg-black/45 text-white
            backdrop-blur-sm transition-all
            hover:bg-[#9E1010]"
        >
          {muted ? (
            <VolumeX size={19} />
          ) : (
            <Volume2 size={19} />
          )}
        </button>
      </div>
    </div>
  );
}
