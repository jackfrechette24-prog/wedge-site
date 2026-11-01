import { LegalPage } from "@/components/LegalPage";
import { termsSections, termsSeo } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(termsSeo, "/terms");

export default function TermsPage() {
  return <LegalPage title={termsSeo.title} path="/terms" sections={termsSections} />;
}
