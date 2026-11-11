import Link from "next/link";
import { CTAS, FOOTER, LOCATION_SHORT, SITE_NAME, SOCIAL_LINKS } from "@/content/site";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { QualifyButton } from "./qualify/QualifyButton";

const LINK = "inline-block py-1 text-sm text-mist transition-colors hover:text-bone";

export function Footer() {
  const socials = SOCIAL_LINKS.filter((social) => social.href);

  return (
    <footer className="border-t border-line pb-10 pt-14 lg:pt-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-mist">{FOOTER.tagline}</p>
            {socials.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-4">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} rel="noopener" className={LINK}>{social.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid gap-8 sm:grid-cols-3 md:col-span-8">
            {FOOTER.columns.map((column) => (
              <div key={column.title}>
                <p className="mono-label mb-3 text-mist">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {link.href === CTAS.primary.href ? (
                        <QualifyButton variant="text" className={LINK}>{link.label}</QualifyButton>
                      ) : (
                        <Link href={link.href} className={LINK}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-mist">
            <p>© {new Date().getFullYear()} {SITE_NAME}</p>
            <p>{LOCATION_SHORT}</p>
            {FOOTER.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="inline-block py-2 transition-colors hover:text-bone">{link.label}</Link>
            ))}
          </div>
          <p className="mt-3 max-w-4xl text-xs leading-relaxed text-mist">{FOOTER.disclaimer}</p>
        </div>
      </Container>
    </footer>
  );
}
