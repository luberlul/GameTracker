import { NextRequest, NextResponse } from "next/server";
import { searchGames } from "@/lib/igdb/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchGames(q);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("[igdb/search]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
