import type { Metadata, Viewport } from "next";
import { Antonio, Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FOOTER, SITE_NAME, SITE_URL } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const antonio = Antonio({ subsets: ["latin"], weight: "700", variable: "--font-antonio", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: FOOTER.description,
};

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${antonio.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh">
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
