import { contextBridge, ipcRenderer } from "electron";
import type { GameImport, GameSuggestion } from "./igdb";
import type { HltbData } from "./hltb";
import type { GameData, CreateGameInput, UpdateGameInput } from "./game-repository";

const api = {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  isMaximized: (): Promise<boolean> =>
    ipcRenderer.invoke("window:is-maximized"),
  focus: () => ipcRenderer.invoke("window:focus"),
  onMaximizeChange: (cb: (maximized: boolean) => void) => {
    const listener = (_event: unknown, value: boolean) => cb(value);
    ipcRenderer.on("window:maximize-changed", listener);
    return () => ipcRenderer.removeListener("window:maximize-changed", listener);
  },
  platform: process.platform,
  igdb: {
    search: (query: string): Promise<GameSuggestion[]> =>
      ipcRenderer.invoke("igdb:search", query),
    getGame: (id: number | string): Promise<GameImport> =>
      ipcRenderer.invoke("igdb:get-game", id),
  },
  hltb: {
    search: (query: string): Promise<HltbData | null> =>
      ipcRenderer.invoke("hltb:search", query),
  },
  db: {
    listGames: (): Promise<GameData[]> =>
      ipcRenderer.invoke("db:games:list"),
    getGame: (id: string): Promise<GameData | null> =>
      ipcRenderer.invoke("db:games:get", id),
    createGame: (input: CreateGameInput): Promise<GameData> =>
      ipcRenderer.invoke("db:games:create", input),
    updateGame: (id: string, input: UpdateGameInput): Promise<GameData> =>
      ipcRenderer.invoke("db:games:update", id, input),
    deleteGame: (id: string): Promise<void> =>
      ipcRenderer.invoke("db:games:delete", id),
  },
};

contextBridge.exposeInMainWorld("electron", api);

export type ElectronApi = typeof api;
