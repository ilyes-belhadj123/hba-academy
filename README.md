# HBA Connect

Plateforme commerciale & espace client — HBA Academy.

Stack : React 18 + TypeScript + Vite (frontend) · FastAPI + Python 3.12 (backend) · MongoDB · API Claude via OpenRouter · Azure.

Voir [HBA_Connect_Tickets_Backlog.md](./HBA_Connect_Tickets_Backlog.md) pour le détail des tickets.

## Démarrage local

### Avec Docker

```
docker compose up --build
```

- Frontend : http://localhost:5173
- Backend : http://localhost:8000 (santé : `/health`)
- MongoDB : localhost:27017

### Sans Docker

**Backend**

```
cd backend
python -m venv .venv
./.venv/Scripts/activate   # Windows
pip install -r requirements.txt
cp .env.example .env       # ajuster les valeurs si besoin
uvicorn app.main:app --reload
```

**Frontend**

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

## CI/CD

- `.github/workflows/ci.yml` : lint + tests + build frontend, tests backend (avec MongoDB de service), sur chaque push/PR.
- `.github/workflows/deploy.yml` : déploiement Azure (App Service + Static Web Apps), déclenchement manuel. Nécessite la configuration des secrets `AZURE_CREDENTIALS`, `AZURE_BACKEND_APP_NAME`, `AZURE_STATIC_WEB_APPS_API_TOKEN` dans les paramètres du dépôt avant utilisation.
- `.github/workflows/backup.yml` : sauvegarde quotidienne de MongoDB (inactif tant que les secrets de production ne sont pas configurés).
- `.github/workflows/uptime.yml` : vérification de disponibilité toutes les 15 min (inactif tant que `PRODUCTION_HEALTH_URL` n'est pas configurée).

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour la procédure complète de mise en production, sauvegarde/restauration et monitoring (HBA-026).
