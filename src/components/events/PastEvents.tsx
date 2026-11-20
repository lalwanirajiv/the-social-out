"use client";

import ReelPlayer from "@/components/home/ReelPlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ImageIcon, MapPin, Play } from "lucide-react";

import { getCityMedia, type EventMedia } from "@/lib/pastEventsMedia";

// =============================================
// CONFIGURATION
// =============================================

const IMAGE_DURATION = 5000;

const CMS = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesocialout.in"
).replace(/\/$/, "");

type HeroTerm = {
  id: number;
};

type HeroMedia = {
  id: number;
  source_url: string;
  mime_type: string;
  media_details?: {
    sizes?: {
      large?: { source_url: string };
    };
  };
};

async function getPastEventsHero(signal: AbortSignal): Promise<string | null> {
  const termsResponse = await fetch(
    `${CMS}/wp-json/wp/v2/socialout_media_sections?slug=past-events-hero`,
    { signal },
  );

  if (!termsResponse.ok) {
    throw new Error("Unable to load hero media section");
  }

  const terms: HeroTerm[] = await termsResponse.json();

  if (!terms.length) return null;

  const mediaResponse = await fetch(
    `${CMS}/wp-json/wp/v2/media?socialout_media_sections=${terms[0].id}&per_page=100`,
    { signal },
  );

  if (!mediaResponse.ok) {
    throw new Error("Unable to load hero image");
  }

  const media: HeroMedia[] = await mediaResponse.json();

  const image = media.find((item) => item.mime_type?.startsWith("image/"));

  return (
    image?.media_details?.sizes?.large?.source_url ?? image?.source_url ?? null
  );
}

type City = {
  name: string;
  slug: string;
  chapter: string;
  location: string;
  events: {
    title: string;
    description: string;
    attendance: string;
  }[];
};

const cities: City[] = [
  {
    name: "Ahmedabad",
    slug: "ahmedabad",
    chapter: "01",
    location: "Gujarat",
    events: [
      {
        title: "Bollytech Split",
        description:
          "An energetic event featuring Ruru Thakur as the headlining artist, alongside DJ Karmari, Honey’sh & Barely Unknown. The event witnessed an incredible crowd of approximately 1,200 attendees.",
        attendance: "~1,200 attendees",
      },
      {
        title: "Pre-Navratri Celebration",
        description:
          "A spectacular festive celebration featuring a Live Band and the renowned Lalo Dholi, bringing traditional Gujarati energy and music to life. The event welcomed over 1,500 attendees.",
        attendance: "1,500+ attendees",
      },
    ],
  },
  {
    name: "Indore",
    slug: "indore",
    chapter: "02",
    location: "Madhya Pradesh",
    events: [
      {
        title: "Club Show",
        description:
          "An electrifying club night headlined by Ruru Thakur, alongside Abhay Music & Dynamic Duo. The event witnessed an impressive turnout of over 2,200 attendees.",
        attendance: "2,200+ attendees",
      },
    ],
  },
];

// =============================================
// SCROLL REVEAL
// =============================================

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =============================================
// FEATURED PHOTO / REEL
// =============================================

function FeaturedMedia({
  item,
  city,
  onVideoEnded,
  onVideoInteraction,
}: {
  item: EventMedia;
  city: string;
  onVideoEnded: () => void;
  onVideoInteraction: () => void;
}) {
  if (item.type === "image") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#101010]">
        <Image
          src={item.src}
          alt={`${city} event photograph`}
          fill
          unoptimized
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <ReelPlayer
      src={item.src}
      label={`${city} event reel`}
      loop={false}
      onEnded={onVideoEnded}
      onInteraction={onVideoInteraction}
    />
  );
}

// =============================================
// MEDIA THUMBNAIL
// =============================================

function MediaThumbnail({
  item,
  active,
}: {
  item: EventMedia;
  active: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {item.type === "image" ? (
        <Image
          src={item.src}
          alt=""
          fill
          unoptimized
          sizes="160px"
          className="object-cover"
        />
      ) : (
        <>
          <video
            src={item.src}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0
              h-full w-full object-cover"
          />

          <div
            className="pointer-events-none
              absolute inset-0
              flex items-center justify-center
              bg-black/25"
          >
            <div
              className="flex h-10 w-10
                items-center justify-center
                rounded-full
                border border-white/50
                bg-black/45"
            >
              <Play size={18} fill="currentColor" className="text-white" />
            </div>
          </div>
        </>
      )}

      {active && (
        <div
          className="pointer-events-none
            absolute inset-0
            border-2 border-[#E04545]"
        />
      )}
    </div>
  );
}

// =============================================
// MIXED MEDIA CAROUSEL
// =============================================

function MediaCarousel({ items, city }: { items: EventMedia[]; city: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [userInteracted, setUserInteracted] = useState(false);

  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = useReducedMotion();

  const active =
    items.length > 0
      ? items[Math.min(activeIndex, items.length - 1)]
      : undefined;

  // Reset selection when the media collection changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;

      setUserInteracted(false);
      setActiveIndex((index + items.length) % items.length);
    },
    [items.length],
  );

  const next = useCallback(() => {
    setUserInteracted(false);
    setActiveIndex((current) =>
      items.length > 0 ? (current + 1) % items.length : 0,
    );
  }, [items.length]);

  const previous = useCallback(() => {
    setUserInteracted(false);
    setActiveIndex((current) =>
      items.length > 0 ? (current - 1 + items.length) % items.length : 0,
    );
  }, [items.length]);
  // Automatically advance photos after 5 seconds.
  // Videos advance when they finish playback.
  useEffect(() => {
    if (!active || items.length <= 1 || userInteracted || reducedMotion) {
      return;
    }

    const timer = window.setTimeout(() => {
      next();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [active, items.length, userInteracted, reducedMotion, next]);

  // Move thumbnail strip to the selected item,
  // without scrolling the entire webpage.
  useEffect(() => {
    const container = thumbnailsRef.current;
    const thumbnail =
      thumbnailRefs.current[Math.min(activeIndex, items.length - 1)];

    if (!container || !thumbnail) return;

    const target =
      thumbnail.offsetLeft -
      container.offsetLeft -
      (container.clientWidth - thumbnail.clientWidth) / 2;

    container.scrollTo({
      left: Math.max(0, target),
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [activeIndex, items.length, reducedMotion]);

  if (!active) {
    return (
      <div
        className="flex min-h-[360px]
          items-center justify-center
          border border-white/10
          bg-[#111111] px-6"
      >
        <div className="text-center">
          <ImageIcon size={30} className="mx-auto text-white/40" />

          <p
            className="mt-4 font-body
              text-sm text-white/50"
          >
            {city} event memories are coming soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* MAIN MEDIA VIEWER */}

      {/* MAIN MEDIA VIEWER */}
      <div
        className={`
    relative overflow-hidden
    transition-all duration-500

    ${
      active.type === "video"
        ? `
          mx-auto aspect-[9/16]
          w-full max-w-[340px]
          bg-[#141414]
          sm:max-w-[370px]
        `
        : `
          aspect-[4/5] w-full
          bg-[#141414]
          sm:aspect-[16/10]
        `
    }
  `}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            className="absolute inset-0"
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    scale: 1.02,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.35,
              ease: "easeInOut",
            }}
          >
            <FeaturedMedia
              item={active}
              city={city}
              onVideoEnded={() => {
                if (items.length > 1) next();
              }}
              onVideoInteraction={() => {
                setUserInteracted(true);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* COUNTER + NAVIGATION */}
      <div
        className="mt-6 flex items-center
          justify-between gap-4"
      >
        <div>
          <p
            className="font-body text-[10px]
              uppercase tracking-[0.25em]
              text-white/45"
          >
            Explore {city} Moments
          </p>

          <p
            className="mt-2 font-heading
              text-sm font-semibold text-white"
          >
            {String(Math.min(activeIndex, items.length - 1) + 1).padStart(
              2,
              "0",
            )}

            <span className="mx-2 text-[#E04545]">/</span>

            {String(items.length).padStart(2, "0")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previous}
            disabled={items.length < 2}
            aria-label={`Previous ${city} media`}
            className="flex h-11 w-11 items-center
              justify-center rounded-full
              border border-white/25
              text-white transition-colors
              hover:border-[#E04545]
              hover:bg-[#9E1010]
              disabled:opacity-30"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={next}
            disabled={items.length < 2}
            aria-label={`Next ${city} media`}
            className="flex h-11 w-11 items-center
              justify-center rounded-full
              border border-white/25
              text-white transition-colors
              hover:border-[#E04545]
              hover:bg-[#9E1010]
              disabled:opacity-30"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* AUTO-SCROLLING MIXED THUMBNAILS */}
      <div
        ref={thumbnailsRef}
        className="relative mt-6 flex
          snap-x snap-mandatory
          gap-3 overflow-x-auto
          overscroll-x-contain pb-3
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden"
        aria-label={`${city} media carousel`}
      >
        {items.map((item, index) => {
          const selected = Math.min(activeIndex, items.length - 1) === index;

          return (
            <button
              key={item.id}
              ref={(node) => {
                thumbnailRefs.current[index] = node;
              }}
              type="button"
              aria-label={`View ${city} ${
                item.type === "video" ? "reel" : "photo"
              } ${index + 1}`}
              aria-pressed={selected}
              onClick={() => goTo(index)}
              className={`
                relative aspect-[4/3]
                w-32 shrink-0 snap-center
                overflow-hidden bg-[#171717]
                transition-opacity duration-300
                sm:w-40
                ${selected ? "opacity-100" : "opacity-60 hover:opacity-100"}
              `}
            >
              <MediaThumbnail item={item} active={selected} />
            </button>
          );
        })}
      </div>

      {/* PROGRESS INDICATOR */}
      <div
        className="mt-3 h-[2px]
          w-full overflow-hidden
          bg-white/10"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#9E1010]
            transition-all duration-500"
          style={{
            width: `${
              ((Math.min(activeIndex, items.length - 1) + 1) / items.length) *
              100
            }%`,
          }}
        />
      </div>
    </div>
  );
}

// =============================================
// CITY CHAPTER
// =============================================

function CityChapter({
  city,
  reverse = false,
}: {
  city: City;
  reverse?: boolean;
}) {
  const [media, setMedia] = useState<EventMedia[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(false);

    getCityMedia(city.slug, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setMedia(items);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [city.slug]);

  return (
    <section
      id={city.slug}
      className="relative px-5 py-24
        md:px-10 lg:px-12 lg:py-36"
    >
      {/* SUBTLE CHAPTER AMBIENCE */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute inset-0"
        style={{
          background: reverse
            ? "radial-gradient(ellipse at 85% 30%, rgba(158,16,16,0.12), transparent 55%)"
            : "radial-gradient(ellipse at 15% 25%, rgba(158,16,16,0.12), transparent 55%)",
        }}
      />

      <div
        className={`
          relative mx-auto grid
          max-w-[1500px]
          items-start gap-12
          lg:gap-16
          ${
            reverse
              ? "lg:grid-cols-[1.35fr_0.65fr]"
              : "lg:grid-cols-[0.65fr_1.35fr]"
          }
        `}
      >
        {/* STICKY CITY INFORMATION */}
        <div
          className={`min-w-0 self-start
            lg:sticky lg:top-32
            ${reverse ? "lg:order-2" : "lg:order-1"}`}
        >
          <Reveal>
            <div
              className="mb-5 flex
                items-center gap-4"
            >
              <span
                className="font-heading text-xs
                  font-bold text-[#E04545]"
              >
                {city.chapter}
              </span>

              <div className="h-px w-12 bg-[#9E1010]" />

              <p
                className="font-body text-[10px]
                  uppercase tracking-[0.25em]
                  text-white/55"
              >
                City Chapter
              </p>
            </div>

            <h2
              className="font-heading
                text-5xl font-bold uppercase
                leading-[0.95] tracking-tight
                sm:text-6xl lg:text-7xl"
            >
              {city.name}
              <span className="text-[#9E1010]">.</span>
            </h2>

            <div
              className="mt-6 flex items-center
                gap-2 text-white/55"
            >
              <MapPin size={15} className="text-[#E04545]" />

              <span className="font-body text-sm">
                {city.name}, {city.location}
              </span>
            </div>

            {/* EVENTS INFORMATION */}
            <div className="mt-12 space-y-9">
              {city.events.map((event) => (
                <div
                  key={event.title}
                  className="border-l-2
                    border-[#9E1010] pl-5"
                >
                  <h3
                    className="font-heading
                      text-xl font-bold
                      uppercase text-white"
                  >
                    {event.title}
                  </h3>

                  <p
                    className="mt-4
                      font-body text-sm
                      leading-7 text-white/65"
                  >
                    {event.description}
                  </p>

                  <p
                    className="mt-4
                      font-body text-[11px]
                      font-semibold uppercase
                      tracking-[0.15em]
                      text-[#E04545]"
                  >
                    {event.attendance}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* CITY MEDIA */}
        <Reveal className={`min-w-0 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
          {loading ? (
            <div
              className="flex min-h-[450px]
                items-center justify-center
                bg-[#151515]"
            >
              <p
                className="font-body text-sm
                  text-white/50"
              >
                Loading {city.name} memories...
              </p>
            </div>
          ) : error ? (
            <div
              className="flex min-h-[450px]
                items-center justify-center
                bg-[#151515] p-8 text-center"
            >
              <p
                className="font-body text-sm
                  text-red-300"
              >
                Unable to load {city.name} media. Please try again later.
              </p>
            </div>
          ) : (
            <MediaCarousel items={media} city={city.name} />
          )}
        </Reveal>
      </div>
    </section>
  );
}

// =============================================
// MAIN PAST EVENTS PAGE
// =============================================

export default function PastEvents() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getPastEventsHero(controller.signal)
      .then((image) => {
        if (!controller.signal.aborted) {
          setHeroImage(image);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Failed to load Past Events hero image:", error);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* =============================================
    PAST EVENTS HERO
============================================= */}
      <section
        className="relative overflow-hidden bg-black
    px-5 pb-24 pt-40 text-white
    md:px-10 md:pt-48
    lg:px-12 lg:pb-32"
      >
        {/* Subtle background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 78% 35%, rgba(158,16,16,0.13), transparent 58%)",
          }}
        />

        <div
          className="relative mx-auto grid max-w-[1500px]
      items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          {/* LEFT — HEADING */}
          <Reveal>
            <p
              className="mb-7 font-body text-xs
          font-semibold uppercase tracking-[0.3em]
          text-[#E04545]"
            >
              The Social Out / Our History
            </p>

            <h1
              className="font-heading text-6xl
          font-bold uppercase leading-[0.9]
          tracking-tight sm:text-7xl
          lg:text-[100px]"
            >
              PAST
              <span className="block text-[#9E1010]">EVENTS.</span>
            </h1>

            <div className="mt-12 h-[2px] w-20 bg-[#9E1010]" />

            <h2
              className="mt-8 font-heading text-2xl
          font-semibold uppercase leading-tight
          md:text-3xl"
            >
              Moments That
              <span className="block text-[#E04545]">Made an Impact.</span>
            </h2>

            <p
              className="mt-6 max-w-xl font-body
          text-base leading-8 text-white/65
          md:text-lg"
            >
              At Social Out, every event is an opportunity to create
              unforgettable experiences. From high-energy club nights to festive
              celebrations, we bring together music, artists, and audiences to
              create memorable moments.
            </p>
          </Reveal>

          {/* RIGHT — WORDPRESS HERO IMAGE */}
          <Reveal className="relative min-w-0">
            <div
              className="relative aspect-[4/5] w-full
          overflow-hidden bg-[#141414]
          sm:aspect-[5/4] lg:aspect-[4/5]"
            >
              {heroImage && (
                <Image
                  src={heroImage}
                  alt="The Social Out past event experience"
                  fill
                  unoptimized
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover
              transition-transform duration-1000
              hover:scale-[1.04]"
                />
              )}

              {/* Cinematic overlay */}
              <div
                className="pointer-events-none absolute inset-0
            bg-gradient-to-t from-black/60
            via-transparent to-black/10"
              />

              {/* Decorative corner details */}
              <div
                className="pointer-events-none absolute
            left-5 top-5 h-10 w-10
            border-l border-t border-white/60"
              />

              <div
                className="pointer-events-none absolute
            bottom-5 right-5 h-10 w-10
            border-b border-r border-white/60"
              />

              {/* Small image caption */}
              <div
                className="absolute bottom-8 left-8
            right-8"
              >
                <p
                  className="font-body text-xs font-semibold
              uppercase tracking-[0.25em]
              text-white/85"
                >
                  The Nights We Remember
                </p>
              </div>
            </div>

            {/* Offset red accent */}
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3
          -z-10 h-28 w-28 bg-[#9E1010]
          md:-bottom-5 md:-right-5"
            />
          </Reveal>
        </div>
      </section>

      {/* AHMEDABAD */}
      <CityChapter city={cities[0]} />

      {/* SECTION DIVIDER */}
      <div
        className="mx-auto h-px
          max-w-[1500px]
          bg-white/15"
      />

      {/* INDORE */}
      <CityChapter city={cities[1]} reverse />

      {/* CLOSING SECTION */}
      <section
        className="relative border-t
          border-white/10 bg-[#0D0D0D]
          px-5 py-24 text-center
          md:px-10 lg:py-36"
      >
        <Reveal className="mx-auto max-w-[850px]">
          <p
            className="mb-6 font-body
              text-xs font-semibold
              uppercase tracking-[0.3em]
              text-[#E04545]"
          >
            More Memories Ahead
          </p>

          <h2
            className="font-heading
              text-4xl font-bold uppercase
              leading-tight md:text-6xl"
          >
            THE BEST NIGHTS
            <span className="block text-[#9E1010]">STAY WITH US.</span>
          </h2>

          <p
            className="mx-auto mt-8
              max-w-2xl font-body
              text-base leading-8
              text-white/65"
          >
            Explore a few glimpses from our past events through pictures and
            videos. These are just some of the unforgettable moments we’ve
            created, and there’s much more to come!
          </p>
        </Reveal>
      </section>
    </main>
  );
}
