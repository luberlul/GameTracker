import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db/server";

function parseJson(str: string, fallback: unknown) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function fromRow(row: Record<string, unknown>) {
  return {
    ...row,
    genre: parseJson(row.genre as string, []),
    screenshots: parseJson(row.screenshots as string, []),
    createdAt: (row.createdAt as Date).toISOString(),
    updatedAt: (row.updatedAt as Date).toISOString(),
  };
}

export async function GET() {
  const rows = await prisma.game.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows.map(fromRow));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const row = await prisma.game.create({
    data: {
      title: body.title,
      coverColor: body.coverColor ?? "#8b5cf6",
      coverImage: body.coverImage,
      bannerImage: body.bannerImage,
      status: body.status ?? "backlog",
      platform: body.platform ?? "",
      overallRating: body.overallRating ?? 0,
      storyRating: body.storyRating ?? 0,
      gameplayRating: body.gameplayRating ?? 0,
      soundtrackRating: body.soundtrackRating ?? 0,
      graphicsRating: body.graphicsRating ?? 0,
      difficulty: body.difficulty ?? 0,
      hoursPlayed: body.hoursPlayed ?? 0,
      minutesPlayed: body.minutesPlayed ?? 0,
      startDate: body.startDate ?? "",
      endDate: body.endDate,
      releaseYear: body.releaseYear,
      genre: JSON.stringify(body.genre ?? []),
      notes: body.notes ?? "",
      achievements: body.achievements ?? "",
      screenshots: JSON.stringify(body.screenshots ?? []),
      tier: body.tier,
      igdbId: body.igdbId,
      hltbId: body.hltbId,
      hltbName: body.hltbName,
      hltbImageUrl: body.hltbImageUrl,
      hltbMainStory: body.hltbMainStory,
      hltbMainExtra: body.hltbMainExtra,
      hltbCompletionist: body.hltbCompletionist,
    },
  });
  return NextResponse.json(fromRow(row as unknown as Record<string, unknown>), {
    status: 201,
  });
}
