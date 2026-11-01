import Image from "next/image";
import { SITE_NAME } from "@/content/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/wedge_primary_dark.svg"
      alt={SITE_NAME}
      width={359}
      height={95}
      priority
      className={className ?? "h-7 w-auto"}
    />
  );
}
