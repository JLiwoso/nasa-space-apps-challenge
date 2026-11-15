"""API du RAG. Lancement recommande :  python run.py   (ou: uvicorn api:app --port 8000)"""
import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

import backend.rag.config as C

state = {}


@asynccontextmanager
async def lifespan(app):
    if not (C.CHUNKS_OUT.exists() and C.VECTORS_OUT.exists()):  # premier demarrage : on construit l'index
        print("Index absent -> construction automatique...")
        import backend.rag.build_index as build_index
        build_index.main()
    from backend.rag.engine import RAG
    state["rag"] = RAG()
    yield


app = FastAPI(title="NASA PSI RAG", version="1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


def check_key(x_api_key: str = Header(default="")):
    if C.API_KEY and x_api_key != C.API_KEY:
        raise HTTPException(401, "Invalid or missing X-API-Key")


class Message(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str


class AskRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)
    history: list[Message] = []  # tours precedents, pour les questions de suivi


@app.post("/ask", dependencies=[Depends(check_key)])
def ask(body: AskRequest):
    """-> {"answer": str, "sources": [{n, cited, type, title, page, url, score, snippet}]}
    type = pdf | web | psi | psi_resource. `cited` = la source est citee [n] dans la reponse."""
    try:
        return state["rag"].ask(body.question, [m.model_dump() for m in body.history])
    except Exception as e:
        raise HTTPException(502, f"LLM error: {e}")


@app.get("/investigations", dependencies=[Depends(check_key)])
def investigations():
    """Liste des investigations PSI (id, nom, liens PSI/DOI, taille, publications avec liens) pour une page 'Browse'."""
    return json.loads(C.INVESTIGATIONS_OUT.read_text(encoding="utf-8")) if C.INVESTIGATIONS_OUT.exists() else []


@app.get("/search", dependencies=[Depends(check_key)])
def search(q: str = Query(min_length=2, max_length=200), k: int = Query(8, ge=1, le=30),
           type: str | None = Query(None, pattern="^(pdf|web|psi|psi_resource)$")):
    """Recherche sans LLM : -> {query, investigations: [...], chunks: [{id, type, title, page, url, score, snippet, psi_id}]}"""
    return state["rag"].search(q, k, [type] if type else None)


@app.get("/stats", dependencies=[Depends(check_key)])
def stats():
    """Compteurs de l'index : chunks, vecteurs, répartition par type et par investigation."""
    return state["rag"].stats()


@app.get("/chunks", dependencies=[Depends(check_key)])
def chunks(type: str | None = Query(None, pattern="^(pdf|web|psi|psi_resource)$"),
           psi_id: str | None = None, q: str | None = Query(None, max_length=200),
           offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    """Explorateur de chunks avec filtres et pagination -> {total, offset, items}"""
    return state["rag"].browse(type, psi_id, q, offset, limit)


@app.get("/pdf/{name}")
def pdf(name: str):
    """Sert les PDF locaux ; l'ancre #page=N dans l'URL ouvre la bonne page."""
    for d in C.PDF_DIRS:
        p = Path(d) / Path(name).name  # .name bloque le path traversal
        if p.is_file():
            return FileResponse(p, media_type="application/pdf")
    raise HTTPException(404, "PDF not found")


@app.get("/health")
def health():
    r = state.get("rag")
    return {"ready": r is not None, "chunks": len(r.chunks) if r else 0,
            "embed": C.EMBED_MODEL, "llm": C.LLM_PROVIDER}