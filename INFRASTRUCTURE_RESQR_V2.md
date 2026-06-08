# Infrastructure RESQR V2

## Etat local

- Application Next.js initialisee a la racine du projet.
- Supabase SSR pret via `@supabase/ssr`.
- Variables attendues documentees dans `.env.example`.
- Migration initiale preparee dans `supabase/migrations/0001_resqr_core.sql`.
- Projet Vercel `resqr-v2` cree, lie et deploye.

## Comptes detectes

### Vercel

- Equipe: `ResQR's projects`
- Team ID: `team_Yv7lYf0L4xmQ9kHwLF5UcjDg`
- Projet RESQR V2: `resqr-v2`
- Project ID: `prj_QLAlk9louLxxoXI7Ltbnhb0HhDzD`
- URL production: `https://resqr-v2.vercel.app`

### Supabase

Memoire long terme:

- ResQR V2 doit stocker ses donnees en Europe.
- Quand un plan payant sera pris et que la production sera preparee, creer `RESQR_V2_PROD` directement en Europe.
- Region recommandee par defaut: Paris `eu-west-3`.
- Alternative acceptable: Francfort `eu-central-1`.
- Ne pas demarrer la production ResQR V2 sur une region US en attendant.
- Un changement de region Supabase implique une migration vers un nouveau projet; il faut donc choisir l'Europe des le depart.

Projets existants:

- `MOUSS_LIVE` en `eu-west-1` - interdit pour RESQR V2
- `MOUSS_STAGING` en `eu-west-1` - interdit pour RESQR V2

Decision requise avant application des migrations:

- creer un projet Supabase dedie `RESQR_V2_DEV`;
- ne jamais utiliser `MOUSS_STAGING` comme environnement RESQR V2.

Blocage actuel:

- la creation de `RESQR_V2_DEV` a ete tentee en `eu-west-3`;
- Supabase a refuse la creation car la limite de deux projets gratuits actifs est deja atteinte dans l'organisation;
- ne pas pause, supprimer ou reutiliser les projets MOUSS sans instruction explicite du proprietaire.

## Variables d'environnement

Variables publiques cote navigateur:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Variable serveur uniquement:

- `SUPABASE_SECRET_KEY`

Regle: ne jamais exposer `SUPABASE_SECRET_KEY` cote client, ni dans une variable `NEXT_PUBLIC_*`.

Etat Vercel actuel:

- `NEXT_PUBLIC_APP_URL` est renseignee en Production avec `https://resqr-v2.vercel.app`;
- `NEXT_PUBLIC_APP_URL` est renseignee en Development avec `http://localhost:3000`;
- l'ajout Preview est bloque tant que le projet Vercel n'a pas de depot Git distant connecte;
- les variables Supabase ne doivent etre ajoutees qu'apres creation du projet `RESQR_V2_DEV`.

## Ordre de branchement recommande

1. Confirmer le projet Supabase cible.
2. Renseigner `.env.local` en local.
3. Appliquer la migration initiale sur une base de developpement uniquement.
4. Ajouter les variables d'environnement Supabase RESQR V2 dans Vercel pour development, preview et production.
5. Deployer une nouvelle preview et verifier la page de statut.

## Points de vigilance Supabase 2026

- Les nouvelles tables peuvent ne plus etre exposees automatiquement a la Data API; les `grant` explicites sont donc inclus dans la migration.
- RLS doit rester activee sur toutes les tables exposees.
- Les politiques ne doivent pas s'appuyer sur des claims modifiables par l'utilisateur.
- Les fonctions `security definer` devront etre deplacees hors schema expose si elles deviennent plus sensibles que les helpers de lecture actuels.
