"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { colors } from "@/_styles/tokens";

const tickStyle = { fill: colors.onSurfaceVariant, fontSize: 11 };

function formatMonth(m) {
  const [y, mm] = m.split("-");
  return new Date(Date.UTC(+y, +mm - 1, 1)).toLocaleString("en-US", {
    month: "short",
  });
}

export default function MonthlyWatchChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={colors.outlineVariant} strokeOpacity={0.3} vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={tickStyle}
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: colors.surfaceVariant, opacity: 0.4 }}
          contentStyle={{
            background: colors.surfaceContainerHigh,
            border: `1px solid ${colors.outlineVariant}`,
            borderRadius: 8,
            fontSize: 12,
            color: colors.onSurface,
          }}
          labelFormatter={formatMonth}
        />
        <Bar dataKey="count" fill={colors.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
