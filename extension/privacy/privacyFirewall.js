/* LOCAL PRIVACY LAYER — outbound payload firewall.
   Every backend request passes through inspect() first. */
(function (root) {
  function inspect(payload, rawValues = []) {
    const json = JSON.stringify(payload);
    const violations = [];

    // 1. Literal raw values scraped from the page must not appear.
    for (const v of rawValues) {
      if (v && String(v).length >= 4 && json.includes(v)) {
        violations.push({ rule: "raw-value-leak", value: mask(v) });
      }
    }
    // 2. Pattern sweep on the serialized payload.
    for (const p of root.PiiDetector.PATTERNS) {
      p.re.lastIndex = 0;
      const m = json.match(p.re);
      if (m) violations.push({ rule: `pattern-${p.type.toLowerCase()}`, value: mask(m[0]) });
    }

    const allowed = violations.length === 0;
    if (!allowed) console.error("🚫 Privacy Firewall: Request blocked", violations);
    else console.log("🔒 Privacy Firewall: payload clean — safe to send");
    return { allowed, violations };
  }

  const mask = (v) => String(v).slice(0, 2) + "•••";

  root.PrivacyFirewall = { inspect };
})(typeof self !== "undefined" ? self : globalThis);
