import Image from "next/image";
import { CLIENT_LOGOS } from "@/content/site";

export function LogoBar({ title }: { title: string }) {
  return (
    <section className="border-b border-line py-10 md:py-12">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted sm:text-xs">{title}</p>
        <ul className="mt-7 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {CLIENT_LOGOS.map((logo, index) => (
            <li key={logo.name ?? index} className="flex min-h-20 items-center justify-center bg-surface p-4 text-center">
              {logo.src ? (
                <Image
                  src={logo.src}
                  alt={`${logo.name ?? "Client"} logo`}
                  width={140}
                  height={44}
                  className="h-10 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
                />
              ) : logo.name ? (
                <span className="text-sm font-medium text-mist">{logo.name}</span>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mist">[CLIENT LOGO]</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
