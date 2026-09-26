import { ImageResponse } from "next/og";

export const alt = "RG Stack — Full-Stack Developer";
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
          justifyContent: "space-between",
          backgroundColor: "#f6f2ec",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "16px",
              backgroundColor: "#1b1815",
              color: "#f3eee7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            <span>R</span>
            <span style={{ color: "#ce7c57" }}>G</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "26px", color: "#221f1c", fontWeight: 600 }}>RG Stack</span>
            <span style={{ fontSize: "18px", color: "#6e665e" }}>Full-Stack Developer</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: "88px", height: "3px", backgroundColor: "#a9553a", marginBottom: "32px" }} />
          <div style={{ fontSize: "62px", color: "#221f1c", lineHeight: 1.12, maxWidth: "900px" }}>
            Modern, scalable web applications — from concept to deployment.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "22px", color: "#6e665e" }}>
            Next.js · React · TypeScript · Node.js · PostgreSQL · Drizzle ORM
          </div>
          <div style={{ fontSize: "22px", color: "#a9553a" }}>rgstack.dev</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
