"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const CMS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesocialout.in";

const WP_API = `${CMS_URL.replace(/\/$/, "")}/wp-json/wp/v2`;

const allLinks = [
  { label: "Upcoming Shows", href: "/experiences/" },
  { label: "About Us", href: "/about/" },
  { label: "Past Events", href: "/collaborate/" },
  { label: "Stay Social", href: "/stay-social/" },
  { label: "Contact Us", href: "/contact/" },
];

type MediaSection = {
  id: number;
  slug: string;
};

type WordPressMedia = {
  id: number;
  source_url: string;
  media_type: string;
  mime_type: string;
};

// Fetch the logo assigned to the "header-logo" section.
async function fetchHeaderLogo(): Promise<string | null> {
  // First, get the section ID.
  const sectionResponse = await fetch(
    `${WP_API}/socialout_media_sections?slug=header-logo`,
    { cache: "no-store" },
  );

  if (!sectionResponse.ok) {
    throw new Error("Failed to fetch Header Logo section");
  }

  const sections: MediaSection[] = await sectionResponse.json();

  if (sections.length === 0) {
    return null;
  }

  const sectionId = sections[0].id;

  // Fetch images assigned to that section.
  const params = new URLSearchParams({
    socialout_media_sections: String(sectionId),
    media_type: "image",
    per_page: "20",
    orderby: "date",
    order: "desc",
  });

  const mediaResponse = await fetch(`${WP_API}/media?${params.toString()}`, {
    cache: "no-store",
  });

  if (!mediaResponse.ok) {
    throw new Error("Failed to fetch Header Logo media");
  }

  const media: WordPressMedia[] = await mediaResponse.json();

  const logo = media.find(
    (item) => item.media_type === "image" && item.source_url,
  );

  return logo?.source_url ?? null;
}

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLogo() {
      try {
        const url = await fetchHeaderLogo();

        if (active) {
          setHeaderLogoUrl(url);
        }
      } catch (error) {
        console.error("Unable to load WordPress header logo:", error);
      }
    }

    loadLogo();

    return () => {
      active = false;
    };
  }, []);
  // Detect page scroll.
  useEffect(() => {
    const updateScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  // Load logo from WordPress on page load.
  useEffect(() => {
    let active = true;

    async function loadLogo() {
      try {
        const url = await fetchHeaderLogo();

        if (active) {
          setHeaderLogoUrl(url);
        }
      } catch (error) {
        console.error("Unable to load WordPress header logo:", error);

        // Local fallback logo remains visible.
      }
    }

    loadLogo();

    return () => {
      active = false;
    };
  }, []);

  // Prevent scrolling while mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close mobile menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLink = (link: { label: string; href: string }) => (
    <Link
      key={link.href}
      href={link.href}
      className={`whitespace-nowrap font-heading text-xs
        font-bold uppercase tracking-[0.14em]
        transition-colors duration-300
        hover:text-[#E04545]
        ${pathname === link.href ? "text-white" : "text-white/80"}`}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50
          px-4 pt-5 transition-all duration-500
          md:px-8 lg:px-12"
      >
        <div
          className={`mx-auto flex h-20 max-w-[1500px]
            items-center justify-between gap-4 rounded-md
            border border-white/15 px-5
            transition-all duration-500 md:px-8
            ${
              scrolled
                ? "bg-black/85 shadow-xl backdrop-blur-xl"
                : "bg-black/35 backdrop-blur-md"
            }`}
        >
          {/* Left-aligned WordPress logo */}
          <Link
            href="/"
            aria-label="The Social Out homepage"
            className="relative z-50 flex shrink-0
              items-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            {headerLogoUrl && (
              <Image
                src={headerLogoUrl}
                alt="The Social Out"
                width={208}
                height={70}
                priority
                unoptimized
                className="h-auto max-h-12 w-40 object-contain md:w-48 lg:w-52"
              />
            )}
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8
              lg:flex xl:gap-12"
          >
            {allLinks.map(navLink)}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="relative z-50 text-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col
          items-center justify-center gap-9 bg-black
          transition-all duration-500 lg:hidden
          ${
            menuOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col items-center gap-9"
        >
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="font-heading text-3xl font-bold
                uppercase text-white transition-colors
                hover:text-[#9E1010]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
