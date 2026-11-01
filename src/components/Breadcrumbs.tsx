import Link from "next/link";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumb trail plus matching structured data. Home is added automatically. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === trail.length - 1 ? (
                <span aria-current="page" className="text-ink">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="inline-block py-1 transition-colors hover:text-bone">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
