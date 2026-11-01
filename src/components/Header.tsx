"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CTAS, NAV, SITE_NAME } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-obsidian/80 backdrop-blur-md transition-colors",
        scrolled || open ? "border-line" : "border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[76px]">
        <Link href="/" aria-label={`${SITE_NAME} home`} className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-mist transition-colors hover:text-bone">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href={CTAS.primary.href} arrow className="min-h-10 px-4 py-2 text-sm">
              {CTAS.primary.label}
            </ButtonLink>
          </div>
          <button
            type="button"
            className="flex size-11 items-center justify-center text-bone lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </Container>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line lg:hidden">
          <Container className="flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-display text-2xl font-bold uppercase last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href={CTAS.primary.href} arrow className="mb-3 mt-4 w-full">
              {CTAS.primary.label}
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}
