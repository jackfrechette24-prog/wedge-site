// The launch timeline panel. Statuses illustrate a typical client, not a promise.
export type TimelineTone = "done" | "active" | "review";

export const timeline = {
  note: "TYPICAL CLIENT TIMELINE",
  liveLabel: "LIVE",
  title: "YOUR FIRST 30 DAYS",
  rows: [
    { day: "DAY 0", description: "Discovery call", status: "DONE", tone: "done" },
    { day: "DAY 1", description: "Onboarding call", status: "DONE", tone: "done" },
    { day: "DAY 1 TO 3", description: "Ads built for your market", status: "DONE", tone: "done" },
    { day: "DAY 3", description: "Pre-launch call + go live", status: "LIVE", tone: "active" },
    { day: "WITHIN 24 HRS", description: "First leads coming in", status: "LEADS", tone: "active" },
    { day: "WEEK 2", description: "Appointments booked on your calendar", status: "BOOKING", tone: "active" },
    { day: "DAY 30", description: "First month review", status: "REVIEW", tone: "review" },
  ] satisfies { day: string; description: string; status: string; tone: TimelineTone }[],
  outcome: { label: "OUTCOME", title: "A FULL CALENDAR." },
};

export const homeProcess = {
  label: "HOW IT WORKS",
  title: [{ text: "FROM CALL TO" }, { text: "booked appointments", accent: true }, { text: "IN DAYS." }],
  link: "See the full process",
};
