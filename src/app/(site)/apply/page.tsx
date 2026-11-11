import { ApplyForm } from "@/components/apply/ApplyForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Glow } from "@/components/Glow";
import { Headline } from "@/components/Headline";
import { RoasFormEmbed } from "@/components/qualify/RoasFormEmbed";
import { applyCopy, applyHeadline, applySeo, qualifyCopy } from "@/content/flow";
import { CONTACT_EMAIL, LEAD_FORM_PROVIDER } from "@/content/site";
import { leadCaptureAvailable } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(applySeo, "/apply");

// Checked per request so a misconfigured deploy can never show a form that goes nowhere.
export const dynamic = "force-dynamic";

export default function ApplyPage() {
  return (
    <div className="relative overflow-x-clip pb-16 pt-6 lg:pb-24 lg:pt-8">
      <Glow className="left-1/2 top-0 w-[min(900px,130vw)] -translate-x-1/2" />
      <Container className="relative">
        <Breadcrumbs items={[{ name: applySeo.title, path: "/apply" }]} />
        <div className="mt-8">
          {LEAD_FORM_PROVIDER === "roasform" ? (
            <div className="mx-auto max-w-[720px]">
              <Headline segments={applyHeadline} as="h1" size={2} />
              <p className="mt-5 text-lg text-muted">{qualifyCopy.applyBody}</p>
              <div className="surface-card featured-card mt-8">
                <RoasFormEmbed height="min(85vh, 760px)" className="min-h-[600px]" />
              </div>
            </div>
          ) : leadCaptureAvailable() ? (
            <ApplyForm />
          ) : (
            <div className="surface-card featured-card mx-auto max-w-[640px] p-6 md:p-10">
              <Headline segments={applyCopy.maintenance.title} as="h1" size={3} />
              <p className="mt-5 text-xl text-muted">{applyCopy.maintenance.body}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-lime">
                {applyCopy.maintenance.linkLabel}: {CONTACT_EMAIL}
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
