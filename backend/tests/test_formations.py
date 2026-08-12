async def test_list_formations(client, seeded_formation):
    response = await client.get("/api/formations")
    assert response.status_code == 200
    titres = [f["titre"] for f in response.json()]
    assert "Formation de test" in titres


async def test_filter_by_filiere(client, seeded_formation):
    response = await client.get("/api/formations", params={"filiere": "Langues"})
    assert response.status_code == 200
    assert len(response.json()) == 1

    response = await client.get("/api/formations", params={"filiere": "Robotique"})
    assert response.json() == []


async def test_filter_by_age_range(client, seeded_formation):
    response = await client.get("/api/formations", params={"age": 10})
    assert response.json() == []

    response = await client.get("/api/formations", params={"age": 25})
    assert len(response.json()) == 1


async def test_get_formation_by_id(client, seeded_formation):
    response = await client.get(f"/api/formations/{seeded_formation['_id']}")
    assert response.status_code == 200
    assert response.json()["titre"] == "Formation de test"


async def test_get_formation_not_found(client):
    response = await client.get("/api/formations/000000000000000000000000")
    assert response.status_code == 404
