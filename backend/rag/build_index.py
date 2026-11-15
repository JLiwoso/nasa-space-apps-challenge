"""Construit l'index unifie : chunks PDF + web (chunks.json) + investigations PSI (psi-XX.json).
Chaque chunk a un champ `url` precis. Lance :  python build_index.py
"""
import json
import re
from pathlib import Path
from urllib.parse import quote

import numpy as np

import backend.rag.config as C

BLOCKED = ("has been blocked", "Web Page Blocked")


def load_links():
    if C.LINKS_FILE.exists():
        return json.loads(C.LINKS_FILE.read_text(encoding="utf-8"))
    return {}


LINKS = load_links()


def pdf_url(filename: str, page=None) -> str:
    official = (LINKS.get("pdf_urls") or {}).get(filename)
    base = official or f"{C.PUBLIC_BASE_URL}/pdf/{quote(filename)}"
    return f"{base}#page={page}" if page else base


def clean_contact(s: str) -> str:
    return re.sub(r"(email|table_view)$", "", s).strip()


# ---------------------------------------------------------------- chunks existants
def convert_existing():
    out = []
    for d in json.loads(C.CHUNKS_IN.read_text(encoding="utf-8")):
        text = d["text"]
        if any(b in text for b in BLOCKED):
            continue  # pages web bloquees (apollo-1, apollo-13...) : inutiles
        if d["type"] == "pdf":
            out.append(dict(
                type="pdf", source=d["source"], title=Path(d["source"]).stem,
                page=d.get("page"), text=text, url=pdf_url(d["source"], d.get("page")),
            ))
        else:
            m = re.match(r"(https?://\S+)", d["source"])
            url = m.group(1) if m else None
            out.append(dict(type="web", source=d["source"], title=url or d["source"],
                            page=None, text=text, url=url))
    return out


# ---------------------------------------------------------------- PSI
def load_abstracts():
    if C.ABSTRACTS_FILE.exists():
        return json.loads(C.ABSTRACTS_FILE.read_text(encoding="utf-8"))
    return {}


ABSTRACTS = load_abstracts()


def convert_psi(path: Path):
    """Retourne (chunks, resume_pour_le_front)."""
    j = json.loads(path.read_text(encoding="utf-8"))
    pid = j["investigation_id"]
    name = j.get("title") or (LINKS.get("psi_titles") or {}).get(pid) or pid
    inv_url = j.get("url")
    head = f"[{pid} - {name} - {j.get('sub_research_area') or j.get('discipline') or ''}]"
    resources = j.get("resources") or []
    sections = {
        "description": j.get("description"),
        "objectifs": j.get("objectives"),
        "hypothese": j.get("hypothesis"),
        "benefices et impacts": j.get("research_impacts_earth_benefits"),
    }
    if not any(sections.values()) and not resources:
        print(f"  ! {pid}: JSON vide (scraping rate), ignore. Relance le scraper pour cette page.")
        return [], None

    base = dict(source=path.name, psi_id=pid, page=None)
    out = []
    for label, txt in sections.items():
        if txt:
            out.append(dict(base, type="psi", title=f"{pid} - {name} ({label})",
                            text=f"{head}\n{label.capitalize()} : {txt}", url=inv_url))

    # fiche donnees : taille, DOI, licence, plateforme, contacts, versions
    facts = []
    proj = j.get("project") or {}
    for k, lab in [("total_size", "Taille totale des donnees"), ("submitted_date", "Date de soumission"),
                   ("doi_url", "DOI du jeu de donnees"), ("license", "Licence")]:
        if j.get(k):
            facts.append(f"{lab} : {j[k]}")
    for k, lab in [("flight_platform", "Plateforme"), ("nasa_center", "Centre NASA"),
                   ("project_type", "Type de projet")]:
        if proj.get(k):
            facts.append(f"{lab} : {proj[k]}")
    contacts = [clean_contact(c) for c in (j.get("contacts") or []) if clean_contact(c)]
    if contacts:
        facts.append("Chercheurs : " + ", ".join(contacts))
    for v in j.get("version_history") or []:
        facts.append(f"Version {v.get('version')} ({v.get('updated_date')}) : {v.get('changes')}, "
                     f"{v.get('files_added')} fichiers ajoutes")
    if facts:
        out.append(dict(base, type="psi", title=f"{pid} - {name} (fiche donnees)",
                        text=f"{head}\nFiche des donnees PSI.\n" + "\n".join(facts),
                        url=j.get("doi_url") or inv_url))

    # un chunk par ressource (publication, hardware, fichier...) -> lien precis
    for r in resources:
        url = r.get("url") or inv_url
        ab = ABSTRACTS.get(r.get("name") or "", {}).get("abstract")
        txt = (f"{head}\n{r.get('category')} : {r.get('name')}. {r.get('description') or ''} "
               + (f"Abstract : {ab[:1500]} " if ab else "") + f"Lien : {url}")
        out.append(dict(base, type="psi_resource", title=r.get("name") or pid, text=txt, url=url,
                        category=r.get("category")))
    summary = dict(
        id=pid, name=name, url=inv_url, doi_url=j.get("doi_url"), size=j.get("total_size"),
        platform=proj.get("flight_platform"), license=j.get("license"),
        research_area=j.get("sub_research_area") or j.get("discipline"),
        contacts=contacts,
        publications=[dict(title=r.get("name"), url=r.get("url") or inv_url, category=r.get("category"))
                      for r in resources],
    )
    return out, summary


def main():
    chunks = convert_existing()
    print(f"{len(chunks)} chunks pdf/web conserves")
    n0 = len(chunks)
    investigations = []
    for p in sorted(C.PSI_DIR.glob("psi-*.json")):
        ch, summ = convert_psi(p)
        chunks += ch
        if summ:
            investigations.append(summ)
    print(f"{len(chunks) - n0} chunks PSI ajoutes")
    for i, c in enumerate(chunks):
        c["id"] = i  # ids uniques (l'ancien fichier avait des doublons)

    from backend.rag.engine import Embedder
    vecs = Embedder().encode_passages([c["text"] for c in chunks])
    C.INDEX_DIR.mkdir(parents=True, exist_ok=True)
    C.CHUNKS_OUT.write_text(json.dumps(chunks, ensure_ascii=False, indent=1), encoding="utf-8")
    C.INVESTIGATIONS_OUT.write_text(json.dumps(investigations, ensure_ascii=False, indent=1), encoding="utf-8")
    np.save(C.VECTORS_OUT, vecs.astype("float32"))
    print(f"OK -> {C.CHUNKS_OUT.name} + {C.VECTORS_OUT.name}  {vecs.shape}")


if __name__ == "__main__":
    main()
