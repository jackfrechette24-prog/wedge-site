import Link from "next/link";
import { caseStudies } from "@/content/caseStudies";
import { CTAS, FOOTER, LOCATION_SHORT, NAV, SITE_NAME, SOCIAL_LINKS } from "@/content/site";
import { Container } from "./Container";
import { Logo } from "./Logo";

const LINK = "inline-block py-1 text-sm text-mist transition-colors hover:text-lime";
const HEADING = "mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-mist";

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className={HEADING}>{title}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={LINK}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const socials = SOCIAL_LINKS.filter((social) => social.href);
  const company = NAV.filter((item) => !["/window-treatment-marketing", "/retractable-screen-marketing"].includes(item.href));
  const niches = NAV.filter((item) => ["/window-treatment-marketing", "/retractable-screen-marketing"].includes(item.href));

  return (
    <footer className="tone-dark border-t border-line py-14 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm text-mist">{FOOTER.description}</p>
            <p className="mt-4 text-sm text-mist">{LOCATION_SHORT}</p>
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
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            <FooterColumn title={FOOTER.columns.pages} links={[...company, { label: CTAS.primary.label, href: CTAS.primary.href }]} />
            <FooterColumn title={FOOTER.columns.niches} links={niches} />
            <FooterColumn
              title={FOOTER.columns.cases}
              links={caseStudies.map((study) => ({ label: study.company, href: `/case-studies/${study.slug}` }))}
            />
            <FooterColumn title={FOOTER.columns.legal} links={FOOTER.legalLinks} />
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-6">
          <p className="max-w-4xl text-xs leading-relaxed text-mist">{FOOTER.disclaimer}</p>
          <p className="mt-4 text-xs text-mist">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
