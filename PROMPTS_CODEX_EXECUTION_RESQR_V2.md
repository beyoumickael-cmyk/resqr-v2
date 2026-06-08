# PROMPTS CODEX - EXECUTION RESQR V2

Ce fichier contient des prompts prêts à copier-coller dans Codex pour exécuter progressivement la reconstruction de ResQR V2 à partir du document `PLANIFICATION_RESQR_V2.md`.

Utilisation recommandée:

1. Copier un seul prompt à la fois dans Codex.
2. Attendre que Codex termine, vérifie et résume le travail.
3. Corriger les éventuels points bloquants.
4. Passer au prompt suivant seulement quand les critères de sortie sont satisfaits.

Règles générales:

- Toujours lire `CONVENTIONS_RESQR_V2.md`, `PERIMETRE_ALPHA_RESQR_V2.md` et `DESIGN_SYSTEM_RESQR_V2.md` en priorité s'ils existent, puis `PLANIFICATION_RESQR_V2.md`.
- Pour tout écran ou composant d'interface: respecter strictement `DESIGN_SYSTEM_RESQR_V2.md` et les tokens `resqr-tokens.css` / `tailwind.config.ts`. Aucune couleur, police, hauteur ou rayon en dur.
- Priorité absolue: sécurité, isolation multi-structure, conformité, audit immuable.
- Ne jamais sacrifier la source unique de vérité pour aller plus vite.
- Vérifier chaque changement avec tests, build ou contrôles adaptés.
- Ne jamais exposer de secret Supabase côté client.
- Ne jamais mettre en place une table métier exposée sans RLS.
- Documenter les décisions structurantes au fil de l'eau.
- ResQR V1 sur Bubble reste la production active pendant la reconstruction; ResQR V2 est une réécriture complète, mais la migration V1 peut être partielle.
- Toute nouvelle feature doit préserver l'esprit QR-first: relier le terrain au numérique via QR code quand c'est pertinent.

---

## PROMPT -04 - S'approprier le périmètre alpha opposable

```text
Tu es Codex dans le projet ResQR V2. Le fichier PERIMETRE_ALPHA_RESQR_V2.md existe déjà à la racine du dépôt et fait autorité sur le périmètre de l'alpha.

Objectif: t'approprier ce périmètre et le rendre opposable à tous les prompts suivants, sans le réécrire.

Actions attendues:
- Lis intégralement PERIMETRE_ALPHA_RESQR_V2.md.
- Vérifie qu'il liste 17 parcours non négociables, une section Dans l'alpha, une section Hors alpha et un critère de fin d'alpha.
- Ne modifie pas son contenu sauf incohérence manifeste avec PLANIFICATION_RESQR_V2.md, auquel cas tu signales l'écart sans trancher seul.
- Confirme que tu traiteras tout élément listé Hors alpha comme non bloquant pour l'alpha, même si PLANIFICATION_RESQR_V2.md le décrit en détail.

Contraintes:
- Ce document prime sur l'exhaustivité du plan.
- Aucune fonctionnalité Hors alpha ne doit retarder les 17 parcours non négociables.

Vérifications:
- Résume les 17 parcours en une ligne chacun.
- Liste ce qui est explicitement Hors alpha.
- Indique tout écart détecté avec le plan.
```

---

## PROMPT -03 - Créer les conventions courtes anti-dérive

```text
Tu es Codex dans le projet ResQR V2. Lis `PLANIFICATION_RESQR_V2.md`.

Objectif: créer un document court que Codex relira avant chaque prompt pour éviter les dérives de nommage, structure, sécurité et architecture.

Actions attendues:
- Crée `CONVENTIONS_RESQR_V2.md`.
- Limite le document à environ 50 lignes utiles.
- Inclue:
  - stratégie produit: réécriture complète de V2, V1 Bubble reste production jusqu'à bascule contrôlée;
  - migration V1: utilisateurs/données migrables si possible, import potentiellement partiel;
  - priorité QR-first;
  - stack cible;
  - règles de nommage;
  - règles de structure fichiers;
  - règles Supabase/RLS;
  - règle audit immuable;
  - règle statut recalculable;
  - règle temps réel ciblé;
  - règle coûts Vercel/Supabase;
  - règle tests minimaux.
- Ajoute une phrase claire: "Toute décision qui contredit ce fichier doit être explicitement justifiée et documentée."

Vérifications:
- Le document est court, lisible et directement réutilisable.
- Il ne remplace pas le plan complet; il sert de boussole opérationnelle.
```

---

## PROMPT -02 - Documenter la matrice de statut déterministe

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`.

Objectif: créer une matrice de statut déterministe avant toute implémentation du moteur de statut.

Actions attendues:
- Crée `MATRICE_STATUT_RESQR_V2.md`.
- Définis les statuts:
  - noir: statut non établi, jamais vérifié, données insuffisantes;
  - vert: conforme;
  - jaune: vigilance, pré-alerte, retard ou anomalie non bloquante;
  - rouge: non conforme, critique, périmé, panne dangereuse ou blocage opérationnel.
- Définis l'ordre strict: noir=0, vert=1, jaune=2, rouge=3.
- Documente les règles:
  - le pire état gagne;
  - rouge gagne toujours;
  - jaune gagne sur vert et noir;
  - vert gagne sur noir seulement si un fait conforme récent existe;
  - noir reste si aucun fait suffisant n'existe;
  - les causes archivées/résolues sont ignorées du statut courant;
  - les causes actives sont conservées et affichables;
  - en égalité, trier les causes par criticité, date puis module;
  - propagation enfant vers parent selon relation contenant/contenu;
  - stock a ses propres états vert/orange/rouge et ne doit impacter le statut moyen que si une règle explicite le relie.
- Ajoute des exemples concrets.

Vérifications:
- Le document doit pouvoir servir de base directe aux tests unitaires du prompt moteur de statut.
```

---

## PROMPT -01 - Garde-fous coûts Vercel, Supabase, Realtime, Storage et SMS

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`.

Objectif: créer une stratégie coûts avant de multiplier les abonnements temps réel, jobs, exports et fichiers.

Actions attendues:
- Crée `COUTS_GARDE_FOUS_RESQR_V2.md`.
- Documente les postes à surveiller:
  - connexions Supabase Realtime;
  - egress;
  - stockage fichiers;
  - fonctions Vercel;
  - jobs planifiés;
  - exports;
  - emails;
  - SMS;
  - logs et observabilité.
- Définis les règles d'implémentation:
  - abonnements temps réel seulement sur l'écran actif;
  - filtres par structure et module;
  - pagination obligatoire des listes longues;
  - pas de souscription globale à toute une structure sauf justification;
  - stockage privé et compression/limites des pièces jointes;
  - quotas par plan;
  - métriques par structure;
  - alertes de dépassement.
- Prévois un tableau de bord interne de consommation par structure.

Vérifications:
- Le document doit éviter de remplacer les WU Bubble par un autre piège de coûts.
```

---

## PROMPT 00 - Orientation du dépôt et plan d'exécution

```text
Tu es Codex dans le projet ResQR V2. Commence par lire `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`, `MATRICE_STATUT_RESQR_V2.md` et `COUTS_GARDE_FOUS_RESQR_V2.md` s'ils existent.

Objectif: préparer l'exécution technique sans encore développer toute l'application.

Actions attendues:
- Inspecte le dossier courant et identifie s'il existe déjà une application, un package manager, un repo git, des configs ou des fichiers utiles.
- Résume l'état réel du workspace.
- Crée ou mets à jour un document `EXECUTION_RESQR_V2.md` avec:
  - l'état initial du projet;
  - la stratégie d'exécution par phases;
  - le rappel que V1 Bubble reste production jusqu'à bascule contrôlée;
  - le principe de réécriture complète avec migration V1 potentiellement partielle;
  - les prérequis techniques;
  - les commandes standards à utiliser;
  - les règles sécurité incontournables;
  - les règles de coûts;
  - les risques immédiats.
- Si aucun projet applicatif n'existe, ne crée pas encore l'app complète dans ce prompt; prépare seulement la feuille d'exécution.

Vérifications:
- Le document doit être cohérent avec `PLANIFICATION_RESQR_V2.md`.
- Le document doit être actionnable par un autre agent Codex.
- Aucun fichier applicatif lourd ne doit être créé dans ce prompt sauf documentation d'exécution.
```

---

## PROMPT 01 - Initialisation de l'application Next.js

```text
Lis `DESIGN_SYSTEM_RESQR_V2.md`, `PLANIFICATION_RESQR_V2.md` et `EXECUTION_RESQR_V2.md` si présents.

Objectif: initialiser la base applicative ResQR V2 avec Next.js, TypeScript et une structure propre pour un SaaS sécurisé.

Actions attendues:
- Si aucune app Next.js n'existe, initialise une application Next.js moderne dans le dossier courant.
- Utilise TypeScript.
- Installe et câble le design system:
  - importe `resqr-tokens.css` globalement (une seule fois);
  - utilise `tailwind.config.ts` fourni, qui pointe vers les variables `--rq-*`;
  - configure les polices Montserrat (UI) et JetBrains Mono (données typées);
  - vérifie que les classes du thème (`bg-surface`, `text-accent`, `h-control`, `rounded-md`) fonctionnent.
- Prévois une structure compatible avec:
  - app router;
  - modules métier;
  - composants UI;
  - librairies serveur;
  - intégration Supabase;
  - tests.
- Installe uniquement les dépendances nécessaires au socle.
- Crée une page d'accueil applicative minimale en dark theme, orientée produit opérationnel, pas une landing marketing.
- Ajoute un README de démarrage avec commandes de dev, build et test.
- Ajoute un `.env.example` sans secret réel.

Contraintes:
- Ne mets aucun secret dans le dépôt.
- Prépare le projet pour Vercel.
- Garde l'interface sobre, efficace, adaptée à une application métier critique.
- Aucune couleur, police, hauteur ou rayon en dur: tout passe par les tokens.

Vérifications:
- Lance l'installation.
- Lance le lint si disponible.
- Lance le build si possible.
- Démarre le serveur local si pertinent et indique l'URL.
```

---

## PROMPT 02 - Socle Supabase, schéma initial et RLS

```text
Lis `CONVENTIONS_RESQR_V2.md` et `PERIMETRE_ALPHA_RESQR_V2.md` s'ils existent, puis `PLANIFICATION_RESQR_V2.md`. Utilise les bonnes pratiques Supabase actuelles et vérifie la documentation officielle si nécessaire.

Les fonctionnalités structure mère/filles (supervision, facturation groupée, stock mutualisé) sont Hors alpha selon `PERIMETRE_ALPHA_RESQR_V2.md`. Crée la table `structure_relationships` et les RLS de cloisonnement dès maintenant, mais n'implémente aucune fonctionnalité mère/fille en alpha.

Objectif: créer le socle base de données Supabase pour ResQR V2 avec isolation stricte par structure.

Actions attendues:
- Prépare les migrations Supabase pour les tables de base:
  - structures;
  - structure_types (table extensible gérée par admin plateforme, seed initial: Ambulance, SMUR, AASC, Centre Français de Secourisme, Croix-Rouge française, Croix Blanche, FFSS, Protection Civile, Secours animalier, Sapeurs Pompiers);
  - structure_relationships pour structure mère/fille;
  - profiles utilisateurs si nécessaire;
  - structure_memberships;
  - roles;
  - role_permissions;
  - membership_permission_overrides;
  - audit_events;
  - plans;
  - structure_plan_subscriptions ou équivalent;
  - feature_flags ou plan_features.
- Active RLS sur toutes les tables exposées.
- Écris les politiques RLS minimales:
  - un utilisateur ne voit que les structures dont il est membre;
  - une structure mère ne voit une structure fille que via une relation explicite et des permissions dédiées;
  - la facturation groupée ne donne pas automatiquement accès aux données opérationnelles;
  - les memberships sont bornés à la structure;
  - les rôles/permissions sont bornés à la structure ou aux rôles système autorisés;
  - l'audit est consultable seulement par permissions adaptées;
  - les inserts/updates sensibles doivent être restreints.
- Ajoute les index nécessaires pour structure_id, user_id, role_id et timestamps.
- Prévois un modèle d'audit immuable: pas d'update/delete direct sur les événements.
- Prévois dès le schéma les futurs besoins:
  - supervision mère/filles;
  - facturation groupée;
  - stock mutualisable optionnel entre structures liées.

Contraintes:
- Ne jamais utiliser `user_metadata` pour autoriser une action.
- Ne jamais exposer la clé service côté client.
- Refus par défaut si l'appartenance ou la permission n'est pas prouvée.

Vérifications:
- Lance les migrations localement si l'environnement Supabase local est disponible.
- Ajoute ou prépare des tests SQL/RLS démontrant qu'un utilisateur de structure A ne lit pas structure B.
- Documente les commandes nécessaires si l'environnement Supabase n'est pas encore configuré.
```

---

## PROMPT 03 - Authentification, multi-structure et sélection de structure active

```text
Lis `PLANIFICATION_RESQR_V2.md` et le schéma Supabase existant.

Objectif: implémenter le socle d'authentification et de navigation multi-structure.

Actions attendues:
- Configure le client Supabase côté serveur et côté client de manière sécurisée.
- Implémente:
  - connexion utilisateur;
  - déconnexion;
  - récupération de session;
  - liste des structures accessibles;
  - sélection de structure active;
  - garde d'accès aux routes applicatives;
  - affichage de la structure active.
- Prépare les flux:
  - invitation par admin;
  - inscription via code organisation à 6 caractères;
  - création par admin avec lien de mot de passe.
- Si certains flux ne peuvent pas être terminés sans configuration externe, crée les interfaces, types et TODO techniques précis.

Contraintes:
- Toutes les requêtes métier doivent être bornées à la structure active.
- Aucune donnée d'une autre structure ne doit être chargée côté client.
- L'état "structure active" ne doit pas être une autorisation suffisante; il doit être vérifié côté serveur/base.

Vérifications:
- Tests ou scénarios manuels:
  - utilisateur sans structure;
  - utilisateur avec une structure;
  - utilisateur avec plusieurs structures;
  - tentative d'accès à une structure non autorisée.
- Build et lint.
```

---

## PROMPT 04 - Modèle des moyens, QR codes et contenant/contenu

```text
Lis `PLANIFICATION_RESQR_V2.md`.

Objectif: implémenter le modèle métier central des moyens: véhicules, matériels, QR codes et relations contenant/contenu.

Actions attendues:
- Ajoute les migrations et types pour:
  - asset_families;
  - assets;
  - asset_relationships;
  - asset_qr_codes ou champ QR unique;
  - asset_files si nécessaire;
  - asset_status_cache si retenu.
- Les moyens doivent supporter:
  - type véhicule ou matériel;
  - nom;
  - identifiant interne;
  - famille;
  - structure_id;
  - statut courant;
  - archive;
  - parent/enfant.
- Implémente les premières pages:
  - liste des moyens;
  - création d'un moyen;
  - fiche détail;
  - affichage du QR ou lien QR;
  - visualisation des enfants et du parent.
- Ajoute les règles RLS nécessaires.
- Ajoute un événement d'audit à la création, modification, archivage et déplacement d'un moyen.

Contraintes:
- Le QR code est un pointeur, jamais une autorisation.
- Un enfant rouge devra pouvoir faire passer le parent rouge dans le futur moteur de statut.
- Les relations doivent éviter les cycles parent/enfant.

Vérifications:
- Tests de création véhicule et matériel.
- Tests d'isolation structure.
- Test de relation parent/enfant.
- Build et lint.
```

---

## PROMPT 05 - Moteur de statut recalculable

```text
Lis `CONVENTIONS_RESQR_V2.md`, `MATRICE_STATUT_RESQR_V2.md` et `PLANIFICATION_RESQR_V2.md`, notamment la section "Moteur De Statut".

Objectif: implémenter un premier moteur de statut unique pour chaque moyen.

Actions attendues:
- Crée les types de statut:
  - noir;
  - vert;
  - jaune;
  - rouge.
- Respecte strictement la matrice:
  - noir=0;
  - vert=1;
  - jaune=2;
  - rouge=3;
  - le pire état gagne;
  - les causes archivées/résolues sont ignorées du statut courant;
  - les causes actives restent affichables.
- Implémente une fonction serveur testable qui calcule le statut depuis les faits disponibles.
- Pour cette première version, prends en compte au minimum:
  - moyen jamais vérifié: noir;
  - moyen conforme: vert;
  - panne à surveiller ou mineure: jaune;
  - panne dangereuse ou critique: rouge;
  - enfant jaune ou rouge: propagation au parent selon pire état;
  - archive ignorée dans le statut courant.
- Le stock possède ses propres états vert/orange/rouge; il ne doit impacter le statut global d'un moyen que si une règle métier explicite est ajoutée.
- Prévois une structure `status_causes` ou équivalent pour expliquer pourquoi un statut est affiché.
- Mets à jour le statut cache après événement critique si le modèle choisi le prévoit.
- Ajoute une vue ou section UI "Pourquoi ce statut ?".

Contraintes:
- Le statut affiché doit être recalculable.
- Les causes doivent être compréhensibles par un utilisateur métier.
- Le pire état gagne.

Vérifications:
- Tests unitaires du moteur:
  - noir sans vérification;
  - vert sans alerte;
  - jaune avec panne mineure;
  - rouge avec panne dangereuse;
  - parent rouge si enfant rouge;
  - panne archivée ignorée.
- Build et lint.
```

---

## PROMPT 06 - Checklists configurables et vérifications signées

```text
Lis `PLANIFICATION_RESQR_V2.md`, sections checklists, vérifications et conformité.

Objectif: créer le socle checklist builder + exécution de vérification.

Actions attendues:
- Ajoute le modèle de données pour:
  - checklist_templates;
  - checklist_sections;
  - checklist_fields;
  - asset_checklist_assignments;
  - verification_runs;
  - verification_answers;
  - verification_signatures;
  - verification_events si nécessaire.
- Types de champs initiaux:
  - texte court;
  - texte long;
  - nombre;
  - case à cocher;
  - choix simple;
  - choix multiple;
  - date;
  - mois/année de péremption;
  - quantité;
  - seuil minimal;
  - photo/pièce jointe en modèle prévu;
  - signature;
  - numéro de scellé;
  - commentaire;
  - section.
- Implémente une UI minimale:
  - liste des modèles;
  - création d'un modèle;
  - ajout de champs;
  - assignation à un moyen;
  - lancement d'une vérification;
  - saisie des réponses;
  - signature finale.
- Une vérification signée devient non modifiable.
- Chaque réponse doit tracer l'auteur.

Contraintes:
- Un champ optionnel vide ne bloque pas la signature.
- Un champ obligatoire vide bloque la signature.
- Ne pas modifier une vérification signée; créer une nouvelle vérification si besoin.

Vérifications:
- Test champ obligatoire.
- Test champ optionnel.
- Test signature.
- Test impossibilité de modifier après signature.
- Test auteur par réponse.
- Build et lint.
```

---

## PROMPT 07 - Temps réel multi-utilisateur

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, `COUTS_GARDE_FOUS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`, surtout les exigences de fluidité temps réel.

Objectif: rendre les changements métier visibles sans rafraîchissement manuel.

Actions attendues:
- Configure Supabase Realtime pour les données nécessaires.
- Implémente les abonnements bornés à la structure active pour:
  - moyens;
  - statuts;
  - pannes;
  - tâches;
  - messages;
  - réponses de vérification.
- Sur une vérification ouverte par plusieurs utilisateurs:
  - afficher les réponses ajoutées par les autres;
  - conserver l'auteur par champ;
  - éviter l'écrasement silencieux.
- Prévois le mode "vérificateur unique" désactivant la saisie simultanée pour une checklist.
- Ajoute des indicateurs discrets de synchronisation ou conflit si utile.

Contraintes:
- Les subscriptions doivent être filtrées par structure.
- Ne pas charger de données inter-structure côté client.
- L'interface doit rester fluide sur listes longues.
- Ne pas ouvrir d'abonnements globaux inutiles.
- Les abonnements doivent être limités à l'écran actif, au module actif et au périmètre utile.
- Instrumenter ou préparer l'instrumentation des connexions realtime, egress et événements par structure.

Vérifications:
- Ouvrir deux sessions et vérifier qu'une panne apparaît sans refresh.
- Ouvrir deux sessions sur une checklist et vérifier la synchronisation des réponses.
- Vérifier que la structure active filtre bien les événements.
- Vérifier qu'une page fermée ou un changement de module coupe les abonnements inutiles.
- Build et lint.
```

---

## PROMPT 08 - Pannes, tâches, rendez-vous et messagerie

```text
Lis `PLANIFICATION_RESQR_V2.md`, sections modules métier.

Objectif: implémenter les principaux modules terrain observés dans Bubble.

Actions attendues:
- Ajoute ou complète les modèles:
  - breakdowns;
  - tasks;
  - appointments;
  - messages;
  - system_events si distinct de audit_events.
- Pannes:
  - création;
  - édition selon droits;
  - archivage audité;
  - impact à surveiller, mineur, dangereux, critique/HS;
  - lien véhicule ou matériel;
  - génération de message système;
  - recalcul statut.
- Tâches:
  - titre, description, statut, priorité, échéance, assigné;
  - lien moyen, panne ou rendez-vous;
  - vues liste et kanban simple;
  - historique et notifications.
- Rendez-vous:
  - calendrier ou liste datée;
  - lien véhicule/matériel/panne/tâche;
  - prestataire, notes, documents prévus;
  - impact possible sur statut ou briefing.
- Messagerie:
  - messages humains libres;
  - événements système automatiques;
  - filtres;
  - code couleur distinct des statuts LED.

Contraintes:
- Chaque action critique doit générer audit immuable.
- Les listes doivent être paginées ou limitées pour éviter les freezes Bubble observés.
- Les dropdowns doivent charger les options efficacement.

Vérifications:
- Créer une panne dangereuse et constater statut rouge.
- Archiver la panne et constater retrait de l'impact courant.
- Créer une tâche assignée et la déplacer de statut.
- Créer un rendez-vous lié à un moyen.
- Vérifier message système automatique.
- Build et lint.
```

---

## PROMPT 08B - Module Fluides (O2 et gaz médicaux)

```text
Lis `CONVENTIONS_RESQR_V2.md`, `PERIMETRE_ALPHA_RESQR_V2.md`, `MATRICE_STATUT_RESQR_V2.md` et `DESIGN_SYSTEM_RESQR_V2.md` s'ils existent, puis `PLANIFICATION_RESQR_V2.md`.

Ce module est dans l'alpha selon `PERIMETRE_ALPHA_RESQR_V2.md`. Il est attendu par les SMUR et ambulances, en particulier pour le suivi de l'oxygène et autres gaz médicaux.

Objectif: implémenter un suivi de niveau de fluides par véhicule, alimenté par les checklists, avec impact sur le statut.

Contexte:
- Le fluide a un niveau continu, pas un stock discret par zone.
- Le niveau est mis à jour par un champ "niveau" ou "quantité" rempli dans une checklist véhicule.
- Plusieurs fluides peuvent coexister sur un véhicule (O2 principal, O2 secours, etc.).

Actions attendues:
- Crée le modèle:
  - fluid_catalog (référentiel des fluides: nom, unité, type);
  - vehicle_fluid_lines (un fluide attaché à un véhicule, avec capacité max et seuils);
  - fluid_readings (chaque relevé horodaté, auteur, valeur, source: checklist ou saisie manuelle);
  - fluid_thresholds intégrés à vehicle_fluid_lines ou table dédiée selon design.
- Catalogue fluides:
  - nom (ex. O2);
  - unité (litres, bars, %);
  - type (gaz médical, carburant, autre).
- Ligne fluide véhicule:
  - véhicule;
  - fluide;
  - capacité de référence;
  - seuil jaune (bas);
  - seuil rouge (critique);
  - niveau courant cache;
  - dernier relevé.
- Lien checklist → fluide:
  - un item de checklist de type "niveau" peut être lié à une ligne fluide véhicule;
  - à la signature de la vérification, le niveau saisi met à jour la ligne fluide et crée un fluid_reading.
- Impact moteur de statut (respecter `MATRICE_STATUT_RESQR_V2.md`):
  - niveau ≤ seuil jaune et > seuil rouge: cause jaune sur le véhicule;
  - niveau ≤ seuil rouge: cause rouge sur le véhicule;
  - aucune lecture récente au-delà d'une période configurable: cause jaune.
- UI minimale:
  - sur la fiche véhicule, un bloc Fluides listant chaque ligne avec niveau actuel, seuils, sparkline des derniers relevés;
  - historique des relevés (qui, quand, combien);
  - création d'une ligne fluide sur véhicule;
  - administration du catalogue fluides au niveau structure.

Contraintes:
- Les relevés sont immuables une fois créés (comme les vérifications signées).
- L'auteur réel de chaque relevé doit être tracé.
- Audit immuable sur création de ligne, modification de seuils, et purge.
- RLS stricte par structure.

Vérifications:
- Création d'une ligne O2 sur un véhicule, seuils définis.
- Vérification véhicule avec champ niveau O2 → fluid_reading créé, ligne mise à jour.
- Niveau passé sous seuil jaune → cause jaune ajoutée au statut véhicule.
- Niveau passé sous seuil rouge → cause rouge.
- Historique consultable, immutabilité des relevés.
- Build et lint.
```

---

## PROMPT 09 - Accès QR, PIN invité 24h et sessions de confiance limitée

```text
Lis `PLANIFICATION_RESQR_V2.md`, section accès QR, connexion et PIN.

Objectif: implémenter le parcours QR sécurisé, avec accès compte connu ou invité temporaire par PIN.

Actions attendues:
- Crée les routes QR:
  - scan/lien public vers un moyen;
  - redirection vers connexion si nécessaire;
  - accès invité si PIN activé par la structure.
- Modèle à prévoir:
  - guest_access_policies;
  - guest_sessions ou guest_memberships;
  - pin_attempts;
  - trusted_devices si pertinent.
- Le PIN doit:
  - être activable/désactivable par admin structure;
  - créer un invité temporaire lié à la structure;
  - expirer après 24h par défaut;
  - limiter les droits;
  - journaliser les actions;
  - limiter les tentatives;
  - ne jamais donner accès à l'administration.
- Prévois un job de nettoyage/désactivation des invités expirés.

Contraintes:
- Le QR ne doit pas autoriser seul.
- L'invité doit être identifiable dans les audits.
- Les actions invitées doivent être bornées aux checklists/moyens autorisés.

Vérifications:
- Scan avec utilisateur connecté.
- Scan sans utilisateur, PIN désactivé.
- Scan sans utilisateur, PIN activé et valide.
- PIN invalide avec limitation d'essais.
- Invité expiré après simulation.
- Build et lint.
```

---

## PROMPT 09B - Module Stock QR-first non prioritaire alpha

```text
Lis `CONVENTIONS_RESQR_V2.md` et `PERIMETRE_ALPHA_RESQR_V2.md` s'ils existent, puis `PLANIFICATION_RESQR_V2.md`.

Ce module est Hors alpha selon `PERIMETRE_ALPHA_RESQR_V2.md`: conception du modèle et migrations autorisées, implémentation non bloquante pour l'alpha. Ne lance pas l'implémentation complète tant que les 17 parcours non négociables ne sont pas verrouillés.

Objectif: concevoir et, si le socle est prêt, implémenter le module Stock QR-first sans en faire une priorité alpha bloquante.

Contexte:
- Le Stock existe dans ResQR V1/Bubble mais n'est pas prioritaire pour l'alpha V2.
- Il doit rester fidèle à l'essence ResQR: un QR code relie le terrain au numérique.
- Le QR est placé sur une localisation de stock: local, armoire, étagère ou autre zone.
- Les invités autorisés peuvent accéder au stock.

Actions attendues:
- Crée ou prépare le modèle:
  - products;
  - product_suppliers;
  - product_labels;
  - storage_zones;
  - storage_zone_qr_codes;
  - stock_lines;
  - stock_movements.
- Catalogue produit:
  - nom;
  - fournisseur;
  - référence;
  - code-barres;
  - labels multiples.
- Zones de stockage:
  - hiérarchie trois niveaux minimum, par exemple local > armoire > étagère;
  - QR code par zone;
  - scan d'une zone parent affichant les lignes accessibles et raccourcis vers sous-zones.
- Lignes de stock:
  - produit + zone;
  - quantité;
  - seuil de pré-alerte;
  - seuil d'alerte;
  - état vert/orange/rouge;
  - sparkline d'évolution récente;
  - filtres par état, zone, produit, label;
  - seuils définis par ligne, donc différents pour un même produit selon la zone.
- Mouvements:
  - ajout ou retrait;
  - quantité;
  - produit;
  - zone;
  - utilisateur ou invité;
  - date/heure serveur;
  - motif optionnel;
  - source QR si applicable;
  - audit immuable.
- Sur chaque ligne de stock, afficher les cinq derniers mouvements avec qui a fait quoi, quand et combien.

Évolutions à prévoir sans forcément livrer en alpha:
- lien entre produit stock et item de checklist;
- réalimentation d'un véhicule/matériel depuis une réserve en un clic;
- exemple: retirer 5 compresses stériles de réserve 1 pour réalimenter une ambulance;
- mise à jour dynamique du stock source et du moyen cible;
- prochaine date de péremption connue par ligne;
- stock commun optionnel entre structure mère et structures filles.

Contraintes:
- Le stock a ses propres états vert/orange/rouge.
- Le stock ne doit impacter le statut global des moyens que via une règle explicite future.
- Toute action stock doit être bornée à la structure ou au périmètre de stock mutualisé autorisé.
- Les listes doivent être recherchables et paginées.

Vérifications:
- Créer un produit avec labels.
- Créer local > armoire > étagère.
- Créer une ligne de stock avec seuils.
- Scanner ou simuler le QR d'une zone.
- Ajouter et retirer une quantité.
- Vérifier les cinq derniers mouvements.
- Vérifier l'accès invité autorisé.
- Vérifier isolation structure et audit.
```

---

## PROMPT 10 - Administration structure

```text
Lis `PLANIFICATION_RESQR_V2.md`, section administration structure.

Objectif: créer l'espace d'administration pour les responsables de structure.

Actions attendues:
- Crée les pages d'administration structure:
  - utilisateurs;
  - invitations;
  - code organisation;
  - PIN invité;
  - rôles;
  - exceptions de permissions;
  - familles de moyens;
  - checklists;
  - alertes;
  - exports;
  - briefing;
  - rétention;
  - audit consultable selon droits.
- Implémente au minimum:
  - inviter un utilisateur;
  - créer un utilisateur avec lien de mot de passe ou flux préparé;
  - gérer un rôle;
  - modifier une exception de permission;
  - régénérer le code organisation;
  - activer/désactiver le PIN invité.

Contraintes:
- Seuls les rôles autorisés peuvent administrer.
- Chaque action admin doit être auditée.
- Les changements de permissions ne doivent jamais élargir l'accès au-delà de la structure.

Vérifications:
- Un non-admin ne peut pas ouvrir l'administration.
- Un admin peut inviter et modifier des permissions.
- Un changement de permission prend effet.
- Audit créé pour chaque action sensible.
- Build et lint.
```

---

## PROMPT 11 - Administration plateforme, plans SaaS et quotas

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`, sections admin plateforme, structures mère/filles et plans SaaS.

Objectif: mettre en place l'administration plateforme ResQR et le modèle plans/quotas/features.

Actions attendues:
- Crée un espace admin plateforme séparé de l'admin structure.
- Implémente les modèles ou écrans pour:
  - structures;
  - plans;
  - quotas;
  - feature flags;
  - incidents;
  - jobs;
  - exports;
  - consommation SMS;
  - accès support.
- Prévois les relations structure mère/filles:
  - rattacher une structure fille à une structure mère;
  - distinguer facturation groupée et supervision opérationnelle;
  - permettre une vision globale des structures filles selon permissions;
  - préparer le stock mutualisable optionnel.
- Les plans doivent combiner:
  - quotas quantitatifs;
  - fonctionnalités activées/désactivées.
- La facturation groupée doit permettre à une structure mère de payer pour elle-même et ses structures filles.
- Les quotas doivent empêcher la création au-delà de la limite sans masquer ou supprimer les données existantes.
- Tout accès aux données client depuis l'admin plateforme doit être journalisé avec justification si sensible.

Contraintes:
- L'admin plateforme ne doit pas contourner silencieusement l'audit.
- Les rôles support et administrateur plateforme doivent être distincts.
- L'accès plateforme doit être ultra-restrictif.

Vérifications:
- Un admin structure ne peut pas accéder à l'admin plateforme.
- Un admin plateforme voit la liste des structures.
- Une structure mère peut être liée à une structure fille.
- La facturation groupée ne donne pas automatiquement accès aux données opérationnelles.
- Un dépassement de quota bloque une création concernée.
- Une consultation sensible exige ou enregistre une justification.
- Build et lint.
```

---

## PROMPT 12 - Exports XLS, CSV, PDF et conformité

```text
Lis `PLANIFICATION_RESQR_V2.md`, sections exports et conformité.

Objectif: implémenter les exports conformité XLS, CSV et PDF.

Actions attendues:
- Crée un service d'export commun.
- Formats:
  - XLS;
  - CSV;
  - PDF.
- Données exportables:
  - moyens;
  - checklists;
  - vérifications signées;
  - pannes;
  - tâches;
  - rendez-vous;
  - audit;
  - statuts et causes.
- Filtres:
  - structure;
  - période;
  - moyen;
  - famille;
  - checklist;
  - statut;
  - utilisateur;
  - type d'événement;
  - module;
  - archivés ou actifs.
- Chaque export doit être journalisé.
- Les permissions d'export doivent être vérifiées.

Contraintes:
- Les vérifications signées ne doivent pas être altérées.
- Les exports doivent respecter la structure active.
- Les données personnelles doivent respecter la politique de rétention.

Vérifications:
- Export CSV filtré.
- Export XLS filtré.
- Export PDF lisible.
- Tentative d'export sans permission refusée.
- Audit d'export créé.
- Build et lint.
```

---

## PROMPT 13 - Jobs, alertes, briefing email et SMS payant

```text
Lis `PLANIFICATION_RESQR_V2.md`, sections notifications, briefing et jobs.

Objectif: mettre en place les traitements planifiés et notifications.

Actions attendues:
- Prévois les jobs pour:
  - recalcul nocturne des statuts;
  - détection péremptions proches;
  - détection péremptions atteintes;
  - retards de vérification;
  - nettoyage invités 24h;
  - briefing email;
  - alertes critiques;
  - monitoring jobs.
- Crée les tables nécessaires:
  - notification_preferences;
  - notifications;
  - email_briefing_settings;
  - sms_usage ou équivalent.
- Implémente notifications app.
- Prépare email briefing configurable par structure.
- Prépare SMS uniquement si feature flag et quota du plan l'autorisent.

Contraintes:
- Les SMS doivent être protégés par plan, quota et anti-abus.
- Les jobs doivent être idempotents.
- Les erreurs de jobs doivent être observables.

Vérifications:
- Simuler un recalcul de statut.
- Simuler une péremption.
- Générer une notification app.
- Générer ou prévisualiser un briefing email.
- Vérifier blocage SMS si plan non autorisé.
- Build et lint.
```

---

## PROMPT 14 - Migration Bubble: outils d'import et mapping

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`, section stratégie V1/V2 et migration Bubble.

Objectif: préparer une chaîne de migration Bubble vers ResQR V2, en partant du principe que ResQR V1 reste en production et que la migration peut être partielle.

Actions attendues:
- Crée un dossier de migration documenté.
- Prévois une structure pour déposer des exports Bubble JSON, NDJSON ou CSV.
- Crée un document `MIGRATION_BUBBLE_RESQR_V2.md` avec:
  - stratégie V1 en production / V2 en reconstruction;
  - migration utilisateurs possible mais pas garantie parfaite;
  - procédure d'export;
  - mapping attendu;
  - règles de nettoyage;
  - limites connues;
  - procédure d'import test;
  - procédure de bascule.
- Crée des scripts ou commandes pour:
  - analyser les colonnes/champs;
  - détecter relations;
  - transformer vers le modèle ResQR V2;
  - importer dans un environnement test;
  - produire un rapport d'erreurs.
- Ne pas supposer que les workflows Bubble sont importables.
- Ne pas supposer que 100% des données Bubble seront exportables sans perte de relations.

Contraintes:
- Les données importées doivent être rattachées à une structure.
- Les historiques importés doivent être distingués des événements natifs V2.
- Les fichiers manquants doivent être signalés.
- Les utilisateurs migrés peuvent nécessiter un reset de mot de passe ou une réinvitation.
- Toute donnée non migrable doit être classée: abandonnée, archivée, à ressaisir, à migrer manuellement.

Vérifications:
- Utiliser un petit jeu d'exemple factice si aucun export réel n'est disponible.
- Générer un rapport de mapping.
- Générer un rapport "migrable / partiel / non migrable".
- Vérifier qu'aucune donnée test ne pollue la production.
```

---

## PROMPT 15 - Sécurité, RLS, conformité et tests de non-régression

```text
Lis `PLANIFICATION_RESQR_V2.md` et inspecte tout le projet.

Objectif: durcir ResQR V2 avant pilote contrôlé.

Actions attendues:
- Audite toutes les tables exposées:
  - RLS activée;
  - politiques cohérentes;
  - index de structure;
  - permissions minimales.
- Audite l'application:
  - aucune clé service côté client;
  - aucun accès admin sans permission;
  - aucune route métier sans structure active validée;
  - fichiers privés;
  - exports journalisés.
- Ajoute ou complète les tests:
  - RLS multi-tenant;
  - permissions lecture/écriture/admin/export;
  - invitation et code organisation;
  - PIN invité;
  - vérification signée immuable;
  - statut et propagation parent/enfant;
  - exports;
  - temps réel;
  - performance listes longues.
- Ajoute une checklist de sécurité `SECURITY_CHECKLIST_RESQR_V2.md`.

Contraintes:
- Refus par défaut.
- Aucun contournement "temporaire" de sécurité.
- Les tests doivent couvrir au moins deux structures et plusieurs rôles.

Vérifications:
- Lancer test suite.
- Lancer lint.
- Lancer build.
- Résumer les risques restants.
```

---

## PROMPT 16 - Revue UX métier et correction des freezes Bubble

```text
Lis `PLANIFICATION_RESQR_V2.md`, surtout les bugs de performance Bubble mentionnés indirectement par les exigences.

Objectif: améliorer l'expérience terrain et éviter les freezes observés dans l'application Bubble.

Actions attendues:
- Audite les écrans principaux:
  - liste moyens;
  - détail véhicule;
  - détail matériel;
  - pannes;
  - tâches;
  - checklists;
  - messagerie;
  - admin.
- Corrige ou préviens:
  - listes non paginées;
  - dropdowns chargeant trop de données;
  - rendus excessifs;
  - requêtes N+1;
  - absence de feedback sauvegarde;
  - composants trop lourds.
- Ajoute:
  - pagination ou virtualisation;
  - recherche côté serveur;
  - états de chargement;
  - états d'erreur;
  - feedback temps réel;
  - messages de sauvegarde;
  - protections contre double clic.
- Vérifie desktop et mobile.

Contraintes:
- Application métier dense, sobre, rapide.
- Pas de landing page marketing à la place de l'expérience utile.
- Les statuts doivent être visibles immédiatement.

Vérifications:
- Tester les parcours:
  - ouvrir détails;
  - créer panne;
  - éditer panne;
  - ouvrir dropdown véhicule;
  - scroller une longue liste;
  - remplir checklist;
  - recevoir mise à jour temps réel.
- Build, lint et test navigateur si possible.
```

---

## PROMPT 17 - Préparation pilote contrôlé

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md` et inspecte le projet complet.

Objectif: préparer ResQR V2 pour un pilote contrôlé avec une ou plusieurs structures test.

Actions attendues:
- Crée une checklist `PILOTE_RESQR_V2.md`.
- Vérifie que les parcours suivants sont prêts:
  - création structure;
  - invitation utilisateur;
  - changement de structure active;
  - création véhicule;
  - création matériel;
  - QR code;
  - accès PIN invité;
  - checklist;
  - vérification signée;
  - panne;
  - tâche;
  - rendez-vous;
  - statut recalculé;
  - messagerie;
  - export;
  - audit;
  - stock si le module a été activé pour le pilote.
- Prépare des données de démonstration réalistes.
- Prépare un plan de retour utilisateur:
  - bugs;
  - lenteurs;
  - incompréhensions;
  - manques fonctionnels;
  - sécurité;
  - conformité.
- Identifie les fonctionnalités à bloquer derrière feature flags si elles ne sont pas prêtes.

Contraintes:
- Le pilote ne doit pas exposer de données réelles sans validation sécurité.
- Les comptes invités et SMS doivent être contrôlés.
- Les exports et audits doivent être vérifiés avant usage terrain.

Vérifications:
- Lancer build.
- Lancer tests.
- Faire un parcours bout-en-bout.
- Résumer clairement ce qui est prêt, partiel ou bloquant.
```

---

## PROMPT 18 - Revue finale de cohérence avec `PLANIFICATION_RESQR_V2.md`

```text
Lis `CONVENTIONS_RESQR_V2.md` s'il existe, puis `PLANIFICATION_RESQR_V2.md`, puis inspecte l'application ResQR V2.

Objectif: vérifier que l'application implémentée reste alignée avec le plan initial.

Actions attendues:
- Crée un rapport `ALIGNEMENT_PLAN_RESQR_V2.md`.
- Compare le projet avec les exigences du plan:
  - cible produit;
  - multi-structure;
  - sécurité;
  - conformité;
  - temps réel;
  - statut unique;
  - checklists;
  - modules métier;
  - QR/PIN;
  - exports;
  - admin structure;
  - admin plateforme;
  - structures mère/filles;
  - stock QR-first;
  - migration Bubble;
  - tests.
- Classe chaque exigence:
  - fait;
  - partiel;
  - absent;
  - bloqué;
  - à décider.
- Propose un backlog priorisé pour fermer les écarts.
- Signale toute dette de sécurité ou conformité comme priorité haute.

Vérifications:
- Le rapport doit être précis, exploitable et honnête.
- Les écarts critiques doivent avoir une action proposée.
- Aucun point sécurité ne doit être minimisé.
```
