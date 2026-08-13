from xml.sax.saxutils import escape

from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse, Response
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.db.mongodb import get_db
from app.services import formateurs_service, formations_service

router = APIRouter(tags=["seo"])

STATIC_PATHS = [
    "",
    "catalogue",
    "formateurs",
    "preuves-sociales",
    "realisations",
    "orientation",
    "mentions-legales",
    "politique-confidentialite",
    "conditions-generales",
]


def _url_entry(loc: str) -> str:
    return f"  <url>\n    <loc>{escape(loc)}</loc>\n  </url>\n"


@router.get("/sitemap.xml")
async def get_sitemap(db: AsyncIOMotorDatabase = Depends(get_db)) -> Response:
    settings = get_settings()
    base = settings.frontend_base_url.rstrip("/")

    entries = [_url_entry(f"{base}/{path}" if path else base) for path in STATIC_PATHS]

    formations = await formations_service.list_formations(db)
    entries += [_url_entry(f"{base}/formations/{formation['_id']}") for formation in formations]

    formateurs = await formateurs_service.list_formateurs(db)
    entries += [_url_entry(f"{base}/formateurs/{formateur['_id']}") for formateur in formateurs]

    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(entries)
        + "</urlset>\n"
    )
    return Response(content=body, media_type="application/xml")


@router.get("/robots.txt")
async def get_robots() -> Response:
    # Ce endpoint sert le robots.txt du domaine API lui-même (non destiné à
    # l'indexation) : le robots.txt de la vitrine vit dans frontend/public.
    return PlainTextResponse(content="User-agent: *\nDisallow: /\n")
