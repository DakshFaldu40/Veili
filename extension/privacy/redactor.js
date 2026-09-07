/* LOCAL PRIVACY LAYER — redaction + sanitized context builder. */
(function (root) {
  const TOKENS = {
    NAME: "[NAME]",
    EMAIL: "[EMAIL]",
    PHONE: "[PHONE]",
    PASSWORD: "[REDACTED]",
    ADDRESS: "[ADDRESS]",
    CREDIT_CARD: "[CARD]",
    DOB: "[DOB]",
  };

  const tokenFor = (type) => TOKENS[type] || "[REDACTED]";

  const INPUT_KIND = {
    PASSWORD: "password_input",
    EMAIL: "email_input",
    PHONE: "tel_input",
  };

  /** Build RAW + SANITIZED views of the current document. */
  function analyzeDocument(doc = document) {
    const raw = [];
    const elements = [];
    const counts = {};
    const confidence = {};

    doc.querySelectorAll("input, textarea, select").forEach((el, i) => {
      if (el.type === "hidden") return;
      const label = root.PiiDetector.labelFor(el) || el.getAttribute("placeholder") || el.name || `field_${i}`;
      const hit = root.PiiDetector.classifyField(el);
      const value = el.value || "";
      const ref = el.id || el.name || `field_${i}`;
      raw.push({ label: label.replace(/[:*]\s*$/, ""), value, pii: hit ? hit.type : null });
      if (hit) {
        counts[hit.type] = (counts[hit.type] || 0) + 1;
        confidence[hit.type] = Math.max(confidence[hit.type] || 0, hit.confidence);
      }
      elements.push({
        type: hit ? INPUT_KIND[hit.type] || "text_input" : el.tagName === "SELECT" ? "select" : "text_input",
        label: label.replace(/[:*]\s*$/, ""),
        ref,
        value: hit ? tokenFor(hit.type) : redactText(value),
        pii_type: hit ? hit.type : null,
      });
    });

    doc.querySelectorAll("button, a[href], input[type=submit]").forEach((el, i) => {
      const text = (el.value || el.textContent || "").trim();
      if (!text) return;
      elements.push({
        type: el.tagName === "A" ? "link" : "button",
        text: redactText(text),
        ref: el.id || text,
      });
    });

    return {
      raw,
      counts,
      confidence,
      sanitized: {
        page: { title: redactText(doc.title), url: safeUrl(location.href) },
        elements,
      },
    };
  }

  /** Redact PII found inside arbitrary text. */
  function redactText(text) {
    let out = String(text || "");
    for (const p of root.PiiDetector.PATTERNS) {
      out = out.replace(p.re, tokenFor(p.type));
    }
    return out;
  }

  function safeUrl(href) {
    try {
      const u = new URL(href);
      return u.origin + u.pathname; // drop query/hash — may carry PII
    } catch {
      return "about:blank";
    }
  }

  root.Redactor = { analyzeDocument, redactText, tokenFor, TOKENS };
})(typeof self !== "undefined" ? self : globalThis);
