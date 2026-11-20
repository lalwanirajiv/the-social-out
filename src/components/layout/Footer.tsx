import Link from "next/link";
import CmsLogo from "@/components/layout/CmsLogo";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa6";

// ============================================
// NAVIGATION LINKS
// ============================================

const links = [
  { label: "Our Team", href: "/our-team/" },
  { label: "Upcoming Shows", href: "/experiences/" },
  { label: "Past Events", href: "/past-events/" },
  { label: "Stay Social", href: "/stay-social/" },
  { label: "Contact Us", href: "/contact/" },
];

// ============================================
// SOCIAL MEDIA LINKS
// Replace empty URLs with your actual profiles.
// ============================================

const socials = [
  {
    label: "Instagram",
    href: "",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "",
    icon: FaYoutube,
  },
  {
    label: "Facebook",
    href: "",
    icon: FaFacebookF,
  },
  {
    label: "LinkedIn",
    href: "",
    icon: FaLinkedinIn,
  },
];

export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden
        border-t border-white/10 bg-[#070405]
        text-white"
    >
      {/* ============================================
          CINEMATIC BACKGROUND
      ============================================ */}

      {/* Top-left red atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute
          -left-52 -top-80 h-[650px] w-[750px]
          rounded-full bg-[#9E1010]/20
          blur-[140px]"
      />

      {/* Bottom-right red atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute
          -bottom-96 -right-56
          h-[750px] w-[850px]
          rounded-full bg-[#9E1010]/20
          blur-[160px]"
      />

      {/* Top-left cinematic diagonal */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute left-0 top-0
          h-32 w-[45%]
          bg-gradient-to-br
          from-[#9E1010]/35
          via-[#9E1010]/10
          to-transparent
          [clip-path:polygon(0_0,100%_0,0_100%)]"
      />

      {/* Top-left fine red line */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute left-0 top-0
          h-px w-[40%]
          bg-gradient-to-r
          from-[#E04545]/70
          to-transparent"
      />

      {/* Bottom-right diagonal atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute bottom-0 right-0
          h-52 w-[50%]
          bg-gradient-to-tl
          from-[#9E1010]/20
          to-transparent
          [clip-path:polygon(100%_0,100%_100%,0_100%)]"
      />

      {/* ============================================
          MAIN FOOTER
      ============================================ */}

      <div
        className="relative z-10 mx-auto
          max-w-[1500px] px-6
          pb-16 pt-24
          md:px-10 md:pt-28
          lg:px-12 lg:pb-24 lg:pt-32"
      >
        <div
          className="grid gap-x-10 gap-y-16
            sm:grid-cols-2
            lg:grid-cols-[1.4fr_0.85fr_1fr_0.9fr]
            lg:gap-x-12"
        >
          {/* ====================================
              COLUMN 1 — BRAND
          ==================================== */}

          <div className="min-w-0">
            <Link
              href="/"
              aria-label="The Social Out — Home"
              className="inline-flex"
            >
              <CmsLogo
                width={240}
                height={90}
                className="h-auto max-h-16
                  w-52 object-contain
                  sm:w-56"
              />
            </Link>

            {/* Brand accent */}
            <div
              className="mt-8 h-[3px] w-16
                bg-gradient-to-r
                from-[#E04545]
                to-[#9E1010]"
            />

            <p
              className="mt-8 max-w-sm
                font-body text-[15px]
                leading-8 text-white/60"
            >
              Creating unforgettable entertainment experiences. Bringing new
              artists, new energy, and first-time moments to Ahmedabad and
              beyond.
            </p>

            <div
              className="mt-9 flex flex-wrap
                items-center gap-x-2 gap-y-2
                font-body text-[10px]
                font-semibold uppercase
                tracking-[0.18em] text-white/85"
            >
              <span>Live</span>
              <span className="h-1 w-1 rounded-full bg-[#D92727]" />
              <span>Music</span>
              <span className="h-1 w-1 rounded-full bg-[#D92727]" />
              <span>People</span>
              <span className="h-1 w-1 rounded-full bg-[#D92727]" />
              <span>Experiences</span>
            </div>
          </div>

          {/* ====================================
              COLUMN 2 — EXPLORE
          ==================================== */}

          <div className="min-w-0 lg:pl-8">
            <h3
              className="font-heading text-lg
                font-bold uppercase
                tracking-[0.08em] text-white"
            >
              Explore
            </h3>

            <div
              className="mt-5 h-[3px] w-12
                bg-[#9E1010]"
            />

            <nav aria-label="Footer navigation" className="mt-8 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex min-h-12
                    items-center justify-between
                    gap-4 border-b border-white/[0.07]
                    py-3 font-body text-sm
                    text-white/60
                    transition-all duration-300
                    hover:border-[#9E1010]/50
                    hover:pl-2 hover:text-white
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#E04545]"
                >
                  <span>{link.label}</span>

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#D92727]
                      transition-transform duration-300
                      group-hover:-translate-y-1
                      group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* ====================================
              COLUMN 3 — GET IN TOUCH
          ==================================== */}

          <div className="min-w-0 lg:pl-8">
            <h3
              className="font-heading text-lg
                font-bold uppercase
                tracking-[0.08em] text-white"
            >
              Get In Touch
            </h3>

            <div className="mt-5 h-[3px] w-12 bg-[#9E1010]" />

            <div className="mt-9">
              <div className="flex items-start gap-3">
                <MapPin
                  size={21}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-[#D92727]"
                />

                <p
                  className="font-body text-sm
                    leading-7 text-white/75"
                >
                  Ahmedabad, Gujarat, India
                </p>
              </div>

              <p
                className="mt-7 max-w-[290px]
                  font-body text-sm
                  leading-8 text-white/60"
              >
                For artists, brands, sponsors, and collaborations.
              </p>

              <Link
                href="/contact/"
                className="group mt-8 inline-flex
                  items-center gap-2
                  border-b border-[#9E1010]
                  pb-2 font-body text-xs
                  font-semibold uppercase
                  tracking-[0.15em]
                  text-white transition-colors
                  hover:text-[#E04545]"
              >
                Let's Connect
                <ArrowUpRight
                  size={16}
                  className="transition-transform
                    duration-300
                    group-hover:-translate-y-1
                    group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* ====================================
              COLUMN 4 — SOCIALS
          ==================================== */}

          <div className="min-w-0 lg:pl-8">
            <h3
              className="font-heading text-lg
                font-bold uppercase
                tracking-[0.08em] text-white"
            >
              Stay Connected
            </h3>

            <div className="mt-5 h-[3px] w-12 bg-[#9E1010]" />

            <p
              className="mt-8 font-body
                text-sm leading-7
                text-white/55"
            >
              Follow the moments. Feel the energy.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow The Social Out on ${social.label}`}
                    title={social.label}
                    className="group relative flex
                      h-12 w-12 items-center
                      justify-center overflow-hidden
                      rounded-xl border border-[#9E1010]/50
                      bg-gradient-to-br
                      from-[#9E1010]/20
                      to-black
                      text-white
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-[#E04545]
                      hover:bg-[#9E1010]
                      hover:shadow-[0_8px_25px_rgba(158,16,16,0.35)]
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-white"
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className="relative z-10
                        transition-transform duration-300
                        group-hover:scale-110"
                    />
                  </a>
                ) : (
                  <span
                    key={social.label}
                    aria-label={`${social.label} profile coming soon`}
                    title={`${social.label} — coming soon`}
                    className="flex h-12 w-12
                      items-center justify-center
                      rounded-xl border
                      border-[#9E1010]/25
                      bg-[#9E1010]/10
                      text-white/45"
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                );
              })}
            </div>

            <p
              className="mt-8 font-body
                text-[10px] uppercase
                tracking-[0.2em] text-white/40"
            >
              Be Part Of The Experience
            </p>
          </div>
        </div>

        {/* ============================================
            BOTTOM COPYRIGHT SECTION
        ============================================ */}

        <div className="relative mt-20 lg:mt-24">
          {/* Premium gradient divider */}
          <div
            aria-hidden="true"
            className="relative h-px w-full
              bg-gradient-to-r
              from-white/10
              via-[#9E1010]/75
              to-white/10"
          />

          {/* Central line glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none
              absolute left-1/2 top-0
              h-[2px] w-28
              -translate-x-1/2
              bg-[#E04545]/70
              blur-[3px]"
          />

          <div
            className="flex flex-col
              items-start justify-between
              gap-5 pt-8
              md:flex-row md:items-center"
          >
            <p
              className="font-body text-xs
                leading-6 text-white/45"
            >
              © {new Date().getFullYear()} The Social Out. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#9E1010]" />

              <p
                className="font-body text-xs
                  italic tracking-wide
                  text-white/50"
              >
                Crafted for unforgettable experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
