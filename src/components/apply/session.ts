// Browser only. sessionStorage helpers for the qualification flow.
import type { Answers, FlowStep } from "@/lib/qualification";

const FORM_KEY = "wedge_apply";
const QUALIFIED_KEY = "wedge_qualified";
const PREFILL_KEY = "wedge_prefill";

export type ContactDraft = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
};

export type SavedForm = {
  step: FlowStep;
  answers: Answers;
  contact: ContactDraft;
  startedAt: number;
  clientSubmissionId: string | null;
};

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing can block storage. The form still works, it just won't survive a refresh.
  }
}

export const loadForm = () => read<SavedForm>(FORM_KEY);
export const saveForm = (form: SavedForm) => write(FORM_KEY, form);

export function clearForm() {
  try {
    sessionStorage.removeItem(FORM_KEY);
  } catch {
    // See write().
  }
}

export type Prefill = { firstName: string; lastName: string; email: string; phone: string };

export function markQualified(prefill: Prefill) {
  write(QUALIFIED_KEY, true);
  write(PREFILL_KEY, prefill);
}

export const isQualified = () => read<boolean>(QUALIFIED_KEY) === true;
export const loadPrefill = () => read<Prefill>(PREFILL_KEY);
