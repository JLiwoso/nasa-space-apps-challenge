"""Recupere le resume (abstract) des publications citees dans les JSON PSI, via OpenAlex (HTTP simple,
sans Playwright). Resultat mis en cache dans abstracts_cache.json ; relancable sans risque.
Usage :  python enrich.py
"""
import difflib
import json
import time

import requests

import backend.rag.config as C

API = "https://api.openalex.org/works"


def rebuild_abstract(inv):
    if not inv:
        return None
    words = {}
    for w, positions in inv.items():
        for p in positions:
            words[p] = w
    return " ".join(words[i] for i in sorted(words)) or None


def _get(params, path=""):
    if C.CONTACT_EMAIL:
        params["mailto"] = C.CONTACT_EMAIL
    r = requests.get(API + path, params=params, timeout=30)
    r.raise_for_status()
    return r.json()


def lookup(name, url):
    if url and url.startswith("https://doi.org/"):
        try:
            w = _get({}, "/doi:" + url.replace("https://doi.org/", ""))
            return w, "doi"
        except requests.HTTPError:
            pass
    res = _get({"search": name, "per-page": 1}).get("results") or []
    if res:
        sim = difflib.SequenceMatcher(None, name.lower(), (res[0].get("title") or "").lower()).ratio()
        if sim >= 0.9:
            return res[0], "title"
    return None, None


def main():
    cache = json.loads(C.ABSTRACTS_FILE.read_text(encoding="utf-8")) if C.ABSTRACTS_FILE.exists() else {}
    todo = []
    for p in sorted(C.PSI_DIR.glob("psi-*.json")):
        for r in json.loads(p.read_text(encoding="utf-8")).get("resources") or []:
            if r.get("category") == "Publications" and r.get("name") and r["name"] not in cache:
                todo.append((r["name"], r.get("url")))
    print(f"{len(todo)} publications a enrichir")
    for i, (name, url) in enumerate(todo, 1):
        try:
            w, how = lookup(name, url)
            ab = rebuild_abstract(w.get("abstract_inverted_index")) if w else None
            cache[name] = {"abstract": ab, "match": how, "openalex": w.get("id") if w else None}
            print(f"[{i}/{len(todo)}] {'OK ' if ab else '-- '} {name[:70]}")
        except Exception as e:  # reseau coupe, quota... : on garde ce qu'on a deja
            print(f"[{i}/{len(todo)}] erreur {name[:50]}: {e}")
        time.sleep(0.15)
        C.ABSTRACTS_FILE.parent.mkdir(parents=True, exist_ok=True)
        C.ABSTRACTS_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{sum(1 for v in cache.values() if v['abstract'])}/{len(cache)} publications avec abstract")


if __name__ == "__main__":
    main()
