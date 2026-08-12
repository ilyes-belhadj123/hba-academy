import json


def extract_json_from_content(content: str) -> dict:
    """Certains modèles enveloppent leur JSON dans un bloc markdown (```json ... ```)
    même quand un format JSON strict est demandé : on nettoie avant de parser."""
    cleaned = content.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"Aucun objet JSON trouvé dans la réponse du modèle : {content!r}")
    return json.loads(cleaned[start : end + 1])
