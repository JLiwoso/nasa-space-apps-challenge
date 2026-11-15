"""Collecte les 24 investigations NASA PSI (Combustion Science) et crée un JSON par investigation.

Le script suit la mission : 24 identifiants fixes, aucune information inventée (un champ
introuvable reste à null et est signalé dans "collection_notes"), aucun téléchargement de
jeu de données : seulement des références (titres, liens, tailles, métadonnées).
Tout le contenu écrit par le script dans les JSON est en anglais.

Installation (une fois) :
    python -m pip install playwright

Utilisation :
    python psi_collect.py --only PSI-117   # test sur une seule investigation
    python psi_collect.py                  # les 24 investigations + vérification
    python psi_collect.py --check-urls     # vérifie aussi chaque URL enregistrée (requête HEAD)
    python psi_collect.py --debug          # sauvegarde aussi les pages brutes dans "psi raw"
                                           # (seulement pour corriger l'extraction si besoin)

Par défaut le script pilote Microsoft Edge déjà installé sur ton PC (aucun téléchargement).
Autres navigateurs : --browser chrome ou --browser chromium.

Résultat :
    psi datasets/psi-117.json ...   les 24 fichiers JSON
La vérification finale s'affiche dans le terminal.
"""

import argparse
import json
import os
import re
import time
import urllib.request
from urllib.parse import urlparse

IDS = [
    "PSI-117", "PSI-59", "PSI-10", "PSI-62", "PSI-60", "PSI-142", "PSI-101", "PSI-115",
    "PSI-98", "PSI-39", "PSI-102", "PSI-106", "PSI-99", "PSI-107", "PSI-100", "PSI-21",
    "PSI-25", "PSI-20", "PSI-68", "PSI-22", "PSI-23", "PSI-69", "PSI-26", "PSI-47",
]

URL_TEMPLATE = "https://psi.nasa.gov/physci/repo/data/investigations/{id}"
OUT_DIR = "psi datasets"
RAW_DIR = "psi raw"

# Sections (panneaux) de la page, dans leur ordre d'affichage
SECTIONS = [
    "Description", "Experimental Table", "Modeling Table", "Read Me", "Hardware",
    "Representative Images/Videos", "Data files and documents", "Publications",
    "Version History",
]
TYPES_DONNEES = {"investigation", "hardware", "dataset", "data set", "publication"}
ARRETS_DESCRIPTION = {
    "project", "objectives", "approach", "hypothesis", "research impacts/earth benefits",
    "contact(s)",
}
COLONNES_AUTRES_TABLEAUX = {
    "file/directory name", "size", "date added", "view content", "identifier",
}
# Noms d'icônes (Material Icons) que innerText peut renvoyer comme du texte
ICONES = {
    "info", "folder", "folder_open", "description", "menu", "search", "share", "download",
    "notifications", "visibility", "close", "image", "book", "chevron_left", "chevron_right",
    "expand_more", "expand_less", "arrow_drop_down", "mail", "email", "cloud_download",
    "table_chart", "menu_book", "library_books", "computer", "insert_drive_file",
}
SIZE_RE = re.compile(r"^\d+(?:[.,]\d+)?\s?(?:bytes|B|KB|kB|MB|GB|TB)$")
DATE_RE = re.compile(r"^\d{1,2}-[A-Za-z]{3}-\d{4}$")
EXT_RE = re.compile(r"\.([A-Za-z0-9]{2,5})$")

# Extrait de la page rendue : texte, liens, images/vidéos de la section Representative, en-têtes de tableaux
JS_EXTRACTION = """
() => {
  const racine = document.body;
  const meta = document.querySelector('meta[name="description"]');
  const sortie = {
    doc_title: document.title || '',
    meta_description: meta ? meta.content : null,
    text: racine.innerText,
    links: [], media: [], headers: []
  };
  racine.querySelectorAll('a[href]').forEach(a => {
    sortie.links.push({text: a.innerText.trim(), href: a.href});
  });
  const dernier = (texte) => {
    const tous = [...document.querySelectorAll('body *')].filter(
      e => e.children.length === 0 && e.innerText && e.innerText.trim() === texte);
    return tous.length ? tous[tous.length - 1] : null;
  };
  const debut = dernier('Representative Images/Videos');
  const fin = dernier('Data files and documents');
  if (debut) {
    racine.querySelectorAll('img, video').forEach(m => {
      if (!(debut.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      if (fin && !(fin.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_PRECEDING)) return;
      if (m.tagName === 'IMG') {
        if (m.naturalWidth < 150 && m.width < 150) return;
        sortie.media.push({tag: 'img', src: m.currentSrc || m.src, alt: m.alt || ''});
      } else {
        const s = m.currentSrc || m.src || (m.querySelector('source') ? m.querySelector('source').src : '');
        sortie.media.push({tag: 'video', src: s, alt: m.title || ''});
      }
    });
  }
  racine.querySelectorAll('th, [role="columnheader"], [class*="header-cell"]').forEach(h => {
    const t = h.innerText.trim();
    if (t) sortie.headers.push(t);
  });
  return sortie;
}
"""


# ---------------------------------------------------------------
# Phase 1 : collecte (navigateur)
# ---------------------------------------------------------------
def collecter(context, psi_id, template, debug=False):
    """Ouvre la fiche et renvoie (meta, data). Les pages brutes ne sont sauvegardées qu'avec --debug."""
    url = template.format(id=psi_id)
    dossier = os.path.join(RAW_DIR, psi_id.lower())
    if debug:
        os.makedirs(dossier, exist_ok=True)

    reponses_json = []
    meta = {"id": psi_id, "url": url, "status": None, "error": None}
    page = context.new_page()

    def sur_reponse(reponse):
        try:
            type_contenu = reponse.headers.get("content-type") or ""
            if "json" in type_contenu and reponse.status == 200:
                reponses_json.append({"url": reponse.url, "body": reponse.json()})
        except Exception:
            pass

    page.on("response", sur_reponse)
    data = None
    try:
        reponse = page.goto(url, wait_until="domcontentloaded", timeout=60000)
        meta["status"] = reponse.status if reponse else None
        # La page est construite par JavaScript : on attend que le contenu apparaisse
        try:
            page.wait_for_function(
                "document.body && document.body.innerText.includes('Data files and documents')",
                timeout=45000,
            )
        except Exception:
            pass
        page.wait_for_timeout(2500)
        data = page.evaluate(JS_EXTRACTION)
        if debug:
            with open(os.path.join(dossier, "page.html"), "w", encoding="utf-8") as f:
                f.write(page.content())
            with open(os.path.join(dossier, "text.txt"), "w", encoding="utf-8") as f:
                f.write(data["text"])
        if meta["status"] and meta["status"] >= 400:
            meta["error"] = f"HTTP {meta['status']}"
    except Exception as erreur:
        meta["error"] = str(erreur).splitlines()[0][:200]
    finally:
        page.close()

    meta["api_urls"] = [e["url"] for e in reponses_json]

    if debug:
        for n, element in enumerate(reponses_json, start=1):
            with open(os.path.join(dossier, f"api_{n}.json"), "w", encoding="utf-8") as f:
                json.dump(element, f, ensure_ascii=False, indent=2)
        with open(os.path.join(dossier, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        if data is not None:
            with open(os.path.join(dossier, "data.json"), "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
    return meta, data


# ---------------------------------------------------------------
# Phase 2 : lecture du texte de la page
# ---------------------------------------------------------------
def nettoyer(texte):
    lignes = []
    for ligne in texte.splitlines():
        ligne = ligne.replace("\xa0", " ").rstrip()
        if ligne.strip().lower() in ICONES and ligne.strip() == ligne.strip().lower():
            continue  # nom d'icône, pas du contenu
        lignes.append(ligne)
    return lignes


def valeur(lignes, label):
    """'Label : valeur' (ou 'Label<tab>valeur') sur une ligne, ou label seul suivi de sa valeur."""
    motif = re.compile(r"^%s\s*(?::|\t)\s*(.+)$" % re.escape(label), re.I)
    for i, ligne in enumerate(lignes):
        texte = ligne.strip()
        trouve = motif.match(texte)
        if trouve:
            return trouve.group(1).strip()
        if texte.lower().rstrip(":").strip() == label.lower():
            for suivante in lignes[i + 1 : i + 4]:
                if suivante.strip():
                    return suivante.strip()
    return None


def bloc(lignes, titre, arrets):
    """Texte qui suit un sous-titre, jusqu'au sous-titre suivant."""
    for i, ligne in enumerate(lignes):
        if ligne.strip().lower().rstrip(":") == titre.lower():
            sortie = []
            for suivante in lignes[i + 1 :]:
                texte = suivante.strip()
                if not texte:
                    continue
                if texte.lower().rstrip(":") in arrets:
                    break
                sortie.append(texte)
            if sortie:
                return "\n".join(sortie)[:5000]
    return None


def decouper_sections(lignes):
    """Sépare l'en-tête de la fiche et ses sections (Description, Hardware, ...)."""
    debut = None
    for i, ligne in enumerate(lignes):
        if ligne.strip().lower().startswith("cite this investigation"):
            debut = i + 1
            break
    if debut is None:
        for i, ligne in enumerate(lignes):
            if ligne.strip().lower().startswith(("initial release date", "license")):
                debut = i + 1
        debut = debut or 0

    positions, courant = {}, debut
    for nom in SECTIONS:
        for i in range(courant, len(lignes)):
            if lignes[i].strip().lower() == nom.lower():
                positions[nom] = i
                courant = i + 1
                break
    noms = [n for n in SECTIONS if n in positions]
    sections = {}
    for k, nom in enumerate(noms):
        fin = positions[noms[k + 1]] if k + 1 < len(noms) else len(lignes)
        sections[nom] = lignes[positions[nom] + 1 : fin]
    return lignes[:debut], sections


def lire_entete(entete):
    info = {}
    for i, ligne in enumerate(entete):
        trouve = re.match(r"^(PSI-\d+)(?:\s+Version\s+(\d+))?$", ligne.strip())
        if not trouve:
            continue
        info["id"] = trouve.group(1)
        if trouve.group(2):
            info["version"] = trouve.group(2)
        for suivante in [x.strip() for x in entete[i + 1 : i + 10] if x.strip()]:
            version = re.match(r"^Version\s+(\d+)$", suivante)
            if version:
                info["version"] = version.group(1)
            elif suivante.lower() in TYPES_DONNEES:
                info.setdefault("data_type", suivante)
            elif ":" not in suivante and "title" not in info and not SIZE_RE.match(suivante):
                info["title"] = suivante
        break
    for ligne in entete:
        if SIZE_RE.match(ligne.strip()):
            info["total_size"] = ligne.strip()
            break
    for cle, label in [
        ("submitted_date", "Submitted Date"),
        ("initial_release_date", "Initial Release Date"),
        ("doi", "DOI"),
        ("research_area", "Research Area"),
        ("sub_research_area", "SubResearch Area"),
        ("license", "License"),
    ]:
        info[cle] = valeur(entete, label)
    return info


def lien_par_texte(liens, texte):
    if not texte:
        return None
    for lien in liens:
        if (lien.get("text") or "").strip() == texte.strip() and (lien.get("href") or "").startswith("http"):
            return lien["href"]
    return None


def lire_versions(section):
    texte = "\n".join(c.strip() for l in section for c in l.split("\t") if c.strip())
    morceaux = re.split(r"(?m)^Version\s+(\d+)\s*$", texte)
    versions = []
    for k in range(1, len(morceaux), 2):
        corps = morceaux[k + 1]
        date = re.search(r"Updated Date:\s*([^\n]+)", corps)
        changes = re.search(r"Changes:\s*([^\n]+)", corps)
        fichiers = re.search(r"Files Added\s*\((\d[\d,]*)\)", corps)
        versions.append({
            "version": morceaux[k],
            "updated_date": date.group(1).strip() if date else None,
            "changes": changes.group(1).strip() if changes else None,
            "files_added": int(fichiers.group(1).replace(",", "")) if fichiers else None,
        })
    return versions


def lire_publications(section, liens):
    lignes = [l.strip() for l in section if l.strip()]
    publications = []
    for idx, ligne in enumerate(lignes):
        if not ligne.lower().startswith("authors"):
            continue
        titre = lignes[idx - 1] if idx > 0 else None
        auteurs = [re.sub(r"^authors\s*[:\t]\s*", "", ligne, flags=re.I)]
        j = idx + 1
        while j < len(lignes) and not lignes[j].lower().startswith("doi") and not (
            j + 1 < len(lignes) and lignes[j + 1].lower().startswith("authors")
        ):
            auteurs.append(lignes[j])
            j += 1
        doi = None
        if j < len(lignes) and lignes[j].lower().startswith("doi"):
            doi = re.sub(r"^doi\s*[:\t]?\s*", "", lignes[j], flags=re.I).strip() or None
        publications.append({
            "title": titre,
            "authors": " ".join(auteurs).strip(),
            "doi": doi,
            "url": lien_par_texte(liens, titre),
            "doi_url": lien_par_texte(liens, doi),
        })
    return publications


def lire_arbre(section):
    """Lignes (nom, taille, date) du tableau « Data files and documents », ou None s'il est introuvable."""
    debut = None
    for i, ligne in enumerate(section[:40]):
        if "view content" in ligne.lower():
            debut = i + 1
    if debut is None:
        return None
    lignes = [l.strip() for l in section[debut:] if l.strip()]
    entrees, i = [], 0
    while i < len(lignes):
        cellules = [c.strip() for c in lignes[i].split("\t") if c.strip()]
        i += 1
        if not cellules:
            continue
        nom, taille, date = cellules[0], None, None
        for cellule in cellules[1:]:
            if SIZE_RE.match(cellule):
                taille = cellule
            elif DATE_RE.match(cellule):
                date = cellule
        if len(cellules) == 1:  # cellules sur des lignes séparées
            for _ in range(3):
                if i < len(lignes) and SIZE_RE.match(lignes[i]) and taille is None:
                    taille, i = lignes[i], i + 1
                elif i < len(lignes) and DATE_RE.match(lignes[i]) and date is None:
                    date, i = lignes[i], i + 1
                else:
                    break
        entrees.append((nom, taille, date))
    return entrees


def ressource(name, category, fmt, url, size, downloadable, description):
    return {
        "name": name,
        "category": category,
        "format": fmt,
        "url": url,
        "file_size": size,
        "downloadable": downloadable,
        "description": description,
    }


# ---------------------------------------------------------------
# Phase 3 : construction du JSON d'une investigation
# ---------------------------------------------------------------
def fiche_vide(psi_id, url):
    return {
        "investigation_id": psi_id,
        "title": None,
        "source": "NASA PSI",
        "url": url,
        "discipline": "Combustion Science",
        "description": None,
        "investigation_type": None,
        "resources": [],
        "version": None,
        "data_type": None,
        "total_size": None,
        "submitted_date": None,
        "initial_release_date": None,
        "doi": None,
        "doi_url": None,
        "research_area": None,
        "sub_research_area": None,
        "license": None,
        "license_url": None,
        "project": {
            "project_type": None,
            "proposal_title": None,
            "flight_platform": None,
            "sponsoring_agency": None,
            "nasa_center": None,
        },
        "objectives": None,
        "hypothesis": None,
        "research_impacts_earth_benefits": None,
        "contacts": [],
        "experimental_table": {"available": None, "total_rows": None, "columns": []},
        "modeling_table_available": None,
        "read_me_available": None,
        "version_history": [],
        "collection_notes": [],
    }


def construire(psi_id, template, meta, data):
    url = template.format(id=psi_id)
    fiche = fiche_vide(psi_id, url)
    notes = fiche["collection_notes"]

    if data is None:
        notes.append(f"Page not accessible: {meta.get('error') or 'unknown reason'}")
        return fiche
    if meta.get("error"):
        notes.append(f"Error while loading the page: {meta['error']}")

    lignes = nettoyer(data["text"])
    liens = data.get("links", [])
    entete, sections = decouper_sections(lignes)
    if not sections:
        notes.append("Page layout not recognised: no section found (run with --debug to inspect the page)")

    # --- En-tête de la fiche
    info = lire_entete(entete)
    if info.get("id") and info["id"] != psi_id:
        notes.append(f"The page shows a different identifier: {info['id']}")
    fiche["title"] = info.get("title")
    if not fiche["title"]:
        notes.append("Title not found")
    for cle in ["version", "data_type", "total_size", "submitted_date", "initial_release_date",
                "doi", "research_area", "sub_research_area", "license"]:
        fiche[cle] = info.get(cle)
    fiche["doi_url"] = lien_par_texte(liens, fiche["doi"])
    fiche["license_url"] = lien_par_texte(liens, fiche["license"])
    if fiche["research_area"]:
        fiche["discipline"] = fiche["research_area"]

    # --- Description
    description = sections.get("Description", [])
    for cle, label in [
        ("project_type", "Project Type"),
        ("proposal_title", "Proposal Title"),
        ("flight_platform", "Flight Platform"),
        ("sponsoring_agency", "Sponsoring Agency"),
        ("nasa_center", "NASA Center"),
    ]:
        fiche["project"][cle] = valeur(description, label)
    fiche["investigation_type"] = fiche["project"]["project_type"]
    if not fiche["investigation_type"]:
        notes.append("Investigation type (Project Type) not found")

    fiche["objectives"] = bloc(description, "Objectives", ARRETS_DESCRIPTION)
    approche = bloc(description, "Approach", ARRETS_DESCRIPTION)
    fiche["hypothesis"] = bloc(description, "Hypothesis", ARRETS_DESCRIPTION)
    fiche["research_impacts_earth_benefits"] = bloc(
        description, "Research Impacts/Earth Benefits", ARRETS_DESCRIPTION
    )
    contacts = bloc(description, "Contact(s)", ARRETS_DESCRIPTION)
    if contacts:
        fiche["contacts"] = [c.strip() for c in re.split(r"[,\n]", contacts) if c.strip()]
    fiche["description"] = approche or fiche["objectives"]
    if not fiche["description"]:
        notes.append("Description (Approach/Objectives) not found")

    # --- Tableaux et Read Me
    experimental = sections.get("Experimental Table")
    if experimental is not None:
        texte_exp = "\n".join(experimental)
        fiche["experimental_table"]["available"] = "no associated" not in texte_exp.lower()
        lignes_total = re.search(r"of\s+(\d[\d,]*)", texte_exp)
        if lignes_total:
            fiche["experimental_table"]["total_rows"] = int(lignes_total.group(1).replace(",", ""))
        if fiche["experimental_table"]["available"]:
            colonnes = []
            for entete_col in data.get("headers", []):
                if entete_col.lower() not in COLONNES_AUTRES_TABLEAUX and entete_col not in colonnes:
                    colonnes.append(entete_col)
            fiche["experimental_table"]["columns"] = colonnes
    if "Modeling Table" in sections:
        fiche["modeling_table_available"] = "no associated" not in "\n".join(sections["Modeling Table"]).lower()
    if "Read Me" in sections:
        fiche["read_me_available"] = "no associated" not in "\n".join(sections["Read Me"]).lower()

    # --- Ressources : matériel (Hardware)
    for ligne in sections.get("Hardware", []):
        nom = ligne.strip()
        if not nom or nom.lower() in COLONNES_AUTRES_TABLEAUX:
            continue
        fiche["resources"].append(ressource(
            nom, "Hardware", None, lien_par_texte(liens, nom), None, False,
            "Hardware used by this investigation (reference to its PSI page)",
        ))

    # --- Ressources : images et vidéos représentatives
    lignes_media = [l.strip() for l in sections.get("Representative Images/Videos", []) if l.strip()]
    for media in data.get("media", []):
        src = media.get("src") or ""
        if not src.startswith("http"):
            continue
        ext = EXT_RE.search(urlparse(src).path)
        nom = media.get("alt") or (lignes_media[0] if len(data["media"]) == 1 and lignes_media else None)
        nom = nom or os.path.basename(urlparse(src).path) or src
        fiche["resources"].append(ressource(
            nom,
            "Audio/Video" if media.get("tag") == "video" else "Images",
            ext.group(1).upper() if ext else None,
            src, None, bool(ext), "Representative image or video shown on the investigation page",
        ))

    # --- Ressources : fichiers et dossiers (Data files and documents), en références seulement
    arbre = lire_arbre(sections["Data files and documents"]) if "Data files and documents" in sections else None
    if arbre is None:
        if "Data files and documents" in sections:
            notes.append("File tree of 'Data files and documents' not recognised")
    else:
        for nom, taille, date in arbre:
            if nom == psi_id:
                continue  # dossier racine
            ext = EXT_RE.search(nom)
            ajout = f" Added on {date}." if date else ""
            if ext:
                fiche["resources"].append(ressource(
                    nom, "Data files and documents", ext.group(1).upper(), url, taille, False,
                    "File listed in the 'Data files and documents' section of the investigation page." + ajout,
                ))
            else:
                fiche["resources"].append(ressource(
                    nom, nom, "folder", url, taille, False,
                    "Folder in the 'Data files and documents' section of the investigation page; "
                    "its contents are browsed online, not downloaded." + ajout,
                ))

    # --- Ressources : publications (références bibliographiques, non téléchargeables)
    for publication in lire_publications(sections.get("Publications", []), liens):
        detail = f"Authors: {publication['authors']}."
        if publication["doi"]:
            detail += f" DOI: {publication['doi']}."
        fiche["resources"].append(ressource(
            publication["title"], "Publications", None,
            publication["url"] or publication["doi_url"], None, False, detail,
        ))

    # --- Historique des versions
    fiche["version_history"] = lire_versions(sections.get("Version History", []))

    if not fiche["resources"]:
        notes.append("No resource detected (run with --debug to inspect the raw page)")
    return fiche


def lire_json(chemin):
    if not os.path.exists(chemin):
        return None
    with open(chemin, encoding="utf-8") as f:
        return json.load(f)


def construire_tous(ids, template, resultats):
    os.makedirs(OUT_DIR, exist_ok=True)
    for psi_id in ids:
        meta, data = resultats[psi_id]
        fiche = construire(psi_id, template, meta, data)
        with open(os.path.join(OUT_DIR, f"{psi_id.lower()}.json"), "w", encoding="utf-8") as f:
            json.dump(fiche, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------
# Vérification finale
# ---------------------------------------------------------------
def tester_url(url):
    try:
        requete = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(requete, timeout=20) as reponse:
            return str(reponse.status)
    except Exception as erreur:
        return f"ECHEC ({str(erreur)[:60]})"


def verifier(ids, template, verifier_urls):
    lignes = []
    problemes = 0
    categories_globales = {}

    presents = [i for i in ids if os.path.exists(os.path.join(OUT_DIR, f"{i.lower()}.json"))]
    lignes.append(f"1. Fichiers JSON présents : {len(presents)} / {len(ids)}")
    for manquant in sorted(set(ids) - set(presents)):
        lignes.append(f"   MANQUANT : {manquant}")
        problemes += 1

    lignes.append("\n2-3. Identifiant et syntaxe de chaque fichier :")
    for psi_id in presents:
        chemin = os.path.join(OUT_DIR, f"{psi_id.lower()}.json")
        try:
            fiche = lire_json(chemin)
        except Exception as erreur:
            lignes.append(f"   {psi_id} : JSON INVALIDE ({erreur})")
            problemes += 1
            continue
        etat = "ok"
        if fiche.get("investigation_id") != psi_id:
            etat = f"IDENTIFIANT INCORRECT ({fiche.get('investigation_id')})"
            problemes += 1
        if fiche.get("url") != template.format(id=psi_id):
            etat += " / URL de fiche différente"
        lignes.append(f"   {psi_id} : {etat}")

    lignes.append("\n4-5. Ressources par catégorie :")
    for psi_id in presents:
        fiche = lire_json(os.path.join(OUT_DIR, f"{psi_id.lower()}.json")) or {}
        compte = {}
        for res in fiche.get("resources", []):
            cle = res.get("category") or "(sans catégorie)"
            compte[cle] = compte.get(cle, 0) + 1
            categories_globales[cle] = categories_globales.get(cle, 0) + 1
        detail = ", ".join(f"{c} : {n}" for c, n in sorted(compte.items())) or "aucune ressource"
        lignes.append(f"   {psi_id} ({fiche.get('title') or 'titre manquant'}) -> {detail}")
        for note in fiche.get("collection_notes", []):
            lignes.append(f"      ! {note}")
        if verifier_urls:
            for res in fiche.get("resources", []):
                if not res.get("url"):
                    continue
                resultat = tester_url(res["url"])
                if not resultat.startswith("2"):
                    lignes.append(f"      URL {resultat} : {res['url']}")
                    problemes += 1

    lignes.append("\nTotal par catégorie : " + (", ".join(
        f"{c} : {n}" for c, n in sorted(categories_globales.items())) or "aucune ressource"))
    lignes.append(f"\nProblèmes bloquants : {problemes}")
    print("\n" + "\n".join(lignes))


# ---------------------------------------------------------------
# Programme principal
# ---------------------------------------------------------------
def main():
    parseur = argparse.ArgumentParser(description="Collecte des investigations NASA PSI")
    parseur.add_argument("--only", help="une seule investigation, par exemple PSI-117")
    parseur.add_argument("--check-urls", action="store_true", help="teste chaque URL (HEAD)")
    parseur.add_argument("--debug", action="store_true", help="sauvegarde aussi les pages brutes dans 'psi raw'")
    parseur.add_argument("--browser", default="msedge", choices=["msedge", "chrome", "chromium"])
    parseur.add_argument("--headed", action="store_true", help="affiche la fenêtre du navigateur")
    parseur.add_argument("--url-template", default=URL_TEMPLATE)
    args = parseur.parse_args()

    ids = IDS
    if args.only:
        ids = [args.only.upper()]
        if ids[0] not in IDS:
            parseur.error(f"{ids[0]} n'est pas dans la liste des 24 investigations")

    from playwright.sync_api import sync_playwright

    resultats = {}
    with sync_playwright() as p:
        options = {"headless": not args.headed}
        if args.browser != "chromium":
            options["channel"] = args.browser
        navigateur = p.chromium.launch(**options)
        contexte = navigateur.new_context()
        for n, psi_id in enumerate(ids, start=1):
            print(f"[{n}/{len(ids)}] {psi_id} ...")
            resultats[psi_id] = collecter(contexte, psi_id, args.url_template, args.debug)
            time.sleep(1)  # on ménage le site
        navigateur.close()

    construire_tous(ids, args.url_template, resultats)
    verifier(ids, args.url_template, args.check_urls)


if __name__ == "__main__":
    main()