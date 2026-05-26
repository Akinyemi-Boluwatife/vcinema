import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontSize: 24,
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size },
  );
}
