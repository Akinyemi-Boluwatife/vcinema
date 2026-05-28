"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "./chart-primitives";

const tickStyle = { fill: "var(--fg-2)", fontSize: 12 };

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
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
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
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--fg-1)",
          }}
          labelFormatter={formatMonth}
        />
        <Bar
          dataKey="count"
          fill="var(--cinema-accent)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
