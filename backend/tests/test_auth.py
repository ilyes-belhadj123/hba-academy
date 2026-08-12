async def test_login_success(client, admin_token):
    assert admin_token


async def test_login_wrong_password(client, admin_token):
    response = await client.post(
        "/api/auth/login", json={"email": "admin.test@example.com", "password": "wrong"}
    )
    assert response.status_code == 401


async def test_admin_endpoint_requires_auth(client):
    response = await client.get("/api/admin/leads")
    assert response.status_code == 401


async def test_admin_endpoint_rejects_wrong_role(client, db):
    from app.core.security import hash_password

    await db.users.insert_one(
        {
            "email": "apprenant.test@example.com",
            "nom": "Apprenant Test",
            "role": "apprenant",
            "password_hash": hash_password("TestPassword123"),
            "formations_suivies": [],
        }
    )
    login = await client.post(
        "/api/auth/login", json={"email": "apprenant.test@example.com", "password": "TestPassword123"}
    )
    token = login.json()["access_token"]

    response = await client.get("/api/admin/leads", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403


async def test_admin_endpoint_accepts_admin(client, admin_token):
    response = await client.get(
        "/api/admin/leads", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
