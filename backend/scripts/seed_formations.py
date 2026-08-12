"""Peuple la collection `formations` avec des données d'exemple pour le développement.

Ce ne sont PAS des formations réelles de HBA Academy : à remplacer par le contenu
réel de l'équipe HBA via le backoffice (HBA-018) avant toute mise en production.

Usage : python scripts/seed_formations.py
"""

import asyncio
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.config import get_settings
from app.db.mongodb import close_mongo_connection, connect_to_mongo, get_database

EXAMPLE_FORMATIONS = [
    {
        "filiere": "Langues",
        "titre": "Anglais général — Niveau A2/B1",
        "description": "Formation d'exemple : renforcement des compétences orales et écrites en anglais courant.",
        "prerequis": "Aucun",
        "duree": "8 semaines",
        "age_min": 16,
        "age_max": 99,
        "prix": 350.0,
        "niveau": "debutant",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": ["Communication orale", "Compréhension écrite"],
    },
    {
        "filiere": "Langues",
        "titre": "Préparation entretiens — Anglais professionnel",
        "description": "Formation d'exemple : mise en situation d'entretiens pour dossiers d'émigration ou d'emploi.",
        "prerequis": "Niveau B1 minimum",
        "duree": "4 semaines",
        "age_min": 18,
        "age_max": 99,
        "prix": 280.0,
        "niveau": "intermediaire",
        "mode": "en_ligne",
        "medias": [],
        "badges_competences": ["Entretien professionnel", "Expression orale"],
    },
    {
        "filiere": "Bureautique & Informatique",
        "titre": "Pack Office — Excel, Word, PowerPoint",
        "description": "Formation d'exemple : maîtrise des outils bureautiques essentiels en contexte professionnel.",
        "prerequis": "Aucun",
        "duree": "6 semaines",
        "age_min": 16,
        "age_max": 99,
        "prix": 300.0,
        "niveau": "debutant",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": ["Excel", "Word", "PowerPoint"],
    },
    {
        "filiere": "Bureautique & Informatique",
        "titre": "Introduction au développement web",
        "description": "Formation d'exemple : bases HTML/CSS/JavaScript pour démarrer une reconversion vers le web.",
        "prerequis": "Notions de base en informatique",
        "duree": "10 semaines",
        "age_min": 18,
        "age_max": 99,
        "prix": 600.0,
        "niveau": "intermediaire",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": ["HTML/CSS", "JavaScript"],
    },
    {
        "filiere": "Développement personnel & Coaching",
        "titre": "Communication et confiance en soi",
        "description": "Formation d'exemple : ateliers pratiques pour renforcer la prise de parole et la confiance en soi.",
        "prerequis": "Aucun",
        "duree": "3 semaines",
        "age_min": 16,
        "age_max": 99,
        "prix": 220.0,
        "niveau": "debutant",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": ["Prise de parole", "Gestion du stress"],
    },
    {
        "filiere": "Développement personnel & Coaching",
        "titre": "Coaching reconversion professionnelle",
        "description": "Formation d'exemple : accompagnement méthodologique pour un projet de reconversion.",
        "prerequis": "Aucun",
        "duree": "4 semaines",
        "age_min": 22,
        "age_max": 99,
        "prix": 400.0,
        "niveau": "intermediaire",
        "mode": "en_ligne",
        "medias": [],
        "badges_competences": ["Projet professionnel", "Bilan de compétences"],
    },
    {
        "filiere": "Robotique & Programmation IA (jeunes)",
        "titre": "Initiation à la robotique — 10/13 ans",
        "description": "Formation d'exemple : découverte ludique de la robotique et de la programmation par blocs.",
        "prerequis": "Aucun",
        "duree": "8 semaines",
        "age_min": 10,
        "age_max": 13,
        "prix": 320.0,
        "niveau": "debutant",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": ["Robotique de base", "Logique de programmation"],
    },
    {
        "filiere": "Robotique & Programmation IA (jeunes)",
        "titre": "Programmation Python & IA — 14/17 ans",
        "description": "Formation d'exemple : introduction à Python et aux concepts de base de l'intelligence artificielle.",
        "prerequis": "Notions de robotique recommandées",
        "duree": "12 semaines",
        "age_min": 14,
        "age_max": 17,
        "prix": 450.0,
        "niveau": "intermediaire",
        "mode": "presentiel",
        "medias": [],
        "badges_competences": ["Python", "Notions d'IA"],
    },
]


def _build_sessions(formation_id, now: datetime) -> list[dict]:
    return [
        {
            "formation_id": str(formation_id),
            "date_debut": now + timedelta(days=14),
            "date_fin": now + timedelta(days=70),
            "capacite_max": 15,
            "places_prises": 6,
            "formateur_id": None,
        },
        {
            "formation_id": str(formation_id),
            "date_debut": now + timedelta(days=45),
            "date_fin": now + timedelta(days=101),
            "capacite_max": 10,
            "places_prises": 10,
            "formateur_id": None,
        },
    ]


def _build_temoignages(formation_id) -> list[dict]:
    return [
        {
            "formation_id": str(formation_id),
            "auteur": "Ancien apprenant",
            "contenu": "Formation d'exemple : contenu clair et formateur disponible.",
            "media": [],
            "statut_publication": "publie",
        },
        {
            "formation_id": str(formation_id),
            "auteur": "Apprenant (avis en cours de validation)",
            "contenu": "Témoignage d'exemple en attente de publication par l'équipe HBA.",
            "media": [],
            "statut_publication": "brouillon",
        },
    ]


def _build_formateurs(sample_ids: list) -> list[dict]:
    return [
        {
            "nom": "Formateur d'exemple A",
            "photo": None,
            "filieres": ["Langues"],
            "bio": "Bio d'exemple : parcours et pédagogie à compléter par l'équipe HBA via le backoffice.",
            "experiences_professionnelles": ["Exemple : 5 ans d'enseignement des langues"],
            "certifications": ["Exemple : certification pédagogique"],
            "formations_dispensees": [str(sample_ids[0])],
            "temoignages_specifiques": [],
        },
        {
            "nom": "Formateur d'exemple B",
            "photo": None,
            "filieres": ["Langues", "Développement personnel & Coaching"],
            "bio": "Bio d'exemple : parcours et pédagogie à compléter par l'équipe HBA via le backoffice.",
            "experiences_professionnelles": ["Exemple : 8 ans de coaching professionnel"],
            "certifications": ["Exemple : certification coaching"],
            "formations_dispensees": [str(sample_ids[0]), str(sample_ids[1])],
            "temoignages_specifiques": [],
        },
    ]


async def seed() -> None:
    settings = get_settings()
    connect_to_mongo()
    db = get_database()
    now = datetime.now(timezone.utc)

    await db.formations.delete_many({})
    await db.sessions.delete_many({})
    await db.temoignages.delete_many({})
    await db.formateurs.delete_many({})

    result = await db.formations.insert_many(EXAMPLE_FORMATIONS)
    print(f"{len(result.inserted_ids)} formations d'exemple insérées dans '{settings.mongodb_db_name}'.")

    # Sessions, témoignages et formateurs d'exemple pour les deux premières formations
    # seulement, pour illustrer les fonctionnalités sans avoir à peupler tout le catalogue.
    sample_ids = result.inserted_ids[:2]
    sessions = [session for formation_id in sample_ids for session in _build_sessions(formation_id, now)]
    temoignages = [t for formation_id in sample_ids for t in _build_temoignages(formation_id)]
    formateurs = _build_formateurs(sample_ids)

    await db.sessions.insert_many(sessions)
    await db.temoignages.insert_many(temoignages)
    await db.formateurs.insert_many(formateurs)
    print(
        f"{len(sessions)} sessions, {len(temoignages)} témoignages et "
        f"{len(formateurs)} formateurs d'exemple insérés."
    )

    close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(seed())
