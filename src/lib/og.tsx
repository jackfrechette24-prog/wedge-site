import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Segments } from "@/content/types";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export const OG_ALT = "Wedge Acquisition";

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

/** Obsidian background, lime wedge mark, Antonio caps, and the accent phrase in lime serif. */
export async function renderOgImage(title: Segments, eyebrow?: string) {
  const [inter, antonio, instrument] = await Promise.all([
    font("Inter-Medium.woff"),
    font("Antonio-Bold.woff"),
    font("InstrumentSerif-Italic.woff"),
  ]);
  const longest = Math.max(...title.map((segment) => segment.text.length));
  const fontSize = longest > 30 ? 72 : longest > 20 ? 88 : 104;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0A0A0B", color: "#FAFAF7", padding: 72, fontFamily: "Inter" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34, letterSpacing: "-0.035em" }}>
        <svg width="44" height="44" viewBox="0 0 100 100">
          <polygon points="0,100 100,100 100,0" fill="#C7FF3D" />
        </svg>
        Wedge Acquisition
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && <div style={{ fontSize: 28, marginBottom: 20, color: "#B2B2B0" }}>{eyebrow}</div>}
        {title.map((segment) =>
          segment.accent ? (
            <div key={segment.text} style={{ fontFamily: "Instrument Serif", fontStyle: "italic", color: "#C7FF3D", fontSize: fontSize * 1.04, lineHeight: 1.05 }}>
              {segment.text}
            </div>
          ) : (
            <div key={segment.text} style={{ fontFamily: "Antonio", fontWeight: 700, fontSize, lineHeight: 1.05, textTransform: "uppercase" }}>
              {segment.text}
            </div>
          ),
        )}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: inter, weight: 500, style: "normal" },
        { name: "Antonio", data: antonio, weight: 700, style: "normal" },
        { name: "Instrument Serif", data: instrument, weight: 400, style: "italic" },
      ],
    },
  );
}
