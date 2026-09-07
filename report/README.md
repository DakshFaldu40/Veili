# SIH-26171: On-Device Vision Agents with Privacy

## Introduction
This project addresses the intersection of AI agents, edge computing, and data privacy. **On-device vision agents** promise to automate web tasks (like an AI browser assistant) without leaking sensitive data. This approach can make digital assistants more powerful and more trustworthy by keeping private information strictly local. Conversely, current AI assistants (e.g., Copilot, ChatGPT, Opera’s Aria) often run entirely in the cloud, which inherently raises privacy risks.

This report outlines:
1. Societal Impact
2. Existing Solutions and Gaps
3. Client-Side ML and Redaction Techniques
4. Proposed Architecture and Prototype Design
5. 3–5 Minute Demo Outline

---

## 1. Societal Impact

- **Privacy Protection:** By design, this project keeps personal data (passwords, photos, documents on screen, etc.) on the user’s device. Modern AI systems are often "data hungry and intransparent", giving users less control over what information is collected. Running vision models locally mitigates this by not sending raw screen images (which may contain PII) to external servers. By blurring or masking faces, passwords, and credit cards *before* any data leaves the browser, an on-device agent perfectly aligns with the demand for privacy-conscious AI.
- **User Trust and Compliance:** Many users and regulators want privacy by design. The EU’s GDPR and similar laws emphasize data minimization. An agent that enforces on-device redaction builds user trust and makes broader AI adoption safer. A working privacy-preserving agent ensures sensitive on-screen data never gets stored or sent improperly, demonstrating that agents can be both powerful and ethical.
- **Automation and Productivity:** Autonomous agents can save users time with tasks like booking, form-filling, and research. Getting these benefits without sacrificing privacy accelerates adoption. Society benefits when routine work is automated, but that only scales if privacy is ensured. By keeping data on-device, this solution enables safer AI assistance in healthcare, education, and citizen services—domains where data is highly sensitive.

Overall, the project’s impact is significant: it enables AI-powered productivity with absolute privacy guarantees.

---

## 2. Existing Solutions and Gaps

Currently, **no mainstream system fully meets these goals.** Many "AI browsers" or extensions today focus on text tasks or use cloud AI, not local vision pipelines. For example, modern browsers with AI add-ons improve search and summarization but **still rely on server-side inference**. They may even require sharing page content to a cloud API, which is the opposite of our goal. This illustrates the gap: current AI helpers don’t sanitize or avoid sending sensitive info.

On the flip side, there *are* some related components and open-source tools – but not an end-to-end privacy agent:

- **Client-side vision models:** Frameworks like HuggingFace’s *Transformers.js* let you run models entirely in-browser via WebGPU/WASM. Similarly, libraries like *MediaPipe Tasks (Vision)* provide JavaScript face detectors and object detectors for the web. OCR is also doable with *Tesseract.js*, a pure-JS OCR engine. Building a client-side visual pipeline is possible, but they haven’t been assembled into a privacy agent for screen automation yet.
- **Server-side vision/LLM:** On the server, many vision-language models (VLMs) exist (LLaVA, BLIP, Qwen-VL, etc.) that interpret images and generate text. However, these expect raw images or embeddings. The novelty here is the interface: sending *only sanitized embeddings*. Currently, no product takes a browser screenshot, locally blurs faces or PII, and *then* sends it to an LLM for UI actions.
- **Privacy filters:** Redaction tools (face blurring, text masking) exist in isolated ways (e.g., OpenCV.js or Canvas). But they aren’t normally tied to a web agent. The competition explicitly calls for demonstrating things like "blurring faces, blacking out passwords, and masking PII." The gap is in integration: making all these parts work smoothly in a browser extension.

**In summary:** The competitor gap is that current AI tools either use cloud models without privacy protection, or offer local models only for simple tasks. Our solution is novel by combining modern browser ML APIs (WebGPU/WASM) with vision/NER models, plus smart sanitization *before* calling a VLM.

---

## 3. Client-Side ML and Redaction Techniques

Building this agent on the browser requires choosing the right tools and models:

- **WebAssembly/WebGPU for inference:** Running lightweight ML in-browser is highly practical today. Sub-30 ms latency is realistic for small models on a mainstream GPU. Libraries like ONNX Runtime Web or TensorFlow.js exploit WebGPU to speed things up. *Transformers.js* is key: it supports vision tasks and lets us load ONNX models into the browser.
- **Vision model for screen understanding:** A mid-sized model (ResNet or a distilled ViT) could classify or detect UI elements. Any sensitive content can be detected via specialized models (e.g., Google’s MediaPipe Face Detector). Once faces are detected, they are blurred on the canvas.
- **Text/OCR for PII:** For on-screen text, we have two paths. One is **DOM analysis**: the extension inspects HTML fields (e.g. `<input type="password">`) and automatically blocks them. For arbitrary images, we need OCR using *Tesseract.js*. A client-side NER model can tag names and locations to be masked.
- **Privacy filter:** Once sensitive regions are identified, we redact them via canvas manipulation (pixelating, blurring, or covering with solid color). *We must make sure these edits happen before any network transmission.* We’ll send only the sanitized snapshot to the server.
- **Local inference vs. offloading:** The agent balances work between client and server. The client handles privacy-critical parts (PII detection and redaction). The server runs a more powerful model to understand context (e.g., LLaVA) and returns actionable commands.
- **Performance trade-offs:** Efficiency is crucial since browser resources are limited. We'll utilize quantized models (8-bit) and small resolutions. Inference should ideally be under a few hundred milliseconds, which is feasible on WebGPU.

---

## 4. Proposed Architecture and Prototype Design

A candidate architecture for the prototype:

### Browser Extension (Client-Side)
- **Screen Capture:** Grab the current page as an image (using canvas APIs) and query the DOM to identify form fields.
- **Vision Model:** Run a small CNN/ViT on the image to identify UI elements.
- **PII Detector:** Perform OCR/DOM analysis to find sensitive text and MediaPipe to find faces.
- **Privacy Filter:** Redact detected sensitive items (e.g., replace `value="abc"` with `value="***"` or blur canvas regions).
- **Sanitized Context Packaging:** Create a JSON or sanitized image to send to the server.
- **Send to Server:** POST the anonymized data, including metadata about redacted areas.

### Server (Cloud or Local VM)
- **Receive Anonymized Input:** The server receives a masked screenshot and element list.
- **Process with VLM/LLM:** Use an open model (LLaVA, Qwen-VL) to interpret context.
- **Generate Action Commands:** Output high-level actions (e.g., "click login", "fill email").
- **Send Commands to Client:** Return structured commands for the agent to execute.

### Browser Agent Execution
- The extension receives the server’s reply and **performs the actions** using standard DOM APIs.

---

## 5. Checklist for 36h Prototype

- [x] Choose a browser (Chrome is best for WebGPU support).
- [x] Use a small face detector and small object detector for identifying PII.
- [x] Implement HTML canvas capture and overlay blur filters.
- [ ] Integrate OCR for arbitrary text regions.
- [x] Write JS logic to detect DOM fields and classify them.
- [x] Prototype a simple server (FastAPI/Node) hosting an LLM.
- [x] Test a scenario (e.g., demo login page where the agent blurs the password field and clicks "Login").

---

## 6. 3–5 Minute Demo Outline

For the final presentation, this script clearly showcases the end-to-end flow and privacy angle:

1. **Setup:** Show the user on a webpage (e.g., a fake bank login with personal details). Explain: *"Our browser agent will assist the user while protecting private info."*
2. **Trigger the Agent:** Click the extension icon. Immediately **visualize redaction:** the user sees faces pixelated and password fields blanked out in real-time.
3. **Network Request:** Open Developer Tools. Show the anonymized data being sent. Point out that passwords and faces are replaced with asterisks/blurs.
4. **Server Processing:** Briefly show the server logs returning actionable commands.
5. **Agent Action:** Watch the agent automatically follow the instruction (e.g., filling in a non-sensitive field and clicking submit).
6. **End Result:** The page reacts successfully. Point out: *"It did that without ever sending the password or my name to the server."*

*Narration tip:* "Notice how the face and password never left your computer – only the sanitized data went to the server. The AI helped complete the task without exposing privacy."

---

## Conclusion

This problem is impactful and technically interesting. It addresses a real social need for private AI assistants. No turnkey solution exists yet, so this creative prototype stands out. With modern browser ML tools and known redaction methods, the basic components are achievable. The MVP successfully demonstrates how anonymized context is shared to perform automated browser actions while keeping user data strictly local.
