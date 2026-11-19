
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

type Props = {
  images: string[];
};

const MAX_VISIBLE = 7;
const SHUFFLE_INTERVAL = 5000;
const REARRANGE_EVERY = 3;

const tileSizes = [
  "col-span-2 row-span-2",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

function randomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffledOrder(count: number) {
  const values = Array.from(
    { length: count },
    (_, index) => index
  );

  for (let i = values.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);

    [values[i], values[j]] = [values[j], values[i]];
  }

  return values;
}

export default function AnimatedGallery({
  images,
}: Props) {
  const count = Math.min(MAX_VISIBLE, images.length);

  const [visibleImages, setVisibleImages] = useState<number[]>(
    () => Array.from({ length: count }, (_, i) => i)
  );

  const [order, setOrder] = useState<number[]>(
    () => Array.from({ length: count }, (_, i) => i)
  );

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setVisibleImages(
      Array.from({ length: count }, (_, i) => i)
    );

    setOrder(
      Array.from({ length: count }, (_, i) => i)
    );
  }, [count, images]);

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;

    let ticks = 0;

    const timer = window.setInterval(() => {
      if (document.hidden) return;

      ticks++;

      setVisibleImages((current) => {
        if (current.length < 1) return current;

        const next = [...current];

        // Select a random tile.
        const slot = randomIndex(next.length);

        // Prefer an image that isn't already visible.
        const available = images
          .map((_, index) => index)
          .filter((index) => !next.includes(index));

        if (available.length > 0) {
          next[slot] =
            available[randomIndex(available.length)];
        } else if (next.length > 1) {
          // If all images are visible, swap two tiles.
          const other =
            (slot + 1 + randomIndex(next.length - 1)) %
            next.length;

          [next[slot], next[other]] = [
            next[other],
            next[slot],
          ];
        }

        return next;
      });

      // Rearrange the mosaic every 15 seconds.
      if (ticks % REARRANGE_EVERY === 0) {
        setOrder((current) => {
          let updated = shuffledOrder(current.length);

          // Avoid keeping the same arrangement.
          if (updated.every((v, i) => v === current[i])) {
            updated = [...current].reverse();
          }

          return updated;
        });
      }
    }, SHUFFLE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [images, reduceMotion]);

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="The Social Out photo gallery"
      className="bg-black px-4 py-20 sm:px-6 lg:px-12"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10">
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-[#9E1010]">
            The Social Out / Experiences
          </p>

          <h2 className="font-heading text-4xl font-bold uppercase leading-none text-white sm:text-6xl lg:text-7xl">
            Moments
            <span className="block text-[#9E1010]">
              In Motion.
            </span>
          </h2>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-2 auto-rows-[110px] gap-2 sm:auto-rows-[160px] lg:grid-cols-4 lg:auto-rows-[190px] lg:gap-3">
          {visibleImages.map((imageIndex, slot) => (
            <motion.div
              key={slot}
              layout="position"
              style={{
                order: order[slot],
              }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 140,
                  damping: 25,
                },
              }}
              className={`relative min-h-0 overflow-hidden rounded-sm bg-[#111111] ${
                tileSizes[slot]
              }`}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={images[imageIndex]}
                  className="absolute inset-0"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, scale: 1.04 }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.02,
                  }}
                  transition={{
                    duration: 0.85,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={images[imageIndex]}
                    alt="The Social Out event moment"
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
