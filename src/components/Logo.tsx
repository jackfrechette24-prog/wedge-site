import Image from "next/image";
import { SITE_NAME } from "@/content/site";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Image
      src={tone === "dark" ? "/brand/wedge_primary_dark.svg" : "/brand/wedge_primary_light.svg"}
      alt={SITE_NAME}
      width={359}
      height={95}
      priority
      className={className ?? "h-7 w-auto"}
    />
  );
}
