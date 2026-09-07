/* LOCAL PRIVACY LAYER — PII detection. Runs 100% in the browser. */
(function (root) {
  const PATTERNS = [
    { type: "EMAIL", re: /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/g, confidence: 0.94 },
    { type: "CREDIT_CARD", re: /\b(?:\d[ -]*?){13,16}\b/g, confidence: 0.88 },
    { type: "PHONE", re: /(\+\d{1,3}[\s-]?)?\b\d{5}[\s-]?\d{5}\b|(\+\d{1,3}[\s-]?)?\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, confidence: 0.9 },
    { type: "NAME", re: /\b[A-Z][a-z]{1,15}\s[A-Z][a-z]{1,15}\b/g, confidence: 0.79 },
  ];

  // Semantic hints from DOM attributes (higher trust than raw regex).
  const SEMANTIC = [
    { type: "PASSWORD", keys: ["password", "passwd", "pwd"], confidence: 0.99 },
    { type: "EMAIL", keys: ["email", "e-mail", "mail"], confidence: 0.97 },
    { type: "PHONE", keys: ["phone", "mobile", "tel", "contact number"], confidence: 0.95 },
    { type: "NAME", keys: ["name", "fullname", "full name", "firstname", "lastname"], confidence: 0.91 },
    { type: "ADDRESS", keys: ["address", "street", "city", "state", "zip", "postal"], confidence: 0.87 },
    { type: "CREDIT_CARD", keys: ["card", "cardnumber", "cc-number", "creditcard"], confidence: 0.96 },
    { type: "DOB", keys: ["dob", "birth", "birthday"], confidence: 0.85 },
  ];

  function fieldSignature(el) {
    return [
      el.getAttribute("name"),
      el.id,
      el.getAttribute("placeholder"),
      el.getAttribute("aria-label"),
      el.getAttribute("autocomplete"),
      labelFor(el),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function labelFor(el) {
    if (el.id) {
      const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (l) return l.textContent.trim();
    }
    const wrap = el.closest("label");
    if (wrap) return wrap.textContent.trim();
    const prev = el.previousElementSibling;
    if (prev && /LABEL|SPAN|DIV|P/.test(prev.tagName)) return prev.textContent.trim();
    return "";
  }

  /** Classify a single input element. */
  function classifyField(el) {
    const sig = fieldSignature(el);
    const inputType = (el.getAttribute("type") || "text").toLowerCase();
    if (inputType === "password") return { type: "PASSWORD", confidence: 0.99, source: "input[type]" };
    if (inputType === "email") return { type: "EMAIL", confidence: 0.98, source: "input[type]" };
    if (inputType === "tel") return { type: "PHONE", confidence: 0.96, source: "input[type]" };
    for (const s of SEMANTIC) {
      if (s.keys.some((k) => sig.includes(k))) return { type: s.type, confidence: s.confidence, source: "dom-semantics" };
    }
    const v = el.value || "";
    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      if (v && p.re.test(v)) return { type: p.type, confidence: p.confidence, source: "regex" };
    }
    return null;
  }

  /** Find PII inside a free-text string. */
  function scanText(text) {
    const hits = [];
    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(text)) !== null) {
        hits.push({ type: p.type, value: m[0], confidence: p.confidence, source: "regex" });
      }
    }
    return hits;
  }

  root.PiiDetector = { classifyField, scanText, labelFor, fieldSignature, PATTERNS };
})(typeof self !== "undefined" ? self : globalThis);
