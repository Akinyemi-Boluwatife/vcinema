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
} from "./chart-primitives";

const tickStyle = { fill: "var(--fg-2)", fontSize: 12 };

export default function RatingByGenreChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
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
        <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
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
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--fg-1)",
          }}
          formatter={(v, _name, props) => [
            `${Number(v).toFixed(1)} (${props.payload.count} films)`,
            "Avg rating",
          ]}
        />
        <Bar
          dataKey="avg"
          fill="var(--cinema-accent)"
          fillOpacity={0.85}
          radius={[0, 4, 4, 0]}
        >
          <LabelList
            dataKey="avg"
            position="right"
            formatter={(v) => Number(v).toFixed(1)}
            style={{ fill: "var(--fg-2)", fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
