import { NichePageTemplate } from "@/components/NichePageTemplate";
import { interiorPage } from "@/content/nichePages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(interiorPage.seo, interiorPage.path);

export default function WindowTreatmentMarketingPage() {
  return <NichePageTemplate page={interiorPage} />;
}
