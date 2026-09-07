# Privacy-Preserving Visual Browser Agent

Chrome MV3 extension + FastAPI backend. The page is understood locally, PII is detected
and redacted **inside the browser**, and only sanitized context ever leaves the device.

```
USER → Webpage → Extension
  → LOCAL DOM ANALYSIS → LOCAL PII DETECTION → LOCAL REDACTION
  → SANITIZED CONTEXT ONLY → BACKEND / LLM
  → ACTION → EXTENSION → EXECUTE LOCALLY
```

## Layers

| Layer            | Code                                             |
| ---------------- | ------------------------------------------------ |
| Local Vision/DOM | `extension/content/content.js`                    |
| Local Privacy    | `extension/privacy/{piiDetector,redactor,privacyFirewall}.js` |
| Server Reasoning | `backend/main.py`, `backend/agent.py`             |
| Local Action     | `extension/agent/actionExecutor.js`               |

A local vision model (ONNX Runtime Web / Transformers.js / WebGPU) can later replace the
DOM analysis step without touching the other three layers.

## Run

**Backend**
```bash
cd backend && pip install -r requirements.txt
uvicorn main:app --reload --port 8000        # mock reasoning
OPENAI_API_KEY=sk-... uvicorn main:app --port 8000   # real LLM
```

**Extension**
1. `chrome://extensions` → Developer mode → **Load unpacked** → select `extension/`.
2. Open `demo/signup.html` in a tab (drag the file into Chrome).
3. Click the extension icon.

If the backend is offline the service worker falls back to local mock reasoning, so the
demo always works.

## Demo script (3 min)
1. Open the demo signup page — Name / Email / Phone / Password / Address / Card filled in.
2. Popup shows detected PII with confidence.
3. **RAW** tab: real values. **REDACTED** tab: `[NAME] [EMAIL] [PHONE] [REDACTED]` JSON.
4. Press **Ask Agent** — DevTools console prints the firewall verdict and the exact
   network payload (tokens only).
5. Backend returns `{"action":"click","target":"Submit Application"}`.
6. The extension clicks the button locally; the page confirms.

## Privacy Firewall
Every outbound payload is inspected against (a) literal raw values scraped from the page
and (b) PII regexes. On a hit the request is blocked and logged:
`🚫 Privacy Firewall: Request blocked`. The backend independently rejects raw PII too.

A hosted mock of the backend lives at `POST /api/public/agent` for the web dashboard demo.
