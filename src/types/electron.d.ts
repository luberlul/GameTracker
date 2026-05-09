import type { GameImport, GameSuggestion } from "@/lib/igdb/types";
import type { HltbData } from "@/lib/hltb/types";
import type { GameData, CreateGameInput, UpdateGameInput } from "@/lib/db/types";

export {};

declare module "*.css";

declare global {
  interface ElectronIgdbApi {
    search: (query: string) => Promise<GameSuggestion[]>;
    getGame: (id: number | string) => Promise<GameImport>;
  }

  interface ElectronHltbApi {
    search: (query: string) => Promise<HltbData | null>;
  }

  interface ElectronDbApi {
    listGames: () => Promise<GameData[]>;
    getGame: (id: string) => Promise<GameData | null>;
    createGame: (input: CreateGameInput) => Promise<GameData>;
    updateGame: (id: string, input: UpdateGameInput) => Promise<GameData>;
    deleteGame: (id: string) => Promise<void>;
  }

  interface ElectronApi {
    minimize: () => Promise<void>;
    toggleMaximize: () => Promise<void>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
    onMaximizeChange: (cb: (maximized: boolean) => void) => () => void;
    focus: () => Promise<void>;
    platform: NodeJS.Platform;
    igdb: ElectronIgdbApi;
    hltb: ElectronHltbApi;
    db: ElectronDbApi;
  }

  interface Window {
    electron?: ElectronApi;
  }
}
