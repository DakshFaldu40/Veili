/* LOCAL PRIVACY LAYER (web dashboard mirror of extension/privacy/*) */

export type PiiType = "NAME" | "EMAIL" | "PHONE" | "PASSWORD" | "ADDRESS" | "CREDIT_CARD";

export const TOKENS: Record<PiiType, string> = {
  NAME: "[NAME]",
  EMAIL: "[EMAIL]",
  PHONE: "[PHONE]",
  PASSWORD: "[REDACTED]",
  ADDRESS: "[ADDRESS]",
  CREDIT_CARD: "[CARD]",
};

export const PATTERNS: { type: PiiType; re: RegExp; confidence: number }[] = [
  { type: "EMAIL", re: /[\w.+-]+@[\w-]+\.[\w.]{2,}/g, confidence: 0.94 },
  { type: "CREDIT_CARD", re: /(?:\d[ -]*?){13,16}/g, confidence: 0.96 },
  { type: "PHONE", re: /(?:\+\d{1,3}[\s-]?)?\d{5}[\s-]?\d{5}/g, confidence: 0.93 },
];

export type Field = {
  ref: string;
  label: string;
  value: string;
  inputType: "text" | "email" | "tel" | "password";
  hintKey: string;
};

export type Detection = { ref: string; type: PiiType; confidence: number; source: string };

const SEMANTIC: { type: PiiType; keys: string[]; confidence: number }[] = [
  { type: "PASSWORD", keys: ["password"], confidence: 0.99 },
  { type: "EMAIL", keys: ["email", "mail"], confidence: 0.97 },
  { type: "PHONE", keys: ["phone", "mobile", "tel"], confidence: 0.95 },
  { type: "NAME", keys: ["name"], confidence: 0.91 },
  { type: "ADDRESS", keys: ["address", "city", "state", "zip"], confidence: 0.87 },
  { type: "CREDIT_CARD", keys: ["card"], confidence: 0.96 },
];

export function classify(f: Field): Detection | null {
  if (f.inputType === "password") return { ref: f.ref, type: "PASSWORD", confidence: 0.99, source: "input[type]" };
  if (f.inputType === "email") return { ref: f.ref, type: "EMAIL", confidence: 0.98, source: "input[type]" };
  if (f.inputType === "tel") return { ref: f.ref, type: "PHONE", confidence: 0.96, source: "input[type]" };
  const sig = `${f.hintKey} ${f.label}`.toLowerCase();
  for (const s of SEMANTIC) {
    if (s.keys.some((k) => sig.includes(k)))
      return { ref: f.ref, type: s.type, confidence: s.confidence, source: "dom-semantics" };
  }
  for (const p of PATTERNS) {
    p.re.lastIndex = 0;
    if (f.value && p.re.test(f.value))
      return { ref: f.ref, type: p.type, confidence: p.confidence, source: "regex" };
  }
  return null;
}

export function redactText(text: string): string {
  let out = text ?? "";
  for (const p of PATTERNS) out = out.replace(p.re, TOKENS[p.type]);
  return out;
}

export type SanitizedContext = {
  page: { title: string; url: string };
  elements: Array<Record<string, unknown>>;
};

export function buildContext(
  fields: Field[],
  buttons: string[],
  page: { title: string; url: string },
): { detections: Detection[]; sanitized: SanitizedContext } {
  const detections: Detection[] = [];
  const elements: Array<Record<string, unknown>> = [];

  for (const f of fields) {
    const hit = classify(f);
    if (hit) detections.push(hit);
    const kind =
      hit?.type === "PASSWORD" ? "password_input" : hit?.type === "EMAIL" ? "email_input" : hit?.type === "PHONE" ? "tel_input" : "text_input";
    elements.push({
      type: kind,
      label: f.label,
      ref: f.ref,
      value: hit ? TOKENS[hit.type] : redactText(f.value),
      pii_type: hit?.type ?? null,
    });
  }
  for (const b of buttons) elements.push({ type: "button", text: redactText(b), ref: b });

  return { detections, sanitized: { page: { title: redactText(page.title), url: page.url }, elements } };
}

/** PRIVACY FIREWALL — inspect the outgoing payload before any network call. */
export function firewall(payload: unknown, rawValues: string[]) {
  const json = JSON.stringify(payload);
  const violations: { rule: string; value: string }[] = [];
  for (const v of rawValues) {
    if (v && v.length >= 4 && json.includes(v)) violations.push({ rule: "raw-value-leak", value: v.slice(0, 2) + "•••" });
  }
  for (const p of PATTERNS) {
    p.re.lastIndex = 0;
    const m = json.match(p.re);
    if (m) violations.push({ rule: `pattern-${p.type.toLowerCase()}`, value: m[0].slice(0, 2) + "•••" });
  }
  return { allowed: violations.length === 0, violations };
}
