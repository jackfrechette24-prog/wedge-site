import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export const OG_ALT = "Wedge Acquisition";

/** Obsidian background, lime wedge mark, page title in Inter. */
export async function renderOgImage(title: string, eyebrow?: string) {
  const font = await readFile(join(process.cwd(), "src/assets/fonts/Inter-Medium.woff"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0A0A0B", color: "#FAFAF7", padding: 72, fontFamily: "Inter" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34, letterSpacing: "-0.035em" }}>
        <svg width="44" height="44" viewBox="0 0 100 100">
          <polygon points="0,100 100,100 100,0" fill="#C7FF3D" />
        </svg>
        Wedge Acquisition
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {eyebrow && <div style={{ fontSize: 28, color: "#C7FF3D" }}>{eyebrow}</div>}
        <div style={{ fontSize: title.length > 48 ? 64 : 76, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1040 }}>{title}</div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: [{ name: "Inter", data: font, weight: 500, style: "normal" }] },
  );
}
