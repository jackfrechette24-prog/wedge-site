import { ApplyForm } from "@/components/apply/ApplyForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { applyCopy, applySeo } from "@/content/flow";
import { CONTACT_EMAIL } from "@/content/site";
import { leadCaptureAvailable } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(applySeo, "/apply");

// Checked per request so a misconfigured deploy can never show a form that goes nowhere.
export const dynamic = "force-dynamic";

export default function ApplyPage() {
  return (
    <div className="py-6 md:py-10">
      <Container>
        <Breadcrumbs items={[{ name: applySeo.title, path: "/apply" }]} />
        <div className="mt-8">
          {leadCaptureAvailable() ? (
            <ApplyForm />
          ) : (
            <div className="mx-auto max-w-2xl py-12">
              <h1 className="text-4xl md:text-5xl">{applyCopy.maintenance.title}</h1>
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
