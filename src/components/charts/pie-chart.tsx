"use client";

import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "@/lib/constants";

interface PieDatum {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieDatum[];
  height?: number;
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={100}
          dataKey="value"
        >
          {filtered.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
      </RPieChart>
    </ResponsiveContainer>
  );
}
