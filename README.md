# ResQR V2

Socle applicatif Next.js pour reconstruire ResQR en SaaS securise: structures isolees, jumeaux numeriques QR, verifications, statuts operationnels et audit.

## Demarrage

```bash
npm install
npm run dev
```

Application locale par defaut: `http://localhost:3000`

## Commandes

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## Configuration

Copier `.env.example` vers `.env.local` et renseigner uniquement des variables RESQR V2 dediees.

Variables attendues:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

Ne jamais commiter `.env.local`, cle service, token Vercel ou secret Supabase.

## Structure

- `src/app`: App Router Next.js.
- `src/components/ui`: composants d'interface reutilisables.
- `src/modules`: logique metier testable.
- `src/lib/supabase`: clients Supabase SSR et navigateur.
- `src/lib/server`: aides reservees au serveur.
- `supabase/migrations`: migrations Postgres/RLS locales a relire avant application.

## Deploiement

Le projet est prepare pour Vercel. Toute variable d'environnement Vercel doit pointer vers des ressources RESQR V2 dediees, jamais vers MOUSS.
