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

- `.github/workflows/ci.yml` : lint + build frontend, install + import check backend, sur chaque push/PR.
- `.github/workflows/deploy.yml` : déploiement Azure (App Service + Static Web Apps), déclenchement manuel. Nécessite la configuration des secrets `AZURE_CREDENTIALS`, `AZURE_BACKEND_APP_NAME`, `AZURE_STATIC_WEB_APPS_API_TOKEN` dans les paramètres du dépôt avant utilisation.
