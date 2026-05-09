import type {
  GameImport,
  GameSuggestion,
  RawgGameDetails,
  RawgSearchResult,
} from "./types";

const yearOf = (released: string | null): number | null => {
  if (!released) return null;
  const y = parseInt(released.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
};

export function toSuggestion(r: RawgSearchResult): GameSuggestion {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    releaseYear: yearOf(r.released),
    cover: r.background_image,
    rating: r.rating,
    ratingsCount: r.ratings_count,
    metacritic: r.metacritic,
    platforms: (r.platforms ?? []).map((p) => p.platform.name),
    genres: (r.genres ?? []).map((g) => g.name),
  };
}

export function toGameImport(d: RawgGameDetails): GameImport {
  return {
    ...toSuggestion(d),
    description: d.description_raw ?? "",
    banner: d.background_image_additional ?? d.background_image,
    developers: (d.developers ?? []).map((x) => x.name),
    publishers: (d.publishers ?? []).map((x) => x.name),
    screenshots: (d.screenshots ?? []).map((s) => s.image),
    playtime: d.playtime ?? 0,
    esrb: d.esrb_rating?.name ?? null,
    website: d.website ?? null,
    released: d.released,
  };
}
