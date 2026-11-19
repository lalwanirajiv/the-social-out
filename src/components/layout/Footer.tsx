
import Link from "next/link";
import CmsLogo from "@/components/layout/CmsLogo";

const links = [
  { label: "Our Team", href: "/our-team/" },
  { label: "Upcoming Shows", href: "/experiences/" },
  { label: "Past Events", href: "/past-events/" },
  { label: "Stay Social", href: "/stay-social/" },
  { label: "Contact Us", href: "/contact/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 pb-8 pt-20 text-white md:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <CmsLogo
            width={200}
            height={80}
            className="h-auto max-h-12 w-44 object-contain"
          />

          <p className="mt-8 max-w-sm font-body text-sm leading-7 text-white/50">
            Creating unforgettable entertainment experiences.
            Bringing new artists, new energy, and first-time moments
            to Ahmedabad and beyond.
          </p>
        </div>

        <div>
          <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-widest">
            Explore
          </h3>

          <nav aria-label="Footer navigation" className="flex flex-col items-start gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-widest">
            Get In Touch
          </h3>

          <p className="font-body text-sm text-white/50">
            Ahmedabad, Gujarat, India
          </p>

          <p className="mt-4 font-body text-sm text-white/50">
            For artists, brands, sponsors, and collaborations.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
        <p className="font-body text-xs text-white/40">
          © {new Date().getFullYear()} The Social Out. All rights reserved.
        </p>

        <p className="font-body text-xs text-white/40">
          Crafted for unforgettable experiences.
        </p>
      </div>
    </footer>
  );
}
