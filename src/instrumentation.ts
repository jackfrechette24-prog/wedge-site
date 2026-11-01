export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { reportEnvProblems } = await import("@/lib/env");
    reportEnvProblems();
  }
}
