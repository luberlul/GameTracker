import type { GameImport, GameSuggestion } from "./types";

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  const body = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return body;
}

export async function searchGames(
  query: string,
  signal?: AbortSignal,
): Promise<GameSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const data = await fetchJson<{ results: GameSuggestion[] }>(
    `/api/rawg/search?q=${encodeURIComponent(trimmed)}`,
    signal,
  );
  return data.results;
}

export async function getGameImport(
  id: number | string,
  signal?: AbortSignal,
): Promise<GameImport> {
  return fetchJson<GameImport>(`/api/rawg/game/${id}`, signal);
}
