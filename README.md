# VigiSafe

Plateforme web full-stack de declaration des hazards et de prevention Sante et Securite au Travail.

## Fonctionnalites

- Authentification par session securisee avec roles `REMONTEUR`, `RESPONSABLE_HSE`, `DIRECTEUR`.
- Declaration HAZARD publique ou connectee, par texte ou dictee Web Speech API.
- Parcours invite sans compte avec identification du rapporteur.
- Upload photo local avec controle type image et taille.
- Consignes SST publiques et assistant fonde uniquement sur cette base de connaissances.
- Classification automatique de gravite par regles, modifiable par le Responsable HSE.
- Liste des hazards avec miniatures photo, filtres, detail, timeline, statut et gravite.
- Dashboard KPI, graphiques Recharts, statistiques par gravite, zone, categorie et statut.
- Export CSV des rapports.
- Permissions verifiees cote API.

## Stack

Next.js, TypeScript, Tailwind CSS, Lucide React, Prisma, PostgreSQL, Zod, Recharts, Vitest.

## Installation

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Comptes de demonstration

Mot de passe commun: `DemoHSE2026!`

- Remonteur: `karim@example.com`
- Responsable HSE: `hse@example.com`
- Directeur: `directeur@example.com`

## Variables d'environnement

`DATABASE_URL` pointe vers PostgreSQL. `SESSION_SECRET` doit etre remplace par une valeur longue et aleatoire en production.

## Base de donnees

Le schema Prisma contient `User`, `Report`, `ReportHistory` et `ReportComment`, avec enums de roles, statuts, zones, categories et gravites.

## Seed

Le seed cree 48 hazards coherents avec la maquette: 7 critiques, 14 majeurs et 27 mineurs, sur plusieurs zones, rapporteurs, categories et statuts.

Pour replacer uniquement les hazards de demonstration sur les 28 derniers jours sans reinitialiser la base :

```bash
npm run demo:refresh
```

## Voix et photos

La dictee utilise `SpeechRecognition` ou `webkitSpeechRecognition` lorsque le navigateur le supporte. Les photos sont stockees en developpement dans `public/uploads`.

## API

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/guest`
- `GET /api/me`
- `POST /api/reports`
- `GET /api/reports`
- `GET /api/reports/:id`
- `PATCH /api/reports/:id`
- `POST /api/reports/:id/comments`
- `GET /api/dashboard`
- `GET /api/reports/export`
- `GET /api/safety-rules`
- `POST /api/safety-chat`

## Tests

```bash
npm run test
```

Les tests couvrent la classification de gravite, les permissions et les helpers de reference.

## Build production

```bash
npm run build
npm run start
```

## Archive ZIP

```bash
npm run zip
```

L'archive produite s'appelle `VigiSafe.zip` et exclut `node_modules`, `.next`, `.git` et les fichiers temporaires principaux.
