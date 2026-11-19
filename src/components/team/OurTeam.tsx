"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const CMS = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesocialout.in"
).replace(/\/$/, "");

type WordPressTerm = {
  id: number;
};

type WordPressMedia = {
  id: number;
  source_url: string;
  mime_type: string;
  media_details?: {
    sizes?: {
      large?: {
        source_url: string;
      };
      full?: {
        source_url: string;
      };
    };
  };
};

type TeamImages = {
  jatin: string | null;
  heany: string | null;
};

// ==========================================
// WORDPRESS MEDIA SECTION IMAGE FETCHING
// ==========================================

async function fetchSectionImage(
  slug: string,
  signal: AbortSignal,
): Promise<string | null> {
  const termResponse = await fetch(
    `${CMS}/wp-json/wp/v2/socialout_media_sections?slug=${encodeURIComponent(
      slug,
    )}`,
    { signal },
  );

  if (!termResponse.ok) {
    throw new Error(`Unable to load media section: ${slug}`);
  }

  const terms: WordPressTerm[] = await termResponse.json();

  if (!terms.length) return null;

  const mediaResponse = await fetch(
    `${CMS}/wp-json/wp/v2/media?socialout_media_sections=${terms[0].id}&per_page=20`,
    { signal },
  );

  if (!mediaResponse.ok) {
    throw new Error(`Unable to load images: ${slug}`);
  }

  const media: WordPressMedia[] = await mediaResponse.json();

  const image = media.find((item) => item.mime_type?.startsWith("image/"));

  return (
    image?.media_details?.sizes?.large?.source_url ?? image?.source_url ?? null
  );
}

// ==========================================
// REVEAL ANIMATION
// ==========================================

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: 28,
            }
      }
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
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// TEAM PORTRAIT
// ==========================================

function TeamPortrait({ src, name }: { src: string | null; name: string }) {
  return (
    <div className="relative w-full">
      <div
        className="relative h-[360px] w-full
          overflow-hidden bg-[#171717]
          sm:h-[450px]
          lg:h-[min(65vh,650px)]"
      >
        {src ? (
          <Image
            src={src}
            alt={`${name} — The Social Out`}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover
              transition-transform duration-700
              hover:scale-[1.035]"
          />
        ) : (
          <div
            className="absolute inset-0 flex
              items-center justify-center
              bg-gradient-to-br
              from-[#202020] to-[#090909]"
          >
            <span
              className="font-heading text-xs
                uppercase tracking-[0.2em]
                text-white/35"
            >
              Portrait Coming Soon
            </span>
          </div>
        )}

        {/* Subtle image gradient */}
        <div
          className="pointer-events-none
            absolute inset-0
            bg-gradient-to-t
            from-black/35 via-transparent
            to-transparent"
        />
      </div>

      {/* Nameplate */}
      <div
        className="relative mx-auto -mt-7
          w-[85%] bg-[#9E1010]
          px-5 py-4 text-center shadow-xl"
      >
        <h3
          className="font-heading text-xl
            font-bold uppercase tracking-tight
            text-white md:text-2xl"
        >
          {name}
        </h3>
      </div>
    </div>
  );
}

// ==========================================
// JATIN JAWRANI — COMPLETE CONTENT
// ==========================================

const jatinStory = [
  `Behind Social Out and Stay Social is Jatin Jawrani, an entrepreneur driven by his passion for music, artists, entertainment, and creating experiences that bring people together.`,

  `With hands-on experience in the entertainment and nightlife industry, Jatin has worked with 20+ artists across multiple music genres, including Spiritual, Techno, Melodic and Progressive Techno, EDM, and Bollywood.`,

  `His journey also extends into the world of spiritual entertainment through his association with Chal Man Vrindavan, a platform dedicated to bringing spiritual concerts and immersive spiritual experiences to audiences. Through this initiative, he has been part of experiences that have reached approximately 2.5 lakh people across India, contributing to a growing space where spirituality, music, and large-scale live experiences come together.`,

  `His work goes beyond artist management. From discovering and developing new talent to artist bookings, event production, stage designing, and executing live entertainment experiences, he believes in understanding every part of the industry that brings an event to life.`,

  `His vision is simple: to give talented artists the opportunities and platforms they deserve, introduce fresh sounds to new audiences, and bring artists to cities and stages where their music has never been experienced before.`,

  `Through Social Out and Stay Social, he aims to build meaningful connections between artists, brands, promoters, and audiences while creating opportunities that go beyond individual events.`,

  `For Jatin, the entertainment industry is not just about shows, bookings, or business. It’s about people, passion, creativity, relationships, and the ability to turn an idea into an experience.`,
];

// ==========================================
// HEANY PAMNANI — COMPLETE CONTENT
// ==========================================

const heanyStory = [
  `Behind the vision and operations of our ventures is Heany Pamnani, a dynamic professional with over 10 years of experience in the marketing and creative industries.`,

  `With a deep understanding of brand communication, creative strategy, artist management, and client relationships, Heany brings a unique combination of creativity, professionalism, and business insight to everything she does.`,

  `Over the years, she has built strong relationships across the industry and developed the ability to understand people, manage artists, handle clients, and bring creative ideas to life. Her strength lies in managing multiple aspects of a business while ensuring that every project receives the attention, planning, and execution it deserves.`,

  `As Co-Founder, she plays an integral role in shaping the vision, managing operations, building relationships, and driving the growth of the companies. From behind-the-scenes planning to important business decisions, her contribution is an essential part of everything we build.`,

  `Known for her dedication, leadership, and ability to manage things with confidence, Heany believes that successful businesses are built not just on great ideas, but on strong relationships, teamwork, consistency, and trust.`,
];

// ==========================================
// REUSABLE FOUNDER PROFILE
// ==========================================

type FounderProfileProps = {
  label: string;
  name: string;
  image: string | null;
  paragraphs: string[];
  closingStatement: string;
  index: string;
  reverse?: boolean;
};

function FounderProfile({
  label,
  name,
  image,
  paragraphs,
  closingStatement,
  index,
  reverse = false,
}: FounderProfileProps) {
  return (
    <section
      className="px-5 py-20
        md:px-10 lg:px-12 lg:py-28"
    >
      <div
        className={`mx-auto grid max-w-[1500px]
    items-start gap-12 lg:gap-20
    ${reverse ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[0.8fr_1.2fr]"}`}
      >
        {/* STICKY PORTRAIT */}
        <div
          className={`relative min-w-0 self-start
    lg:sticky lg:top-32
    ${reverse ? "lg:order-2" : "lg:order-1"}`}
        >
          <Reveal>
            <TeamPortrait src={image} name={name} />
          </Reveal>
        </div>

        {/* COMPLETE BIOGRAPHY */}
        <div className={`min-w-0 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
          <Reveal>
            <div
              className="mb-5 flex items-center
                gap-4"
            >
              <span
                className="font-body text-xs
                  font-semibold tracking-widest
                  text-[#E04545]"
              >
                {index}
              </span>

              <div
                className="h-px w-10
                  bg-[#9E1010]"
              />

              <span
                className="font-body text-xs
                  font-semibold uppercase
                  tracking-[0.2em]
                  text-[#E04545]"
              >
                {label}
              </span>
            </div>

            <h2
              className="font-heading text-4xl
                font-bold uppercase leading-[1]
                tracking-tight sm:text-5xl
                xl:text-6xl"
            >
              {name.split(" ")[0]}
              <span
                className="block mt-2
                  text-[#9E1010]"
              >
                {name.split(" ").slice(1).join(" ")}
              </span>
            </h2>

            <div
              className="my-9 h-[2px] w-16
                bg-[#9E1010]"
            />
          </Reveal>

          {/* COMPLETE STORY */}
          <div className="space-y-7">
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i}>
                <p
                  className="font-body text-base
                    leading-8 text-white/70
                    md:text-lg md:leading-9"
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          {/* SIGNATURE CLOSING */}
          <Reveal>
            <blockquote
              className="mt-12 border-l-[3px]
                border-[#9E1010] pl-6"
            >
              <p
                className="font-heading text-xl
                  font-semibold leading-relaxed
                  text-white md:text-2xl"
              >
                {closingStatement}
              </p>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN OUR TEAM COMPONENT
// ==========================================

export default function OurTeam() {
  const [images, setImages] = useState<TeamImages>({
    jatin: null,
    heany: null,
  });

  // Fetch WordPress images.
  useEffect(() => {
    const controller = new AbortController();

    async function loadImages() {
      const results = await Promise.allSettled([
        fetchSectionImage("founder-1", controller.signal),
        fetchSectionImage("founder-2", controller.signal),
      ]);

      if (controller.signal.aborted) return;

      setImages({
        jatin: results[0].status === "fulfilled" ? results[0].value : null,

        heany: results[1].status === "fulfilled" ? results[1].value : null,
      });
    }

    void loadImages();

    return () => controller.abort();
  }, []);

  return (
    <main
      className="min-h-screen bg-black
        text-white"
    >
      {/* =====================================
          PAGE INTRODUCTION
      ===================================== */}
      <section
        className="px-5 pb-16 pt-44
          md:px-10 md:pb-24 md:pt-52
          lg:px-12"
      >
        <Reveal
          className="mx-auto max-w-[1500px]
            text-center"
        >
          <p
            className="mb-6 font-body text-xs
              font-semibold uppercase
              tracking-[0.3em]
              text-[#E04545]"
          >
            The Social Out / The People
          </p>

          <h1
            className="font-heading
              text-6xl font-bold uppercase
              leading-[0.95] tracking-tight
              sm:text-7xl lg:text-[110px]"
          >
            OUR <span className="text-[#9E1010]">TEAM.</span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl
              font-body text-base leading-8
              text-white/60 md:text-lg"
          >
            The minds behind the <span className="text-[#9E1010]">experiences.</span>
          </p>
        </Reveal>
      </section>

      {/* =====================================
          01 — JATIN JAWRANI
      ===================================== */}
      <FounderProfile
        index="01"
        label="Meet The Founder"
        name="Jatin Jawrani"
        image={images.jatin}
        paragraphs={jatinStory}
        closingStatement={
          "Always discovering. Always creating. Always building something bigger."
        }
      />

      {/* PROFILE DIVIDER */}
      <div
        className="mx-auto max-w-[1500px]
          px-5 md:px-10 lg:px-12"
      >
        <div
          className="h-px w-full
            bg-white/15"
        />
      </div>

      {/* =====================================
          02 — HEANY PAMNANI
      ===================================== */}
      <FounderProfile
        index="02"
        label="Meet The Co-Founder"
        name="Heany Pamnani"
        image={images.heany}
        paragraphs={heanyStory}
        closingStatement={
          "Creative in her thinking. Strong in her execution. Essential to everything we build."
        }
        reverse
      />

      {/* =====================================
          CLOSING STATEMENT
      ===================================== */}
      <section
        className="relative isolate
          overflow-hidden bg-[#9E1010]
          px-5 py-24 text-center
          md:px-10 lg:px-12 lg:py-36"
      >
        {/* Subtle gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none
            absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.10), transparent 65%), linear-gradient(to bottom, transparent, rgba(0,0,0,0.25))",
          }}
        />

        <Reveal
          className="relative z-10
            mx-auto max-w-[1100px]"
        >
          <p
            className="mb-6 font-body text-xs
              font-semibold uppercase
              tracking-[0.3em]
              text-white/75"
          >
            The Social Out
          </p>

          <h2
            className="font-heading
              text-4xl font-bold uppercase
              leading-tight tracking-tight
              sm:text-5xl lg:text-7xl"
          >
            THE PEOPLE BEHIND
            <span className="block text-[#000000]">THE EXPERIENCES.</span>
          </h2>

          <p
            className="mx-auto mt-8 max-w-xl
              font-body text-base leading-8
              text-white/80 md:text-lg"
          >
            Driven by passion, creativity, and a shared vision to create
            experiences that bring people together.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
