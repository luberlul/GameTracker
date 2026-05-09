"use client";

import {
  LineChart as RLineChart,
  Line,
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

interface LineChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  categoryKey: keyof T & string;
  color?: string;
  height?: number;
}

export function LineChart<T>({
  data,
  dataKey,
  categoryKey,
  color = "#06b6d4",
  height = 300,
}: LineChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
        <XAxis dataKey={categoryKey} stroke={CHART_AXIS_STROKE} />
        <YAxis stroke={CHART_AXIS_STROKE} />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, r: 6 }}
        />
      </RLineChart>
    </ResponsiveContainer>
  );
}
