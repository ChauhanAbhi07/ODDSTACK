import { ImageResponse } from "next/og";
export const alt = "ODDESTACK — Your business. One better stack.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#11120e",
        color: "#f4f2ec",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "65px 75px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, letterSpacing: "-1px" }}>
        ODDESTACK™
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          lineHeight: 1.03,
          letterSpacing: "-5px",
        }}
      >
        <span>Your business.</span>
        <span>
          One better <span style={{ color: "#c7ff3d" }}>stack.</span>
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 20,
          color: "#c7ff3d",
          letterSpacing: "4px",
        }}
      >
        TECHNOLOGY × GROWTH × INTELLIGENCE
      </div>
    </div>,
    size,
  );
}
