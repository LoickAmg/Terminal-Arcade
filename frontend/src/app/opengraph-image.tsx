import { ImageResponse } from "next/og";

// Image de partage (réseaux sociaux, messageries), dans le thème Seuil.
export const alt = "Terminal Arcade : apprends le terminal en jouant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#e7e5dd",
          fontFamily: "sans-serif",
          border: "4px solid #d4f54a",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#d4f54a" }}>JEU / TERMINAL / 2026</div>
        <div style={{ fontSize: 140, fontWeight: 900, fontStyle: "italic", marginTop: 30, lineHeight: 1 }}>TERMINAL</div>
        <div style={{ fontSize: 140, fontWeight: 900, fontStyle: "italic", color: "#d4f54a", lineHeight: 1 }}>ARCADE</div>
        <div style={{ fontSize: 34, marginTop: 40, color: "#8c8b84" }}>
          Apprends le terminal en jouant. Un vrai Linux, un compagnon qui triche.
        </div>
      </div>
    ),
    size,
  );
}
