import Link from "next/link";
import CmsLogo from "@/components/layout/CmsLogo";
import { ArrowUpRight, MapPin } from "lucide-react";
import { FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa6";

// ==========================================
// FOOTER NAVIGATION
// ==========================================

const links = [
  { label: "Our Team", href: "/our-team/" },
  { label: "Upcoming Shows", href: "/experiences/" },
  { label: "Past Events", href: "/past-events/" },
  { label: "Stay Social", href: "/stay-social/" },
  { label: "Contact Us", href: "/contact/" },
];

// ==========================================
// SOCIAL LINKS
// ==========================================

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/thesocialout_?evlk=YzJ6MDYyeHU2N3Rq",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1ExvY9Wb3b/?mibextid=wwXIfr",
    icon: FaFacebookF,
  },
  {
    label: "Email",
    href: "mailto:contact@thesocialout.in",
    icon: FaEnvelope,
  },
];

// ==========================================
// REUSABLE HEADING
// ==========================================

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="font-heading text-sm
          font-bold uppercase
          tracking-[0.1em] text-white
          lg:text-base"
      >
        {children}
      </h3>

      <div
        className="mt-3 h-[2px]
          w-9 bg-[#9E1010]"
      />
    </div>
  );
}

// ==========================================
// FOOTER
// ==========================================

export default function Footer() {
  return (
    <footer
      className="relative isolate
        overflow-hidden
        border-t border-white/10
        bg-[#070405] text-white"
    >
      {/* ====================================
          CINEMATIC BACKGROUND
      ==================================== */}

      {/* Top-left ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute -left-40 -top-60
          h-[420px] w-[480px]
          rounded-full bg-[#9E1010]/15
          blur-[110px]"
      />

      {/* Bottom-right ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute -bottom-56 -right-36
          h-[440px] w-[500px]
          rounded-full bg-[#9E1010]/15
          blur-[110px]"
      />

      {/* Top-left angular accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute left-0 top-0
          h-16 w-[38%]
          bg-gradient-to-br
          from-[#9E1010]/30
          to-transparent
          [clip-path:polygon(0_0,100%_0,0_100%)]"
      />

      {/* Bottom-right angular accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none
          absolute bottom-0 right-0
          h-24 w-[45%]
          bg-gradient-to-tl
          from-[#9E1010]/15
          to-transparent
          [clip-path:polygon(100%_0,100%_100%,0_100%)]"
      />

      {/* ====================================
          MAIN CONTENT
      ==================================== */}

      <div
        className="relative z-10
          mx-auto max-w-[1500px]
          px-5 pb-8 pt-12
          sm:px-8
          md:px-10 md:pt-14
          lg:px-12 lg:pb-10"
      >
        <div
          className="grid grid-cols-2
            items-start
            gap-x-6 gap-y-9
            sm:gap-x-10
            lg:grid-cols-[1.4fr_0.85fr_1fr_0.9fr]
            lg:gap-x-12 lg:gap-y-0"
        >
          {/* ==================================
              COLUMN 1 — BRAND
          ================================== */}

          <div
            className="col-span-2 min-w-0
              lg:col-span-1"
          >
            <Link
              href="/"
              aria-label="The Social Out — Home"
              className="inline-flex"
            >
              <CmsLogo
                width={220}
                height={75}
                className="h-auto max-h-12
                  w-44 object-contain
                  sm:w-48"
              />
            </Link>

            <div
              className="mt-5 h-[2px]
                w-12 bg-gradient-to-r
                from-[#E04545]
                to-[#9E1010]"
            />

            <p
              className="mt-5 max-w-sm
                font-body text-[13px]
                leading-6 text-white/60
                sm:text-sm sm:leading-7"
            >
              Creating unforgettable entertainment experiences. Bringing new
              artists, new energy, and first-time moments to Ahmedabad and
              beyond.
            </p>

            <div
              className="mt-5 flex flex-wrap
                items-center gap-x-2 gap-y-2
                font-body text-[9px]
                font-semibold uppercase
                tracking-[0.13em]
                text-white/75
                sm:text-[10px]"
            >
              <span>Live</span>
              <span
                className="h-1 w-1
                  rounded-full bg-[#D92727]"
              />
              <span>Music</span>
              <span
                className="h-1 w-1
                  rounded-full bg-[#D92727]"
              />
              <span>People</span>
              <span
                className="h-1 w-1
                  rounded-full bg-[#D92727]"
              />
              <span>Experiences</span>
            </div>
          </div>

          {/* ==================================
              COLUMN 2 — EXPLORE
          ================================== */}

          <div className="min-w-0">
            <FooterHeading>Explore</FooterHeading>

            <nav aria-label="Footer navigation" className="mt-4 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex min-h-9
                    items-center justify-between
                    gap-2 border-b
                    border-white/[0.06]
                    py-2 font-body
                    text-[12px] leading-5
                    text-white/60
                    transition-all duration-300
                    hover:border-[#9E1010]/50
                    hover:text-white
                    sm:text-sm"
                >
                  <span>{link.label}</span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                    className="shrink-0
                      text-[#D92727]
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* ==================================
              COLUMN 3 — GET IN TOUCH
          ================================== */}

          <div className="min-w-0">
            <FooterHeading>Get In Touch</FooterHeading>

            <div className="mt-5">
              <div
                className="flex items-start
                  gap-2"
              >
                <MapPin
                  size={17}
                  strokeWidth={1.8}
                  className="mt-0.5
                    shrink-0 text-[#D92727]"
                />

                <p
                  className="font-body
                    text-[12px] leading-6
                    text-white/70
                    sm:text-sm"
                >
                  Ahmedabad, Mumbai, Indore, Delhi
                </p>
              </div>

              <p
                className="mt-4 font-body
                  text-[12px] leading-6
                  text-white/55
                  sm:text-sm"
              >
                For artists, brands, sponsors, and collaborations.
              </p>

              <Link
                href="/contact/"
                className="group mt-5 inline-flex
                  items-center gap-2
                  border-b border-[#9E1010]
                  pb-1.5 font-body
                  text-[10px] font-semibold
                  uppercase tracking-[0.1em]
                  text-white transition-colors
                  hover:text-[#E04545]
                  sm:text-xs"
              >
                Let's Connect
                <ArrowUpRight
                  size={14}
                  className="transition-transform
                    duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* ==================================
              COLUMN 4 — SOCIAL MEDIA
          ================================== */}

          <div
            className="col-span-2 min-w-0
              lg:col-span-1"
          >
            <FooterHeading>Stay Connected</FooterHeading>

            <p
              className="mt-4 font-body
                text-[13px] leading-6
                text-white/55"
            >
              Follow the moments. Feel the energy.
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={
                      social.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      social.href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    aria-label={
                      social.label === "Email"
                        ? "Email The Social Out"
                        : `Follow The Social Out on ${social.label}`
                    }
                    title={social.label}
                    className="group flex h-10 w-10
                      items-center justify-center
                      rounded-lg border
                      border-[#9E1010]/50
                      bg-gradient-to-br
                      from-[#9E1010]/15
                      to-black text-white
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-[#E04545]
                      hover:bg-[#9E1010]
                      hover:shadow-[0_6px_18px_rgba(158,16,16,0.3)]
                      sm:h-11 sm:w-11"
                  >
                    <Icon
                      size={18}
                      className="transition-transform
                        duration-300
                        group-hover:scale-110"
                    />
                  </a>
                );
              })}
            </div>

            <p
              className="mt-4 font-body
                text-[9px] uppercase
                tracking-[0.16em]
                text-white/40"
            >
              Be Part Of The Experience
            </p>
          </div>
        </div>

        {/* ====================================
            COMPACT COPYRIGHT
        ==================================== */}

        <div className="relative mt-10 lg:mt-12">
          <div
            aria-hidden="true"
            className="h-px w-full
              bg-gradient-to-r
              from-white/10
              via-[#9E1010]/70
              to-white/10"
          />

          <div
            className="flex flex-col
              gap-2 pt-5
              sm:flex-row sm:items-center
              sm:justify-between
              sm:gap-5"
          >
            <p
              className="font-body
                text-[11px] leading-5
                text-white/40"
            >
              © {new Date().getFullYear()} The Social Out. All rights reserved.
            </p>

            <p
              className="font-body
                text-[11px] italic
                leading-5 text-white/40"
            >
              Crafted for unforgettable experiences.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
