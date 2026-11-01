import { NichePageTemplate } from "@/components/NichePageTemplate";
import { exteriorPage } from "@/content/nichePages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(exteriorPage.seo, exteriorPage.path);

export default function RetractableScreenMarketingPage() {
  return <NichePageTemplate page={exteriorPage} />;
}
