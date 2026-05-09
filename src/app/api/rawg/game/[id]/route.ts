import { NextResponse } from "next/server";
import { getGameDetails } from "@/lib/rawg/server";
import { toGameImport } from "@/lib/rawg/mappers";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const data = await getGameDetails(id);
    return NextResponse.json(toGameImport(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
