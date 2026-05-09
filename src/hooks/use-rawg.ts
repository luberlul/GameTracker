import { useQuery } from "@tanstack/react-query";
import { getGameImport, searchGames } from "@/lib/rawg/client";
import type { GameImport, GameSuggestion } from "@/lib/rawg/types";

const MIN_QUERY = 2;

export function useRawgSearch(query: string) {
  const enabled = query.trim().length >= MIN_QUERY;

  return useQuery<GameSuggestion[]>({
    queryKey: ["rawg", "search", query.trim().toLowerCase()],
    queryFn: ({ signal }) => searchGames(query, signal),
    enabled,
  });
}

export function useRawgGame(id: number | null) {
  return useQuery<GameImport>({
    queryKey: ["rawg", "game", id],
    queryFn: ({ signal }) => getGameImport(id as number, signal),
    enabled: id !== null,
  });
}
