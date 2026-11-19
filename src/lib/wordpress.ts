
const CMS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ??
  "https://cms.thesocialout.in";

const API = `${CMS_URL.replace(/\/$/, "")}/wp-json/wp/v2`;

type MediaSection = {
  id: number;
  slug: string;
};

type WordPressMedia = {
  id: number;
  source_url: string;
  media_type: string;
  mime_type: string;
  media_details?: {
    sizes?: Record<string, { source_url: string }>;
  };
};

export type SiteMedia = {
  gallery: string[];
  reels: string[];
  heroVideo: string | null;
};

async function fetchSection(slug: string): Promise<WordPressMedia[]> {
  // Find the numeric WordPress term ID.
  const sectionResponse = await fetch(
    `${API}/socialout_media_sections?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!sectionResponse.ok) {
    throw new Error(`Cannot fetch WordPress section: ${slug}`);
  }

  const sections: MediaSection[] = await sectionResponse.json();

  if (sections.length === 0) return [];

  const termId = sections[0].id;
  const allMedia: WordPressMedia[] = [];

  // WordPress limits collection requests to 100 items per page.
  for (let page = 1; page <= 50; page++) {
    const params = new URLSearchParams({
      socialout_media_sections: String(termId),
      per_page: "100",
      page: String(page),
      orderby: "date",
      order: "desc",
      _fields:
        "id,source_url,media_type,mime_type,media_details",
    });

    const response = await fetch(`${API}/media?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      // WP returns 400 when a page exceeds the last page.
      if (response.status === 400 && page > 1) break;

      throw new Error(
        `Cannot fetch ${slug} media: HTTP ${response.status}`
      );
    }

    const batch: WordPressMedia[] = await response.json();
    allMedia.push(...batch);

    if (batch.length < 100) break;
  }

  return allMedia;
}

function isImage(item: WordPressMedia) {
  return (
    item.media_type === "image" &&
    /^image\/(jpeg|png|webp|avif)$/i.test(item.mime_type)
  );
}


function isVideo(item: WordPressMedia): boolean {
  const supportedMimeTypes = [
    "video/mp4",
    "video/webm",
  ];

  return supportedMimeTypes.includes(
    item.mime_type.toLowerCase()
  );
}


let headerLogoRequest: Promise<string | null> | undefined;

// Header and footer share one request per page load. Refreshing loads CMS updates.
export function getHeaderLogo(): Promise<string | null> {
  if (!headerLogoRequest) {
    headerLogoRequest = fetchSection("header-logo")
      .then(
        (items) =>
          items.find((item) => item.media_type === "image" && item.source_url)
            ?.source_url ?? null,
      )
      .catch((error) => {
        // Allow a later mount to retry after a failed request.
        headerLogoRequest = undefined;
        throw error;
      });
  }

  return headerLogoRequest;
}

export async function getSiteMedia(): Promise<SiteMedia> {
  const [galleryItems, reelItems, heroItems] =
    await Promise.all([
      fetchSection("gallery"),
      fetchSection("reels"),
      fetchSection("hero"),
    ]);

  const gallery = galleryItems
    .filter(isImage)
    .map(
      (item) =>
        item.media_details?.sizes?.large?.source_url ??
        item.source_url
    );

  const reels = reelItems
    .filter(isVideo)
    .map((item) => item.source_url);

  const heroVideo =
    heroItems.find(isVideo)?.source_url ?? null;

  return {
    gallery: [...new Set(gallery)],
    reels: [...new Set(reels)],
    heroVideo,
  };
}
