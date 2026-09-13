import { ImageResponse } from "next/og";

export const alt = "이재호 | PM Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "52px 64px", background: "#0C0C0C",
        color: "#D7E2EA", fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
        <span>LEE JAEHO</span><span>PM PORTFOLIO</span>
      </div>
      <div style={{ display: "flex", fontSize: 140, fontWeight: 900, letterSpacing: -9 }}>
        HI, I&apos;M JAEHO
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: 25 }}>RESEARCH / REQUIREMENTS / QA</span>
        <div style={{ display: "flex", padding: "18px 28px", borderRadius: 48, border: "1px solid #D7E2EA", background: "linear-gradient(123deg, #18011F, #7621B0)" }}>
          ficstory.dev/PM1
        </div>
      </div>
    </div>,
    size,
  );
}
