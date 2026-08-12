async def test_escalade_keyword_triggers_escalade(client):
    response = await client.post(
        "/api/chatbot/message",
        json={
            "session_id": "test-session",
            "messages": [{"role": "user", "content": "Je veux parler à un conseiller humain"}],
        },
    )
    assert response.status_code == 200
    assert response.json()["escalade"] is True


async def test_escalade_not_sent_twice(client, db):
    payload = {
        "session_id": "test-session-2",
        "messages": [{"role": "user", "content": "Je veux parler à un conseiller humain"}],
    }
    await client.post("/api/chatbot/message", json=payload)
    await client.post("/api/chatbot/message", json=payload)

    conversation = await db.conversations_chatbot.find_one({"session_id": "test-session-2"})
    assert conversation["statut_escalade"] is True


async def test_conversation_persisted_without_pii_by_default(client, db):
    await client.post(
        "/api/chatbot/message",
        json={
            "session_id": "test-session-3",
            "messages": [{"role": "user", "content": "Bonjour, quelles formations proposez-vous ?"}],
        },
    )
    conversation = await db.conversations_chatbot.find_one({"session_id": "test-session-3"})
    assert conversation is not None
    assert conversation["qualification"]["email"] is None
