# EXECUTION RESQR V2

## 1. Role Du Document

Ce document prepare l'execution technique de ResQR V2. Il doit etre lu par tout agent Codex avant de creer des ressources, modifier le modele de donnees ou developper un parcours metier.

References de cadrage a respecter:

- `CONVENTIONS_RESQR_V2.md`
- `PLANIFICATION_RESQR_V2.md`
- `MATRICE_STATUT_RESQR_V2.md`
- `COUTS_GARDE_FOUS_RESQR_V2.md`
- `PERIMETRE_ALPHA_RESQR_V2.md`

ResQR V2 est une reecriture complete de ResQR, pas une extension de MOUSS et pas un simple MVP reduit.

## 2. Regle Infrastructure Non Negociable

Ne jamais utiliser les projets, bases, tables, buckets, fonctions, variables, environnements ou donnees MOUSS pour ResQR V2.

Interdits explicites:

- ne pas utiliser `MOUSS_LIVE`;
- ne pas utiliser `MOUSS_STAGING`;
- ne pas creer de table ResQR dans une base MOUSS;
- ne pas lire, migrer, dupliquer ou reutiliser une table MOUSS comme socle ResQR V2;
- ne pas configurer Vercel RESQR V2 avec des variables pointant vers MOUSS;
- ne pas deployer de fonctions, jobs ou buckets RESQR V2 dans un projet MOUSS.

Toute ressource necessaire a ResQR V2 doit etre creee sous un nom dedie RESQR V2.

Noms cibles:

- Vercel: `resqr-v2`
- Supabase developpement: `RESQR_V2_DEV`
- Supabase preproduction: `RESQR_V2_STAGING`
- Supabase production: `RESQR_V2_PROD`

`RESQR_V2_PROD` ne doit etre cree qu'au moment de preparer une bascule controlee, apres validation des parcours critiques.

Toute creation Supabase future doit passer par confirmation explicite du cout avant execution.

## 2.1 Memoire Long Terme - Region Europe

Decision a conserver pour la mise en production future: ResQR V2 doit stocker ses donnees en Europe.

Quand le plan Supabase payant sera pris, meme dans plusieurs mois, creer `RESQR_V2_PROD` directement dans une region europeenne. Region recommandee par defaut: Paris `eu-west-3`. Alternative acceptable si Paris n'est pas disponible ou moins adaptee: Francfort `eu-central-1`.

Ne pas creer de projet Supabase RESQR V2 en region US "temporairement" pour eviter une migration regionale plus tard. Un projet Supabase est lie a sa region d'infrastructure; changer de region implique de creer un nouveau projet dans la region cible puis de migrer les donnees.

Configurer ensuite les fonctions Vercel au plus proche de la base europeenne, par exemple Paris `cdg1` si Supabase est en `eu-west-3`.

## 3. Etat Initial Reel Du Workspace

Etat constate au lancement de cette feuille d'execution:

- une application Next.js existe deja dans `src`;
- le package manager est npm, confirme par `package-lock.json`;
- `package.json` contient les scripts standards `dev`, `build`, `start`, `lint` et `typecheck`;
- les dependances principales sont Next.js, React, `@supabase/ssr` et `@supabase/supabase-js`;
- les configs Next.js, TypeScript, Tailwind, PostCSS et ESLint existent;
- les tokens visuels RESQR existent dans `resqr-tokens.css`;
- les assets produit existent dans `public`;
- un dossier `supabase/migrations` existe avec une migration initiale locale;
- la migration Supabase locale n'est pas appliquee a un projet cloud RESQR V2;
- un depot Git local est initialise dans ce dossier;
- le projet Vercel RESQR V2 `resqr-v2` est cree et lie dans `.vercel/project.json`;
- un premier deploiement Vercel est disponible sur `https://resqr-v2.vercel.app`;
- aucun projet Supabase RESQR V2 n'est confirme ou cree;
- `node_modules` et `.next` sont presents comme artefacts locaux de developpement.

Consequence: les prochains agents doivent considerer que le socle applicatif local et Vercel existent, mais que l'infrastructure Supabase RESQR V2 dediee reste a creer et lier.

## 4. Principes Produit A Conserver

ResQR V1 Bubble reste la production active jusqu'a une bascule controlee. Aucun developpement V2 ne doit supposer que V1 peut etre arretee ou remplacee sans validation terrain.

La migration V1 vise les utilisateurs, structures, roles, donnees metier, fichiers et relations quand c'est possible. Elle peut etre partielle si Bubble ne permet pas un export complet ou fiable.

Ne jamais bloquer ResQR V2 sur la promesse d'un export Bubble parfait. Les donnees importees qui ne permettent pas un recalcul fiable doivent rester identifiees comme telles.

Le principe central est la source unique de verite: Postgres porte les faits metier, l'audit et les relations. L'interface peut mettre en cache ou materialiser des vues, mais les statuts et preuves doivent rester recalculables et auditables.

## 5. Strategie D'Execution Par Phases

### Phase 0 - Orientation Et Garde-Fous

- Lire les documents de cadrage.
- Verifier l'etat du workspace avant toute mutation.
- Initialiser Git avant tout travail durable.
- Confirmer que les ressources MOUSS ne sont jamais utilisees.
- Creer uniquement les documents ou configurations explicitement demandes.

### Phase 1 - Socle Infrastructure Dedie

- Creer les projets Supabase dedies `RESQR_V2_DEV` puis `RESQR_V2_STAGING`.
- Utiliser le projet Vercel dedie `resqr-v2` deja cree et lie.
- Configurer les variables d'environnement Vercel et locales avec les projets RESQR V2 uniquement.
- Ne jamais pointer vers `MOUSS_LIVE` ou `MOUSS_STAGING`.
- Appliquer les migrations seulement sur un environnement RESQR V2 confirme.

### Phase 2 - Modele Donnees, RLS Et Audit

- Stabiliser le modele multi-structure: `structure`, `membership`, roles, permissions, structure active.
- Activer RLS stricte sur toutes les tables exposees.
- Refuser par defaut si appartenance ou permission absente.
- Journaliser les actions critiques dans un audit immuable.
- Garder `structure_id` sur toute donnee metier critique.

### Phase 3 - Authentification Et Acces

- Brancher Supabase Auth avec sessions SSR.
- Implementer creation de structure, invitation, activation et changement de structure active.
- Garantir l'isolation inter-structure par tests automatises.
- Traiter les PIN invites 24h comme des droits limites et traces, jamais comme une autorisation implicite par QR.

### Phase 4 - Parcours Alpha Terrain

- Construire les moyens et jumeaux numeriques QR-first.
- Implementer vehicules, materiels, relations parent/enfant et statut LED.
- Implementer checklists, verifications signees, pannes, taches, rendez-vous, hygiene, fluides et fil systeme.
- Chaque parcours doit etre utilisable desktop et mobile.

### Phase 5 - Conformite, Exports Et Bascule

- Produire exports PDF, CSV et XLS filtres par permissions.
- Journaliser chaque export.
- Verifier audit immuable, signatures, statut explicable et preuves.
- Preparer la migration V1 et la bascule controlee uniquement apres validation des parcours critiques.

## 6. Prerequis Techniques

Outils locaux attendus:

- Node.js compatible avec le projet;
- npm;
- acces Vercel authentifie;
- acces Supabase authentifie;
- Git initialise avant tout travail collaboratif durable.

Variables attendues localement dans `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

Regles:

- ne jamais commiter `.env.local`;
- ne jamais exposer `SUPABASE_SECRET_KEY` cote client;
- ne jamais utiliser de variable `NEXT_PUBLIC_*` pour une cle secrete;
- verifier que les URLs et cles pointent vers un projet RESQR V2 dedie.

## 7. Commandes Standards

Installation:

```bash
npm install
```

Developpement:

```bash
npm run dev
```

Si le port `3000` est deja occupe:

```bash
$env:PORT=3001; npm run dev
```

Qualite:

```bash
npm run lint
npm run typecheck
npm run build
```

Regle: ne pas lancer de migration, de deployement ou de creation de ressource cloud sans confirmation explicite de l'environnement cible RESQR V2.

## 8. Regles Securite Incontournables

- RLS activee par defaut sur toutes les tables exposees.
- Refus par defaut si l'utilisateur n'a pas d'appartenance ou permission valide.
- `structure_id` obligatoire sur toute donnee metier critique.
- Les politiques d'autorisation doivent s'appuyer sur des appartenances et permissions serveur, jamais sur des donnees client modifiables.
- Aucune cle service role ou secret Supabase cote client.
- Supabase Storage prive par defaut, acces par URL signee courte et permission serveur.
- Audit immuable pour toute action critique: creation, modification, signature, export, acces admin, changement de statut critique.
- Archivage logique prefere a la suppression physique pour les donnees metier critiques.
- Le QR code est un pointeur vers le jumeau numerique, jamais une autorisation.
- Les signatures et verifications signees deviennent immuables apres validation.
- Les exports respectent RLS, permissions, filtres, retention et audit.

## 9. Regles De Couts

Chaque fonctionnalite consommatrice doit etre bornee par structure, module, ecran actif, plan SaaS, quota et metrique observable.

Garde-fous obligatoires:

- Realtime uniquement sur l'ecran actif;
- souscriptions filtrees au minimum par `structure_id` et module;
- fermeture des souscriptions au changement de structure active;
- pagination obligatoire pour listes longues;
- aucun dropdown ne charge toute une structure sans recherche, filtre ou pagination;
- fichiers prives, limites en taille, compresses quand possible;
- exports filtres, limites, preferablement asynchrones et journalises;
- jobs incrementaux, bornes, idempotents et journalises;
- SMS uniquement sur plans/options autorises, avec quotas et trace;
- logs sans secrets, PIN, tokens ou donnees sensibles;
- metriques par structure pour Realtime, egress, Storage, fonctions, jobs, exports, emails, SMS et erreurs.

Signal rouge: toute fonctionnalite qui apporte de la fluidite mais rend le cout imprevisible doit etre redesignee avant production.

## 10. Risques Immediats

- Les projets Supabase RESQR V2 dedies ne sont pas encore crees.
- Le projet Vercel `resqr-v2` est cree, lie et deploye sur `https://resqr-v2.vercel.app`.
- `NEXT_PUBLIC_APP_URL` est renseignee dans Vercel pour Production et Development; Preview attend la connexion d'un depot Git distant.
- Le depot Git local est initialise, mais aucun commit initial n'a encore ete cree.
- La migration Supabase locale existe mais n'est appliquee nulle part.
- La creation de `RESQR_V2_DEV` est bloquee par la limite de deux projets gratuits actifs Supabase dans l'organisation detectee.
- Toute confusion avec `MOUSS_LIVE` ou `MOUSS_STAGING` serait un risque critique d'isolation et de donnees.
- L'app locale existe deja alors que les prompts d'orientation initiaux demandaient de ne pas creer l'app si elle etait absente; les prochains agents doivent partir de l'etat reel, sans supprimer ce socle.
- Les documents sources contiennent par endroits des caracteres mal encodes; ne pas modifier le fond metier sans relire attentivement.
- L'audit npm a signale une vulnerabilite transitive moderee liee a Next/PostCSS; ne pas forcer de downgrade automatique, surveiller les mises a jour Next.js.

## 11. Definition De Pret Pour La Suite

La suite peut demarrer quand:

- Git est initialise;
- le projet Vercel `resqr-v2` existe;
- le projet Supabase `RESQR_V2_DEV` existe;
- `.env.local` pointe vers `RESQR_V2_DEV`;
- aucune variable ne pointe vers MOUSS;
- les projets Supabase RESQR V2 sont crees en Europe, avec `RESQR_V2_PROD` en `eu-west-3` par defaut ou `eu-central-1` si besoin;
- la migration initiale a ete revue avant application;
- les commandes `npm run lint`, `npm run typecheck` et `npm run build` passent.
