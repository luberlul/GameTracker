"use client";

import { Zap, Minus, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HltbData } from "@/lib/hltb/types";
import { getSpeedLabel, formatHltbHours } from "@/lib/hltb/types";
import type { Game } from "@/lib/data/games";

interface HltbSpeedBadgeProps {
  hltb: HltbData;
  userHours: number;
  status: Game["status"];
}

const CONFIG = {
  faster: {
    icon: Zap,
    label: "Mais Rápido",
    description: "que a média da história principal",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
    iconColor: "text-emerald-400",
  },
  "on-par": {
    icon: Minus,
    label: "Na Média",
    description: "próximo ao tempo médio",
    color: "text-slate-400",
    bg: "bg-slate-400/10 border-slate-400/30",
    iconColor: "text-slate-400",
  },
  slower: {
    icon: Map,
    label: "Explorador",
    description: "acima do tempo médio da história",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/30",
    iconColor: "text-sky-400",
  },
};

export function HltbSpeedBadge({
  hltb,
  userHours,
  status,
}: HltbSpeedBadgeProps) {
  const isPlaying = status === "playing";
  const hasFinished = status === "completed" || status === "100%";
  const hasData = hltb.mainStory > 0;

  if (!hasData || userHours <= 0) return null;

  const label = getSpeedLabel(userHours, hltb.mainStory);
  const cfg = CONFIG[label];
  const Icon = cfg.icon;

  const ratio = userHours / hltb.mainStory;
  const pct = Math.abs(Math.round((ratio - 1) * 100));
  const diffStr =
    ratio < 1
      ? `${pct}% mais rápido`
      : ratio > 1.15
        ? `${pct}% mais lento`
        : "dentro da média";

  const remaining = {
    main: Math.max(0, hltb.mainStory - userHours),
    extra: Math.max(0, hltb.mainExtra - userHours),
    completionist: Math.max(0, hltb.completionist - userHours),
  };

  return (
    <div className="space-y-3">
      {hasFinished && (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl border",
            cfg.bg,
          )}
        >
          <Icon className={cn("w-5 h-5 flex-shrink-0", cfg.iconColor)} />
          <div className="min-w-0">
            <p className={cn("font-bold text-sm", cfg.color)}>{cfg.label}</p>
            <p className="text-xs text-muted-foreground">
              {diffStr} {cfg.description}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Seu tempo</p>
            <p className="font-bold text-sm">{formatHltbHours(userHours)}</p>
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {hltb.mainStory > 0 && remaining.main > 0 && (
            <RemainingTile
              label="Restante (história)"
              value={remaining.main}
              color="text-blue-400"
            />
          )}
          {hltb.mainExtra > 0 && remaining.extra > 0 && (
            <RemainingTile
              label="Restante (+ extras)"
              value={remaining.extra}
              color="text-purple-400"
            />
          )}
          {hltb.completionist > 0 && remaining.completionist > 0 && (
            <RemainingTile
              label="Restante (100%)"
              value={remaining.completionist}
              color="text-amber-400"
            />
          )}
        </div>
      )}
    </div>
  );
}

function RemainingTile({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-accent px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-bold text-base", color)}>
        ~{formatHltbHours(value)}
      </p>
    </div>
  );
}
