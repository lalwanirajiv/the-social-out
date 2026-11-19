
"use client";

import { useEffect, useState } from "react";

const CMS_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ??
  "https://cms.thesocialout.in"
).replace(/\/$/, "");

const API_URL = `${CMS_URL}/wp-json/wp/v2`;

type MediaSection = {
  id: number;
};

type WordPressMedia = {
  id: number;
  source_url: string;
  mime_type: string;
};

export default function UpcomingShows() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadVideo() {
      try {
        // Get the upcoming-shows Media Section ID.
        const sectionResponse = await fetch(
          `${API_URL}/socialout_media_sections?slug=upcoming-shows`
        );

        if (!sectionResponse.ok) {
          throw new Error("Unable to load Media Section");
        }

        const sections: MediaSection[] =
          await sectionResponse.json();

        if (!sections.length) return;

        // Fetch media assigned to the section.
        const mediaResponse = await fetch(
          `${API_URL}/media?socialout_media_sections=${sections[0].id}&per_page=20`
        );

        if (!mediaResponse.ok) {
          throw new Error("Unable to load Upcoming Shows video");
        }

        const media: WordPressMedia[] =
          await mediaResponse.json();

        // WordPress can label MP4 attachments as "file",
        // so check mime_type instead of media_type.
        const video = media.find(
          (item) =>
            item.mime_type === "video/mp4" ||
            item.mime_type === "video/webm"
        );

        if (active) {
          setVideoUrl(video?.source_url ?? null);
        }
      } catch (error) {
        console.error("Upcoming Shows video error:", error);
      }
    }

    loadVideo();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      className="relative flex min-h-screen items-center
        justify-center overflow-hidden bg-black
        px-6 text-center text-white"
    >
      {/* WordPress-hosted background video */}
      {videoUrl && (
        <video
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src={videoUrl}
            type={
              videoUrl.toLowerCase().split("?")[0].endsWith(".webm")
                ? "video/webm"
                : "video/mp4"
            }
          />
        </video>
      )}

      {/* Cinematic dark overlay */}
      <div
        className="absolute inset-0
          bg-black/55"
      />

      {/* Coming Soon message */}
      <div className="relative z-10">
        <h1
          className="font-heading text-5xl font-bold
            uppercase leading-none tracking-tight
            sm:text-7xl lg:text-9xl"
        >
          COMING{" "}
          <span className="text-[#9E1010]">
            SOON.
          </span>
        </h1>

        <p
          className="mt-6 font-body text-sm
            font-medium uppercase tracking-[0.35em]
            text-white/80 sm:text-lg"
        >
          STAY TUNED.
        </p>
      </div>
    </main>
  );
}
