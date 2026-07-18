"use client";

import { useSyncExternalStore } from "react";
import { ResponsiveContainer } from "./chart-primitives";

// recharts' ResponsiveContainer measures its parent via ResizeObserver, which
// can't run during SSR / the first hydration pass — it reports width/height as
// -1 and logs a console warning. Gate it on client mount so it only renders
// once there's a real, laid-out DOM node to measure. Parent wrappers already
// reserve a fixed height, so nothing shifts.
const subscribe = () => () => {};

export default function ChartContainer({ children }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!mounted) return null;

  // Seed positive initial dimensions. recharts defaults initialDimension to
  // {-1,-1}, which it renders once (logging a "width(-1) and height(-1)"
  // warning) before ResizeObserver measures the real size a frame later.
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      initialDimension={{ width: 300, height: 200 }}
    >
      {children}
    </ResponsiveContainer>
  );
}
