import { cn } from "@/lib/cn";

/** A cheap, positioned radial glow. Size and position come from className. */
export function Glow({ className, tone = "lime" }: { className?: string; tone?: "lime" | "stop" }) {
  return <div aria-hidden="true" className={cn("glow", tone === "stop" && "glow-stop", className)} />;
}
