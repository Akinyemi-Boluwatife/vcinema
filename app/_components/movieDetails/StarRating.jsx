"use client";

import { useState } from "react";

const EMPTY_MESSAGES = [];

export default function StarRating({
  maxRating = 5,
  color = "var(--cinema-accent)",
  size = 24,
  className = "",
  messages = EMPTY_MESSAGES,
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
    onSetRating?.(rating);
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            color={color}
            size={size}
            key={i}
            onRate={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p
        className="font-mono text-sm leading-none m-0"
        style={{ color: "var(--fg-2)" }}
      >
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
  return (
    <button
      type="button"
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      className="bg-transparent border-0 p-0 inline-flex transition-colors duration-100"
      style={{
        width: size,
        height: size,
        color,
        cursor: "pointer",
      }}
      aria-label={`Rate ${full ? "filled" : "empty"} star`}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={full ? color : "none"}
        stroke={full ? color : "var(--fg-muted)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
    </button>
  );
}
