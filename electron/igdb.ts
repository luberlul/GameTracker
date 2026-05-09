// Main-process IGDB client. Mirrors src/lib/igdb/server.ts but lives outside
// the Next bundle so it works in the packaged Electron build (where API
// routes are absent because of `output: 'export'`).

interface IgdbImage { id: number; image_id: string }
interface IgdbGenre { id: number; name: string }
interface IgdbPlatform { id: number; name: string; abbreviation?: string }
interface IgdbCompany { id: number; name: string }
interface IgdbInvolvedCompany { id: number; company: IgdbCompany; developer: boolean; publisher: boolean }
interface IgdbFranchise { id: number; name: string }
interface IgdbReleaseDate { id: number; human?: string }
interface IgdbWebsite { url: string; category: number }

interface IgdbSearchResult {
  id: number;
  slug: string;
  name: string;
  first_release_date?: number;
  cover?: IgdbImage;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  platforms?: IgdbPlatform[];
  genres?: IgdbGenre[];
}

interface IgdbGameDetails extends IgdbSearchResult {
  summary?: string;
  storyline?: string;
  artworks?: IgdbImage[];
  screenshots?: IgdbImage[];
  involved_companies?: IgdbInvolvedCompany[];
  franchises?: IgdbFranchise[];
  release_dates?: IgdbReleaseDate[];
  websites?: IgdbWebsite[];
}

export interface GameSuggestion {
  id: number;
  slug: string;
  name: string;
  releaseYear: number | null;
  cover: string | null;
  rating: number;
  ratingsCount: number;
  platforms: string[];
  genres: string[];
}

export interface GameImport extends GameSuggestion {
  description: string;
  banner: string | null;
  developers: string[];
  publishers: string[];
  screenshots: string[];
  franchises: string[];
  released: string | null;
  website: string | null;
}

const IMAGE_BASE = "https://images.igdb.com/igdb/image/upload";
const BASE = "https://api.igdb.com/v4";

interface TokenCache { accessToken: string; expiresAt: number }
let tokenCache: TokenCache | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set.");
  }
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" },
  );
  if (!res.ok) throw new Error(`Twitch token request failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.accessToken;
}

async function igdbPost<T>(endpoint: string, body: string): Promise<T[]> {
  const token = await getToken();
  const clientId = process.env.IGDB_CLIENT_ID ?? "";
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
      Accept: "application/json",
    },
    body,
  });
  if (!res.ok) throw new Error(`IGDB ${endpoint} failed: ${res.status}`);
  return (await res.json()) as T[];
}

const SEARCH_FIELDS = [
  'fields id, slug, name, first_release_date, cover.image_id,',
  '  rating, rating_count, aggregated_rating,',
  '  platforms.name, platforms.abbreviation, genres.name;',
  'limit 8;',
].join("\n");

const GAME_FIELDS = [
  "fields id, slug, name, first_release_date, cover.image_id,",
  "  rating, rating_count, aggregated_rating,",
  "  platforms.name, platforms.abbreviation, genres.name,",
  "  summary, storyline, artworks.image_id, screenshots.image_id,",
  "  involved_companies.company.name, involved_companies.developer, involved_companies.publisher,",
  "  franchises.name, release_dates.human,",
  "  websites.url, websites.category;",
].join("\n");

const coverUrl = (id: string) => `${IMAGE_BASE}/t_cover_big/${id}.jpg`;
const artworkUrl = (id: string) => `${IMAGE_BASE}/t_720p/${id}.jpg`;
const screenshotUrl = (id: string) => `${IMAGE_BASE}/t_screenshot_big/${id}.jpg`;

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

function toSuggestion(r: IgdbSearchResult): GameSuggestion {
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

function toGameImport(d: IgdbGameDetails): GameImport {
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

  const screenshots = (d.screenshots ?? []).map((s) => screenshotUrl(s.image_id));
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

export async function searchGames(query: string): Promise<GameSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const escaped = trimmed.replace(/"/g, '\\"');
  const body = `search "${escaped}";\n${SEARCH_FIELDS}`;
  const results = await igdbPost<IgdbSearchResult>("/games", body);
  return results.map(toSuggestion);
}

export async function getGame(id: string | number): Promise<GameImport> {
  const body = `${GAME_FIELDS}\nwhere id = ${id};`;
  const results = await igdbPost<IgdbGameDetails>("/games", body);
  if (!results.length) throw new Error(`IGDB: game ${id} not found`);
  return toGameImport(results[0]);
}
