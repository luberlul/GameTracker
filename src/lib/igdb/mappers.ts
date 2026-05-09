import type {
  IgdbSearchResult,
  IgdbGameDetails,
  GameSuggestion,
  GameImport,
} from "./types";

const IMAGE_BASE = "https://images.igdb.com/igdb/image/upload";

export const coverUrl = (imageId: string) =>
  `${IMAGE_BASE}/t_cover_big/${imageId}.jpg`;

export const artworkUrl = (imageId: string) =>
  `${IMAGE_BASE}/t_720p/${imageId}.jpg`;

export const screenshotUrl = (imageId: string) =>
  `${IMAGE_BASE}/t_screenshot_big/${imageId}.jpg`;

const yearOf = (ts: number | undefined): number | null => {
  if (!ts) return null;
  const y = new Date(ts * 1000).getFullYear();
  return Number.isFinite(y) ? y : null;
};

const ratingOf = (r: IgdbSearchResult): number => {
  if (r.rating != null) return Math.round(r.rating) / 10;
  if (r.aggregated_rating != null) return Math.round(r.aggregated_rating) / 10;
  return 0;
};

export function toSuggestion(r: IgdbSearchResult): GameSuggestion {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    releaseYear: yearOf(r.first_release_date),
    cover: r.cover ? coverUrl(r.cover.image_id) : null,
    rating: ratingOf(r),
    ratingsCount: r.rating_count ?? 0,
    platforms: (r.platforms ?? []).map((p) => p.abbreviation ?? p.name),
    genres: (r.genres ?? []).map((g) => g.name),
  };
}

export function toGameImport(d: IgdbGameDetails): GameImport {
  const developers = (d.involved_companies ?? [])
    .filter((c) => c.developer)
    .map((c) => c.company.name);

  const publishers = (d.involved_companies ?? [])
    .filter((c) => c.publisher)
    .map((c) => c.company.name);

  const banner =
    d.artworks?.[0]?.image_id
      ? artworkUrl(d.artworks[0].image_id)
      : d.screenshots?.[0]?.image_id
        ? screenshotUrl(d.screenshots[0].image_id)
        : null;

  const screenshots = (d.screenshots ?? []).map((s) =>
    screenshotUrl(s.image_id),
  );

  const released = d.release_dates?.[0]?.human ?? null;
  const officialSite = (d.websites ?? []).find((w) => w.category === 1);

  return {
    ...toSuggestion(d),
    description: d.summary ?? d.storyline ?? "",
    banner,
    developers,
    publishers,
    screenshots,
    franchises: (d.franchises ?? []).map((f) => f.name),
    released,
    website: officialSite?.url ?? null,
  };
}
