const MONTHS_SHORT = [
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

function monthKey(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function aggregateHistory(rows, year) {
  const target = year ?? new Date().getUTCFullYear();

  const byDay = new Map();
  const byMonthMap = new Map();
  let total = 0;

  for (const row of rows) {
    if (!row.watchedAt) continue;
    const date = new Date(row.watchedAt);
    if (Number.isNaN(date.getTime())) continue;
    if (date.getUTCFullYear() !== target) continue;

    total += 1;
    const dKey = dayKey(date);
    const mKey = monthKey(date);

    if (!byDay.has(dKey)) byDay.set(dKey, { count: 0, titles: [] });
    const dayBucket = byDay.get(dKey);
    dayBucket.count += 1;
    dayBucket.titles.push(row.title);

    byMonthMap.set(mKey, (byMonthMap.get(mKey) ?? 0) + 1);
  }

  const byMonth = [];
  for (let i = 0; i < 12; i += 1) {
    const m = String(i + 1).padStart(2, "0");
    const key = `${target}-${m}`;
    byMonth.push({
      month: key,
      label: MONTHS_SHORT[i],
      count: byMonthMap.get(key) ?? 0,
    });
  }

  let bestMonth = null;
  for (const entry of byMonth) {
    if (entry.count > 0 && (!bestMonth || entry.count > bestMonth.count)) {
      bestMonth = entry;
    }
  }

  let bestDay = null;
  for (const [date, bucket] of byDay) {
    if (!bestDay || bucket.count > bestDay.count) {
      bestDay = { date, count: bucket.count };
    }
  }

  let streak = 0;
  let running = 0;
  let prev = null;
  const sortedDays = Array.from(byDay.keys()).toSorted();
  for (const key of sortedDays) {
    const d = new Date(`${key}T00:00:00.000Z`);
    if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) {
      running += 1;
    } else {
      running = 1;
    }
    if (running > streak) streak = running;
    prev = d;
  }

  return { year: target, total, byDay, byMonth, bestMonth, bestDay, streak };
}
