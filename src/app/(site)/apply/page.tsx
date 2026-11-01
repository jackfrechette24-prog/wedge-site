import { ApplyForm } from "@/components/apply/ApplyForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Glow } from "@/components/Glow";
import { Headline } from "@/components/Headline";
import { applyCopy, applySeo } from "@/content/flow";
import { CONTACT_EMAIL } from "@/content/site";
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
          {leadCaptureAvailable() ? (
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
