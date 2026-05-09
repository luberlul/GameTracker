import { getAccessToken } from "./token";
import { toSuggestion, toGameImport } from "./mappers";
import type {
  IgdbSearchResult,
  IgdbGameDetails,
  GameSuggestion,
  GameImport,
} from "./types";

const BASE = "https://api.igdb.com/v4";

async function igdbPost<T>(endpoint: string, body: string): Promise<T[]> {
  const [token, clientId] = await Promise.all([
    getAccessToken(),
    Promise.resolve(process.env.IGDB_CLIENT_ID ?? ""),
  ]);

  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
      Accept: "application/json",
    },
    body,
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`IGDB ${endpoint} failed: ${res.status}`);
  return (await res.json()) as T[];
}

const GAME_FIELDS = `
fields id, slug, name, first_release_date, cover.image_id,
  rating, rating_count, aggregated_rating,
  platforms.name, platforms.abbreviation, genres.name,
  summary, storyline, artworks.image_id, screenshots.image_id,
  involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
  franchises.name, release_dates.human,
  websites.url, websites.category;
`.trim();

export async function searchGames(query: string): Promise<GameSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const escaped = trimmed.replace(/"/g, '\\"');
  // search must come first in apicalypse; no where-filter so results aren't over-constrained
  const body = `
search "${escaped}";
fields id, slug, name, first_release_date, cover.image_id,
  rating, rating_count, aggregated_rating,
  platforms.name, platforms.abbreviation, genres.name;
limit 8;
`.trim();
  const results = await igdbPost<IgdbSearchResult>("/games", body);
  return results.map(toSuggestion);
}

export async function getGameDetails(
  id: number | string,
): Promise<GameImport> {
  const body = `${GAME_FIELDS}\nwhere id = ${id};`;
  const results = await igdbPost<IgdbGameDetails>("/games", body);
  if (!results.length) throw new Error(`IGDB: game ${id} not found`);
  return toGameImport(results[0]);
}
