
const CMS = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ??
  "https://cms.thesocialout.in"
).replace(/\/$/, "");

type WPTerm = {
  id: number;
};

type WPMedia = {
  id: number;
  source_url: string;
  mime_type: string;
  date: string;
  alt_text?: string;
  title?: {
    rendered?: string;
  };
  media_details?: {
    sizes?: Record<
      string,
      {
        source_url: string;
      }
    >;
  };
};

export type EventMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  label: string;
};

// Fetch all attachments belonging to one media section.
async function getSectionMedia(
  slug: string,
  signal: AbortSignal
): Promise<EventMedia[]> {
  const termResponse = await fetch(
    `${CMS}/wp-json/wp/v2/socialout_media_sections?slug=${encodeURIComponent(slug)}`,
    { signal }
  );

  if (!termResponse.ok) {
    throw new Error(`Could not load section: ${slug}`);
  }

  const terms: WPTerm[] = await termResponse.json();

  if (!terms.length) {
    return [];
  }

  const results: WPMedia[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const params = new URLSearchParams({
      socialout_media_sections: String(terms[0].id),
      per_page: "100",
      page: String(page),
      orderby: "date",
      order: "desc",
    });

    const response = await fetch(
      `${CMS}/wp-json/wp/v2/media?${params.toString()}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error(`Could not load media: ${slug}`);
    }

    const items: WPMedia[] = await response.json();
    results.push(...items);

    totalPages = Number(
      response.headers.get("X-WP-TotalPages") || "1"
    );

    page++;
  } while (page <= totalPages);

  return results
    .filter(
      (item) =>
        item.source_url &&
        (item.mime_type?.startsWith("image/") ||
          item.mime_type?.startsWith("video/"))
    )
    .map((item) => {
      const isVideo = item.mime_type.startsWith("video/");

      const sizes = item.media_details?.sizes;

      return {
        id: `${slug}-${item.id}`,
        type: isVideo ? "video" : "image",
        src: isVideo
          ? item.source_url
          : sizes?.large?.source_url ??
            sizes?.medium_large?.source_url ??
            item.source_url,
        label:
          item.alt_text ||
          item.title?.rendered ||
          (isVideo ? "Event video" : "Event photograph"),
      };
    });
}

// Mix photos and videos in a repeating sequence.
function interleaveMedia(
  images: EventMedia[],
  videos: EventMedia[]
): EventMedia[] {
  const combined: EventMedia[] = [];
  let imageIndex = 0;
  let videoIndex = 0;

  while (
    imageIndex < images.length ||
    videoIndex < videos.length
  ) {
    if (imageIndex < images.length) {
      combined.push(images[imageIndex++]);
    }

    if (videoIndex < videos.length) {
      combined.push(videos[videoIndex++]);
    }
  }

  return combined;
}

export async function getCityMedia(
  citySlug: string,
  signal: AbortSignal
): Promise<EventMedia[]> {
  const [images, videos] = await Promise.all([
    getSectionMedia(`${citySlug}-gallery`, signal),
    getSectionMedia(`${citySlug}-reels`, signal),
  ]);

  return interleaveMedia(images, videos);
}
