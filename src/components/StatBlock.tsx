import { cn } from "@/lib/cn";

export function StatBlock({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={className}>
      <p className={cn("text-4xl font-medium tracking-[-0.02em] text-accent md:text-5xl")}>{value}</p>
      <p className="mt-3 text-[15px] leading-snug text-muted">{label}</p>
    </div>
  );
}
