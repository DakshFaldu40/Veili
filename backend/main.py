"""FastAPI backend — sees sanitized context only.

Run:  uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import assert_sanitized, get_reasoner

app = FastAPI(title="Privacy Browser Agent Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

reasoner = get_reasoner()


class AgentRequest(BaseModel):
    task: str = "What should I do next?"
    sanitized_context: dict[str, Any]


class AgentResponse(BaseModel):
    action: str
    target: str | None = None
    value: str | None = None
    reason: str
    source: str = "mock"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "engine": type(reasoner).__name__}


@app.post("/agent", response_model=AgentResponse)
def agent(req: AgentRequest) -> AgentResponse:
    leaks = assert_sanitized(req.sanitized_context)
    if leaks:
        # The server refuses raw PII too — defense in depth.
        raise HTTPException(status_code=400, detail=f"Rejected: raw PII detected ({', '.join(leaks)})")
    result = reasoner.reason(req.task, req.sanitized_context)
    return AgentResponse(**result)
