"use client";

import { useEffect, useRef } from "react";

const heroHeadline = "Live Love Dance";

type HeroProps = {
  videoUrl: string | null;
};

export default function Hero({ videoUrl }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Automatically play the video when its URL changes.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoUrl) return;

    video.muted = true;

    video.play().catch(() => {
      // Autoplay may be restricted by the browser.
    });
  }, [videoUrl]);

  return (
    <section
      className="relative flex min-h-screen items-end
        overflow-hidden bg-black"
    >
      {/* WordPress CMS background video */}
      {videoUrl && (
        <video
          key={videoUrl}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0
            h-full w-full object-cover"
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
    </section>
  );
}
