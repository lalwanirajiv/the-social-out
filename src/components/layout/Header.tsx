"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import CmsLogo from "@/components/layout/CmsLogo";

const allLinks = [
  { label: "Upcoming Shows", href: "/experiences/" },
  { label: "Our Team", href: "/our-team/" },
  { label: "Past Events", href: "/past-events/" },
  { label: "Stay Social", href: "/stay-social/" },
  { label: "Contact Us", href: "/contact/" },
];

// Normalize URLs to prevent trailing-slash mismatches.
function normalizePath(path: string) {
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
}

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const currentPath = normalizePath(pathname ?? "/");

  function isActive(href: string) {
    const targetPath = normalizePath(href);

    return (
      currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    );
  }

  // Prevent background scrolling while mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close mobile menu whenever route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLink = (link: { label: string; href: string }) => {
    const active = isActive(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`
          group relative whitespace-nowrap
          font-heading text-xs font-bold uppercase
          tracking-[0.14em] transition-colors duration-300
          ${active ? "text-[#E04545]" : "text-white/80 hover:text-white"}
        `}
      >
        {link.label}

        {/* Animated active indicator */}
        <span
          className={`
            absolute -bottom-2 left-0 h-[2px]
            bg-[#9E1010] transition-all duration-300
            ${active ? "w-full" : "w-0 group-hover:w-full"}
          `}
        />
      </Link>
    );
  };

  return (
    <>
      {/* FLOATING TRANSPARENT HEADER */}
      <header
        className="fixed inset-x-0 top-0 z-50
          px-4 pt-5 md:px-8 lg:px-12"
      >
        <div
          className="
            mx-auto flex h-20 max-w-[1500px]
            items-center justify-between gap-4
            rounded-md border border-white/15
            bg-black/25 px-5
            backdrop-blur-md
            transition-colors duration-300
            md:px-8
          "
        >
          {/* CMS HEADER LOGO */}
          <Link
            href="/"
            aria-label="The Social Out homepage"
            className="relative z-50 flex shrink-0
              items-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            <CmsLogo
              width={208}
              height={70}
              preload
              className="h-auto max-h-12 w-40 object-contain md:w-48 lg:w-52"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8
              lg:flex xl:gap-12"
          >
            {allLinks.map(navLink)}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="relative z-50 text-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
      </header>

      {/* FULLSCREEN MOBILE MENU */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`
          fixed inset-0 z-40
          flex flex-col items-center justify-center gap-9
          bg-black transition-all duration-500
          lg:hidden
          ${
            menuOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }
        `}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col items-center gap-9"
        >
          {allLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className={`
                  font-heading text-3xl font-bold uppercase
                  transition-colors duration-300
                  ${
                    active
                      ? "text-[#E04545]"
                      : "text-white hover:text-[#E04545]"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
