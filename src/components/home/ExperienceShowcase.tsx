"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ReelPlayer from "@/components/home/ReelPlayer";

type ExperienceShowcaseProps = {
  images: string[];
  reels: string[];
};

type WordPressTerm = {
  id: number;
};

type WordPressMedia = {
  source_url?: string;
  mime_type?: string;
  media_details?: {
    sizes?: {
      full?: { source_url?: string };
      large?: { source_url?: string };
    };
  };
};

const CMS = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesocialout.in"
).replace(/\/$/, "");

const SHUFFLE_INTERVAL = 5000;
const PHOTO_SLOTS = 4;
const REEL_SLOTS = 3;

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function initialSelection(total: number, slots: number): number[] {
  return Array.from({ length: Math.min(total, slots) }, (_, index) => index);
}

/** Replace one or two random tiles without repeating currently visible media. */
function shuffleRandomTiles(current: number[], total: number): number[] {
  if (total < 2 || current.length < 2) return current;

  const next = [...current];
  const availableSlots = current.map((_, index) => index);
  const unusedMedia = Array.from({ length: total }, (_, index) => index).filter(
    (index) => !current.includes(index),
  );

  const requestedChanges = 1 + randomInt(2);
  const maxChanges = Math.min(
    requestedChanges,
    current.length - 1,
    unusedMedia.length,
  );

  if (maxChanges > 0) {
    for (let i = 0; i < maxChanges; i++) {
      const slot = availableSlots.splice(
        randomInt(availableSlots.length),
        1,
      )[0];
      const replacement = unusedMedia.splice(
        randomInt(unusedMedia.length),
        1,
      )[0];
      next[slot] = replacement;
    }
    return next;
  }

  const first = randomInt(current.length);
  let second = randomInt(current.length - 1);
  if (second >= first) second += 1;
  [next[first], next[second]] = [next[second], next[first]];
  return next;
}

/** Gallery and reels retain independent shuffle timers. */
function useIndependentShuffle(total: number, slots: number) {
  const reducedMotion = useReducedMotion();
  const [indexes, setIndexes] = useState<number[]>(() =>
    initialSelection(total, slots),
  );

  useEffect(() => {
    setIndexes(initialSelection(total, slots));
  }, [total, slots]);

  useEffect(() => {
    if (reducedMotion || total < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setIndexes((current) => shuffleRandomTiles(current, total));
    }, SHUFFLE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [total, reducedMotion]);

  return { indexes, reducedMotion };
}

/** Fetch the image assigned to the WordPress Media Section slug "reel-bg". */
function useReelBackground(): string | null {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBackground() {
      try {
        const termsResponse = await fetch(
          `${CMS}/wp-json/wp/v2/socialout_media_sections?slug=reel-bg`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!termsResponse.ok) throw new Error("Unable to load media section");

        const terms: WordPressTerm[] = await termsResponse.json();
        const termId = terms[0]?.id;
        if (!termId) return;

        const mediaResponse = await fetch(
          `${CMS}/wp-json/wp/v2/media?socialout_media_sections=${termId}&per_page=100`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!mediaResponse.ok)
          throw new Error("Unable to load background media");

        const media: WordPressMedia[] = await mediaResponse.json();
        const background = media.find((item) =>
          item.mime_type?.startsWith("image/"),
        );
        if (!background || controller.signal.aborted) return;

        setBackgroundUrl(
          background.media_details?.sizes?.full?.source_url ??
            background.source_url ??
            null,
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Could not load the reel-bg image:", error);
        }
      }
    }

    void loadBackground();
    return () => controller.abort();
  }, []);

  return backgroundUrl;
}

const photoShapes = [
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-1 lg:row-span-2",
];

export default function ExperienceShowcase({
  images,
  reels,
}: ExperienceShowcaseProps) {
  const photos = useIndependentShuffle(images.length, PHOTO_SLOTS);
  const videos = useIndependentShuffle(reels.length, REEL_SLOTS);
  const reelBackground = useReelBackground();

  return (
    <>
      {/* ABOUT US + IMAGE GALLERY */}
      <section
        id="about"
        className="bg-black px-5 py-24 text-white md:px-10 lg:px-12 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.3em] text-[#9E1010]">
              The Social Out / Our Story
            </p>

            {/* <h2 className="font-heading text-5xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl xl:text-7xl">
              Beyond
              <span className="block">The</span>
              <span className="block text-[#9E1010]">Ordinary.</span>
            </h2> */}

            <p className="mt-8 max-w-lg font-body text-base leading-8 text-white/65">
              Great experiences shouldn&apos;t be limited to the same cities and
              the same audiences.
            </p>

            <p className="mt-4 max-w-lg font-body text-base leading-8 text-white/65">
              Social Out is an artist management and entertainment company
              dedicated to bringing fresh music, emerging talent, and
              unforgettable nightlife experiences to new cities. We connect
              audiences with emerging, independent, and international DJs and
              artists, creating unique events that celebrate music, energy, and
              connection. From artist management and bookings to collaborations
              and live entertainment, our mission is to redefine nightlife
              through fresh sounds, exciting performances, and memorable
              experiences. We don’t just bring artists to your city. We bring
              new sounds, new energy, and new reasons to go out. This is Social
              Out. And we’re just getting started.
            </p>

            {/* <Link
              href="/about/"
              className="mt-10 inline-flex items-center gap-3 border-b border-[#9E1010] pb-3 font-heading text-sm font-semibold uppercase tracking-widest transition-colors hover:text-[#9E1010]"
            >
              Discover Our Story
              <ArrowUpRight size={18} />
            </Link> */}
          </div>

          <div
            className="grid grid-cols-2 auto-rows-[145px] gap-2 sm:auto-rows-[190px] lg:grid-cols-6 lg:auto-rows-[105px] lg:gap-3"
            aria-label="The Social Out photo gallery"
          >
            {Array.from({ length: PHOTO_SLOTS }, (_, slot) => {
              const imageIndex = photos.indexes[slot];
              const src =
                imageIndex === undefined ? undefined : images[imageIndex];

              return (
                <div
                  key={slot}
                  className={`relative col-span-1 row-span-1 overflow-hidden bg-[#141414] ${photoShapes[slot] ?? ""}`}
                >
                  {src && (
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={src}
                        className="absolute inset-0"
                        initial={
                          photos.reducedMotion
                            ? false
                            : { opacity: 0, scale: 1.035 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.015 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                      >
                        <Image
                          src={src}
                          alt={`The Social Out event moment ${slot + 1}`}
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 45vw, 50vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REELS: WORDPRESS IMAGE BACKGROUND + RESPONSIVE VIDEO LAYOUT */}
      {reels.length > 0 && (
        <section
          id="reels"
          className="relative isolate overflow-hidden bg-black px-5 py-24 text-white md:px-10 lg:px-12 lg:py-32"
        >
          {/* CMS background image: no hardcoded URL or extra red texture layers. */}
          {reelBackground && (
            <Image
              src={reelBackground}
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              sizes="100vw"
              className="pointer-events-none z-0 object-cover"
            />
          )}

          {/* Keep headings readable over a bright or detailed background. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-black/55"
          />

          <div className="relative z-10 mx-auto max-w-[1500px]">
            <p className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
              The Social Out / Experiences
            </p>

            <h2 className="mb-12 font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-7xl">
              Moments In
              <span className="text-[#E04545]"> Motion.</span>
            </h2>

            {/* Mobile: one reel per swipe. Desktop: 3 columns, taller center. */}
            <div
              className="flex snap-x snap-mandatory items-center gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:items-center md:gap-5 md:overflow-visible md:pb-0"
              aria-label="The Social Out experience reels"
              aria-roledescription="carousel"
            >
              {Array.from({ length: REEL_SLOTS }, (_, slot) => {
                const videoIndex = videos.indexes[slot];
                const src =
                  videoIndex === undefined ? undefined : reels[videoIndex];

                return (
                  <div
                    key={slot}
                    className={`relative w-full min-w-0 shrink-0 snap-center overflow-hidden bg-[#141414] aspect-[9/16] md:shrink ${
                      slot === 1 ? "md:aspect-[9/16]" : "md:aspect-[4/5]"
                    }`}
                  >
                    {src && (
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={src}
                          className="absolute inset-0"
                          initial={
                            videos.reducedMotion ? false : { opacity: 0 }
                          }
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                          <ReelPlayer
                            src={src}
                            label={`Experience reel ${slot + 1}`}
                          />
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center font-body text-xs uppercase tracking-[0.2em] text-white/70 md:hidden">
              Swipe to explore reels
            </p>
          </div>
        </section>
      )}
    </>
  );
}
