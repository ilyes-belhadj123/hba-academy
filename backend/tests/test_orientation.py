async def test_recommandation_uses_fallback_and_matches_catalogue(client, seeded_formation):
    response = await client.post(
        "/api/orientation/recommander",
        json={
            "objectif": "jeune_adulte",
            "filiere_cible": "Langues",
            "niveau": "debutant",
            "mode": "presentiel",
            "age": None,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "regles"
    assert data["formation_principale"]["_id"] == seeded_formation["_id"]


async def test_recommandation_logs_simulation(client, db, seeded_formation):
    await client.post(
        "/api/orientation/recommander",
        json={
            "objectif": "jeune_adulte",
            "filiere_cible": "Langues",
            "niveau": "debutant",
            "mode": "presentiel",
            "age": None,
        },
    )
    logs = await db.simulateur_logs.count_documents({})
    assert logs == 1
