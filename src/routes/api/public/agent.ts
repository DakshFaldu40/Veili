import { createFileRoute } from "@tanstack/react-router";

/** Hosted mirror of backend/main.py::/agent — sanitized context only. */
const PII = [
  { re: /[\w.+-]+@[\w-]+\.[\w.]{2,}/, name: "EMAIL" },
  { re: /(?:\+\d{1,3}[\s-]?)?\d{5}[\s-]?\d{5}/, name: "PHONE" },
  { re: /(?:\d[ -]*?){13,16}/, name: "CREDIT_CARD" },
];

export const Route = createFileRoute("/api/public/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { task?: string; sanitized_context?: { elements?: Array<Record<string, unknown>> } };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const ctx = body.sanitized_context;
        if (!ctx || !Array.isArray(ctx.elements))
          return Response.json({ error: "sanitized_context required" }, { status: 400 });

        const blob = JSON.stringify(ctx);
        const leaks = PII.filter((p) => p.re.test(blob)).map((p) => p.name);
        if (leaks.length)
          return Response.json({ error: `Rejected: raw PII detected (${leaks.join(", ")})` }, { status: 400 });

        const task = (body.task || "What should I do next?").toLowerCase();
        const buttons = ctx.elements.filter((e) => e["type"] === "button");
        if (task.includes("scroll") || buttons.length === 0)
          return Response.json({
            action: "scroll",
            target: null,
            reason: "No primary control requested; scrolling for more context.",
            source: "hosted-mock",
          });

        const best =
          buttons.find((b) => String(b["text"] ?? "").toLowerCase().includes("submit")) ?? buttons[0];
        if (!best) return Response.json({ action: "scroll", target: null, reason: "No control found.", source: "hosted-mock" });
        return Response.json({
          action: "click",
          target: String(best["text"] ?? ""),
          reason: `The sanitized page exposes a primary button "${best["text"]}" and the user asked to ${body.task}`,
          source: "hosted-mock",
        });
      },
    },
  },
});
