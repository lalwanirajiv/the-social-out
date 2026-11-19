"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import ExperienceShowcase from "@/components/home/ExperienceShowcase";
import { getSiteMedia, type SiteMedia } from "@/lib/wordpress";
import ContactUs from "@/components/home/ContactUs";

const emptyMedia: SiteMedia = {
  gallery: [],
  reels: [],
  heroVideo: null,
};

export default function HomeContent() {
  const [media, setMedia] = useState<SiteMedia>(emptyMedia);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadMedia() {
      try {
        const result = await getSiteMedia();
        console.log("WordPress media:", result);
        console.log("Hero video URL:", result.heroVideo);

        if (active) {
          setMedia(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          console.error("WordPress CMS error:", err);
          setError("Unable to load media from WordPress.");
        }
      }
    }

    loadMedia();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <Hero videoUrl={media.heroVideo} />

      <ExperienceShowcase images={media.gallery} reels={media.reels} />
      <ContactUs />
      {error && (
        <p
          role="alert"
          className="bg-black px-6 py-4 text-center text-sm text-red-400"
        >
          {error}
        </p>
      )}
    </>
  );
}
