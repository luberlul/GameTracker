import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as db from "@/lib/db/client";
import type { CreateGameInput, UpdateGameInput } from "@/lib/db/types";

export const GAMES_KEY = ["games"] as const;
export const gameKey = (id: string) => ["games", id] as const;

export function useGames() {
  return useQuery({ queryKey: GAMES_KEY, queryFn: db.listGames });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: gameKey(id),
    queryFn: () => db.getGame(id),
    enabled: !!id,
  });
}

export function useCreateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGameInput) => db.createGame(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GAMES_KEY });
    },
  });
}

export function useUpdateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGameInput }) =>
      db.updateGame(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: GAMES_KEY });
      qc.invalidateQueries({ queryKey: gameKey(id) });
    },
  });
}

export function useDeleteGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => db.deleteGame(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GAMES_KEY });
    },
  });
}
