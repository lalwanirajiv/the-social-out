"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const heroHeadline = "Live Love Dance";

type HeroProps = {
  videoUrl: string | null;
};

export default function Hero({ videoUrl }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Play the video muted when its URL changes.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoUrl) {
      setPlaying(false);
      return;
    }

    video.muted = true;
    setMuted(true);

    video.play().catch(() => {
      setPlaying(false);
    });
  }, [videoUrl]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <section
      className="relative flex min-h-screen items-end
        overflow-hidden bg-black"
    >
      {/* WordPress CMS background video */}
      {videoUrl && (
        <video
          ref={videoRef}
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src={videoUrl}
            type={
              videoUrl.split("?")[0].toLowerCase().endsWith(".webm")
                ? "video/webm"
                : "video/mp4"
            }
          />
        </video>
      )}

      {/* Cinematic gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0
          bg-gradient-to-t from-black
          via-black/35 to-black/30"
      />

      {/* Bottom-centered headline and tagline */}
      <div
        className="relative z-10 mx-auto w-full max-w-[1500px]
          px-6 pb-16 pt-40 text-center
          md:px-12 md:pb-24"
      >
        <div className="min-w-0">
          <h2
            className="whitespace-nowrap font-heading
              text-[19px] font-bold uppercase
              leading-[0.9] tracking-tight
              text-white md:text-[79px]"
          >
            {heroHeadline}
          </h2>

          <p
            className="mt-3 font-body text-lg
              font-normal leading-6 text-white/65
              md:mt-0 md:text-xl md:leading-7"
          >
            NEW CITIES. NEW STAGES.{" "}
            <span className="block md:inline">UNFORGETTABLE STORIES.</span>
          </p>
        </div>
      </div>

      {/* Hero video controls - bottom right */}
      {videoUrl && (
        <div
          className="absolute bottom-4 right-4 z-20
            flex items-center gap-2
            sm:bottom-6 sm:right-6
            md:bottom-8 md:right-10"
        >
          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              playing ? "Pause background video" : "Play background video"
            }
            title={playing ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center
              justify-center rounded-full
              border border-white/25
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

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={
              muted ? "Unmute background video" : "Mute background video"
            }
            title={muted ? "Unmute" : "Mute"}
            className="flex h-10 w-10 items-center
              justify-center rounded-full
              border border-white/25
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
      )}
    </section>
  );
}
