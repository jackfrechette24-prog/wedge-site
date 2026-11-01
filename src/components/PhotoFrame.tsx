import Image from "next/image";
import { cn } from "@/lib/cn";
import { WedgeMark } from "./WedgeMark";

type Props = { src: string | null; alt: string; label: string; className?: string };

/** A rounded photo frame. Without a photo it shows a dark placeholder with the wedge watermark. */
export function PhotoFrame({ src, alt, label, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden rounded-[24px] border border-line-strong", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
      ) : (
        <div className="placeholder-frame absolute inset-0">
          <WedgeMark className="absolute bottom-0 right-0 w-4/5 opacity-[0.06]" />
        </div>
      )}
      <p className="absolute bottom-4 left-4 right-4 flex w-fit items-center gap-2 rounded-full border border-line-strong bg-obsidian/85 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-bone">
        <span className="size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
        {label}
      </p>
    </div>
  );
}
