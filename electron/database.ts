import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

let prisma: PrismaClient | null = null;

function getDbUrl(): string {
  if (app.isPackaged) {
    const dir = app.getPath("userData");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return `file:${path.join(dir, "gametrack.db")}`;
  }
  return "file:./prisma/dev.db";
}

export function getDb(): PrismaClient {
  if (!prisma) {
    const adapter = new PrismaLibSql({ url: getDbUrl() });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prisma = new PrismaClient({ adapter } as any);
  }
  return prisma;
}
