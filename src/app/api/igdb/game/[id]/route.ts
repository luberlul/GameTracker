import { NextRequest, NextResponse } from "next/server";
import { getGameDetails } from "@/lib/igdb/server";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const game = await getGameDetails(id);
    return NextResponse.json(game);
  } catch (err) {
    console.error("[igdb/game]", err);
    return NextResponse.json({ error: "Game not found" }, { status: 500 });
  }
}
