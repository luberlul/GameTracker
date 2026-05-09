import type { HltbData } from "@/lib/hltb/types";

export interface Game {
  id: string;
  title: string;
  coverColor: string;
  coverImage?: string;
  bannerImage?: string;
  status: "completed" | "playing" | "backlog" | "dropped" | "100%";
  platform: string;
  overallRating: number;
  storyRating: number;
  gameplayRating: number;
  soundtrackRating: number;
  graphicsRating: number;
  difficulty: number;
  hoursPlayed: number;
  minutesPlayed?: number;
  startDate: string;
  endDate?: string;
  releaseYear?: string;
  genre: string[];
  notes: string;
  achievements: string;
  screenshots?: string[];
  tier?: "S" | "A" | "B" | "C" | "D";
  igdbId?: number;
  hltb?: HltbData;
}

/** Convert a raw DB record (GameData) into the typed Game interface. */
export function toGame(row: {
  id: string;
  title: string;
  coverColor: string;
  coverImage?: string;
  bannerImage?: string;
  status: string;
  platform: string;
  overallRating: number;
  storyRating: number;
  gameplayRating: number;
  soundtrackRating: number;
  graphicsRating: number;
  difficulty: number;
  hoursPlayed: number;
  minutesPlayed: number;
  startDate: string;
  endDate?: string;
  releaseYear?: string;
  genre: string[];
  notes: string;
  achievements: string;
  screenshots: string[];
  tier?: string;
  igdbId?: number;
  hltbId?: string;
  hltbName?: string;
  hltbImageUrl?: string;
  hltbMainStory?: number;
  hltbMainExtra?: number;
  hltbCompletionist?: number;
}): Game {
  const hltb: HltbData | undefined =
    row.hltbId != null
      ? {
          id: row.hltbId,
          name: row.hltbName ?? row.title,
          imageUrl: row.hltbImageUrl ?? "",
          mainStory: row.hltbMainStory ?? 0,
          mainExtra: row.hltbMainExtra ?? 0,
          completionist: row.hltbCompletionist ?? 0,
        }
      : undefined;

  return {
    id: row.id,
    title: row.title,
    coverColor: row.coverColor,
    coverImage: row.coverImage,
    bannerImage: row.bannerImage,
    status: row.status as Game["status"],
    platform: row.platform,
    overallRating: row.overallRating,
    storyRating: row.storyRating,
    gameplayRating: row.gameplayRating,
    soundtrackRating: row.soundtrackRating,
    graphicsRating: row.graphicsRating,
    difficulty: row.difficulty,
    hoursPlayed: row.hoursPlayed,
    minutesPlayed: row.minutesPlayed,
    startDate: row.startDate,
    endDate: row.endDate,
    releaseYear: row.releaseYear,
    genre: row.genre,
    notes: row.notes,
    achievements: row.achievements,
    screenshots: row.screenshots,
    tier: row.tier as Game["tier"],
    igdbId: row.igdbId,
    hltb,
  };
}
