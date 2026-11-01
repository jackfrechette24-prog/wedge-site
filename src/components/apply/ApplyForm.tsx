"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/Button";
import { applyCopy as copy, CONSENT_TEXT, REVENUE_OPTIONS } from "@/content/flow";
import { readAttribution } from "@/lib/attribution";
import { cn } from "@/lib/cn";
import { dequeueLead, enqueueLead, postLead } from "@/lib/leadQueue";
import { contactSchema, HONEYPOT_FIELD } from "@/lib/leads/schema";
import {
  afterQ1,
  afterQ2,
  afterQ3,
  previousStep,
  progressFor,
  stepNumberFor,
  TOTAL_STEPS,
  type Answers,
  type DisqualifyReason,
  type FlowStep,
  type Revenue,
  type Route,
} from "@/lib/qualification";
import { trackQualifiedLead } from "@/lib/tracking";
import { clearForm, loadForm, markQualified, saveForm, type ContactDraft } from "./session";

const EMPTY_CONTACT: ContactDraft = { firstName: "", lastName: "", companyName: "", email: "", phone: "", website: "" };
const RETRY_DELAYS_MS = [1000, 2000, 4000];

type FieldErrors = Partial<Record<keyof ContactDraft | "consent", string>>;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function recordDisqualified(reason: DisqualifyReason, annualRevenue?: Revenue) {
  const body = JSON.stringify({ reason, annualRevenue: annualRevenue ?? null, attribution: readAttribution() });
  const blob = new Blob([body], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/disqualified", blob)) {
    void fetch("/api/disqualified", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

const QUESTION_CLASS = "headline text-[2.25rem] outline-none md:text-5xl";

function AnswerButton({ children, onClick, selected }: { children: ReactNode; onClick: () => void; selected?: boolean }) {
  const Icon = selected ? CircleCheck : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-16 w-full items-center justify-between gap-4 rounded-[14px] border bg-obsidian/50 px-5 py-4 text-left text-lg font-semibold transition-colors hover:border-lime",
        selected ? "border-lime" : "border-line-strong",
      )}
    >
      {children}
      <Icon className={cn("size-5 shrink-0 transition-colors group-hover:text-lime", selected ? "text-lime" : "text-mist")} aria-hidden="true" />
    </button>
  );
}

function Field({
  name,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  required = true,
}: {
  name: keyof ContactDraft;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel" | "url";
  required?: boolean;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-[52px] w-full rounded-[10px] border bg-obsidian/60 px-4 text-base text-bone outline-none transition focus:border-lime focus:ring-2 focus:ring-lime/30",
          error ? "border-lime" : "border-line-strong",
        )}
      />
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-lime">{error}</p>}
    </div>
  );
}

export function ApplyForm() {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const [step, setStep] = useState<FlowStep>("q1");
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<ContactDraft>(EMPTY_CONTACT);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "retrying">("idle");
  const [startedAt, setStartedAt] = useState(0);
  const [clientSubmissionId, setClientSubmissionId] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const saved = loadForm();
    if (saved) {
      setStep(saved.step);
      setAnswers(saved.answers);
      setContact(saved.contact);
      setClientSubmissionId(saved.clientSubmissionId);
    }
    setStartedAt(saved?.startedAt ?? Date.now());
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) saveForm({ step, answers, contact, startedAt, clientSubmissionId });
  }, [restored, step, answers, contact, startedAt, clientSubmissionId]);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  function go(route: Route, nextAnswers: Answers) {
    setAnswers(nextAnswers);
    if (route.kind === "disqualified") {
      recordDisqualified(route.reason, nextAnswers.annualRevenue);
      clearForm();
      setRestored(false);
      router.push(`/not-a-fit?reason=${route.reason}`);
      return;
    }
    moved.current = true;
    setStep(route.step);
  }

  function back() {
    const previous = previousStep(step, answers);
    if (previous) {
      moved.current = true;
      setStep(previous);
    }
  }

  function updateContact(name: keyof ContactDraft, value: string) {
    setContact((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function finish(leadId: string, data: { firstName: string; lastName: string; email: string; phone: string }) {
    markQualified(data);
    clearForm();
    setRestored(false);
    router.push(`/book?lid=${encodeURIComponent(leadId)}`);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status !== "idle") return;

    const parsed = contactSchema.safeParse({ ...contact, consent });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        next[key] ??= issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document.getElementById(first === "consent" ? "field-consent" : `field-${first}`)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    const submissionId = clientSubmissionId ?? crypto.randomUUID();
    setClientSubmissionId(submissionId);

    const prefill = { firstName: parsed.data.firstName, lastName: parsed.data.lastName, email: parsed.data.email, phone: parsed.data.phone };
    const payload = {
      clientSubmissionId: submissionId,
      ...contact,
      consent,
      ownsCompany: answers.ownsCompany,
      annualRevenue: answers.annualRevenue,
      willingToInvest3k: answers.willingToInvest3k ?? null,
      attribution: readAttribution(),
      elapsedMs: Date.now() - startedAt,
      [HONEYPOT_FIELD]: honeypot,
    };

    let result = await postLead(payload);

    if (result.kind === "failed") {
      // Keep a copy in this browser so nothing is lost, then try a few more times.
      enqueueLead(payload);
      setStatus("retrying");
      for (const delay of RETRY_DELAYS_MS) {
        await sleep(delay);
        result = await postLead(payload);
        if (result.kind !== "failed") break;
      }
      if (result.kind !== "failed") dequeueLead(submissionId);
    }

    if (result.kind === "ok") {
      trackQualifiedLead(result.leadId);
      finish(result.leadId, prefill);
    } else if (result.kind === "failed") {
      // Still let them book. The queue keeps retrying on their next page load.
      finish(submissionId, prefill);
    } else {
      const next: FieldErrors = {};
      for (const [key, messages] of Object.entries(result.errors)) next[key as keyof FieldErrors] = messages?.[0];
      setErrors(next);
      setStatus("idle");
    }
  }

  const previous = previousStep(step, answers);
  const progress = progressFor(step);

  return (
    <div className="surface-card featured-card mx-auto w-full max-w-[640px] p-5 sm:p-8">
      <div className="flex h-11 items-center justify-between">
        <p className="mono-label text-mist">{copy.stepLabel} {stepNumberFor(step)} / {TOTAL_STEPS}</p>
        {previous && (
          <button type="button" onClick={back} className="-mr-2 flex min-h-11 items-center gap-2 px-2 text-sm text-mist transition-colors hover:text-lime">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </button>
        )}
      </div>

      <div
        role="progressbar"
        aria-label={copy.eyebrow}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-graphite"
      >
        <div className="h-full rounded-full bg-lime transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-8 min-h-[440px]">
        {step === "q1" && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={QUESTION_CLASS}>{copy.q1.question}</h1>
            <div className="mt-8 grid gap-3">
              <AnswerButton selected={answers.ownsCompany === true} onClick={() => go(afterQ1(true), { ...answers, ownsCompany: true })}>{copy.q1.yes}</AnswerButton>
              <AnswerButton onClick={() => go(afterQ1(false), { ...answers, ownsCompany: false })}>{copy.q1.no}</AnswerButton>
            </div>
          </>
        )}

        {step === "q2" && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={QUESTION_CLASS}>{copy.q2.question}</h1>
            <div className="mt-8 grid gap-3">
              {REVENUE_OPTIONS.map((option) => (
                <AnswerButton
                  key={option.value}
                  selected={answers.annualRevenue === option.value}
                  onClick={() =>
                    go(afterQ2(option.value), {
                      ...answers,
                      annualRevenue: option.value,
                      willingToInvest3k: option.value === "under_300k" ? answers.willingToInvest3k : undefined,
                    })
                  }
                >
                  {option.label}
                </AnswerButton>
              ))}
            </div>
          </>
        )}

        {step === "q3" && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={QUESTION_CLASS}>{copy.q3.question}</h1>
            <div className="mt-8 grid gap-3">
              <AnswerButton selected={answers.willingToInvest3k === true} onClick={() => go(afterQ3(true), { ...answers, willingToInvest3k: true })}>{copy.q3.yes}</AnswerButton>
              <AnswerButton onClick={() => go(afterQ3(false), { ...answers, willingToInvest3k: false })}>{copy.q3.no}</AnswerButton>
            </div>
          </>
        )}

        {step === "contact" && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={QUESTION_CLASS}>{copy.contact.title}</h1>
            <p className="mt-3 text-lg text-muted">{copy.contact.intro}</p>
            <form noValidate onSubmit={submit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="firstName" label={copy.contact.firstName} value={contact.firstName} error={errors.firstName} autoComplete="given-name" onChange={(value) => updateContact("firstName", value)} />
                <Field name="lastName" label={copy.contact.lastName} value={contact.lastName} error={errors.lastName} autoComplete="family-name" onChange={(value) => updateContact("lastName", value)} />
              </div>
              <Field name="companyName" label={copy.contact.companyName} value={contact.companyName} error={errors.companyName} autoComplete="organization" onChange={(value) => updateContact("companyName", value)} />
              <Field name="email" type="email" inputMode="email" label={copy.contact.email} value={contact.email} error={errors.email} autoComplete="email" onChange={(value) => updateContact("email", value)} />
              <Field name="phone" type="tel" inputMode="tel" label={copy.contact.phone} value={contact.phone} error={errors.phone} autoComplete="tel" onChange={(value) => updateContact("phone", value)} />
              <Field name="website" inputMode="url" required={false} label={copy.contact.website} value={contact.website} error={errors.website} autoComplete="url" onChange={(value) => updateContact("website", value)} />

              <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <label>
                  Leave this empty
                  <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
                </label>
              </div>

              <div>
                <label htmlFor="field-consent" className="flex cursor-pointer gap-3 text-sm leading-relaxed text-muted">
                  <input
                    id="field-consent"
                    type="checkbox"
                    checked={consent}
                    required
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setErrors((current) => ({ ...current, consent: undefined }));
                    }}
                    className="mt-0.5 size-5 shrink-0 accent-lime"
                  />
                  <span>
                    {CONSENT_TEXT}{" "}
                    <Link href="/privacy" target="_blank" className="underline underline-offset-4 hover:text-lime">{copy.contact.privacy}</Link>
                  </span>
                </label>
                {errors.consent && <p id="consent-error" className="mt-2 text-sm text-lime">{errors.consent}</p>}
              </div>

              <Button type="submit" disabled={status !== "idle"} className="w-full">
                {status === "idle" ? copy.contact.submit : status === "submitting" ? copy.contact.submitting : copy.contact.retrying}
              </Button>
              <p role="status" className="sr-only">{status === "retrying" ? copy.contact.retrying : ""}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
