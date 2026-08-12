# HBA Connect — Backlog technique complet

**Projet :** HBA Connect — Plateforme commerciale & espace client HBA Academy
**Élaboré par :** Ilyes Belhadj — Ingénieur & Consultant en IA
**Usage :** Ce backlog est conçu pour être repris directement dans Claude Code, ticket par ticket, dans l'ordre des dépendances indiquées.

**Stack de référence pour tous les tickets :**
- Frontend : React 18 + TypeScript + Vite
- Backend : FastAPI (Python 3.12)
- Base de données : MongoDB
- IA : API Claude (Anthropic) via OpenRouter
- Infra/CI-CD : Microsoft Azure
- Auth : JWT + RBAC (rôles : `visitor`, `prospect`, `apprenant`, `formateur`, `admin`)

**Convention d'estimation :** en jours-homme indicatifs (1 dev senior full-stack).

---

## Modèle de données transverse (à mettre en place dès HBA-001)

Collections MongoDB principales, partagées par plusieurs epics :

- `formations` — filière, titre, description, prérequis, durée, prix, âge cible, mode (présentiel/en ligne), médias, badges de compétences
- `sessions` — formation_id, date_debut, date_fin, capacite_max, places_prises, formateur_id
- `leads` — source (vitrine/simulateur/chatbot), profil_visiteur, coordonnees, formation_interet, statut (nouveau/qualifié/converti/perdu), historique
- `preinscriptions` — lead_id, session_id, statut (en_attente/confirmée/annulée), date_creation
- `users` — role, email, mot_de_passe_hash, profil (si apprenant : formations suivies, progression)
- `certificats` — user_id, formation_id, date_emission, code_verification, url_pdf
- `temoignages` — auteur, formation_id, contenu, media, statut_publication
- `conversations_chatbot` — lead_id ou anonyme, historique_messages, langue, statut_escalade

---

## EPIC 1 — Vitrine digitale & Catalogue de formations

### HBA-001 — Architecture initiale du projet
**Priorité :** Haute · **Estimation :** 3 jours · **Dépendances :** aucune

**Description :** Poser le socle technique du monorepo (ou repos séparés front/back), la configuration des environnements et le déploiement initial sur Azure.

**Tâches techniques :**
- Initialiser le frontend (`Vite + React + TypeScript`), configuration ESLint/Prettier
- Initialiser le backend FastAPI avec structure modulaire (`routers/`, `models/`, `services/`)
- Connexion MongoDB (Motor ou PyMongo async), configuration via variables d'environnement (jamais de valeurs en dur)
- Mise en place CI/CD Azure (pipeline build + déploiement staging)
- Configuration CORS, logging structuré, gestion d'erreurs centralisée

**Définition de terminé :** le frontend et le backend sont déployés sur un environnement staging Azure, avec une route `/health` fonctionnelle.

---

### HBA-002 — Page d'accueil adaptative par profil
**Priorité :** Haute · **Estimation :** 3 jours · **Dépendances :** HBA-001

**Description :** Page d'accueil avec sélecteur de profil (parent, jeune adulte, professionnel, candidat émigration) qui personnalise le contenu affiché (formations mises en avant, message d'accroche, témoignages).

**Tâches techniques :**
- Composant `ProfileSelector` (state géré en React, persistance en `sessionStorage` côté navigateur uniquement, pas de stockage serveur pour un simple visiteur anonyme)
- Config JSON ou collection `profils_config` définissant le contenu à afficher par profil
- Design responsive mobile-first (cf. skill frontend-design)

**Critères d'acceptation :**
- 4 profils sélectionnables, contenu affiché différent selon le choix
- Temps de chargement de la page d'accueil < 2s

---

### HBA-003 — Catalogue de formations filtrable
**Priorité :** Haute · **Estimation :** 4 jours · **Dépendances :** HBA-001

**Description :** Liste des formations avec filtres combinables.

**Endpoints à créer :**
- `GET /api/formations?filiere=&age=&duree=&prix_max=&niveau=&mode=`
- `GET /api/formations/filieres` (liste des filières disponibles pour peupler les filtres)

**Tâches techniques :**
- Indexation MongoDB sur les champs filtrables pour garder un temps de réponse < 1s
- Composant `CatalogueGrid` avec pagination ou scroll infini
- Composant `FilterBar` synchronisé avec les query params de l'URL (pour partage de lien filtré)

**Critères d'acceptation :**
- Filtres combinés retournent des résultats corrects et cohérents
- URL reflète l'état des filtres (lien copiable/partageable)

---

### HBA-004 — Fiche formation détaillée
**Priorité :** Moyenne · **Estimation :** 3 jours · **Dépendances :** HBA-003

**Description :** Page détail d'une formation.

**Endpoints à créer :**
- `GET /api/formations/{id}`
- `GET /api/formations/{id}/temoignages`

**Tâches techniques :**
- Rendu SEO-friendly (meta tags dynamiques via `react-helmet` ou équivalent Vite)
- Intégration vidéo (lecteur natif ou embed)
- CTA vers HBA-014 (calendrier des sessions) et HBA-015 (préinscription)

**Critères d'acceptation :**
- Toutes les sections s'affichent depuis les données backoffice
- Lien direct fonctionnel vers la prise de rendez-vous

---

### HBA-005 — Espace preuves sociales
**Priorité :** Moyenne · **Estimation :** 3 jours · **Dépendances :** HBA-001

**Description :** Galerie de projets élèves + témoignages + indicateurs de réussite.

**Tâches techniques :**
- Upload et stockage des médias (Azure Blob Storage recommandé, avec redimensionnement/compression automatique)
- Composant `MediaGallery` avec lazy loading
- Collection `temoignages` avec statut de publication géré depuis le backoffice (HBA-021)

**Critères d'acceptation :**
- Galerie avec chargement progressif, pas de ralentissement de la page
- Témoignages affichés uniquement si statut = publié

---

### HBA-022 — Page "Nos formateurs"
**Priorité :** Moyenne · **Estimation :** 3 jours · **Dépendances :** HBA-001, HBA-018

**Description :** Page publique présentant l'équipe de formateurs du centre, avec pour chacun sa carrière et ses spécialités, afin de rassurer les prospects sur la qualité pédagogique.

**Modèle de données à ajouter :**
- Collection `formateurs` — nom, photo, filière(s), bio/parcours (texte long), expériences_professionnelles[], certifications[], formations_dispensees[] (référence vers `formations`), temoignages_specifiques[] (référence vers `temoignages`)

**Endpoints à créer :**
- `GET /api/formateurs` (liste, avec filtre par filière)
- `GET /api/formateurs/{id}` (fiche détaillée)

**Tâches techniques :**
- Composant `FormateursGrid` (liste, filtrable par filière) et `FormateurDetail` (fiche complète)
- Chaque formation dispensée sur la fiche formateur renvoie vers sa fiche détail (HBA-004) et vice-versa (afficher le formateur sur la fiche formation)
- Gestion des photos via Azure Blob Storage (même pipeline que HBA-005)
- Édition du contenu (bio, expériences, certifications) intégrée au backoffice de gestion de contenu (HBA-021), pour que l'équipe HBA puisse mettre à jour les fiches sans développeur

**Critères d'acceptation :**
- Chaque formateur a une fiche complète (bio, parcours, formations dispensées)
- La fiche formateur et la fiche formation sont liées dans les deux sens
- Un administrateur peut modifier une fiche formateur depuis le backoffice sans intervention technique

---

### HBA-023 — Page "Nos réalisations" (exploits du centre)
**Priorité :** Moyenne · **Estimation :** 3 jours · **Dépendances :** HBA-001, HBA-005

**Description :** Page publique valorisant la crédibilité du centre : chiffres clés, projets/concours gagnés, partenariats, moments marquants — en complément de l'espace preuves sociales déjà prévu (HBA-005) qui reste centré sur les projets élèves au niveau des fiches formation.

**Modèle de données à ajouter :**
- Collection `realisations` — type (chiffre_cle / concours / partenariat / evenement), titre, description, date, media, mise_en_avant (booléen pour la page d'accueil)

**Endpoints à créer :**
- `GET /api/realisations?type=`
- `GET /api/realisations/chiffres-cles` (endpoint dédié pour les compteurs affichés en page d'accueil et sur cette page)

**Tâches techniques :**
- Composant `RealisationsTimeline` ou galerie chronologique (concours gagnés, partenariats, événements marquants)
- Composant `StatsCounters` (chiffres clés — nombre d'apprenants formés, taux de réussite, taux de placement) avec animation au scroll
- Intégration de quelques réalisations "mises en avant" directement sur la page d'accueil (HBA-002), pour capter l'attention dès l'arrivée
- Gestion du contenu intégrée au backoffice (HBA-021), pour ajout facile d'une nouvelle réalisation par l'équipe HBA

**Critères d'acceptation :**
- Les chiffres clés affichés sont configurables depuis le backoffice, jamais codés en dur
- Au moins une réalisation "mise en avant" apparaît sur la page d'accueil
- La page reste crédible : chaque chiffre ou concours affiché doit pouvoir être justifié (pas de statistique inventée)

---

## EPIC 2 — Simulateur d'orientation IA

### HBA-006 — Questionnaire dynamique d'orientation
**Priorité :** Haute · **Estimation :** 3 jours · **Dépendances :** HBA-001

**Description :** Questionnaire de 3 à 6 questions adaptatives (objectifs, disponibilité, niveau).

**Tâches techniques :**
- Composant `OrientationWizard` avec logique conditionnelle (question suivante dépend de la réponse précédente)
- Stockage temporaire des réponses en state React, envoyées en un seul payload à l'API

**Critères d'acceptation :**
- Temps de complétion moyen visé < 2 minutes
- Le questionnaire s'adapte selon les réponses précédentes

---

### HBA-007 — Moteur de recommandation IA
**Priorité :** Haute · **Estimation :** 4 jours · **Dépendances :** HBA-006, HBA-003

**Description :** Appel à l'API Claude pour produire une recommandation basée sur les réponses + le catalogue actuel.

**Endpoint à créer :**
- `POST /api/orientation/recommander` — reçoit les réponses du questionnaire, retourne `{formation_principale, alternatives[], justification}`

**Tâches techniques :**
- Prompt système dédié : injecter dynamiquement le catalogue de formations actif (pas de formations obsolètes) en contexte
- Garde-fous : la réponse du modèle doit être contrainte à un format JSON strict, avec validation côté serveur avant retour au frontend (rejeter/relancer si le modèle recommande une formation hors catalogue)
- Gestion des erreurs API (timeout, fallback vers une recommandation par règles simples si l'IA est indisponible)

**Critères d'acceptation :**
- La recommandation correspond toujours à une formation existante du catalogue
- Fallback fonctionnel en cas d'indisponibilité de l'API Claude

---

### HBA-008 — Page de restitution du résultat
**Priorité :** Moyenne · **Estimation :** 2 jours · **Dépendances :** HBA-007

**Description :** Affichage du résultat avec formation principale + alternatives + CTA.

**Tâches techniques :**
- Composant `RecommendationResult`
- Option d'envoi du résultat par email (réutiliser le service email de HBA-015)

**Critères d'acceptation :**
- CTA direct vers la fiche formation ou la prise de rendez-vous
- Option d'envoi par email fonctionnelle

---

### HBA-009 — Suivi analytique du simulateur
**Priorité :** Basse · **Estimation :** 2 jours · **Dépendances :** HBA-007

**Description :** Journalisation anonymisée des passages au simulateur pour le backoffice (HBA-020).

**Tâches techniques :**
- Collection `simulateur_logs` (réponses, recommandation produite, timestamp — sans données personnelles sauf si le visiteur a donné son email pour recevoir le résultat)
- Endpoint interne consommé par le tableau de bord admin

**Critères d'acceptation :**
- Aucune donnée personnelle stockée sans consentement explicite

---

## EPIC 3 — Chatbot commercial multilingue

### HBA-010 — Widget chatbot intégré au site
**Priorité :** Haute · **Estimation :** 3 jours · **Dépendances :** HBA-001

**Description :** Composant frontend du chatbot (bulle flottante, ouverture/fermeture, historique de session).

**Tâches techniques :**
- Composant `ChatWidget` présent sur toutes les pages publiques (layout global)
- Historique conservé en `sessionStorage` (session navigateur) ; persistance serveur uniquement si le lead est identifié (HBA-012)
- Design conforme à la charte HBA (cf. skill frontend-design pour la direction visuelle)

**Critères d'acceptation :**
- Widget accessible partout, historique conservé pendant la session

---

### HBA-011 — Moteur conversationnel FR/Derja
**Priorité :** Haute · **Estimation :** 5 jours · **Dépendances :** HBA-010, HBA-003

**Description :** Intégration de l'API Claude pour les échanges en français et en Derja tunisien, strictement dans le périmètre du centre.

**Endpoint à créer :**
- `POST /api/chatbot/message` — reçoit le message + historique, retourne la réponse du chatbot

**Tâches techniques :**
- Prompt système définissant : le rôle (conseiller commercial HBA), le périmètre autorisé (formations, tarifs, sessions, prérequis, processus d'inscription), le ton, et l'interdiction de répondre sur des sujets hors périmètre
- Injection dynamique du catalogue de formations et des sessions actives en contexte
- Détection des demandes hors périmètre pour déclencher HBA-013 (escalade)
- Tests de robustesse sur les échanges en Derja (jeu de questions type à valider avec l'équipe HBA)

**Critères d'acceptation :**
- Réponses correctes en Derja sur un jeu de questions test
- Aucune réponse hors périmètre du centre

---

### HBA-012 — Qualification et prise de RDV via chatbot
**Priorité :** Haute · **Estimation :** 4 jours · **Dépendances :** HBA-011, HBA-015

**Description :** Le chatbot collecte les informations de qualification et peut déclencher une préinscription depuis la conversation.

**Tâches techniques :**
- Extraction structurée des informations de qualification (filière, disponibilité, budget) via function calling / tool use de l'API Claude
- Création automatique d'un `lead` en base dès qu'un minimum d'informations est collecté
- Déclenchement du flux de préinscription (réutilise le service de HBA-015) directement depuis le chat

**Critères d'acceptation :**
- Une préinscription créée via le chatbot apparaît dans le backoffice (HBA-019)
- Confirmation automatique envoyée au prospect

---

### HBA-013 — Escalade vers un conseiller humain
**Priorité :** Moyenne · **Estimation :** 2 jours · **Dépendances :** HBA-011

**Description :** Bascule vers un contact humain si la demande dépasse le périmètre du chatbot.

**Tâches techniques :**
- Détection d'intention d'escalade (soit par mots-clés, soit via l'analyse de la réponse contrainte du modèle)
- Envoi d'un email/notification à l'équipe avec le contexte complet de la conversation
- Message de confirmation au visiteur

**Critères d'acceptation :**
- L'équipe reçoit le contexte complet de la conversation lors d'une escalade

---

## EPIC 4 — Prise de rendez-vous, préinscription & suivi client

### HBA-014 — Calendrier des sessions en temps réel
**Priorité :** Haute · **Estimation :** 3 jours · **Dépendances :** HBA-003

**Description :** Affichage des sessions à venir avec places restantes, synchronisé en temps réel.

**Endpoint à créer :**
- `GET /api/sessions?formation_id=`

**Tâches techniques :**
- Calcul `places_restantes = capacite_max - places_prises` côté backend (source unique de vérité, jamais recalculé côté frontend)
- Verrouillage optimiste en base pour éviter la sur-réservation en cas de préinscriptions simultanées

**Critères d'acceptation :**
- Une session complète est immédiatement indiquée comme non disponible

---

### HBA-015 — Formulaire de préinscription en ligne
**Priorité :** Haute · **Estimation :** 3 jours · **Dépendances :** HBA-014

**Description :** Préinscription avec confirmation automatique.

**Endpoint à créer :**
- `POST /api/preinscriptions`

**Tâches techniques :**
- Validation des champs côté frontend ET backend (ne jamais faire confiance uniquement au frontend)
- Service d'envoi d'email transactionnel (confirmation immédiate)
- Pour les mineurs (formations enfants/ados) : champ obligatoire de consentement parental

**Critères d'acceptation :**
- Confirmation email envoyée automatiquement
- Préinscription visible immédiatement dans le backoffice

---

### HBA-016 — Portail client — planning et documents
**Priorité :** Moyenne · **Estimation :** 4 jours · **Dépendances :** HBA-001, authentification JWT

**Description :** Espace apprenant authentifié.

**Endpoints à créer :**
- `POST /api/auth/login`, `POST /api/auth/refresh`
- `GET /api/portail/planning`
- `GET /api/portail/documents`

**Tâches techniques :**
- Authentification JWT avec refresh token, rôle `apprenant`
- Stockage des documents (Azure Blob Storage) avec liens sécurisés à durée limitée
- Interface `PortailDashboard`

**Critères d'acceptation :**
- Accès restreint aux seules données de l'apprenant connecté (pas de fuite inter-comptes)

---

### HBA-017 — Certificats numériques avec QR de vérification
**Priorité :** Moyenne · **Estimation :** 4 jours · **Dépendances :** HBA-016

**Description :** Génération de certificats PDF avec QR code de vérification.

**Endpoints à créer :**
- `POST /api/certificats/generer` (admin/formateur)
- `GET /api/certificats/verifier/{code}` (page publique de vérification)

**Tâches techniques :**
- Génération PDF (réutiliser la charte graphique HBA existante — gabarits déjà produits pour les certificats HBA)
- Génération du QR code pointant vers la page de vérification publique
- Page de vérification affichant : nom (partiel ou complet selon consentement), formation, date, statut "authentique"

**Critères d'acceptation :**
- Le QR code renvoie vers une page confirmant l'authenticité
- Certificat téléchargeable depuis le portail client

---

## EPIC 5 — Backoffice & pilotage

### HBA-018 — Backoffice — gestion du catalogue
**Priorité :** Haute · **Estimation :** 4 jours · **Dépendances :** HBA-003, rôle `admin`

**Description :** Interface CRUD pour formations et sessions.

**Endpoints à créer :**
- `POST/PUT/DELETE /api/admin/formations`
- `POST/PUT/DELETE /api/admin/sessions`

**Tâches techniques :**
- Interface `AdminFormationsEditor` (formulaire riche avec upload de médias)
- Contrôle d'accès strict réservé aux rôles `admin`/`formateur`

**Critères d'acceptation :**
- Modifications visibles immédiatement sur la vitrine publique

---

### HBA-019 — Tableau de bord des leads et prospects
**Priorité :** Moyenne · **Estimation :** 3 jours · **Dépendances :** HBA-007, HBA-012, HBA-015

**Description :** Vue consolidée des leads multi-sources avec statut de conversion.

**Endpoints à créer :**
- `GET /api/admin/leads?source=&statut=`
- `PATCH /api/admin/leads/{id}` (mise à jour du statut)
- `GET /api/admin/leads/export` (CSV)

**Critères d'acceptation :**
- Chaque lead affiche sa source d'origine
- Export CSV fonctionnel

---

### HBA-020 — Statistiques de conversion par formation et canal
**Priorité :** Moyenne · **Estimation :** 3 jours · **Dépendances :** HBA-019, HBA-009

**Description :** Indicateurs de performance dans le backoffice.

**Tâches techniques :**
- Agrégations MongoDB (pipeline `$group`/`$match`) pour calculer taux de conversion par formation et par canal
- Composant `AdminDashboardCharts` (graphiques via `recharts` ou équivalent)
- Filtrage par période

**Critères d'acceptation :**
- Au moins 3 indicateurs clés affichés, filtrables par période

---

### HBA-021 — Gestion de contenu (médias et témoignages)
**Priorité :** Basse · **Estimation :** 2 jours · **Dépendances :** HBA-005, HBA-018

**Description :** Interface non technique pour gérer médias et témoignages.

**Tâches techniques :**
- Interface `AdminContentManager` (upload, édition, publication/dépublication)
- Compression/optimisation automatique des médias uploadés (redimensionnement, format web)

**Critères d'acceptation :**
- Un utilisateur non technique peut publier un témoignage sans aide

---

## Ordre de développement recommandé

1. **Semaine 1-2 :** HBA-001 → HBA-002 → HBA-003 → HBA-018 (socle + catalogue + gestion admin en parallèle)
2. **Semaine 3 :** HBA-004, HBA-005, HBA-014, HBA-015, HBA-022, HBA-023 (fiches formation, preuves sociales, RDV/préinscription, formateurs, réalisations)
3. **Semaine 4-5 :** HBA-006 → HBA-007 → HBA-008 → HBA-009 (simulateur IA)
4. **Semaine 6-7 :** HBA-010 → HBA-011 → HBA-012 → HBA-013 (chatbot)
5. **Semaine 8-9 :** HBA-016 → HBA-017 (portail client + certificats)
6. **Semaine 10 :** HBA-019 → HBA-020 → HBA-021 (backoffice avancé)
7. **Semaine 11-12 :** recette, tests de charge, corrections, mise en production

---

*Document généré par Ilyes Belhadj — Ingénieur & Consultant en IA — pour usage interne de développement HBA Connect.*
