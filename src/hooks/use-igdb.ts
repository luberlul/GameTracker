import { useQuery } from "@tanstack/react-query";
import { searchGames, getGameImport } from "@/lib/igdb/client";
import type { GameSuggestion, GameImport } from "@/lib/igdb/types";

const MIN_QUERY = 2;

export function useIgdbSearch(query: string) {
  const enabled = query.trim().length >= MIN_QUERY;

  return useQuery<GameSuggestion[]>({
    queryKey: ["igdb", "search", query.trim().toLowerCase()],
    queryFn: ({ signal }) => searchGames(query, signal),
    enabled,
  });
}

export function useIgdbGame(id: number | null) {
  return useQuery<GameImport>({
    queryKey: ["igdb", "game", id],
    queryFn: ({ signal }) => getGameImport(id as number, signal),
    enabled: id !== null,
  });
}
