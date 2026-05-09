import { NextResponse } from "next/server";
import { searchGames } from "@/lib/rawg/server";
import { toSuggestion } from "@/lib/rawg/mappers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const pageSize = Math.min(
    Math.max(parseInt(searchParams.get("page_size") ?? "8", 10) || 8, 1),
    20,
  );

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchGames(q, pageSize);
    return NextResponse.json({
      results: data.results.map(toSuggestion),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
