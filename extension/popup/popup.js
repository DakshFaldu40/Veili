const $ = (s) => document.querySelector(s);
let analysis = null;
let tab = "raw";

async function activeTab() {
  const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
  return t;
}

function render() {
  if (!analysis) return;
  const counts = analysis.counts || {};
  const conf = analysis.confidence || {};
  const keys = Object.keys(counts);
  $("#detected").innerHTML = keys.length
    ? keys
        .map(
          (k) =>
            `<li><span>${k}</span><span>${counts[k]} • ${Math.round((conf[k] || 0.8) * 100)}%</span></li>`,
        )
        .join("")
    : '<li class="muted">No PII detected on this page</li>';

  if (tab === "raw") {
    $("#banner").className = "banner danger";
    $("#banner").textContent = "RAW • PII EXPOSED";
    $("#preview").textContent = analysis.raw
      .filter((r) => r.value)
      .map((r) => `${r.label}: ${r.value}`)
      .join("\n");
  } else {
    $("#banner").className = "banner safe";
    $("#banner").textContent = "✓ SANITIZED • SAFE TO SEND";
    $("#preview").textContent = JSON.stringify(analysis.sanitized, null, 2);
  }
}

function steps(list) {
  $("#steps").innerHTML = list.map((s) => `<li class="${s.state || ""}">${s.text}</li>`).join("");
}

async function scan() {
  const t = await activeTab();
  $("#host").textContent = new URL(t.url).hostname;
  chrome.tabs.sendMessage(t.id, { cmd: "ANALYZE" }, (res) => {
    if (chrome.runtime.lastError || !res) {
      $("#detected").innerHTML = '<li class="muted">Open the demo page and reload it.</li>';
      return;
    }
    analysis = res;
    render();
    steps([
      { text: "STEP 1 · Page captured locally", state: "done" },
      { text: "STEP 2 · Local PII detection", state: "done" },
      { text: "STEP 3 · Local redaction", state: "done" },
      { text: "STEP 4 · Awaiting Ask Agent" },
    ]);
  });
}

document.querySelectorAll(".tab").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    tab = b.dataset.tab;
    render();
  }),
);

$("#rescan").addEventListener("click", scan);

$("#toggle").addEventListener("change", (e) =>
  chrome.storage.local.set({ enabled: e.target.checked }),
);

$("#ask").addEventListener("click", async () => {
  const t = await activeTab();
  steps([
    { text: "STEP 1 · Page captured locally", state: "done" },
    { text: "STEP 2 · Local PII detection", state: "done" },
    { text: "STEP 3 · Local redaction", state: "done" },
    { text: "STEP 4 · Privacy firewall + send…" },
  ]);
  chrome.tabs.sendMessage(t.id, { cmd: "ASK_AGENT", task: $("#task").value }, (res) => {
    if (!res) return steps([{ text: "No content script — reload the page", state: "fail" }]);
    if (res.blocked)
      return steps([
        { text: "STEP 4 · 🚫 Privacy Firewall: Request blocked", state: "fail" },
        { text: JSON.stringify(res.violations) },
      ]);
    const r = res.response || {};
    steps([
      { text: "STEP 1 · Page captured locally", state: "done" },
      { text: "STEP 2 · Local PII detection", state: "done" },
      { text: "STEP 3 · Local redaction", state: "done" },
      { text: "STEP 4 · 🔒 Firewall passed — sanitized context sent", state: "done" },
      { text: `STEP 5 · ☁ LLM: ${r.reason || res.error || "—"}`, state: "done" },
      { text: `STEP 6 · Action: ${r.action?.toUpperCase()} → ${r.target ?? ""}`, state: "done" },
      { text: `STEP 7 · ${res.exec?.message || "—"}`, state: res.exec?.ok ? "done" : "fail" },
    ]);
  });
});

chrome.storage.local.get({ enabled: true }).then((c) => ($("#toggle").checked = c.enabled));
scan();
