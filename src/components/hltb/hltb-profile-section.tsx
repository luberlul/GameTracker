"use client";

import { Zap, Minus, Map, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/charts/chart-card";
import type { Game } from "@/lib/data/games";
import { formatHltbHours, getSpeedLabel } from "@/lib/hltb/types";
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
} from "@/lib/constants";

interface HltbProfileSectionProps {
  games: Game[];
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl shadow-black/30 text-sm">
      <p className="font-bold mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-6">
          <span>{p.name}</span>
          <span className="font-semibold">{formatHltbHours(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function HltbProfileSection({ games }: HltbProfileSectionProps) {
  const withHltb = games.filter(
    (g) => g.hltb && g.hltb.mainStory > 0 && g.hoursPlayed > 0,
  );
  const finished = withHltb.filter((g) =>
    ["completed", "100%"].includes(g.status),
  );

  if (withHltb.length === 0) {
    return null;
  }

  const speedStats = finished.map((g) => ({
    title: g.title,
    userHours: g.hoursPlayed + (g.minutesPlayed ?? 0) / 60,
    hltbHours: g.hltb!.mainStory,
    ratio: (g.hoursPlayed + (g.minutesPlayed ?? 0) / 60) / g.hltb!.mainStory,
  }));

  const fasterCount = speedStats.filter((s) => s.ratio < 0.85).length;
  const onParCount = speedStats.filter(
    (s) => s.ratio >= 0.85 && s.ratio <= 1.15,
  ).length;
  const slowerCount = speedStats.filter((s) => s.ratio > 1.15).length;

  const avgRatio =
    speedStats.length > 0
      ? speedStats.reduce((a, b) => a + b.ratio, 0) / speedStats.length
      : null;

  const chartData = [...withHltb]
    .sort((a, b) => b.hoursPlayed - a.hoursPlayed)
    .slice(0, 8)
    .map((g) => ({
      name: g.title.length > 16 ? g.title.slice(0, 16) + "…" : g.title,
      "Seu Tempo": parseFloat(
        (g.hoursPlayed + (g.minutesPlayed ?? 0) / 60).toFixed(1),
      ),
      "Média HLTB": g.hltb!.mainStory,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Análise HowLongToBeat</h2>
        <p className="text-muted-foreground text-sm">
          Comparação do seu tempo de jogo com as médias da comunidade
        </p>
      </div>

      {finished.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ProfileStatCard
              icon={<Zap className="w-5 h-5 text-emerald-400" />}
              label="Speedrunner"
              value={fasterCount}
              sub="jogos completados mais rápido"
              color="from-emerald-500/20 to-emerald-500/5 border-emerald-500/30"
            />
            <ProfileStatCard
              icon={<Minus className="w-5 h-5 text-slate-400" />}
              label="Na Média"
              value={onParCount}
              sub="jogos dentro da média"
              color="from-slate-500/20 to-slate-500/5 border-slate-500/30"
            />
            <ProfileStatCard
              icon={<Map className="w-5 h-5 text-sky-400" />}
              label="Explorador"
              value={slowerCount}
              sub="jogos acima da média"
              color="from-sky-500/20 to-sky-500/5 border-sky-500/30"
            />
            {avgRatio !== null && (
              <ProfileStatCard
                icon={<Clock className="w-5 h-5 text-primary" />}
                label="Velocidade Média"
                value={`${avgRatio < 1 ? "-" : "+"}${Math.abs(Math.round((avgRatio - 1) * 100))}%`}
                sub={avgRatio < 0.85 ? "acima da média geral" : avgRatio > 1.15 ? "abaixo da média geral" : "alinhado à média"}
                color="from-primary/20 to-primary/5 border-primary/30"
              />
            )}
          </div>
        </>
      )}

      <ChartCard title="Tempo Jogado vs. Média HLTB (História Principal)">
        <ResponsiveContainer width="100%" height={chartData.length * 52 + 60}>
          <BarChart data={chartData} layout="vertical" barGap={2} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} horizontal={false} />
            <XAxis
              type="number"
              stroke={CHART_AXIS_STROKE}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}h`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={CHART_AXIS_STROKE}
              tick={{ fontSize: 12 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <Bar
              dataKey="Média HLTB"
              fill="#8b5cf650"
              stroke="#8b5cf680"
              strokeWidth={1}
              radius={[0, 6, 6, 0]}
            />
            <Bar
              dataKey="Seu Tempo"
              fill="#06b6d4"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {finished.length > 0 && (
        <Card glass>
          <h3 className="font-bold mb-4 text-lg">Velocidade por Jogo</h3>
          <div className="space-y-3">
            {speedStats
              .sort((a, b) => a.ratio - b.ratio)
              .map((s, i) => {
                const label = getSpeedLabel(s.userHours, s.hltbHours);
                const pct = Math.round(Math.abs(s.ratio - 1) * 100);
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent"
                  >
                    <div className="text-lg font-bold text-muted-foreground w-6">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatHltbHours(s.userHours)} jogados ·{" "}
                        {formatHltbHours(s.hltbHours)} média HLTB
                      </p>
                    </div>
                    <SpeedChip label={label} pct={pct} />
                  </motion.div>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
}

function ProfileStatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 flex flex-col gap-2 ${color}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground leading-tight">{sub}</p>
    </div>
  );
}

function SpeedChip({
  label,
  pct,
}: {
  label: "faster" | "on-par" | "slower";
  pct: number;
}) {
  const map = {
    faster: { text: `⚡ ${pct}% mais rápido`, cls: "text-emerald-400 bg-emerald-400/10" },
    "on-par": { text: "≈ Na média", cls: "text-slate-400 bg-slate-400/10" },
    slower: { text: `🗺️ ${pct}% explorador`, cls: "text-sky-400 bg-sky-400/10" },
  };
  const { text, cls } = map[label];
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${cls}`}>
      {text}
    </span>
  );
}
