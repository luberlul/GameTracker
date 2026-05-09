import { NextRequest, NextResponse } from "next/server";
import type { HltbData } from "@/lib/hltb/types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query?.trim()) return NextResponse.json(null);

  try {
    const { HowLongToBeatService } = await import("howlongtobeat");
    const service = new HowLongToBeatService();
    const results = await service.search(query.trim());
    if (!results || results.length === 0) return NextResponse.json(null);

    const best = results.reduce((a, b) =>
      b.similarity > a.similarity ? b : a,
    );
    const data: HltbData = {
      id: best.id,
      name: best.name,
      imageUrl: best.imageUrl ?? "",
      mainStory: best.gameplayMain ?? 0,
      mainExtra: best.gameplayMainExtra ?? 0,
      completionist: best.gameplayCompletionist ?? 0,
    };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
