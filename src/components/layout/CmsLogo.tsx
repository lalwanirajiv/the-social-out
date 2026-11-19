"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getHeaderLogo } from "@/lib/wordpress";

type CmsLogoProps = {
  width: number;
  height: number;
  className?: string;
  preload?: boolean;
};

export default function CmsLogo({
  width,
  height,
  className = "",
  preload = false,
}: CmsLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getHeaderLogo()
      .then((url) => {
        if (active) setLogoUrl(url);
      })
      .catch((error) => {
        if (active) console.error("Unable to load WordPress brand logo:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!logoUrl) {
    return (
      <span
        role="img"
        aria-label="The Social Out"
        className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap
          font-heading text-xl uppercase ${className}`}
      >
        <span className="font-bold text-white">Social</span>
        <span className="font-normal text-brand-red">Out</span>
      </span>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt="The Social Out"
      width={width}
      height={height}
      preload={preload}
      unoptimized
      className={className}
      onError={() => setLogoUrl(null)}
    />
  );
}
