# PERIMETRE ALPHA RESQR V2

## 0. Rôle De Ce Document

Ce document définit la ligne de coupe de l'alpha ResQR V2. Il prime sur l'envie d'exhaustivité. Tout ce qui n'est pas listé en "Dans l'alpha" est explicitement hors alpha, même si le plan le décrit en détail.

Règle unique: l'alpha s'arrête au plus petit produit qu'un premier client ADPC réel peut utiliser sur le terrain pour sécuriser ses vérifications et son agrément. Pas un clone de V1.

Critère de bascule alpha: une structure ADPC pilote peut équiper ses véhicules et matériels, faire ses vérifications signées tracées, surfacer ses anomalies, et produire un export opposable en audit, sans repasser par Bubble.

## 1. Parcours Non Négociables

Ces parcours doivent fonctionner de bout en bout, sur desktop et mobile, avec sécurité et audit, avant tout pilote réel.

1. Création de structure et connexion d'un compte propriétaire.
2. Invitation d'un utilisateur et activation de son compte.
3. Changement de structure active sans fuite de données.
4. Création d'un véhicule avec QR code.
5. Création d'un matériel avec QR code, rattachable à un véhicule parent.
6. Scan QR menant au jumeau numérique, avec accès compte connu.
7. Accès invité par PIN 24h, droits limités, actions tracées sous identité invitée.
8. Création et assignation d'une checklist à un moyen.
9. Exécution d'une vérification, signature nominative, immutabilité après signature.
10. Calcul et affichage du statut LED avec la vue "pourquoi ce statut".
11. Création d'une panne avec impact statut correct (dangereux/critique = rouge).
12. Gestion des tâches: création, assignation, statut, échéance, lien vers moyen/panne/rendez-vous.
13. Rendez-vous et maintenance: création datée, lien vers moyen/panne, prestataire, affichage briefing.
14. Module Hygiène dédié: procédures préétablies suivies par fréquence, détection des retards, preuve de réalisation exploitable comme justificatif ARS.
15. Module Fluides: catalogue de fluides (O2, autres gaz médicaux), niveau par véhicule alimenté par checklist, seuils d'alerte, impact sur le statut du véhicule.
16. Fil système affichant les événements automatiques clés.
17. Export conformité PDF, CSV et XLS filtrable, journalisé, respectant les permissions.
18. Audit immuable consultable selon permission.

Si un seul de ces 18 parcours n'est pas prêt, l'alpha n'est pas prête.

## 2. Dans L'Alpha

### Modèle et sécurité
- Structures, appartenances, structure active.
- Rôles initiaux réduits: propriétaire, admin structure, vérificateur, utilisateur terrain, invité PIN, lecture seule.
- RLS stricte, refus par défaut, audit immuable.

### Moyens
- Véhicules et matériels.
- QR code pointeur.
- Relation parent/enfant simple avec propagation de statut.
- Familles de moyens.

### Vérifications
- Checklist builder avec les types de champs essentiels: texte, nombre, case, choix simple, date, mois/année de péremption, quantité, seuil, photo, signature, commentaire.
- Vérification simultanée par défaut, mode vérificateur unique disponible.
- Signature et immutabilité.

### Statut
- Moteur déterministe selon `MATRICE_STATUT_RESQR_V2.md`.
- Causes stockées et explicables.
- Recalcul sur événement + recalcul nocturne.

### Modules terrain
- Pannes avec impact statut.
- Péremptions avec alerte avant échéance et bascule en périmé.
- Tâches: création, assignation, statut, priorité, échéance, liens vers moyen/panne/rendez-vous, vue liste. Kanban drag-and-drop et calendrier tolérés si peu coûteux, sinon repoussés.
- Rendez-vous et maintenance: version datée avec liens moyen/panne, prestataire, notes, affichage briefing.
- Hygiène: module dédié, procédures préétablies par type de moyen, suivi par fréquence, détection des retards, preuve de réalisation, export conformité ARS.
- Fluides: catalogue de fluides (O2 et gaz médicaux en priorité), niveau par véhicule, alimentation par champ "quantité" ou "niveau" dans les checklists, seuils d'alerte par fluide, impact statut véhicule selon seuil (bas = jaune, critique = rouge).
- Fil système (événements automatiques). Messages humains libres tolérés mais non prioritaires.

### Accès
- Compte nominatif, invitation admin, code organisation.
- PIN invité 24h avec nettoyage automatique.

### Conformité
- Export PDF, CSV et XLS filtrables, journalisés, conformes aux vérifications signées.
- Audit consultable.

### Notifications
- Briefing email configurable par structure (version simple).
- Notifications in-app basiques.

## 3. Hors Alpha (Prévu, Non Bloquant)

À bloquer derrière feature flags ou à laisser en conception sans implémentation tant que les 14 parcours ne sont pas verrouillés.

- Module Stock QR-first (zones, lignes, mouvements, sparkline, consommation depuis checklist). Conçu, pas livré en alpha.
- Structures mère/filles: facturation groupée, supervision, stock mutualisé. Modèle posé, fonctionnalités hors alpha.
- SMS payant et quotas SMS.
- Tâches avancées au-delà de la version alpha: automatisations, dépendances entre tâches, rappels multiples.
- Administration plateforme complète: un accès admin minimal suffit, l'espace plateforme complet est hors alpha.
- Plans SaaS et quotas avancés, feature flags fins, pack conformité.
- MFA, rotation de code organisation, trusted devices avancés.
- Migration Bubble automatisée: l'alpha peut démarrer sur données saisies/démo, la migration vient après validation pilote.
- Messagerie humaine riche, pièces jointes dans messages, recherche avancée.

## 4. Hors Périmètre V2 Tant Que MRR Non Stable

- Toute fonctionnalité réclamée par un seul prospect non payant.
- Toute intégration tierce non indispensable au pilote.
- Toute optimisation de coût prématurée au-delà des garde-fous de `COUTS_GARDE_FOUS_RESQR_V2.md`.

## 5. Règle D'Arbitrage En Cours De Route

Avant d'ajouter quoi que ce soit à l'alpha, répondre oui aux trois:

1. Est-ce nécessaire à l'un des 18 parcours non négociables ?
2. Un premier client ADPC refuserait-il de basculer sans cette fonctionnalité ?
3. Est-ce exigible en audit ARS ou préfectoral à court terme ?

Si une seule réponse est non, c'est hors alpha.

## 6. Critère De Fin D'Alpha

L'alpha est terminée quand:

- les 18 parcours passent un test bout-en-bout sur deux structures et plusieurs rôles;
- l'isolation inter-structure est prouvée par tests RLS automatisés;
- un export PDF/CSV conforme et journalisé est produit et vérifié;
- aucune dette de sécurité ou de conformité n'est ouverte en priorité haute;
- un premier client ADPC pilote peut être équipé sans recours à Bubble.
