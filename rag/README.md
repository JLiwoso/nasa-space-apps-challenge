# NASA PSI RAG - backend pret a brancher

    pip install -r requirements.txt
    export GROQ_API_KEY=gsk_...          # cle GRATUITE : console.groq.com  (ou rien + Ollama en local)
    python run.py                        # http://localhost:8000  (docs interactives : /docs)

Premier lancement : telechargement du modele d'embeddings + construction de l'index (quelques minutes).
Apres ajout de PDF / psi-XX.json : `python build_index.py` (puis relancer).

## Contrat pour le frontend

### POST /ask
Requete :
    { "question": "Which experiments studied flame spread on PMMA?",
      "history": [ {"role":"user","content":"..."}, {"role":"assistant","content":"..."} ] }   // history optionnel
Reponse :
    { "answer": "Text with citations like [1] and [3] ...",
      "sources": [ { "n":1, "cited":true, "type":"psi_resource|psi|pdf|web",
                     "title":"...", "page":3|null, "url":"https://...", "score":0.81, "snippet":"..." } ] }
Affichage conseille : texte de `answer`, `[n]` cliquable -> `sources[n-1].url`, puis liste des sources
(les `cited:true` en premier). Les `url` pdf s'ouvrent directement a la bonne page.

### GET /investigations
Liste pour une page "Browse" : id, name, url (page PSI), doi_url, size, platform, license, contacts,
publications[{title,url,category}].

### GET /health        -> {"ready":true,"chunks":N,...}
### GET /pdf/{fichier}  -> le PDF (utilise par les liens de sources)

Option : `API_KEY=xxx` cote serveur -> le front envoie l'en-tete `X-API-Key: xxx`.
Prod : `PUBLIC_BASE_URL=https://ton-domaine` pour que les liens PDF soient corrects, et restreindre CORS dans api.py.

### Exemple JS
    const r = await fetch(`${API}/ask`, {method:"POST", headers:{"Content-Type":"application/json"},
                          body: JSON.stringify({question, history})});
    const {answer, sources} = await r.json();
