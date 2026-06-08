# PLANIFICATION RESQR V2

## 1. Résumé Exécutif

ResQR V2 doit reconstruire l'application Bubble existante sous forme de SaaS moderne, sécurisé et conforme, destiné à la gestion de véhicules et matériels critiques. L'objectif n'est pas de créer un MVP réduit, mais de planifier une réécriture complète des fonctionnalités métier connues, tout en tenant compte du passif ResQR V1, des clients actifs et d'une migration utilisateur/données qui pourra être partielle si Bubble ne permet pas d'exporter 100% des données sans perte de relations.

Le principe central est la source unique de vérité: chaque objet physique critique possède un jumeau numérique dans ResQR. Ce jumeau numérique porte son identité, ses relations, ses contrôles, ses alertes, ses pannes, ses échéances, ses preuves et son statut opérationnel. L'affichage peut être optimisé ou mis en cache, mais les faits métier doivent rester recalculables et auditables.

Les priorités non négociables sont:

- fluidité proche de Bubble, avec mises à jour visibles sans rafraîchir la page;
- sécurité par défaut, avec isolation stricte entre structures;
- conformité, auditabilité et traçabilité nominative;
- statut unique fiable pour chaque moyen;
- modèle multi-structure permettant à un utilisateur de changer de structure active;
- liens structure mère / structures filles pour facturation, supervision et options opérationnelles;
- architecture évolutive permettant d'ajouter de nouveaux champs, modules et plans SaaS.

## 2. Cible Produit

ResQR V2 est une application SaaS multi-structure pour équipes de secours, ambulances, SMUR, associations agréées, sapeurs-pompiers et organisations gérant du matériel opérationnel critique.

Chaque structure dispose de son propre espace, de ses utilisateurs, de ses rôles, de ses moyens, de ses checklists, de ses exports, de ses plans, de ses alertes et de ses règles de fonctionnement. Un utilisateur peut appartenir à plusieurs structures et changer de structure active sans mélange de données.

ResQR V1 sur Bubble reste la production active jusqu'à ce que ResQR V2 soit prêt à basculer. La reconstruction doit donc tenir compte des utilisateurs existants et prévoir une migration prudente, mais ne doit pas supposer qu'un import complet et parfait sera possible.

Les modules métier à couvrir dans la planification sont:

- véhicules;
- matériels, sacs, lots, kits et appareils;
- jumeaux numériques;
- QR codes;
- familles et catégories personnalisables;
- checklists et procédures;
- vérifications de routine;
- suivi des péremptions;
- hygiène et bionettoyage;
- pannes;
- rendez-vous et maintenance;
- tâches;
- messagerie et fil système;
- stock QR-first;
- alertes temps réel;
- briefing email;
- SMS sur plans payants;
- exports XLS, CSV et PDF;
- administration structure;
- administration plateforme;
- migration Bubble.

## 3. Architecture Cible

La cible technique retenue est:

- frontend et application: Next.js;
- hébergement applicatif: Vercel;
- base de données: Supabase Postgres;
- authentification: Supabase Auth;
- temps réel: Supabase Realtime;
- fichiers et pièces jointes: Supabase Storage;
- sécurité base: Row Level Security stricte;
- journalisation: table d'événements immuables;
- sauvegarde: PITR et exports par structure;
- jobs planifiés: tâches nocturnes de recalcul, alertes, briefing et nettoyage invités;
- monitoring: logs, erreurs, performance, jobs et accès sensibles.

Le backend ne doit pas être pensé comme un simple CRUD. Les opérations critiques doivent passer par des règles métier contrôlées: vérification des droits, écriture des faits, émission d'événements d'audit, recalcul de statut, notification temps réel et éventuelle génération de tâches ou messages système.

### 3.1 Principes Techniques

- La base Postgres est la source de vérité.
- Les données exposées à l'interface sont filtrées par structure active et permissions.
- Les statuts affichés peuvent être matérialisés pour la performance, mais doivent toujours être recalculables depuis les faits.
- Les opérations sensibles doivent être idempotentes autant que possible.
- Les listes longues doivent être paginées ou virtualisées.
- Les champs extensibles doivent être modélisés sans rendre les exports et audits impossibles.
- Les fichiers doivent rester privés par défaut, avec accès signé et permissions vérifiées.
- Les événements métier critiques ne doivent pas être supprimés ni modifiés.
- Les coûts Supabase/Vercel doivent être instrumentés dès le départ: connexions temps réel, egress, stockage, fonctions, jobs, exports et SMS.
- Les abonnements temps réel doivent être ciblés par structure, module et écran actif; ne jamais souscrire inutilement à toute la base d'une structure.

## 4. Modèle Métier Central

### 4.1 Structures

Une structure représente un espace client isolé. Elle porte:

- nom et informations administratives;
- type d'organisation;
- plan SaaS actif;
- quotas;
- options activées;
- paramètres de sécurité;
- paramètres de rétention;
- paramètres de briefing;
- règles d'accès invité par PIN;
- code organisation à 6 caractères si activé;
- configuration des alertes;
- configuration des exports.

Chaque donnée métier critique doit appartenir explicitement à une structure. Aucune requête côté client ne doit pouvoir accéder aux données d'une autre structure.

### 4.1.1 Structures Mères Et Filles

ResQR V2 doit prévoir des relations structure mère / structures filles.

Usages à couvrir:

- facturation groupée: une structure mère peut payer pour elle-même et pour ses structures filles;
- supervision: une structure mère peut obtenir une vision globale des structures filles selon permissions;
- exploitation opérationnelle: certaines données peuvent être consolidées ou supervisées;
- stock mutualisable optionnel: certaines structures peuvent partager une gestion de stock commune selon une configuration explicite.

Règles:

- une structure fille garde son espace et ses droits propres;
- la supervision mère/fille n'annule jamais l'isolation RLS;
- chaque accès depuis une structure mère doit être autorisé et audité;
- la facturation groupée ne donne pas automatiquement accès aux données opérationnelles;
- le partage de stock inter-structures doit être optionnel, paramétrable et explicitement journalisé.

### 4.2 Utilisateurs Et Appartenances

Un utilisateur peut appartenir à plusieurs structures. L'appartenance définit:

- structure;
- utilisateur;
- rôle principal;
- exceptions de permissions;
- statut d'invitation ou d'activation;
- date d'entrée;
- éventuelle date de suspension;
- préférences dans la structure.

L'utilisateur choisit une structure active. Toutes les vues, actions et souscriptions temps réel doivent être bornées à cette structure active.

### 4.3 Rôles Et Permissions

Le modèle retenu est "rôles + exceptions". Chaque structure peut utiliser des rôles prédéfinis puis ajuster des permissions par module et par action.

Permissions à prévoir:

- lecture;
- création;
- modification;
- archivage;
- export;
- administration;
- gestion utilisateurs;
- gestion checklists;
- accès aux données sensibles;
- gestion plans et options;
- accès invité;
- consultation audit.

Les rôles initiaux à prévoir:

- propriétaire structure;
- administrateur structure;
- responsable matériel;
- responsable véhicule;
- superviseur;
- vérificateur;
- utilisateur terrain;
- invité temporaire;
- lecture seule;
- support plateforme;
- administrateur plateforme.

Un même utilisateur peut être administrateur dans une structure et simple utilisateur dans une autre.

### 4.4 Moyens Et Jumeaux Numériques

Un moyen est un véhicule ou un matériel ayant une existence physique et un jumeau numérique.

Types initiaux:

- véhicule;
- sac;
- lot;
- kit;
- appareil;
- matériel isolé;
- contenant personnalisé.

Chaque moyen porte:

- structure;
- type;
- nom;
- identifiant interne;
- famille;
- QR code unique;
- statut courant;
- statut recalculable;
- relations contenant/contenu;
- checklists associées;
- pannes actives;
- rendez-vous;
- tâches liées;
- messages liés;
- historique;
- fichiers et preuves;
- état d'archivage.

Le QR code ne doit jamais devenir une autorisation en soi. Il est un pointeur vers le jumeau numérique; l'accès reste contrôlé par session, compte, PIN autorisé ou permissions.

### 4.5 Contenant Et Contenu

ResQR V2 doit supporter les relations parent/enfant. Exemple: une ambulance contient deux sacs de premiers secours; si le sac A devient rouge, l'ambulance doit passer rouge par propagation.

Règles:

- un moyen peut contenir plusieurs moyens;
- un moyen peut être déplacé d'un contenant à un autre avec journalisation;
- le statut d'un enfant peut impacter le statut du parent;
- la vue détail du parent doit expliquer quelles alertes enfants provoquent son statut;
- les historiques des enfants restent distincts mais consultables depuis le contenant.

## 5. Moteur De Statut

Chaque moyen possède un statut unique visible par LED:

- noir: jamais vérifié ou statut non établi;
- vert: conforme;
- jaune: vigilance requise;
- rouge: non conforme, critique, périmé, panne dangereuse ou blocage opérationnel.

Le statut est calculé en quasi temps réel depuis les faits métier. La règle générale est "le pire état gagne".

### 5.0 Matrice Déterministe

Ordre de priorité:

| Rang | Statut | Signification |
| --- | --- | --- |
| 0 | noir | statut non établi, jamais vérifié, données insuffisantes |
| 1 | vert | conforme |
| 2 | jaune | vigilance, pré-alerte, retard, anomalie non bloquante |
| 3 | rouge | non conforme, critique, périmé, panne dangereuse, blocage opérationnel |

Règles déterministes:

- le statut global d'un moyen est le statut le plus élevé parmi toutes les causes actives;
- rouge gagne toujours sur jaune, vert et noir;
- jaune gagne sur vert et noir;
- vert gagne sur noir seulement si une vérification ou un fait conforme récent existe;
- noir reste applicable tant que le moyen n'a jamais été vérifié ou manque de faits suffisants;
- en cas d'égalité de rang, les causes sont toutes conservées et triées par criticité, date puis module;
- les causes archivées ou résolues ne participent pas au statut courant;
- un enfant jaune ou rouge peut propager son statut au parent selon les règles de relation contenant/contenu;
- le statut cache peut être stocké, mais la matrice doit permettre un recalcul complet.

### 5.1 Faits Qui Impactent Le Statut

Le calcul doit prendre en compte:

- dernière vérification complète ou incomplète;
- retard de vérification de routine;
- retard de vérification des péremptions;
- item manquant;
- quantité sous seuil minimal;
- item périmé;
- item proche péremption;
- panne active;
- criticité de panne;
- contrôle technique ou échéance véhicule expirée;
- rendez-vous critique;
- procédure d'hygiène en retard;
- scellé attendu absent ou incohérent si obligatoire;
- champ obligatoire non rempli;
- statut rouge ou jaune d'un moyen enfant;
- règles spécifiques de la checklist.

### 5.2 Pannes Et Statut

Les impacts de panne doivent être standardisés:

- à surveiller: jaune sauf règle spécifique;
- mineur: jaune sauf règle spécifique;
- dangereux: rouge;
- critique ou HS: rouge.

Une panne archivée ne doit plus impacter le statut courant, mais reste visible dans l'historique.

### 5.3 Cache Et Recalcul

Pour préserver la fluidité:

- le statut courant peut être stocké sur le moyen;
- chaque événement critique déclenche un recalcul ciblé;
- un job nocturne recalcule les statuts pour détecter péremptions, retards et dérives;
- un outil admin doit permettre de forcer un recalcul;
- tout statut affiché doit être explicable par une liste de causes.

## 6. Checklists Et Vérifications

### 6.1 Éditeur De Checklists

L'éditeur doit être complet et extensible. Types de champs initiaux:

- titre de section;
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
- photo;
- pièce jointe;
- signature;
- numéro de scellé;
- commentaire;
- champ calculé ou informatif.

Chaque champ doit pouvoir définir:

- libellé;
- aide;
- caractère obligatoire;
- impact sur conformité;
- valeur attendue;
- seuils;
- visibilité conditionnelle;
- ordre;
- section;
- permissions éventuelles;
- comportement export.

Un champ optionnel non rempli ne doit pas rendre la vérification incomplète. Exemple: une pièce jointe optionnelle absente ne bloque pas la conformité.

### 6.2 Fréquences

Les fréquences sont configurées par checklist:

- vérification de routine;
- suivi des péremptions;
- hygiène;
- contrôle spécifique.

Une checklist peut définir des fréquences différentes selon le type de contrôle.

### 6.3 Vérification Simultanée

Par défaut, plusieurs utilisateurs peuvent remplir une même vérification en simultané. Chaque action doit tracer:

- utilisateur;
- structure;
- moyen;
- checklist;
- champ;
- ancienne valeur si applicable;
- nouvelle valeur;
- date et heure;
- appareil ou session si disponible.

La vérification simultanée doit être désactivable par checklist. Dans ce cas, un vérificateur unique conduit la vérification.

### 6.4 Signature Et Immutabilité

Une vérification clôturée est signée nominativement et devient non modifiable.

Règles:

- aucune modification après signature;
- si une erreur est constatée, créer une nouvelle vérification ou une action corrective;
- l'original reste intact;
- l'historique doit montrer les vérifications successives;
- les exports doivent refléter cette immutabilité.

## 7. Accès QR, Connexion Et PIN

### 7.1 Compte Nominatif

Les utilisateurs connus accèdent via:

- email et mot de passe;
- lien d'invitation;
- création par admin avec lien de création de mot de passe;
- inscription via code organisation à 6 caractères si activée;
- MFA optionnel selon structure ou rôle.

### 7.2 Code Organisation

Le code organisation permet de rejoindre une structure selon les règles définies par l'admin.

À prévoir:

- code rotatif ou régénérable;
- limitation d'essais;
- expiration optionnelle;
- approbation admin si configurée;
- attribution d'un rôle par défaut;
- journalisation de chaque tentative.

### 7.3 Accès Invité Par PIN

Si l'admin structure l'autorise, un scan QR peut demander un code PIN. Le PIN crée une session ou un compte invité temporaire lié à la structure, avec permissions limitées.

Règles:

- durée de vie: 24h par défaut;
- suppression ou désactivation automatique après expiration;
- rattachement obligatoire à la structure;
- droits limités aux checklists et moyens autorisés;
- journalisation des actions sous identité invitée;
- indication claire dans les audits;
- impossibilité d'utiliser le PIN pour accéder à l'administration;
- limitation d'essais;
- révocation possible par admin.

### 7.4 Sessions

Politique de confiance limitée:

- appareil mémorisé pour éviter reconnexions à chaque scan;
- PIN rapide pour réactiver une session autorisée;
- expiration courte pour actions sensibles;
- révocation de session possible;
- journalisation des connexions et changements de structure active.

## 8. Modules Métier

### 8.1 Véhicules

Fonctionnalités à prévoir:

- fiche véhicule;
- QR code véhicule;
- statut temps réel;
- checklists multiples;
- pannes;
- rendez-vous;
- contrôle technique;
- maintenance;
- carnet de bord;
- carburant si repris de Bubble;
- matériel embarqué;
- messages;
- tâches;
- historique;
- exports.

### 8.2 Matériel

Fonctionnalités à prévoir:

- fiche matériel;
- famille personnalisable;
- QR code;
- statut;
- contenant parent;
- enfants éventuels;
- checklists;
- péremptions;
- seuils;
- scellé;
- preuves;
- historique;
- exports.

### 8.3 Pannes

Fonctionnalités à prévoir:

- création;
- modification avant archivage selon droits;
- archivage audité;
- impact: à surveiller, mineur, dangereux, critique/HS;
- lien véhicule ou matériel;
- note libre;
- auteur;
- horodatage;
- pièces jointes optionnelles;
- génération de message système;
- génération possible de tâche;
- lien éventuel vers rendez-vous;
- impact statut selon criticité;
- filtres et exports.

### 8.4 Tâches

Les tâches doivent être planifiables et assignables, avec une expérience proche des meilleurs outils de suivi de travail.

À prévoir:

- titre;
- description;
- statut;
- priorité;
- échéance;
- planification;
- assigné;
- créateur;
- lien vers véhicule;
- lien vers matériel;
- lien vers panne;
- lien vers rendez-vous;
- commentaires;
- pièces jointes optionnelles;
- rappels;
- drag and drop entre statuts;
- vues liste, kanban et éventuellement calendrier;
- historique des changements;
- notifications;
- filtres.

Statuts initiaux:

- à faire;
- en cours;
- terminé;
- archivé.

### 8.5 Rendez-Vous Et Maintenance

Fonctionnalités à prévoir:

- calendrier lié;
- rendez-vous véhicule;
- rendez-vous matériel;
- lien vers panne;
- lien vers tâche;
- type de rendez-vous;
- date début et fin;
- immobilisation prévue;
- prestataire;
- notes;
- documents;
- rappel;
- impact éventuel sur statut;
- affichage dans briefing.

### 8.6 Hygiène

Fonctionnalités à prévoir:

- procédures par type de véhicule ou matériel;
- fréquence personnalisée;
- checklist dédiée;
- suivi des retards;
- preuves optionnelles ou obligatoires selon checklist;
- historique;
- alertes;
- exports conformité.

### 8.7 Péremptions

Fonctionnalités à prévoir:

- saisie rapide mois/année;
- calcul automatique du dernier jour du mois;
- saisie du jour si besoin;
- alerte avant échéance;
- bascule automatique en périmé;
- contrôle distinct de la vérification de routine;
- modification tracée nominativement;
- export filtrable;
- recalcul nocturne.

### 8.8 Messagerie Et Fil Système

Le module doit combiner:

- messages humains libres;
- événements système automatiques;
- code couleur distinct des alertes LED;
- filtres: tout, véhicules, matériel, tâches, pannes, hygiène;
- messages importants;
- recherche;
- liens vers objets métier;
- pièces jointes si autorisées;
- notifications temps réel.

Les événements système sont générés automatiquement lors d'actions importantes: panne ajoutée, vérification signée, statut changé, tâche créée, rendez-vous planifié, invité créé, export généré.

### 8.9 Stock QR-First

Le module Stock n'est pas prioritaire pour l'alpha de ResQR V2, mais il doit être prévu dès la conception, car il répond à une demande marché et doit rester aligné avec l'essence du produit: créer un lien direct entre terrain et numérique via QR code.

Principes:

- le QR code est placé sur une localisation: local, armoire, étagère ou autre zone de stockage;
- scanner une zone permet de consulter et modifier les lignes de stock de cette zone;
- scanner une zone parent donne accès à des raccourcis vers les sous-zones;
- les invités autorisés peuvent accéder au stock selon permissions;
- chaque ajout ou retrait est tracé comme toute action critique ResQR.

Modèles à prévoir:

- produits du catalogue;
- fournisseurs;
- références fournisseur;
- codes-barres;
- labels/tags de produits;
- zones de stockage hiérarchiques sur trois niveaux minimum;
- lignes de stock;
- mouvements de stock;
- seuils par ligne de stock;
- historique court visible sur chaque ligne.

Catalogue produit:

- nom du produit;
- fournisseur;
- référence;
- code-barres;
- labels multiples pour filtrage;
- rattachement à une structure ou éventuellement à un catalogue partagé à définir.

Zones de stockage:

- exemple: local 1 > armoire A > étagère 1;
- une zone parent peut contenir des sous-zones;
- une zone possède un QR code;
- le scan d'une zone parent affiche les lignes de stock de la zone et des raccourcis vers les sous-zones.

Lignes de stock:

- une ligne correspond à un produit dans une zone donnée;
- les seuils sont définis par ligne, pas globalement par produit;
- le même produit peut avoir des seuils différents dans deux armoires;
- état vert: quantité supérieure au seuil de pré-alerte;
- état orange: quantité inférieure ou égale au seuil de pré-alerte;
- état rouge: quantité inférieure ou égale au seuil d'alerte;
- une sparkline affiche l'évolution récente du stock et prend la couleur de l'état courant;
- la liste peut être filtrée par état, localisation, produit et label.

Mouvements de stock:

- type: ajout ou retrait;
- quantité;
- produit;
- zone;
- ligne de stock;
- utilisateur ou invité;
- date/heure serveur;
- motif optionnel;
- source QR si applicable;
- contexte éventuel: réalimentation d'un véhicule, correction, inventaire, commande.

Sur chaque ligne de stock, l'utilisateur doit voir les cinq derniers mouvements: qui a fait quoi, quand et combien.

Évolutions à prévoir:

- lien entre produits de stock et items de checklist;
- possibilité de réalimenter un véhicule depuis une réserve en un clic;
- exemple: retirer 5 compresses stériles de la réserve 1 pour réalimenter une ambulance;
- mise à jour simultanée du stock et du véhicule/matériel cible;
- péremption stock prévue hors alpha: stocker au minimum la prochaine date de péremption connue par ligne;
- mise à jour de la prochaine péremption lors d'un ajout de stock si l'utilisateur la renseigne;
- stock commun optionnel entre structure mère et structures filles, à préciser par configuration.

## 9. Notifications, Briefing Et SMS

Canaux à prévoir:

- notifications dans l'application;
- email;
- SMS sur plans payants.

Le briefing email doit être configurable par structure:

- jours d'envoi;
- destinataires;
- sections incluses;
- véhicules;
- pannes;
- rendez-vous;
- tâches;
- hygiène;
- utilisateurs;
- alertes critiques;
- liens directs vers l'application.

Les SMS doivent être protégés par quotas, plan SaaS et règles anti-abus.

## 10. Exports Et Conformité

Exports requis:

- XLS;
- CSV;
- PDF.

Filtres minimaux:

- structure;
- période;
- moyen;
- famille;
- checklist;
- statut;
- utilisateur;
- type d'événement;
- module;
- données archivées ou actives.

Les exports doivent respecter:

- permissions d'export;
- journalisation;
- isolation structure;
- cohérence avec les vérifications signées;
- données personnelles selon politique de rétention;
- format exploitable en audit.

## 11. Sécurité Et Conformité

### 11.1 Isolation Des Données

Toutes les tables exposées doivent avoir RLS activée. Les politiques doivent s'appuyer sur les appartenances à une structure et les permissions réelles, jamais sur une donnée modifiable par l'utilisateur.

Contrôles obligatoires:

- aucun accès inter-structure;
- aucune action sans appartenance valide;
- aucune lecture admin plateforme non journalisée;
- aucune clé service exposée côté client;
- fichiers privés par défaut;
- exports réservés aux rôles autorisés.

### 11.2 Journal Immuable

Chaque action critique doit produire un événement non modifiable:

- création;
- modification;
- archivage;
- signature;
- changement de statut;
- connexion;
- changement de structure active;
- accès QR;
- accès PIN;
- export;
- consultation admin sensible;
- recalcul forcé;
- échec de permission.

Un événement doit contenir:

- structure;
- acteur;
- rôle au moment de l'action;
- type d'action;
- objet concerné;
- date et heure serveur;
- contexte;
- ancienne et nouvelle valeur si utile;
- adresse IP ou empreinte session si disponible;
- origine: app, job, admin plateforme, import, API.

### 11.3 Archivage Au Lieu De Suppression

Les données métier critiques ne doivent pas être supprimées physiquement depuis l'interface. Elles sont archivées avec:

- auteur;
- date;
- raison si nécessaire;
- événement d'audit;
- exclusion du statut courant si applicable.

### 11.4 Rétention RGPD

La conservation doit être configurable par structure et par type de donnée:

- durée d'historique métier;
- durée des comptes invités;
- anonymisation des utilisateurs supprimés;
- export des données;
- purge contrôlée des données non critiques;
- conservation longue des faits nécessaires à la conformité.

## 12. Administration

### 12.1 Administration Structure

Fonctionnalités:

- gérer utilisateurs;
- inviter utilisateurs;
- créer utilisateur et envoyer lien de mot de passe;
- gérer code organisation;
- gérer PIN invité;
- gérer rôles;
- gérer exceptions;
- gérer moyens;
- gérer familles;
- gérer checklists;
- gérer alertes;
- gérer exports;
- gérer briefing;
- gérer rétention;
- consulter audit selon permission.

### 12.2 Administration Plateforme

Un espace admin plateforme complet doit être prévu.

Fonctionnalités:

- gérer structures;
- gérer plans;
- gérer quotas;
- gérer feature flags;
- consulter incidents;
- diagnostiquer jobs;
- forcer recalculs;
- gérer support;
- consulter logs;
- consulter accès sensibles avec justification;
- suivre consommation SMS;
- suivre exports;
- gérer migrations.

Tout accès plateforme aux données client doit être journalisé et, pour les données sensibles, accompagné d'une justification.

## 13. Plans SaaS Et Quotas

Le modèle doit combiner quotas quantitatifs et fonctionnalités.

Quotas à prévoir:

- véhicules;
- checklists;
- utilisateurs;
- stockage;
- exports;
- SMS;
- structures secondaires si besoin.

Feature flags à prévoir:

- SMS;
- exports avancés;
- briefing email;
- audit avancé;
- support prioritaire;
- accès invité PIN;
- nombre de rôles personnalisés;
- administration avancée;
- pack conformité.

Les limites ne doivent pas casser les données existantes. Si une structure dépasse un quota après changement de plan, l'application doit empêcher la création de nouveaux éléments concernés, pas supprimer ou masquer brutalement les données.

## 14. Stratégie V1/V2 Et Migration Bubble

ResQR V2 est une réécriture complète, mais ResQR V1 sur Bubble reste opérationnel pendant la construction. La migration doit être préparée sans supposer qu'elle sera complète: les dettes techniques Bubble, les relations internes, les fichiers et les règles privacy peuvent empêcher un export totalement fiable.

Objectifs:

- migrer les utilisateurs quand c'est possible et légalement propre;
- migrer les structures, rôles et données métier avec le plus de relations possible;
- accepter qu'une partie du passif soit importée comme archive, référence ou historique partiel;
- ne jamais bloquer la reconstruction V2 sur une promesse d'export Bubble parfait.

Approche:

1. Auditer l'application Bubble existante.
2. Identifier les types de données Bubble.
3. Exporter les données par type en JSON, NDJSON ou CSV quand possible.
4. Étudier l'usage de la Data API Bubble si l'export manuel est insuffisant.
5. Cartographier les champs Bubble vers le modèle ResQR V2.
6. Détecter les relations, listes, références et fichiers.
7. Reformater les données avec scripts et assistance IA.
8. Importer dans un environnement Supabase de test.
9. Valider volumes, relations, statuts recalculés et historiques.
10. Faire une migration à blanc.
11. Déterminer ce qui est migrable automatiquement, migrable manuellement, archivable ou abandonné.
12. Préparer une bascule contrôlée quand V2 est prêt.
13. Geler les écritures Bubble uniquement au moment réellement nécessaire.
14. Réimporter le delta si nécessaire.
15. Valider la production avant ouverture.

Points de vigilance:

- les workflows Bubble ne deviennent pas automatiquement du code exploitable;
- les règles de privacy Bubble doivent être réinterprétées;
- les dates, listes et références peuvent nécessiter un nettoyage;
- les fichiers doivent être récupérés et relogés;
- l'historique importé doit être distingué des événements natifs V2.
- les comptes utilisateurs migrés doivent respecter les exigences de sécurité V2 et peuvent nécessiter une réinitialisation de mot de passe.

## 15. Phasage Des Travaux

### Phase 1: Audit Complet Bubble

Objectifs:

- inventorier tous les écrans;
- documenter tous les workflows;
- capturer les formulaires;
- lister les rôles et règles d'accès;
- explorer les modules non couverts par le document initial;
- tester les parcours critiques;
- identifier les données Bubble;
- prioriser les écarts et risques.

Livrables:

- cartographie fonctionnelle;
- captures annotées;
- liste des modèles de données;
- liste des règles métier;
- backlog initial.

### Phase 2: Socle Technique Et Sécurité

Objectifs:

- initialiser Next.js;
- connecter Supabase;
- mettre en place auth;
- créer structures et appartenances;
- activer RLS;
- créer rôles et permissions;
- créer audit log;
- poser conventions de code;
- poser tests sécurité de base.

Critère de sortie:

- un utilisateur multi-structure voit uniquement les données autorisées de sa structure active.

### Phase 3: Modèle Métier Central

Objectifs:

- créer moyens;
- créer QR codes;
- gérer contenant/contenu;
- créer familles;
- créer checklists;
- créer vérifications;
- créer moteur de statut;
- gérer signatures;
- gérer archivage.

Critère de sortie:

- un moyen peut être scanné, vérifié, signé et afficher un statut recalculé.

### Phase 4: Modules Terrain

Objectifs:

- véhicules;
- matériel;
- pannes;
- tâches;
- rendez-vous;
- hygiène;
- péremptions;
- messagerie;
- fichiers.
- prévoir le module Stock dans l'architecture, sans le rendre prioritaire alpha.

Critère de sortie:

- les workflows métier principaux de Bubble sont couverts sans freeze et avec traçabilité.

### Phase 5: Temps Réel Et Jobs

Objectifs:

- synchronisation live;
- recalculs de statut;
- propagation parent/enfant;
- alertes nocturnes;
- briefing email;
- SMS payant;
- nettoyage invités 24h;
- monitoring jobs.

Critère de sortie:

- les changements en base se reflètent dans l'interface sans rafraîchissement manuel.

### Phase 6: Migration Bubble

Objectifs:

- migration utilisateurs;
- exports Bubble;
- mapping;
- nettoyage;
- import test;
- vérification;
- migration à blanc;
- bascule contrôlée.

Critère de sortie:

- données importées, relations conservées, statuts recalculés, exports cohérents.
- limites d'import documentées et acceptées.

### Phase 7: Sécurité, Conformité Et Stabilisation

Objectifs:

- tests RLS;
- tests E2E;
- tests performance;
- tests exports;
- tests restauration;
- revue RGPD;
- audit accès plateforme;
- durcissement sessions;
- documentation opérationnelle.

Critère de sortie:

- application prête pour un pilote contrôlé.

## 16. Tests Et Critères D'Acceptation

### 16.1 Sécurité

- Un utilisateur d'une structure A ne peut jamais lire les données d'une structure B.
- Un utilisateur multi-structure ne voit que la structure active.
- Les permissions lecture, écriture, admin et export sont respectées.
- Un invité PIN ne peut accéder qu'aux moyens et checklists autorisés.
- Une session expirée ne permet aucune action sensible.
- Le service role n'est jamais exposé côté client.

### 16.2 Temps Réel

- Une panne créée apparaît immédiatement pour les autres utilisateurs autorisés.
- Une checklist remplie par plusieurs utilisateurs affiche les réponses sans refresh.
- Un changement de statut est propagé aux vues liste, détail et parent.
- La messagerie reçoit les événements système en direct.

### 16.3 Vérifications

- Chaque champ modifié conserve l'auteur réel.
- Une vérification signée est impossible à modifier.
- Une checklist en mode vérificateur unique bloque les autres modifications.
- Un champ optionnel vide ne rend pas la vérification incomplète.
- Un champ obligatoire vide bloque la signature.

### 16.4 Statut

- Un moyen jamais vérifié est noir.
- Un moyen conforme est vert.
- Une péremption proche rend jaune.
- Une péremption atteinte rend rouge.
- Une panne dangereuse rend rouge.
- Un retard de vérification rend jaune.
- Un enfant rouge rend le parent rouge.
- Le statut affiché est explicable par ses causes.

### 16.5 Migration

- Les exports Bubble sont lisibles.
- Les relations entre objets sont conservées.
- Les fichiers sont récupérés ou signalés comme manquants.
- Les statuts recalculés après import sont cohérents.
- Les données importées restent isolées par structure.

### 16.6 Exports

- Les exports XLS, CSV et PDF respectent les filtres.
- Les exports respectent les permissions.
- Les exports sont journalisés.
- Les vérifications signées ne sont pas altérées.
- Les données archivées sont incluses ou exclues selon filtre.

### 16.7 Performance

- Les listes longues ne provoquent pas de freeze.
- Les dropdowns ne chargent pas toute la base sans pagination.
- Les pages détails s'ouvrent rapidement.
- Les opérations de sauvegarde donnent un retour utilisateur clair.
- Les jobs nocturnes ne bloquent pas l'usage de l'application.

### 16.8 Sauvegarde Et Restauration

- La restauration PITR est testée.
- Un export structure peut être généré.
- Un scénario de suppression accidentelle est restaurable.
- Les fichiers critiques sont inclus dans la stratégie de sauvegarde.

## 17. Risques Majeurs

### 17.1 Migration Bubble Incomplète

Risque: les exports Bubble ne conservent pas toutes les relations, règles ou fichiers.

Réponse:

- faire un audit manuel;
- tester plusieurs formats d'export;
- prévoir scripts de mapping;
- distinguer données importées et logique reconstruite;
- accepter une phase de correction manuelle.

### 17.2 Complexité Du Statut

Risque: le statut unique devient difficile à expliquer.

Réponse:

- stocker les causes;
- garder un moteur de règles testable;
- documenter les priorités;
- fournir une vue "pourquoi ce statut".

### 17.3 Temps Réel Et Conflits

Risque: plusieurs utilisateurs modifient le même champ simultanément.

Réponse:

- tracer chaque action;
- définir une stratégie de résolution;
- afficher les changements récents;
- permettre le mode vérificateur unique.

### 17.4 RLS Mal Configurée

Risque: fuite de données entre structures.

Réponse:

- tests automatisés RLS;
- revue sécurité à chaque migration;
- politiques par table;
- données de test multi-tenant;
- refus par défaut.

### 17.5 Dette Fonctionnelle Du Clone

Risque: vouloir tout reproduire bloque la livraison.

Réponse:

- planifier toutes les fonctionnalités;
- livrer par phases cohérentes;
- garder les critères d'acceptation;
- ne pas sacrifier sécurité et modèle de données.

## 18. Hypothèses

- Le document Claude est utile mais non fiable à 100%; il sert de base prudente.
- Le fichier final est créé dans le dossier courant.
- Le document ne contient pas de section de sources.
- La reconstruction vise toutes les fonctionnalités métier connues, pas un MVP réduit.
- Les fonctionnalités non observées devront être confirmées par audit Bubble.
- Les exports Bubble et la Data API sont à valider sur l'application réelle.
- Les règles métier actuelles doivent être reconstruites explicitement, pas copiées automatiquement depuis Bubble.
- La priorité sécurité prime sur la vitesse de livraison.

## 19. Prochaines Actions Immédiates

1. Organiser un audit complet de l'application Bubble avec accès administrateur.
2. Capturer chaque écran important sur desktop et mobile.
3. Lister tous les types de données Bubble et leurs champs.
4. Exporter un échantillon JSON, NDJSON ou CSV par type de donnée.
5. Construire le premier schéma conceptuel Supabase.
6. Définir les rôles initiaux et permissions par module.
7. Écrire les tests de sécurité multi-structure avant les premiers écrans.
8. Prototyper le moteur de statut sur véhicules, matériels, pannes, péremptions et contenant/contenu.
9. Prototyper une checklist temps réel multi-utilisateur.
10. Valider le parcours QR avec compte connu et invité PIN 24h.
