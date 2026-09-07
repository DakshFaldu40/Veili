/* CONTENT SCRIPT — bridges page ⇄ popup. Raw values never leave this file. */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.cmd === "ANALYZE") {
    const result = Redactor.analyzeDocument();
    console.group("%c🟢 LOCAL ANALYSIS", "color:#22d3ee");
    console.log("RAW DATA (stays on device):", result.raw.map((r) => r.value).filter(Boolean));
    console.log("↓ LOCAL REDACTION ↓");
    console.log("NETWORK PAYLOAD:", result.sanitized);
    console.groupEnd();
    sendResponse(result);
    return true;
  }

  if (msg.cmd === "ASK_AGENT") {
    const result = Redactor.analyzeDocument();
    const rawValues = result.raw.map((r) => r.value).filter(Boolean);
    const payload = { task: msg.task || "What should I do next?", sanitized_context: result.sanitized };
    const verdict = PrivacyFirewall.inspect(payload, rawValues);
    if (!verdict.allowed) {
      sendResponse({ blocked: true, violations: verdict.violations });
      return true;
    }
    chrome.runtime.sendMessage({ cmd: "CALL_BACKEND", payload }, (res) => {
      if (res && res.action) {
        const exec = ActionExecutor.execute(res);
        sendResponse({ blocked: false, response: res, exec, sanitized: result.sanitized });
      } else {
        sendResponse({ blocked: false, error: (res && res.error) || "No response", sanitized: result.sanitized });
      }
    });
    return true; // async
  }

  if (msg.cmd === "EXECUTE") {
    sendResponse(ActionExecutor.execute(msg.action));
    return true;
  }
});
