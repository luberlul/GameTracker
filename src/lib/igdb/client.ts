import type { GameSuggestion, GameImport } from "./types";

async function httpSearch(
  query: string,
  signal?: AbortSignal,
): Promise<GameSuggestion[]> {
  const res = await fetch(
    `/api/igdb/search?q=${encodeURIComponent(query)}`,
    { signal },
  );
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = (await res.json()) as { results: GameSuggestion[] };
  return data.results;
}

async function httpGetGame(
  id: number | string,
  signal?: AbortSignal,
): Promise<GameImport> {
  const res = await fetch(`/api/igdb/game/${id}`, { signal });
  if (!res.ok) throw new Error(`Game fetch failed: ${res.status}`);
  return (await res.json()) as GameImport;
}

// Use IPC only in the packaged Electron app (file:// protocol).
// In dev, Next.js runs at localhost:3000 and handles the API routes directly,
// so we fall through to HTTP even when window.electron is present.
function isPackagedElectron(): boolean {
  return (
    typeof window !== "undefined" &&
    window.electron?.igdb != null &&
    window.location.protocol === "file:"
  );
}

export function searchGames(
  query: string,
  signal?: AbortSignal,
): Promise<GameSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return Promise.resolve([]);
  if (isPackagedElectron()) {
    return window.electron!.igdb.search(trimmed);
  }
  return httpSearch(trimmed, signal);
}

export function getGameImport(
  id: number | string,
  signal?: AbortSignal,
): Promise<GameImport> {
  if (isPackagedElectron()) {
    return window.electron!.igdb.getGame(id);
  }
  return httpGetGame(id, signal);
}
