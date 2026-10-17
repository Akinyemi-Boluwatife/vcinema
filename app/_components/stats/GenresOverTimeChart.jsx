"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "./chart-primitives";
import ChartContainer from "./ChartContainer";

const palette = [
  "color-mix(in srgb, var(--cinema-accent) 85%, transparent)",
  "color-mix(in srgb, var(--cinema-accent) 60%, transparent)",
  "color-mix(in srgb, var(--cinema-accent) 40%, transparent)",
  "color-mix(in srgb, var(--cinema-accent) 25%, transparent)",
  "color-mix(in srgb, var(--foreground) 14%, transparent)",
];

const tickStyle = { fill: "var(--fg-2)", fontSize: 12 };

function formatMonth(m) {
  const [y, mm] = m.split("-");
  return new Date(Date.UTC(+y, +mm - 1, 1)).toLocaleString("en-US", {
    month: "short",
  });
}

export default function GenresOverTimeChart({ data, genres }) {
  if (!genres || genres.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
        Not enough genre data yet.
      </div>
    );
  }
  return (
    <ChartContainer>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
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
          contentStyle={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--fg-1)",
          }}
          labelFormatter={formatMonth}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "var(--fg-2)" }}
          iconType="square"
        />
        {genres.map((g, i) => (
          <Area
            key={g}
            type="monotone"
            dataKey={g}
            stackId="1"
            stroke={palette[i % palette.length]}
            fill={palette[i % palette.length]}
            fillOpacity={0.85}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
