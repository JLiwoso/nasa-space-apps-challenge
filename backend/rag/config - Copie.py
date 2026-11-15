"""Configuration unique du RAG. Tout se change ici ou par variables d'environnement."""
import os
from pathlib import Path

# Racine du projet (le dossier qui contient "docs and datas" et "backend")
ROOT = Path(os.getenv("PROJECT_ROOT", Path(__file__).resolve().parent.parent))
DATA = ROOT / "docs and datas"

CHUNKS_IN = DATA / "index" / "chunks.json"                      # chunks PDF + web existants
PSI_DIR = DATA / "investigations informations" / "psi datasets"  # psi-XX.json
PDF_DIRS = [                                                     # ou chercher les PDF pour les servir
    DATA / "informations in pdf",
    DATA / "investigations informations" / "achieved experiments in pdf",
]
INDEX_DIR = DATA / "index"
CHUNKS_OUT = INDEX_DIR / "chunks_all.json"   # chunks unifies (avec champ url)
VECTORS_OUT = INDEX_DIR / "vectors_all.npy"
LINKS_FILE = Path(__file__).parent / "source_links.json"

# --- Embeddings : anglais (questions EN, documents EN), 384 dimensions, leger (CPU ok)
EMBED_MODEL = os.getenv("EMBED_MODEL", "BAAI/bge-small-en-v1.5")

# --- LLM : liste ordonnee de fournisseurs, le suivant prend le relais si le precedent echoue.
#   "groq"      : gratuit (cle gratuite sur console.groq.com), rapide, aucun GPU requis
#   "ollama"    : gratuit, 100% local (necessite un PC assez puissant)
#   "anthropic" : payant (API Claude)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq,ollama")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
ANTHROPIC_MODEL = os.getenv("LLM_MODEL", "claude-haiku-5-5")     # ou claude-sonnet-5-5 pour plus de qualite
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b-instruct")

# --- Recherche
TOP_K = int(os.getenv("TOP_K", 5))
MAX_CHUNK_CHARS = int(os.getenv("MAX_CHUNK_CHARS", 1000))  # garde le prompt petit (limites du palier gratuit)
MIN_SCORE = float(os.getenv("MIN_SCORE", 0.0))   # a monter (ex. 0.5 avec bge) si trop de bruit

# URL publique de ton backend, pour que les liens PDF soient cliquables depuis le front
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000")

# --- Fichiers generes
ABSTRACTS_FILE = INDEX_DIR / "abstracts_cache.json"     # resumes d'articles (OpenAlex)
INVESTIGATIONS_OUT = INDEX_DIR / "investigations.json"  # liste pour le front (endpoint /investigations)
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "")          # optionnel : "polite pool" d'OpenAlex (plus rapide)
API_KEY = os.getenv("API_KEY", "")                      # optionnel : si defini, le front doit envoyer l'en-tete X-API-Key
