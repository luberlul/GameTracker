"use client";

import {
  AreaChart as RAreaChart,
  Area,
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

interface AreaChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  categoryKey: keyof T & string;
  color?: string;
  height?: number;
}

export function AreaChart<T>({
  data,
  dataKey,
  categoryKey,
  color = "#8b5cf6",
  height = 300,
}: AreaChartProps<T>) {
  const gradientId = `area-gradient-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
        <XAxis
          dataKey={categoryKey}
          stroke={CHART_AXIS_STROKE}
          tick={{ fill: CHART_AXIS_STROKE, fontSize: 12 }}
        />
        <YAxis
          stroke={CHART_AXIS_STROKE}
          tick={{ fill: CHART_AXIS_STROKE, fontSize: 12 }}
        />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </RAreaChart>
    </ResponsiveContainer>
  );
}
