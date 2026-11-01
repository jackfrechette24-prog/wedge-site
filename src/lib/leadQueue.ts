// Browser only. Holds submissions that could not reach the server, and resends them on later page loads.
const KEY = "wedge_lead_queue";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type QueuedLead = { queuedAt: number; payload: { clientSubmissionId: string } & Record<string, unknown> };

function read(): QueuedLead[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(queue: QueuedLead[]) {
  try {
    if (queue.length) localStorage.setItem(KEY, JSON.stringify(queue));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked or full. Nothing more we can do from here.
  }
}

export function enqueueLead(payload: QueuedLead["payload"]) {
  const queue = read().filter((item) => item.payload.clientSubmissionId !== payload.clientSubmissionId);
  write([...queue, { queuedAt: Date.now(), payload }]);
}

export function dequeueLead(clientSubmissionId: string) {
  write(read().filter((item) => item.payload.clientSubmissionId !== clientSubmissionId));
}

export type PostResult =
  | { kind: "ok"; leadId: string }
  | { kind: "invalid"; errors: Record<string, string[] | undefined> }
  | { kind: "failed" };

export async function postLead(payload: unknown): Promise<PostResult> {
  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return { kind: "ok", leadId: (await response.json()).leadId };
    if (response.status === 400) return { kind: "invalid", errors: (await response.json()).errors ?? {} };
    return { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}

export async function flushLeadQueue() {
  const now = Date.now();
  for (const item of read()) {
    if (now - item.queuedAt > MAX_AGE_MS) {
      dequeueLead(item.payload.clientSubmissionId);
      continue;
    }
    const result = await postLead(item.payload);
    if (result.kind !== "failed") dequeueLead(item.payload.clientSubmissionId);
  }
}
