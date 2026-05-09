"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { HltbData } from "@/lib/hltb/types";
import { formatHltbHours } from "@/lib/hltb/types";
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
} from "@/lib/constants";

interface HltbComparisonChartProps {
  hltb: HltbData;
  userHours: number;
  height?: number;
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

export function HltbComparisonChart({
  hltb,
  userHours,
  height = 280,
}: HltbComparisonChartProps) {
  const data = [
    ...(hltb.mainStory > 0
      ? [{ name: "Só História", hltb: hltb.mainStory, você: userHours }]
      : []),
    ...(hltb.mainExtra > 0
      ? [{ name: "Hist. + Extras", hltb: hltb.mainExtra, você: userHours }]
      : []),
    ...(hltb.completionist > 0
      ? [{ name: "Completionista", hltb: hltb.completionist, você: userHours }]
      : []),
  ];

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Dados HLTB não disponíveis para este jogo.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
        <XAxis
          dataKey="name"
          stroke={CHART_AXIS_STROKE}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          stroke={CHART_AXIS_STROKE}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v}h`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
        {userHours > 0 && (
          <ReferenceLine
            y={userHours}
            stroke="#06b6d4"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}
        <Bar
          dataKey="hltb"
          name="Média HLTB"
          fill="#8b5cf650"
          stroke="#8b5cf680"
          strokeWidth={1}
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="você"
          name="Seu Tempo"
          fill="#06b6d4"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
