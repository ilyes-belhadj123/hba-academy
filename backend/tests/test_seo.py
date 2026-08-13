async def test_robots_disallows_everything(client):
    response = await client.get("/robots.txt")
    assert response.status_code == 200
    assert "Disallow: /" in response.text


async def test_sitemap_includes_static_and_formation_urls(client, seeded_formation):
    response = await client.get("/sitemap.xml")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/xml")
    assert "<urlset" in response.text
    assert f"/formations/{seeded_formation['_id']}" in response.text
