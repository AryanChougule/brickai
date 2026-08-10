import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { site } from "@/lib/site";

/** Not exported: a route handler may only export HTTP methods and route config. */
const SIZE = { width: 1200, height: 630 };

/**
 * Open Graph card generator.
 *
 * Rendered with the same tokens as the site: ground #171515, accent #f26511,
 * flush-left type, square corners. Satori cannot resolve CSS variables, so the
 * accent literals here mirror `styles/theme.css` and must be retuned with it.
 *
 * `title` and `eyebrow` come from the query string, clamped so an over-long
 * value cannot break the layout.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = (params.get("title") ?? site.name).slice(0, 110);
  const eyebrow = (params.get("eyebrow") ?? "Software engineering").slice(0, 60);

  // Long titles step down a size rather than overflowing the card.
  const fontSize = title.length > 68 ? 62 : title.length > 40 ? 78 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171515",
          color: "#f3f2f2",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top rule + wordmark */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", height: 4, background: "#f26511", width: 120 }} />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>
            <span>BRICK</span>
            <span style={{ color: "#f26511" }}>AI</span>
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#ffa76b",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(248,244,244,0.22)",
            paddingTop: 24,
            fontSize: 22,
            color: "#9b9797",
          }}
        >
          <span>{site.tagline}</span>
          <span style={{ color: "#7d7979" }}>brickai.com</span>
        </div>
      </div>
    ),
    SIZE,
  );
}
