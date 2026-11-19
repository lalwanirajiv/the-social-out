
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";

type ExperienceShowcaseProps = {
  images: string[];
  reels: string[];
};

const SHUFFLE_INTERVAL = 5000;
const PHOTO_SLOTS = 4;
const REEL_SLOTS = 3;

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function initialSelection(total: number, slots: number) {
  return Array.from(
    { length: Math.min(total, slots) },
    (_, index) => index
  );
}

/**
 * Independently replace 1 or 2 random tiles.
 *
 * - Never changes every tile at once.
 * - Never introduces duplicate visible media.
 * - Prefers unseen media.
 * - If all media is already visible, swaps two tiles.
 */
function shuffleRandomTiles(
  current: number[],
  total: number
): number[] {
  if (total < 2 || current.length < 2) {
    return current;
  }

  const next = [...current];

  const availableSlots = current.map(
    (_, index) => index
  );

  const unusedMedia = Array.from(
    { length: total },
    (_, index) => index
  ).filter((index) => !current.includes(index));

  // Randomly choose one or two slots,
  // but always keep at least one other tile still.
  const requestedChanges = 1 + randomInt(2);
  const maxChanges = Math.min(
    requestedChanges,
    current.length - 1,
    unusedMedia.length
  );

  if (maxChanges > 0) {
    for (let i = 0; i < maxChanges; i++) {
      const slotPosition = randomInt(
        availableSlots.length
      );

      const slot = availableSlots.splice(
        slotPosition,
        1
      )[0];

      const mediaPosition = randomInt(
        unusedMedia.length
      );

      const replacement = unusedMedia.splice(
        mediaPosition,
        1
      )[0];

      next[slot] = replacement;
    }

    return next;
  }

  // No unused images/videos left:
  // swap two random positions instead.
  // Other tiles remain in exactly the same positions.
  const first = randomInt(current.length);

  let second = randomInt(current.length - 1);

  if (second >= first) {
    second += 1;
  }

  [next[first], next[second]] = [
    next[second],
    next[first],
  ];

  return next;
}

/**
 * Each collection has its own independent timer.
 */
function useIndependentShuffle(
  total: number,
  slots: number
) {
  const reducedMotion = useReducedMotion();

  const [indexes, setIndexes] = useState<number[]>(
    () => initialSelection(total, slots)
  );

  useEffect(() => {
    setIndexes(initialSelection(total, slots));
  }, [total, slots]);

  useEffect(() => {
    if (reducedMotion || total < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      if (document.hidden) return;

      setIndexes((current) =>
        shuffleRandomTiles(current, total)
      );
    }, SHUFFLE_INTERVAL);

    return () => {
      window.clearInterval(timer);
    };
  }, [total, reducedMotion]);

  return {
    indexes,
    reducedMotion,
  };
}

/**
 * Fixed asymmetric layout:
 *
 * Tile 1: Large square
 * Tile 2: Wide horizontal rectangle
 * Tile 3: Medium rectangle
 * Tile 4: Small vertical rectangle
 */
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
  const photos = useIndependentShuffle(
    images.length,
    PHOTO_SLOTS
  );

  const videos = useIndependentShuffle(
    reels.length,
    REEL_SLOTS
  );

  return (
    <>
      {/* =================================
          ABOUT US + IMAGE GALLERY
      ================================= */}
      <section
        id="about"
        className="bg-black px-5 py-24 text-white md:px-10 lg:px-12 lg:py-36"
      >
        <div
          className="mx-auto grid max-w-[1500px]
            items-center gap-12
            lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        >
          {/* LEFT: About Us */}
          <div className="max-w-xl">
            <p
              className="mb-6 font-body text-xs
                font-semibold uppercase
                tracking-[0.3em] text-[#9E1010]"
            >
              The Social Out / Our Story
            </p>

            <h2
              className="font-heading text-5xl
                font-bold uppercase
                leading-[0.98] tracking-tight
                sm:text-6xl xl:text-7xl"
            >
              Beyond
              <span className="block">
                The
              </span>
              <span className="block text-[#9E1010]">
                Ordinary.
              </span>
            </h2>

            <p
              className="mt-8 max-w-lg
                font-body text-base leading-8
                text-white/65"
            >
              Great experiences shouldn&apos;t be
              limited to the same cities and
              the same audiences.
            </p>

            <p
              className="mt-4 max-w-lg
                font-body text-base leading-8
                text-white/65"
            >
              Based in Ahmedabad, The Social Out
              brings artists, entertainment,
              and fresh energy to places where
              they haven&apos;t performed before.
              Our goal is to create meaningful,
              unforgettable first-time moments.
            </p>

            <Link
              href="/about/"
              className="mt-10 inline-flex
                items-center gap-3 border-b
                border-[#9E1010] pb-3
                font-heading text-sm font-semibold
                uppercase tracking-widest
                transition-colors hover:text-[#9E1010]"
            >
              Discover Our Story
              <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* RIGHT: Four differently sized tiles */}
          <div
            className="grid grid-cols-2
              auto-rows-[145px] gap-2
              sm:auto-rows-[190px]
              lg:grid-cols-6
              lg:auto-rows-[105px] lg:gap-3"
            aria-label="The Social Out photo gallery"
          >
            {Array.from({ length: PHOTO_SLOTS }, (_, slot) => {
              const imageIndex = photos.indexes[slot];
              const src = imageIndex === undefined ? undefined : images[imageIndex];

              return (
                <div
                  key={slot}
                  className={`relative
                    col-span-1 row-span-1
                    overflow-hidden bg-[#141414]
                    ${photoShapes[slot] ?? ""}`}
                >
                  {src && <AnimatePresence initial={false}>
                    <motion.div
                      key={src}
                      className="absolute inset-0"
                      initial={
                        photos.reducedMotion
                          ? false
                          : {
                              opacity: 0,
                              scale: 1.035,
                            }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 1.015,
                      }}
                      transition={{
                        duration: 0.9,
                        ease: "easeInOut",
                      }}
                    >
                      <Image
                        src={src}
                        alt={`The Social Out event moment ${
                          slot + 1
                        }`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 45vw, 50vw"
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================
          INDEPENDENT REELS SECTION
      ================================= */}
      {reels.length > 0 && (
        <section
          id="reels"
          className="bg-black px-5 py-24
            text-white md:px-10 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-[1500px]">
            <p
              className="mb-5 font-body text-xs
                font-semibold uppercase
                tracking-[0.3em] text-[#9E1010]"
            >
              The Social Out / Experiences
            </p>

            <h2
              className="mb-12 font-heading
                text-4xl font-bold uppercase
                tracking-tight sm:text-5xl
                lg:text-7xl"
            >
              Moments In
              <span className="text-[#9E1010]">
                {" "}Motion.
              </span>
            </h2>

            <div
              className="grid grid-cols-2
                items-center gap-3
                md:grid-cols-3 md:gap-5"
              aria-label="The Social Out experience reels"
            >
              {Array.from({ length: REEL_SLOTS }, (_, slot) => {
                const videoIndex = videos.indexes[slot];
                const src = videoIndex === undefined ? undefined : reels[videoIndex];

                const reelSizes = [
                  "aspect-[3/5]",
                  "aspect-[9/16]",
                  "aspect-[4/5]",
                ];

                return (
                  <div
                    key={slot}
                    className={`relative
                      w-full overflow-hidden
                      bg-[#141414]
                      ${reelSizes[slot]}`}
                  >
                    {src && <AnimatePresence initial={false}>
                      <motion.div
                        key={src}
                        className="absolute inset-0"
                        initial={
                          videos.reducedMotion
                            ? false
                            : { opacity: 0 }
                        }
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                        }}
                      >
                        <video
                          src={src}
                          autoPlay={!videos.reducedMotion}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-label={`Experience reel ${
                            slot + 1
                          }`}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
