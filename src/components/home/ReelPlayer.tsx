"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type ReelPlayerProps = {
  src: string;
  label: string;
  loop?: boolean;
  onEnded?: () => void;
  onInteraction?: () => void;
};

export default function ReelPlayer({
  src,
  label,
  loop = true,
  onEnded,
  onInteraction,
}: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Autoplay muted whenever the video changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    setMuted(true);
    setPlaying(false);

    video.play().catch(() => {
      setPlaying(false);
    });
  }, [src]);

  // Play or pause the video.
  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    // Notify the parent that the user interacted.
    onInteraction?.();

    if (video.paused) {
      video.play().catch(() => {
        setPlaying(false);
      });
    } else {
      video.pause();
    }
  }

  // Mute or unmute the video.
  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    // Notify the parent that the user interacted.
    onInteraction?.();

    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div className="relative h-full w-full">
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop={loop}
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(event) => {
          setMuted(event.currentTarget.muted);
        }}
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />

      {/* CUSTOM VIDEO CONTROLS */}
      <div
        className="absolute inset-x-0 bottom-0
          flex items-center justify-between
          bg-gradient-to-t from-black/70
          via-black/20 to-transparent
          px-4 pb-4 pt-12"
      >
        {/* PLAY / PAUSE */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause reel" : "Play reel"}
          title={playing ? "Pause" : "Play"}
          className="flex h-10 w-10 items-center
            justify-center rounded-full
            border border-white/20
            bg-black/45 text-white
            backdrop-blur-sm
            transition-all duration-300
            hover:border-[#9E1010]
            hover:bg-[#9E1010]
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-white"
        >
          {playing ? (
            <Pause size={17} fill="currentColor" />
          ) : (
            <Play size={17} fill="currentColor" />
          )}
        </button>

        {/* MUTE / UNMUTE */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute reel" : "Mute reel"}
          title={muted ? "Unmute" : "Mute"}
          className="flex h-10 w-10 items-center
            justify-center rounded-full
            border border-white/20
            bg-black/45 text-white
            backdrop-blur-sm
            transition-all duration-300
            hover:border-[#9E1010]
            hover:bg-[#9E1010]
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-white"
        >
          {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
        </button>
      </div>
    </div>
  );
}
