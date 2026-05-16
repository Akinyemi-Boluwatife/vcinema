"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { colors } from "@/_styles/tokens";

const palette = [
  colors.primary,
  colors.tertiary,
  colors.secondaryFixed,
  colors.primaryContainer,
  colors.tertiaryContainer,
];

const tickStyle = { fill: colors.onSurfaceVariant, fontSize: 11 };

function formatMonth(m) {
  const [y, mm] = m.split("-");
  return new Date(Date.UTC(+y, +mm - 1, 1)).toLocaleString("en-US", {
    month: "short",
  });
}

export default function GenresOverTimeChart({ data, genres }) {
  if (!genres || genres.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-on-surface-variant text-xs">
        Not enough genre data yet.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={colors.outlineVariant} strokeOpacity={0.3} vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={tickStyle} allowDecimals={false} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: colors.surfaceContainerHigh,
            border: `1px solid ${colors.outlineVariant}`,
            borderRadius: 8,
            fontSize: 12,
            color: colors.onSurface,
          }}
          labelFormatter={formatMonth}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: colors.onSurfaceVariant }} />
        {genres.map((g, i) => (
          <Area
            key={g}
            type="monotone"
            dataKey={g}
            stackId="1"
            stroke={palette[i % palette.length]}
            fill={palette[i % palette.length]}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
