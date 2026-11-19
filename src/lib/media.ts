
import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_TYPES = /\.(jpg|jpeg|png|webp|avif)$/i;
const VIDEO_TYPES = /\.(mp4|webm)$/i;

async function readMedia(
  relativeDirectory: string,
  allowedExtensions: RegExp
): Promise<string[]> {
  const directory = path.join(
    process.cwd(),
    "public",
    relativeDirectory
  );

  try {
    const entries = await readdir(directory, {
      withFileTypes: true,
    });

    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          allowedExtensions.test(entry.name)
      )
      .map(
        (entry) =>
          "/" +
          relativeDirectory.replaceAll("\\", "/") +
          "/" +
          encodeURIComponent(entry.name)
      )
      .sort();
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}

export async function getExperienceMedia() {
  const [images, reels] = await Promise.all([
    readMedia("images/gallery", IMAGE_TYPES),
    readMedia("videos/reels", VIDEO_TYPES),
  ]);

  return { images, reels };
}
