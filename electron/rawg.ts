// Main-process RAWG client. Mirrors src/lib/rawg/server.ts but lives outside
// the Next bundle so it works in the packaged Electron build (where API
// routes are absent because of `output: 'export'`).

interface RawgPlatformLite {
  platform: { id: number; name: string };
}
interface RawgGenreLite {
  id: number;
  name: string;
}
interface RawgScreenshotLite {
  id: number;
  image: string;
}

interface RawgSearchResult {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  ratings_count: number;
  metacritic: number | null;
  platforms: RawgPlatformLite[] | null;
  genres: RawgGenreLite[];
}

interface RawgGameDetails extends RawgSearchResult {
  description_raw: string;
  background_image_additional: string | null;
  website: string | null;
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  esrb_rating: { id: number; name: string } | null;
  playtime: number;
  screenshots?: RawgScreenshotLite[];
}

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

const BASE = "https://api.rawg.io/api";

function getKey(): string {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY is not set in the Electron environment.");
  return key;
}

async function rawg<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("key", getKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`RAWG ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

const yearOf = (d: string | null) => {
  if (!d) return null;
  const y = parseInt(d.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
};

function toSuggestion(r: RawgSearchResult): GameSuggestion {
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

function toGameImport(d: RawgGameDetails): GameImport {
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

export async function searchGames(query: string): Promise<GameSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const data = await rawg<{ results: RawgSearchResult[] }>("/games", {
    search: trimmed,
    page_size: "8",
    search_precise: "true",
  });
  return data.results.map(toSuggestion);
}

export async function getGame(idOrSlug: string | number): Promise<GameImport> {
  const data = await rawg<RawgGameDetails>(`/games/${idOrSlug}`, {});
  return toGameImport(data);
}
