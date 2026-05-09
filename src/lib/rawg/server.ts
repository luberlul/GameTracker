// Server-side fetcher for RAWG. Used by Next.js API routes (and re-implemented
// in electron/rawg.ts for packaged Electron builds where API routes are absent).

import type { RawgGameDetails, RawgSearchResponse } from "./types";

const BASE = "https://api.rawg.io/api";

function getKey(): string {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    throw new Error(
      "RAWG_API_KEY is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  return key;
}

async function rawgFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("key", getKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // RAWG content rarely changes; let the platform cache responses for a day
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    throw new Error(`RAWG ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function searchGames(query: string, pageSize = 8): Promise<RawgSearchResponse> {
  return rawgFetch<RawgSearchResponse>("/games", {
    search: query,
    page_size: String(pageSize),
    search_precise: "true",
  });
}

export function getGameDetails(idOrSlug: string | number): Promise<RawgGameDetails> {
  return rawgFetch<RawgGameDetails>(`/games/${idOrSlug}`, {});
}
