"use client";

import {
  RadarChart as RRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_STYLE,
} from "@/lib/constants";

interface RadarChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  categoryKey: keyof T & string;
  name?: string;
  height?: number;
  domain?: [number, number];
}

export function RadarChart<T>({
  data,
  dataKey,
  categoryKey,
  name = "Valor",
  height = 300,
  domain,
}: RadarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RRadarChart data={data}>
        <PolarGrid stroke={CHART_GRID_STROKE} />
        <PolarAngleAxis
          dataKey={categoryKey}
          stroke={CHART_AXIS_STROKE}
          tick={{ fill: CHART_AXIS_STROKE, fontSize: 12 }}
        />
        <PolarRadiusAxis
          stroke={CHART_AXIS_STROKE}
          angle={90}
          domain={domain}
          tick={{ fill: CHART_AXIS_STROKE, fontSize: 11 }}
        />
        <Radar
          name={name}
          dataKey={dataKey}
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
      </RRadarChart>
    </ResponsiveContainer>
  );
}
