"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { colors } from "@/_styles/tokens";

const tickStyle = { fill: colors.onSurfaceVariant, fontSize: 11 };

export default function RatingByGenreChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-on-surface-variant text-xs">
        Rate at least 2 movies in a genre to see this chart.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid stroke={colors.outlineVariant} strokeOpacity={0.3} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 10]}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="genre"
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
          width={80}
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
          formatter={(v, _name, props) => [
            `★ ${Number(v).toFixed(1)} (${props.payload.count} films)`,
            "Avg rating",
          ]}
        />
        <Bar dataKey="avg" fill={colors.tertiary} radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="avg"
            position="right"
            formatter={(v) => Number(v).toFixed(1)}
            style={{ fill: colors.onSurfaceVariant, fontSize: 11 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
