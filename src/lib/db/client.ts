import type { GameData, CreateGameInput, UpdateGameInput } from "./types";

function useElectronDb() {
  return typeof window !== "undefined" && window.electron?.db != null
    ? window.electron.db
    : null;
}

export async function listGames(): Promise<GameData[]> {
  const ipc = useElectronDb();
  if (ipc) return ipc.listGames();
  const res = await fetch("/api/games");
  if (!res.ok) throw new Error("Failed to list games");
  return res.json() as Promise<GameData[]>;
}

export async function getGame(id: string): Promise<GameData | null> {
  const ipc = useElectronDb();
  if (ipc) return ipc.getGame(id);
  const res = await fetch(`/api/games/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to get game");
  return res.json() as Promise<GameData>;
}

export async function createGame(input: CreateGameInput): Promise<GameData> {
  const ipc = useElectronDb();
  if (ipc) return ipc.createGame(input);
  const res = await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create game");
  return res.json() as Promise<GameData>;
}

export async function updateGame(
  id: string,
  input: UpdateGameInput,
): Promise<GameData> {
  const ipc = useElectronDb();
  if (ipc) return ipc.updateGame(id, input);
  const res = await fetch(`/api/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update game");
  return res.json() as Promise<GameData>;
}

export async function deleteGame(id: string): Promise<void> {
  const ipc = useElectronDb();
  if (ipc) return ipc.deleteGame(id);
  const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete game");
}
