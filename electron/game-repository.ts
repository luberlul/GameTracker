import type { Game as PrismaGame } from "@prisma/client";
import { getDb } from "./database";

export interface GameData {
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
  createdAt: string;
  updatedAt: string;
}

export type CreateGameInput = Omit<GameData, "id" | "createdAt" | "updatedAt">;
export type UpdateGameInput = Partial<CreateGameInput>;

function fromPrisma(row: PrismaGame): GameData {
  return {
    id: row.id,
    title: row.title,
    coverColor: row.coverColor,
    coverImage: row.coverImage ?? undefined,
    bannerImage: row.bannerImage ?? undefined,
    status: row.status,
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
    endDate: row.endDate ?? undefined,
    releaseYear: row.releaseYear ?? undefined,
    genre: safeParseJson(row.genre, []),
    notes: row.notes,
    achievements: row.achievements,
    screenshots: safeParseJson(row.screenshots, []),
    tier: row.tier ?? undefined,
    igdbId: row.igdbId ?? undefined,
    hltbId: row.hltbId ?? undefined,
    hltbName: row.hltbName ?? undefined,
    hltbImageUrl: row.hltbImageUrl ?? undefined,
    hltbMainStory: row.hltbMainStory ?? undefined,
    hltbMainExtra: row.hltbMainExtra ?? undefined,
    hltbCompletionist: row.hltbCompletionist ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function safeParseJson<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export async function listGames(): Promise<GameData[]> {
  const db = getDb();
  const rows = await db.game.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(fromPrisma);
}

export async function getGame(id: string): Promise<GameData | null> {
  const db = getDb();
  const row = await db.game.findUnique({ where: { id } });
  return row ? fromPrisma(row) : null;
}

export async function createGame(input: CreateGameInput): Promise<GameData> {
  const db = getDb();
  const row = await db.game.create({
    data: {
      title: input.title,
      coverColor: input.coverColor,
      coverImage: input.coverImage,
      bannerImage: input.bannerImage,
      status: input.status,
      platform: input.platform,
      overallRating: input.overallRating,
      storyRating: input.storyRating,
      gameplayRating: input.gameplayRating,
      soundtrackRating: input.soundtrackRating,
      graphicsRating: input.graphicsRating,
      difficulty: input.difficulty,
      hoursPlayed: input.hoursPlayed,
      minutesPlayed: input.minutesPlayed,
      startDate: input.startDate,
      endDate: input.endDate,
      releaseYear: input.releaseYear,
      genre: JSON.stringify(input.genre),
      notes: input.notes,
      achievements: input.achievements,
      screenshots: JSON.stringify(input.screenshots),
      tier: input.tier,
      igdbId: input.igdbId,
      hltbId: input.hltbId,
      hltbName: input.hltbName,
      hltbImageUrl: input.hltbImageUrl,
      hltbMainStory: input.hltbMainStory,
      hltbMainExtra: input.hltbMainExtra,
      hltbCompletionist: input.hltbCompletionist,
    },
  });
  return fromPrisma(row);
}

export async function updateGame(
  id: string,
  input: UpdateGameInput,
): Promise<GameData> {
  const db = getDb();
  const data: Record<string, unknown> = { ...input };
  if (input.genre !== undefined) data.genre = JSON.stringify(input.genre);
  if (input.screenshots !== undefined)
    data.screenshots = JSON.stringify(input.screenshots);
  const row = await db.game.update({ where: { id }, data });
  return fromPrisma(row);
}

export async function deleteGame(id: string): Promise<void> {
  const db = getDb();
  await db.game.delete({ where: { id } });
}
