/* LOCAL ACTION LAYER — executes the structured action returned by the backend. */
(function (root) {
  function findByText(target) {
    const t = String(target || "").toLowerCase().trim();
    const candidates = [...document.querySelectorAll("button, a, input[type=submit], [role=button]")];
    return (
      candidates.find((el) => (el.value || el.textContent || "").toLowerCase().trim() === t) ||
      candidates.find((el) => (el.value || el.textContent || "").toLowerCase().includes(t)) ||
      document.getElementById(target) ||
      document.querySelector(`[name="${CSS.escape(t)}"]`)
    );
  }

  function execute(action) {
    const { action: kind, target, value } = action || {};
    switch (kind) {
      case "click": {
        const el = findByText(target);
        if (!el) return { ok: false, message: `Target not found: ${target}` };
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        flash(el);
        el.click();
        return { ok: true, message: `Clicked "${target}"` };
      }
      case "scroll": {
        window.scrollBy({ top: Number(value) || window.innerHeight * 0.8, behavior: "smooth" });
        return { ok: true, message: "Scrolled page" };
      }
      case "focus": {
        const el = findByText(target) || document.querySelector(`[name="${target}"]`);
        if (!el) return { ok: false, message: `Target not found: ${target}` };
        el.focus();
        flash(el);
        return { ok: true, message: `Focused "${target}"` };
      }
      case "navigate": {
        if (!/^https?:\/\//.test(value || "")) return { ok: false, message: "Unsafe navigate target" };
        location.href = value;
        return { ok: true, message: `Navigating to ${value}` };
      }
      case "type": {
        // The backend can never supply sensitive values: reject PII-ish fields.
        const el = findByText(target) || document.querySelector(`[name="${target}"]`);
        if (!el) return { ok: false, message: `Target not found: ${target}` };
        const hit = root.PiiDetector.classifyField(el);
        if (hit) return { ok: false, message: `Blocked typing into ${hit.type} field (local policy)` };
        el.value = value || "";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return { ok: true, message: `Typed into "${target}"` };
      }
      default:
        return { ok: false, message: `Unsupported action: ${kind}` };
    }
  }

  function flash(el) {
    const prev = el.style.outline;
    el.style.outline = "3px solid #22d3ee";
    setTimeout(() => (el.style.outline = prev), 1200);
  }

  root.ActionExecutor = { execute };
})(typeof self !== "undefined" ? self : globalThis);
