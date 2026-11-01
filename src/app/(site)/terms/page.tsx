import { LegalPage } from "@/components/LegalPage";
import { termsSections, termsSeo } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(termsSeo, "/terms", { defaultImage: true });

export default function TermsPage() {
  return <LegalPage title={termsSeo.title} path="/terms" sections={termsSections} />;
}
