/* SERVICE WORKER — only network egress point. Sanitized payloads only. */
const DEFAULT_BACKEND = "http://localhost:8000/agent";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.cmd !== "CALL_BACKEND") return;
  chrome.storage.local.get({ backendUrl: DEFAULT_BACKEND, enabled: true }).then(async (cfg) => {
    if (!cfg.enabled) return sendResponse({ error: "Agent is OFF" });
    try {
      const r = await fetch(cfg.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      });
      sendResponse(await r.json());
    } catch (e) {
      // Offline fallback: local mock reasoning so the demo never dies.
      sendResponse(localReason(msg.payload));
    }
  });
  return true;
});

function localReason(payload) {
  const btn = (payload.sanitized_context.elements || []).find((e) => e.type === "button");
  return {
    action: btn ? "click" : "scroll",
    target: btn ? btn.text : null,
    reason: btn
      ? `Offline mock reasoning: the sanitized context exposes a primary button "${btn.text}".`
      : "Offline mock reasoning: no actionable button found, scrolling for more context.",
    source: "local-mock",
  };
}
