"""Un seul point d'entree :  python run.py
1) verifie la cle LLM  2) enrichit les publications (si internet)  3) construit l'index si absent  4) lance l'API."""
import os
import sys

import uvicorn

import config as C


def main():
    first = C.LLM_PROVIDER.split(",")[0].strip()
    if first == "groq" and not os.getenv("GROQ_API_KEY") and "ollama" not in C.LLM_PROVIDER:
        sys.exit("GROQ_API_KEY manquante : cle gratuite sur https://console.groq.com")
    if first == "anthropic" and not os.getenv("ANTHROPIC_API_KEY"):
        sys.exit("ANTHROPIC_API_KEY manquante.")
    if first == "groq" and not os.getenv("GROQ_API_KEY"):
        print("! GROQ_API_KEY absente : bascule sur Ollama (doit tourner en local).")
    if not C.ABSTRACTS_FILE.exists():
        try:
            import enrich
            enrich.main()
        except Exception as e:
            print(f"(enrichissement ignore : {e})")
    # api.py construit l'index tout seul s'il n'existe pas (python build_index.py pour le forcer apres un ajout)
    uvicorn.run("api:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    main()
