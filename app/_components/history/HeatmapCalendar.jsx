"use client";
import { useMemo, useState } from "react";
import { colors } from "@/_styles/tokens";

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const ROWS = 7;
const LEFT_LABEL_WIDTH = 22;
const TOP_LABEL_HEIGHT = 16;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function dayKey(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeekUTC(date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function levelFor(count) {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const LEVEL_FILL = {
  0: "rgba(255,255,255,0.04)",
  1: "rgba(225,29,46,0.20)",
  2: "rgba(225,29,46,0.40)",
  3: "rgba(225,29,46,0.65)",
  4: "rgba(225,29,46,0.95)",
};

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatLong(date) {
  const w = WEEKDAYS_SHORT[date.getUTCDay()];
  const m = MONTH_LABELS[date.getUTCMonth()];
  return `${w}, ${m} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export default function HeatmapCalendar({ year, byDay }) {
  const [hover, setHover] = useState(null);

  const { cells, monthLabels, weeks } = useMemo(() => {
    const yearStart = new Date(Date.UTC(year, 0, 1));
    const yearEnd = new Date(Date.UTC(year, 11, 31));
    const gridStart = startOfWeekUTC(yearStart);
    const gridEndCutoff = startOfWeekUTC(new Date(Date.UTC(year, 11, 31)));
    const totalWeeks =
      Math.floor((gridEndCutoff.getTime() - gridStart.getTime()) / 604800000) +
      1;

    const cellList = [];
    const monthList = [];
    let prevMonth = -1;

    for (let w = 0; w < totalWeeks; w += 1) {
      for (let d = 0; d < ROWS; d += 1) {
        const date = new Date(gridStart);
        date.setUTCDate(date.getUTCDate() + w * 7 + d);
        if (date.getUTCFullYear() !== year) continue;
        if (date < yearStart || date > yearEnd) continue;

        if (d === 0 && date.getUTCMonth() !== prevMonth) {
          monthList.push({
            x: w * STEP,
            label: MONTH_LABELS[date.getUTCMonth()],
          });
          prevMonth = date.getUTCMonth();
        }

        const key = dayKey(date);
        const bucket = byDay.get?.(key) ?? byDay[key];
        const count = bucket?.count ?? 0;
        const titles = bucket?.titles ?? [];
        cellList.push({
          key,
          date,
          count,
          titles,
          x: w * STEP,
          y: d * STEP,
          level: levelFor(count),
        });
      }
    }

    return { cells: cellList, monthLabels: monthList, weeks: totalWeeks };
  }, [year, byDay]);

  const width = LEFT_LABEL_WIDTH + weeks * STEP;
  const height = TOP_LABEL_HEIGHT + ROWS * STEP;

  return (
    <div className="relative overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={`Watch heatmap for ${year}`}
        style={{ minWidth: width }}
      >
        {monthLabels.map((m) => (
          <text
            key={`m-${m.x}`}
            x={LEFT_LABEL_WIDTH + m.x}
            y={11}
            fill="var(--fg-3)"
            fontSize="10"
            fontFamily="inherit"
          >
            {m.label}
          </text>
        ))}

        {[
          { label: "Mon", row: 1 },
          { label: "Wed", row: 3 },
          { label: "Fri", row: 5 },
        ].map((r) => (
          <text
            key={r.label}
            x={0}
            y={TOP_LABEL_HEIGHT + r.row * STEP + 9}
            fill="var(--fg-3)"
            fontSize="9"
            fontFamily="inherit"
          >
            {r.label}
          </text>
        ))}

        <g transform={`translate(${LEFT_LABEL_WIDTH}, ${TOP_LABEL_HEIGHT})`}>
          {cells.map((c) => (
            <rect
              key={c.key}
              x={c.x}
              y={c.y}
              width={CELL}
              height={CELL}
              rx={2}
              ry={2}
              fill={LEVEL_FILL[c.level]}
              stroke={c.level === 0 ? "rgba(255,255,255,0.05)" : "none"}
              onMouseEnter={() => setHover(c)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setHover((prev) => (prev?.key === c.key ? null : c))}
              style={{ cursor: c.count > 0 ? "pointer" : "default" }}
            >
              <title>
                {`${formatLong(c.date)}${
                  c.count > 0
                    ? ` — ${c.count} ${c.count === 1 ? "movie" : "movies"}: ${c.titles.join(", ")}`
                    : " — no movies"
                }`}
              </title>
            </rect>
          ))}
        </g>
      </svg>

      {hover && hover.count > 0 && (
        <div className="absolute top-0 left-0 pointer-events-none">
          <div
            className="bg-popover border border-border rounded-md px-3 py-2 text-xs text-foreground shadow-lg max-w-xs"
            style={{
              position: "absolute",
              left: Math.min(LEFT_LABEL_WIDTH + hover.x, width - 200),
              top: TOP_LABEL_HEIGHT + hover.y + STEP + 6,
            }}
          >
            <p className="font-medium text-foreground mb-0.5">
              {formatLong(hover.date)}
            </p>
            <p className="text-muted-foreground">
              {hover.count} {hover.count === 1 ? "movie" : "movies"}
            </p>
            {hover.titles.length > 0 && (
              <p className="text-foreground mt-1 leading-snug">
                {hover.titles.slice(0, 4).join(", ")}
                {hover.titles.length > 4 ? ` +${hover.titles.length - 4} more` : ""}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            className="inline-block rounded-sm"
            style={{
              width: 12,
              height: 12,
              background: LEVEL_FILL[lvl],
              border: lvl === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
