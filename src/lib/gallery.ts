
import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

const EXTENSIONS = /\.(jpg|jpeg|png|webp|avif|gif)$/i;

export async function getGalleryImages(): Promise<string[]> {
  const directory = path.join(
    process.cwd(),
    "public",
    "images",
    "gallery"
  );

  try {
    const files = await readdir(directory, {
      withFileTypes: true,
    });

    return files
      .filter(
        (file) =>
          file.isFile() &&
          EXTENSIONS.test(file.name)
      )
      .map(
        (file) =>
          `/images/gallery/${encodeURIComponent(file.name)}`
      )
      .sort();
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}
