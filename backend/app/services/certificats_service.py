import io
import secrets
from datetime import datetime, timezone

import qrcode
from bson import ObjectId
from bson.errors import InvalidId
from fpdf import FPDF
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.services.storage_service import get_storage


_CHAR_REPLACEMENTS = {
    "—": "-",
    "–": "-",
    "’": "'",
    "‘": "'",
    "“": '"',
    "”": '"',
    "…": "...",
}


def _pdf_safe(text: str) -> str:
    for original, replacement in _CHAR_REPLACEMENTS.items():
        text = text.replace(original, replacement)
    return text.encode("latin-1", errors="replace").decode("latin-1")


def _mask_name(nom: str) -> str:
    parts = nom.split()
    if len(parts) <= 1:
        return nom
    return parts[0] + " " + " ".join(f"{p[0]}." for p in parts[1:])


def _build_pdf(nom: str, formation_titre: str, date_emission: datetime, verification_url: str) -> bytes:
    nom = _pdf_safe(nom)
    formation_titre = _pdf_safe(formation_titre)
    qr_image = qrcode.make(verification_url)
    qr_buffer = io.BytesIO()
    qr_image.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    pdf = FPDF(orientation="L", unit="mm", format="A4")
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 26)
    pdf.ln(20)
    pdf.cell(0, 15, "Certificat de réussite", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 16)
    pdf.ln(10)
    pdf.cell(0, 10, "HBA Academy certifie que", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 12, nom, align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 16)
    pdf.cell(0, 10, "a suivi avec succès la formation", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 12, formation_titre, align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 10, f"Délivré le {date_emission.strftime('%d/%m/%Y')}", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.image(qr_buffer, x=250, y=15, w=30)

    return bytes(pdf.output())


async def generer_certificat(db: AsyncIOMotorDatabase, user_id: str, formation_id: str) -> dict:
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    formation = await db.formations.find_one({"_id": ObjectId(formation_id)})
    if user is None or formation is None:
        raise ValueError("Apprenant ou formation introuvable")

    settings = get_settings()
    code_verification = secrets.token_hex(6)
    date_emission = datetime.now(timezone.utc)
    verification_url = f"{settings.frontend_base_url}/certificats/verifier/{code_verification}"

    pdf_bytes = _build_pdf(user["nom"], formation["titre"], date_emission, verification_url)

    storage = get_storage()
    url_pdf = await storage.save(pdf_bytes, f"certificat-{code_verification}.pdf", "application/pdf")

    document = {
        "user_id": user_id,
        "formation_id": formation_id,
        "date_emission": date_emission,
        "code_verification": code_verification,
        "url_pdf": url_pdf,
    }
    result = await db.certificats.insert_one(document)
    document["_id"] = str(result.inserted_id)
    return document


async def list_certificats_for_apprenant(db: AsyncIOMotorDatabase, user_id: str) -> list[dict]:
    cursor = db.certificats.find({"user_id": user_id}).sort("date_emission", -1)
    certificats = await cursor.to_list(length=None)
    for certificat in certificats:
        certificat["_id"] = str(certificat["_id"])
    return certificats


async def verifier_certificat(db: AsyncIOMotorDatabase, code: str) -> dict:
    certificat = await db.certificats.find_one({"code_verification": code})
    if certificat is None:
        return {"valide": False}

    try:
        user_id = ObjectId(certificat["user_id"])
        formation_id = ObjectId(certificat["formation_id"])
    except InvalidId:
        return {"valide": False}

    user = await db.users.find_one({"_id": user_id})
    formation = await db.formations.find_one({"_id": formation_id})
    if user is None or formation is None:
        return {"valide": False}

    return {
        "valide": True,
        "nom_affiche": _mask_name(user["nom"]),
        "formation_titre": formation["titre"],
        "date_emission": certificat["date_emission"].date(),
    }
