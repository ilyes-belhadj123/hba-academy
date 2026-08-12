import asyncio


async def test_preinscription_success(client, seeded_session):
    response = await client.post(
        "/api/preinscriptions",
        json={
            "session_id": seeded_session["_id"],
            "nom": "Jane Doe",
            "email": "jane.doe@example.com",
            "telephone": "+21600000000",
            "mineur": False,
            "consentement_parental": False,
        },
    )
    assert response.status_code == 201
    assert response.json()["statut"] == "en_attente"


async def test_preinscription_rejects_full_session(client, seeded_session):
    payload = {
        "session_id": seeded_session["_id"],
        "nom": "Jane Doe",
        "email": "jane.doe@example.com",
        "telephone": "+21600000000",
        "mineur": False,
        "consentement_parental": False,
    }
    first = await client.post("/api/preinscriptions", json=payload)
    assert first.status_code == 201

    second = await client.post("/api/preinscriptions", json=payload)
    assert second.status_code == 409


async def test_preinscription_mineur_requires_consent(client, seeded_session):
    response = await client.post(
        "/api/preinscriptions",
        json={
            "session_id": seeded_session["_id"],
            "nom": "Jane Doe",
            "email": "jane.doe@example.com",
            "telephone": "+21600000000",
            "mineur": True,
            "consentement_parental": False,
        },
    )
    assert response.status_code == 400


async def test_preinscription_mineur_with_consent_succeeds(client, seeded_session):
    response = await client.post(
        "/api/preinscriptions",
        json={
            "session_id": seeded_session["_id"],
            "nom": "Jane Doe",
            "email": "jane.doe@example.com",
            "telephone": "+21600000000",
            "mineur": True,
            "consentement_parental": True,
        },
    )
    assert response.status_code == 201


async def test_preinscription_simultaneous_never_overbooks(client, db, seeded_formation):
    session = {
        "formation_id": seeded_formation["_id"],
        "capacite_max": 1,
        "places_prises": 0,
        "formateur_id": None,
    }
    from datetime import datetime

    session["date_debut"] = datetime(2027, 1, 1)
    session["date_fin"] = datetime(2027, 2, 1)
    result = await db.sessions.insert_one(session)
    session_id = str(result.inserted_id)

    def make_payload(i):
        return {
            "session_id": session_id,
            "nom": f"Visiteur {i}",
            "email": f"visiteur{i}@example.com",
            "telephone": "+21600000000",
            "mineur": False,
            "consentement_parental": False,
        }

    responses = await asyncio.gather(
        *[client.post("/api/preinscriptions", json=make_payload(i)) for i in range(5)]
    )
    statuses = sorted(r.status_code for r in responses)
    assert statuses == [201, 409, 409, 409, 409]

    final_session = await db.sessions.find_one({"_id": result.inserted_id})
    assert final_session["places_prises"] == 1
