"""SERVER REASONING LAYER.

Receives ONLY sanitized context. Swap `OpenAIReasoner` for any other
LLM/VLM provider without touching main.py.
"""

from __future__ import annotations

import json
import os
import re
from typing import Any, Protocol

PII_PATTERNS = [
    (r"[\w.+-]+@[\w-]+\.[\w.]{2,}", "EMAIL"),
    (r"(?:\+\d{1,3}[\s-]?)?\d{5}[\s-]?\d{5}", "PHONE"),
    (r"(?:\d[ -]*?){13,16}", "CREDIT_CARD"),
]

SYSTEM_PROMPT = """You are a browser agent. You only ever see a SANITIZED page
representation where personal data is replaced by tokens like [NAME], [EMAIL],
[PHONE], [REDACTED]. Never ask for or invent real personal values.
Reply with STRICT JSON: {"action":"click|scroll|focus|navigate","target":"...","reason":"..."}"""


def assert_sanitized(context: dict[str, Any]) -> list[str]:
    """Server-side second line of defense."""
    blob = json.dumps(context)
    return [name for pattern, name in PII_PATTERNS if re.search(pattern, blob)]


class Reasoner(Protocol):
    def reason(self, task: str, context: dict[str, Any]) -> dict[str, Any]: ...


class MockReasoner:
    """Deterministic engine used when no API key is configured."""

    def reason(self, task: str, context: dict[str, Any]) -> dict[str, Any]:
        elements = context.get("elements", [])
        buttons = [e for e in elements if e.get("type") == "button"]
        t = (task or "").lower()

        if "scroll" in t:
            return {"action": "scroll", "target": None, "reason": "The user asked to scroll the page.", "source": "mock"}
        if buttons:
            best = next((b for b in buttons if "submit" in b.get("text", "").lower()), buttons[0])
            return {
                "action": "click",
                "target": best.get("text"),
                "reason": f"The sanitized context contains a primary action button; the user requested: {task}",
                "source": "mock",
            }
        return {"action": "scroll", "target": None, "reason": "No actionable control visible yet.", "source": "mock"}


class OpenAIReasoner:
    """OpenAI-compatible chat completions (works with any compatible base URL)."""

    def __init__(self) -> None:
        self.key = os.getenv("OPENAI_API_KEY")
        self.base = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def reason(self, task: str, context: dict[str, Any]) -> dict[str, Any]:
        import httpx

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"TASK: {task}\nSANITIZED_CONTEXT:\n{json.dumps(context)}"},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0,
        }
        r = httpx.post(
            f"{self.base}/chat/completions",
            json=payload,
            headers={"Authorization": f"Bearer {self.key}"},
            timeout=30,
        )
        r.raise_for_status()
        out = json.loads(r.json()["choices"][0]["message"]["content"])
        out["source"] = self.model
        return out


def get_reasoner() -> Reasoner:
    return OpenAIReasoner() if os.getenv("OPENAI_API_KEY") else MockReasoner()
