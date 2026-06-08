# CONVENTIONS RESQR V2

Ce fichier est une boussole operationnelle courte pour Codex.
Il ne remplace pas `PLANIFICATION_RESQR_V2.md`; il le resume pour eviter les derives.

## Strategie produit

- ResQR V2 est une reecriture complete de ResQR, pas un MVP reduit.
- ResQR V1 Bubble reste la production active jusqu'a une bascule controlee.
- La migration V1 vise utilisateurs, structures, roles, donnees metier, fichiers et relations quand c'est possible.
- L'import Bubble peut etre partiel: archives, references ou historique incomplet.
- Ne jamais bloquer V2 sur la promesse d'un export Bubble parfait.
- Priorite produit: QR-first, terrain-first, securite-first.
- Un QR code pointe vers un jumeau numerique; il n'est jamais une autorisation en soi.

## Stack cible

- Application: Next.js sur Vercel.
- Donnees: Supabase Postgres.
- Authentification: Supabase Auth.
- Temps reel: Supabase Realtime.
- Fichiers: Supabase Storage prive par defaut.
- Securite base: RLS stricte sur toutes les tables exposees.

## Nommage

- Utiliser un nommage explicite, stable et metier: `structure`, `membership`, `asset`, `vehicle`, `equipment`, `checklist`, `verification`, `audit_event`.
- Garder `structure_id` sur toute donnee metier critique.
- Eviter les noms vagues: `item`, `data`, `object`, `record`, sauf contexte local evident.
- Les statuts metier restent limites a noir, vert, jaune, rouge.
- Distinguer faits sources, caches, archives et evenements.

## Structure fichiers

- Separer interface, acces donnees, logique metier, validations et tests.
- Garder les regles critiques cote serveur ou base.
- Centraliser le moteur de statut et les permissions pour eviter les variantes divergentes.
- Aligner les modules sur les domaines ResQR: structures, moyens, QR, checklists, pannes, taches, rendez-vous, hygiene, peremptions, exports, audit.
- Ne pas introduire une nouvelle architecture sans justification documentee.

## Supabase, RLS et securite

- RLS activee par defaut; refus par defaut si appartenance ou permission absente.
- Les politiques s'appuient sur appartenance et permissions reelles, jamais sur une valeur client modifiable.
- Aucune cle service role cote client.
- Tout acces admin plateforme aux donnees client est journalise.
- Les exports respectent RLS, permissions, filtres, retention et audit.

## Regles metier non negociables

- Audit immuable: toute action critique cree un evenement non modifiable.
- Archivage plutot que suppression physique pour les donnees metier critiques.
- Statut recalculable: l'affichage peut etre cache, mais les causes doivent permettre un recalcul complet.
- Le pire statut actif gagne; les causes resolues ou archivees ne participent plus au statut courant.
- Temps reel cible: souscrire par structure, module et ecran actif, jamais a toute la base inutilement.
- Couts Vercel/Supabase surveilles des le depart: realtime, egress, stockage, fonctions, jobs, exports, SMS.
- Tests minimaux requis: RLS multi-structure, permissions, statut, audit immuable, signature, QR/PIN, exports critiques.

Toute décision qui contredit ce fichier doit être explicitement justifiée et documentée.
