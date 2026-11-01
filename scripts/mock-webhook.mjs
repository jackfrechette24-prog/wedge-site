// Local stand-in for the CRM inbound webhook.
//   pnpm mock:webhook                 listens on :4010 and accepts everything
//   MOCK_FAIL=1 pnpm mock:webhook     starts in failing mode
//   curl -X POST localhost:4010/fail  toggle failing mode on
//   curl -X POST localhost:4010/ok    toggle failing mode off
//   curl localhost:4010/received      list everything received
import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 4010);
let failing = process.env.MOCK_FAIL === "1";
const received = [];

createServer((req, res) => {
  const reply = (status, body) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if (req.url === "/fail") {
    failing = true;
    return reply(200, { failing });
  }
  if (req.url === "/ok") {
    failing = false;
    return reply(200, { failing });
  }
  if (req.url === "/received") return reply(200, received);

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    if (failing) {
      console.log("[mock-webhook] rejecting with 500");
      return reply(500, { error: "mock failure" });
    }
    const body = JSON.parse(raw || "{}");
    received.push(body);
    console.log("[mock-webhook] received", body);
    reply(200, { ok: true });
  });
}).listen(port, () => console.log(`[mock-webhook] listening on :${port} (failing: ${failing})`));
