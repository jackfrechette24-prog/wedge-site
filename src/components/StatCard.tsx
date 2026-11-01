import { cn } from "@/lib/cn";
import { CountUp } from "./CountUp";

export function StatCard({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cn("surface-card p-5 md:p-6", className)}>
      <p className="font-display text-4xl font-bold uppercase leading-none text-lime md:text-5xl">
        <CountUp value={value} />
      </p>
      <p className="mono-label mt-3 text-mist">{label}</p>
    </div>
  );
}
