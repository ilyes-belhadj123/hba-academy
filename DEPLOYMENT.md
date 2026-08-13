# Mise en production, monitoring & sauvegardes (HBA-026)

## État actuel

Rien n'est déployé en production à ce jour : aucun hébergement Azure n'a
encore été provisionné (identifiants Azure non fournis) et aucun nom de
domaine n'a été acheté pour HBA Academy. Ce qui suit est donc préparé et
testé localement, mais **restera inactif tant que ces deux éléments ne
sont pas fournis par l'équipe HBA** :

- [ ] Nom de domaine définitif + certificat SSL — bloqué, à acheter/configurer
- [ ] Secrets Azure (`AZURE_CREDENTIALS`, `AZURE_BACKEND_APP_NAME`,
      `AZURE_STATIC_WEB_APPS_API_TOKEN`) — bloqué, nécessite un abonnement Azure
- [ ] URI MongoDB de production (`PROD_MONGODB_URI`, `PROD_MONGODB_DB_NAME`) —
      bloqué, dépend de l'hébergement choisi
- [ ] URL de santé publique (`PRODUCTION_HEALTH_URL`) — bloqué, dépend du domaine

## Séparation des environnements

- Aucun secret n'est commité dans le code : `backend/.env` et `frontend/.env`
  sont gitignorés, seuls `.env.example` (valeurs factices) sont versionnés.
- Convention à suivre en production : un environnement **staging** et un
  environnement **production** distincts, chacun avec :
  - sa propre base MongoDB (nom de base différent, ex. `hba_connect_staging`
    vs `hba_connect_prod`) ;
  - son propre jeu de secrets (JWT, SMTP, clé OpenRouter, connexion Azure
    Blob) — jamais partagés entre les deux ;
  - le déploiement staging peut se faire depuis n'importe quelle branche,
    le déploiement production uniquement depuis `master`, via
    `.github/workflows/deploy.yml` (déclenchement manuel pour l'instant).

## Sauvegardes MongoDB

Scripts (`backend/scripts/backup_mongodb.py` et `restore_mongodb.py`) :
exportent/restaurent chaque collection en JSON Lines compressé (`bson.json_util`,
préserve fidèlement `ObjectId`/dates). **Testés localement avec succès** :
sauvegarde de la base de dev (12 collections), restauration vers une base
temporaire, comparaison document par document — identique bit à bit. Le
script de restauration refuse par défaut d'écraser la base active (`--force`
requis), pour éviter une restauration accidentelle en production.

```bash
cd backend
python scripts/backup_mongodb.py --out-dir backups
python scripts/restore_mongodb.py backups/<horodatage> --target-db hba_connect_restore_test
```

Le workflow `.github/workflows/backup.yml` exécute cette sauvegarde
automatiquement tous les jours à 2h (UTC) et publie le résultat comme
artefact GitHub Actions (rétention 35 jours). **Il ne fait rien pour
l'instant** : il vérifie la présence du secret `PROD_MONGODB_URI` et
s'arrête proprement si celui-ci n'est pas configuré. Une fois l'hébergement
choisi, il suffit d'ajouter les secrets `PROD_MONGODB_URI` et
`PROD_MONGODB_DB_NAME` dans les paramètres du dépôt pour l'activer.

À faire une fois l'hébergement de production connu : stocker les
sauvegardes dans un stockage durable plutôt que dans les artefacts GitHub
(ex. `AzureBlobStorageBackend`, déjà implémenté dans
`backend/app/services/storage_service.py`, réutilisable pour ce besoin).

## Monitoring & alerte de disponibilité

Le workflow `.github/workflows/uptime.yml` interroge `/health` toutes les
15 minutes. S'il ne trouve pas la variable de dépôt `PRODUCTION_HEALTH_URL`,
il s'arrête proprement sans rien faire. Une fois configurée, un échec de la
requête fait échouer le workflow — GitHub
notifie alors par email les personnes ayant les notifications Actions
activées pour ce dépôt (réglage individuel, Settings → Notifications →
Actions sur github.com).

**Limite connue :** cette alerte dépend des préférences de notification
GitHub de chaque personne, ce n'est pas un canal d'astreinte garanti. Pour
une alerte plus fiable une fois en production, ajouter une étape webhook
(Slack, email direct via le SMTP déjà configuré côté backend, ou un service
dédié comme UptimeRobot/Better Uptime) dans ce même workflow en cas
d'échec.

## Checklist avant mise en production officielle

1. Domaine + certificat SSL configurés
2. Secrets Azure + secrets MongoDB de production ajoutés au dépôt
3. `PRODUCTION_HEALTH_URL` configurée et `uptime.yml` vérifié une première fois
4. `PROD_MONGODB_URI` configurée et une sauvegarde automatique vérifiée
5. Une restauration de sauvegarde testée **en conditions réelles** (pas
   seulement localement comme ci-dessus) avant le lancement officiel
