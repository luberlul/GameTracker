"use client";

import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_STYLE,
} from "@/lib/constants";

interface BarChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  categoryKey: keyof T & string;
  color?: string;
  layout?: "horizontal" | "vertical";
  height?: number;
}

export function BarChart<T>({
  data,
  dataKey,
  categoryKey,
  color = "#8b5cf6",
  layout = "horizontal",
  height = 300,
}: BarChartProps<T>) {
  const isVertical = layout === "vertical";
  const tick = { fill: CHART_AXIS_STROKE, fontSize: 12 };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} layout={layout} margin={{ top: 5, right: 16, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
        <XAxis
          type={isVertical ? "number" : "category"}
          dataKey={isVertical ? undefined : categoryKey}
          stroke={CHART_AXIS_STROKE}
          tick={tick}
          allowDecimals={false}
        />
        <YAxis
          type={isVertical ? "category" : "number"}
          dataKey={isVertical ? categoryKey : undefined}
          stroke={CHART_AXIS_STROKE}
          tick={tick}
          allowDecimals={false}
          width={isVertical ? 100 : 40}
        />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={isVertical ? [0, 8, 8, 0] : [8, 8, 0, 0]}
          maxBarSize={60}
        />
      </RBarChart>
    </ResponsiveContainer>
  );
}
