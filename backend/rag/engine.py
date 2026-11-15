"""Retrieval (embeddings) + generation (LLM) + sources avec liens."""
import json
import os
import re
import time

import numpy as np
import requests

import backend.rag.config as C


class Embedder:
    def __init__(self, name=C.EMBED_MODEL):
        from sentence_transformers import SentenceTransformer
        self.name = name
        n = name.lower()
        self.e5 = "e5" in n  # e5 : prefixes "query: " / "passage: "
        # bge anglais : instruction cote requete uniquement (pas pour les passages)
        self.q_prefix = ("query: " if self.e5 else
                         "Represent this sentence for searching relevant passages: " if "bge" in n and "m3" not in n
                         else "")
        self.p_prefix = "passage: " if self.e5 else ""
        self.model = SentenceTransformer(name)

    def encode_passages(self, texts):
        texts = [self.p_prefix + t for t in texts]
        return self.model.encode(texts, batch_size=32, normalize_embeddings=True, show_progress_bar=True)

    def encode_query(self, q):
        return self.model.encode([self.q_prefix + q], normalize_embeddings=True)[0]


SYSTEM = """Tu es l'assistant scientifique du projet, expert en science de la combustion et securite incendie \
dans l'espace (NASA, ISS, PSI - Physical Sciences Informatics).
Regles :
- Reponds en anglais, de facon claire et structuree (ou dans la langue de la question si ce n'est pas l'anglais).
- Appuie-toi UNIQUEMENT sur les extraits numerotes fournis. Cite-les avec [1], [2]... apres chaque affirmation.
- Si les extraits ne suffisent pas, dis-le franchement et propose ce qu'il faut chercher ; n'invente rien.
- Format : paragraphes courts, listes avec "- ", **gras** pour les termes cles ; pas de tableaux ni de titres markdown.
- Ne recopie pas d'URL toi-meme : les liens sont ajoutes automatiquement a partir des numeros cites.
- Quand l'utilisateur cherche un article, un PDF ou des donnees, indique quelles sources ([n]) lui correspondent."""


class RAG:
    def __init__(self):
        self.chunks = json.loads(C.CHUNKS_OUT.read_text(encoding="utf-8"))
        self.vecs = np.load(C.VECTORS_OUT)
        assert len(self.chunks) == len(self.vecs), "index desynchronise : relance build_index.py"
        self.emb = Embedder()
        # alias pour booster une investigation citee dans la question (ex. "PSI-25", "BASS-II")
        self.alias = {}
        for i, c in enumerate(self.chunks):
            if c.get("psi_id"):
                name = c["title"].split(" - ")[1].split(" (")[0] if " - " in c["title"] else ""
                for a in {c["psi_id"].lower(), name.lower()}:
                    if a:
                        self.alias.setdefault(a, set()).add(i)

    # ------------------------------------------------------------ retrieval
    def retrieve(self, question, k=C.TOP_K):
        scores = self.vecs @ self.emb.encode_query(question)
        q = question.lower()
        for a, idx in self.alias.items():
            if re.search(r"(?<![\w-])" + re.escape(a) + r"(?![\w-])", q):
                scores[list(idx)] += 0.10
        order = np.argsort(-scores)[: k * 3]
        picked, seen = [], set()
        for i in order:
            c = self.chunks[i]
            key = (c["url"], c["text"][:80])
            if key in seen or scores[i] < C.MIN_SCORE:
                continue
            seen.add(key)
            picked.append((c, float(scores[i])))
            if len(picked) == k:
                break
        return picked

    # ------------------------------------------------------------ recherche sans LLM (barre de recherche, page NASA Data)
    def _investigations(self):
        if not hasattr(self, "_inv_cache"):
            p = C.INVESTIGATIONS_OUT
            self._inv_cache = json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
        return self._inv_cache

    @staticmethod
    def _public(c, score=None, full=False):
        """Chunk -> dict JSON pour le front."""
        text = c["text"]
        out = {
            "id": c["id"], "type": c["type"], "title": c["title"], "page": c.get("page"),
            "url": c.get("url"), "psi_id": c.get("psi_id"), "category": c.get("category"),
            "snippet": text[:240].replace("\n", " "),
        }
        if full:
            out["text"] = text[:1500]
        if score is not None:
            out["score"] = round(score, 3)
        return out

    def search(self, query, k=8, types=None):
        """Investigations dont le nom/id/domaine correspond + chunks les plus proches (vecteurs). Aucun appel LLM."""
        q = query.lower().strip()
        terms = [t for t in re.split(r"\W+", q) if len(t) > 1]
        invs = []
        for inv in self._investigations():
            hay = " ".join(str(inv.get(f) or "") for f in ("id", "name", "research_area", "platform")).lower()
            score = sum(1 for t in terms if t in hay)
            if q and q in hay:
                score += 2
            if score:
                invs.append((score, inv))
        invs.sort(key=lambda x: -x[0])
        investigations = [{
            "id": i["id"], "name": i["name"], "url": i.get("url"), "doi_url": i.get("doi_url"),
            "research_area": i.get("research_area"), "size": i.get("size"),
            "publications": len(i.get("publications") or []),
        } for _, i in invs[:5]]

        # on demande plus de candidats si on filtre par type, puis on coupe
        hits = self.retrieve(query, k=k * 4 if types else k)
        if types:
            hits = [(c, s) for c, s in hits if c["type"] in types][:k]
        return {"query": query, "investigations": investigations,
                "chunks": [self._public(c, s) for c, s in hits]}

    def stats(self):
        by_type, by_inv = {}, {}
        for c in self.chunks:
            by_type[c["type"]] = by_type.get(c["type"], 0) + 1
            if c.get("psi_id"):
                by_inv[c["psi_id"]] = by_inv.get(c["psi_id"], 0) + 1
        invs = self._investigations()
        return {
            "chunks": len(self.chunks), "vectors": int(self.vecs.shape[0]), "dimensions": int(self.vecs.shape[1]),
            "embed_model": C.EMBED_MODEL, "by_type": by_type, "by_investigation": by_inv,
            "investigations": len(invs),
            "publications": sum(len(i.get("publications") or []) for i in invs),
        }

    def browse(self, type=None, psi_id=None, q=None, offset=0, limit=20):
        """Parcourt les chunks (filtre par type, investigation, mot-clé) avec pagination."""
        ql = q.lower().strip() if q else None
        rows = [c for c in self.chunks
                if (not type or c["type"] == type)
                and (not psi_id or c.get("psi_id") == psi_id)
                and (not ql or ql in c["text"].lower() or ql in c["title"].lower())]
        return {"total": len(rows), "offset": offset,
                "items": [self._public(c, full=True) for c in rows[offset: offset + limit]]}

    # ------------------------------------------------------------ generation
    @staticmethod
    def _label(c):
        if c["type"] == "pdf":
            return f"PDF - {c['title']}, page {c['page']}"
        if c["type"] == "web":
            return f"Web - {c['title']}"
        return f"PSI - {c['title']}"

    def _prompt(self, question, hits):
        ctx = "\n\n".join(f"[{n}] ({self._label(c)})\n{c['text'][:C.MAX_CHUNK_CHARS]}" for n, (c, _) in enumerate(hits, 1))
        return f"Extraits :\n\n{ctx}\n\nQuestion : {question}"

    def _call(self, provider, msgs):
        if provider == "groq":  # API compatible OpenAI, palier gratuit
            key = os.getenv("GROQ_API_KEY")
            if not key:
                raise RuntimeError("GROQ_API_KEY manquante")
            for attempt in range(2):
                r = requests.post("https://api.groq.com/openai/v1/chat/completions", timeout=120,
                                  headers={"Authorization": f"Bearer {key}"},
                                  json={"model": C.GROQ_MODEL, "temperature": 0.2, "max_tokens": 1500,
                                        "reasoning_effort": "low",
                                        "messages": [{"role": "system", "content": SYSTEM}] + msgs})
                if r.status_code == 429 and attempt == 0:  # limite par minute du palier gratuit
                    time.sleep(min(float(r.headers.get("retry-after", 10)), 30))
                    continue
                r.raise_for_status()
                return r.json()["choices"][0]["message"]["content"]
        if provider == "ollama":
            r = requests.post(f"{C.OLLAMA_URL}/api/chat", timeout=300, json={
                "model": C.OLLAMA_MODEL, "stream": False, "options": {"temperature": 0.2},
                "messages": [{"role": "system", "content": SYSTEM}] + msgs})
            r.raise_for_status()
            return r.json()["message"]["content"]
        if provider == "anthropic":
            import anthropic  # lit ANTHROPIC_API_KEY
            resp = anthropic.Anthropic().messages.create(
                model=C.ANTHROPIC_MODEL, max_tokens=1200, temperature=0.2, system=SYSTEM, messages=msgs)
            return "".join(b.text for b in resp.content if b.type == "text")
        raise RuntimeError(f"fournisseur inconnu : {provider}")

    def _llm(self, user_msg, history):
        msgs = (history or [])[-4:] + [{"role": "user", "content": user_msg}]
        errors = []
        for p in [x.strip() for x in C.LLM_PROVIDER.split(",") if x.strip()]:
            try:
                return self._call(p, msgs)
            except Exception as ex:
                errors.append(f"{p}: {ex}")
                print(f"[LLM] {p} a echoue ({ex}), essai du suivant...")
        raise RuntimeError(" | ".join(errors))

    def ask(self, question, history=None):
        hits = self.retrieve(question)
        if not hits:
            return {"answer": "Je n'ai trouve aucun extrait pertinent dans la base.", "sources": []}
        answer = self._llm(self._prompt(question, hits), history)
        cited = {int(n) for n in re.findall(r"\[(\d+)\]", answer)}
        sources = [{
            "n": n, "cited": n in cited, "type": c["type"], "title": c["title"], "page": c.get("page"),
            "url": c["url"], "score": round(s, 3), "snippet": c["text"][:240].replace("\n", " "),
        } for n, (c, s) in enumerate(hits, 1)]
        return {"answer": answer, "sources": sources}