import { LegalPage } from "@/components/LegalPage";
import { privacySections, privacySeo } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(privacySeo, "/privacy");

export default function PrivacyPage() {
  return <LegalPage title={privacySeo.title} path="/privacy" sections={privacySections} />;
}
