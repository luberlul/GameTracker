// Subset of the RAWG API shape — only the fields we consume.
// Reference: https://api.rawg.io/docs/

export interface RawgPlatform {
  platform: { id: number; name: string; slug: string };
}

export interface RawgGenre {
  id: number;
  name: string;
  slug: string;
}

export interface RawgScreenshot {
  id: number;
  image: string;
}

export interface RawgSearchResult {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  platforms: RawgPlatform[] | null;
  genres: RawgGenre[];
  short_screenshots?: { id: number; image: string }[];
}

export interface RawgSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgSearchResult[];
}

export interface RawgGameDetails extends RawgSearchResult {
  description_raw: string;
  background_image_additional: string | null;
  website: string | null;
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  esrb_rating: { id: number; name: string } | null;
  playtime: number;
  screenshots?: RawgScreenshot[];
}

// Shape consumed by the renderer / form — no RAWG-specific noise.
export interface GameSuggestion {
  id: number;
  slug: string;
  name: string;
  releaseYear: number | null;
  cover: string | null;
  rating: number;
  ratingsCount: number;
  metacritic: number | null;
  platforms: string[];
  genres: string[];
}

export interface GameImport extends GameSuggestion {
  description: string;
  banner: string | null;
  developers: string[];
  publishers: string[];
  screenshots: string[];
  playtime: number;
  esrb: string | null;
  website: string | null;
  released: string | null;
}
