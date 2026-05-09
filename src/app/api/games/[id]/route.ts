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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = await prisma.game.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fromRow(row as unknown as Record<string, unknown>));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = { ...body };
  if (body.genre !== undefined) data.genre = JSON.stringify(body.genre);
  if (body.screenshots !== undefined)
    data.screenshots = JSON.stringify(body.screenshots);
  const row = await prisma.game.update({ where: { id }, data });
  return NextResponse.json(fromRow(row as unknown as Record<string, unknown>));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.game.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
