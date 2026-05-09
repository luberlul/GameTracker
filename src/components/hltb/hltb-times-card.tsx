"use client";

import { BookOpen, PackagePlus, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HltbData } from "@/lib/hltb/types";
import { formatHltbHours } from "@/lib/hltb/types";

interface HltbTimesCardProps {
  hltb: HltbData;
  userHours?: number;
  compact?: boolean;
}

const TIMES = [
  {
    key: "mainStory" as const,
    label: "Só a História",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    key: "mainExtra" as const,
    label: "História + Extras",
    icon: PackagePlus,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  {
    key: "completionist" as const,
    label: "Completionista",
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
];

export function HltbTimesCard({
  hltb,
  userHours,
  compact = false,
}: HltbTimesCardProps) {
  const hasAnyData = hltb.mainStory > 0 || hltb.mainExtra > 0 || hltb.completionist > 0;

  if (!hasAnyData) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Dados HLTB não disponíveis para este jogo.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className={cn("grid gap-3", compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3")}>
        {TIMES.map(({ key, label, icon: Icon, color, bg }) => {
          const hours = hltb[key];
          if (hours <= 0) return null;

          const pct =
            userHours && userHours > 0
              ? Math.min(100, Math.round((userHours / hours) * 100))
              : null;

          return (
            <div
              key={key}
              className={cn(
                "rounded-xl border p-3 flex flex-col gap-1.5",
                bg,
              )}
            >
              <div className={cn("flex items-center gap-1.5 text-xs font-medium", color)}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
              <p className="text-2xl font-bold">{formatHltbHours(hours)}</p>
              {pct !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{pct}% do caminho</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", color.replace("text-", "bg-"))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Fonte:{" "}
        <span className="font-medium text-foreground">HowLongToBeat</span>
        {hltb.name !== "" && ` · ${hltb.name}`}
      </p>
    </div>
  );
}
