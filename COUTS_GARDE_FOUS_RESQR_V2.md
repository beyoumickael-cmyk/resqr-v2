# COUTS GARDE-FOUS RESQR V2

## 1. Objectif

Ce document definit les garde-fous couts de ResQR V2 avant de multiplier les abonnements temps reel, les jobs, les exports, les fichiers, les emails et les SMS.

Le but n'est pas seulement de reduire la facture Vercel ou Supabase. Le but est d'eviter de remplacer les WU Bubble par un autre piege de couts: connexions Realtime trop larges, egress invisible, fichiers non limites, fonctions appelees en boucle, exports massifs ou SMS sans quota.

Principe directeur: chaque fonctionnalite consommatrice doit etre bornee par structure, module, ecran actif, plan SaaS, quota et metrique observable.

## 2. Postes De Couts A Surveiller

| Poste | Risque principal | Garde-fou attendu |
| --- | --- | --- |
| Connexions Supabase Realtime | Souscriptions trop nombreuses ou trop larges, utilisateurs multi-onglets, ecrans laisses ouverts | Souscription uniquement sur l'ecran actif, filtres stricts par structure et module, nettoyage a la sortie de page |
| Egress | Listes longues, fichiers, exports, pieces jointes, polling, rechargements complets | Pagination, compression, caches controles, exports asynchrones, limitation des payloads |
| Stockage fichiers | Photos et pieces jointes non compressees, historiques illimites, doublons | Storage prive, limites de taille, compression, quotas par plan, retention par structure |
| Fonctions Vercel | Fonctions appelees trop souvent, traitements lourds synchrones, cold starts multiplies | Idempotence, debouncing, batch, limites par route, suivi du nombre d'invocations et duree |
| Jobs planifies | Jobs nocturnes trop larges, recalculs globaux inutiles, retries infinis | Jobs incrementaux, bornes temporelles, reprise controlee, metriques et alertes |
| Exports | Exports massifs repetes, generation PDF couteuse, telechargements multiples | Exports filtres, asynchrones, limites par plan, cache temporaire, audit |
| Emails | Briefings trop frequents, destinataires nombreux, notifications redondantes | Preferences par structure, regroupement, quotas, anti-spam applicatif |
| SMS | Cout direct par message, abus, alertes trop bavardes | Plans payants uniquement, quotas stricts, seuils critiques, opt-in, journalisation |
| Logs et observabilite | Logs verbeux en production, conservation excessive, donnees sensibles | Niveaux de logs, sampling, retention, masquage des donnees sensibles |

## 3. Regles D'Implementation Non Negociables

### 3.1 Temps Reel

- Les abonnements Supabase Realtime sont ouverts seulement pour l'ecran actif.
- Chaque souscription doit etre filtree au minimum par `structure_id` et par module metier.
- Les vues detail souscrivent au perimetre de l'objet consulte, pas a toute la structure.
- Les vues liste souscrivent uniquement aux evenements necessaires a leur page courante ou a un compteur cible.
- Une souscription globale a toute une structure est interdite sauf justification documentee: besoin metier, volume estime, duree de vie, plan concerne, seuil d'alerte.
- Tout changement de structure active ferme les souscriptions de l'ancienne structure avant d'ouvrir les nouvelles.
- Les onglets inactifs doivent reduire ou fermer les flux non essentiels quand c'est possible.
- Les mutations qui declenchent du temps reel doivent envoyer des payloads courts; les details lourds sont recharges a la demande.

### 3.2 Donnees Et Listes Longues

- La pagination est obligatoire pour toutes les listes longues: moyens, materiels, checklists, pannes, taches, rendez-vous, audit, exports, stock et utilisateurs.
- Les dropdowns et selecteurs ne chargent jamais toute la base d'une structure sans recherche, filtre ou pagination.
- Les recherches doivent etre bornees par structure active, permissions et limite de resultats.
- Les pages terrain doivent preferer des requetes ciblees a des chargements "tout-en-un".
- Les compteurs et badges doivent provenir de vues ou agregats controles plutot que de listes completes cote client.

### 3.3 Fichiers Et Storage

- Supabase Storage est prive par defaut.
- L'acces aux fichiers passe par permissions serveur, URLs signees et durees d'expiration courtes.
- Les pieces jointes ont des limites de taille par type: photo, PDF, document, preuve de verification.
- Les images terrain doivent etre compressees avant upload quand la qualite probante reste suffisante.
- Les doublons doivent etre evites par empreinte ou logique metier quand c'est pertinent.
- Les fichiers orphelins doivent etre detectes par job de nettoyage.
- La retention des fichiers est configurable par structure et par categorie, sans supprimer les preuves critiques necessaires a l'audit.

### 3.4 Fonctions, APIs Et Jobs

- Les fonctions Vercel doivent etre courtes, idempotentes et bornees.
- Les traitements longs passent en job asynchrone ou en batch controle.
- Les jobs planifies ne doivent pas recalculer toute la base si un delta suffit.
- Les retries sont limites et journalises; aucun job ne doit boucler sans plafond.
- Chaque job ecrit un resultat d'execution: duree, structure concernee, volume traite, erreurs, prochain passage.
- Les recalculs de statut doivent etre cibles par moyen, relation parent/enfant ou structure seulement si necessaire.

### 3.5 Exports

- Tout export est filtre par structure, periode, module et permissions.
- Les exports volumineux sont asynchrones, avec notification quand le fichier est pret.
- Les exports XLS, CSV et PDF ont des quotas par plan: nombre, frequence, volume et retention.
- Les exports sont journalises dans l'audit: acteur, structure, filtres, volume, format, date.
- Les fichiers d'export expirent apres une duree definie, sauf obligation de conservation.
- Les exports repetes identiques peuvent reutiliser un fichier temporaire si les droits et la fraicheur le permettent.

### 3.6 Emails Et SMS

- Les emails de briefing sont regroupes par structure et configuration, pas envoyes evenement par evenement.
- Les notifications email doivent respecter les preferences utilisateur et structure.
- Les SMS sont reserves aux plans et options qui les autorisent.
- Chaque structure a un quota SMS mensuel et un plafond anti-abus journalier.
- Les SMS sont limites aux alertes reellement critiques ou aux cas explicitement configures.
- Une alerte SMS doit avoir une trace: structure, destinataire, raison, module, cout estime, statut d'envoi.

### 3.7 Logs Et Observabilite

- Les logs de production ne doivent pas contenir de donnees medicales, personnelles sensibles, secrets, PIN ou tokens.
- Les erreurs applicatives doivent etre reliees a une structure quand c'est utile, sans exposer son contenu metier.
- Les logs verbeux sont reserves au debug temporaire avec expiration.
- La retention des logs doit etre definie par environnement: developpement, preproduction, production.
- Les traces d'acces admin plateforme aux donnees client restent auditables, meme si les logs techniques expirent.

## 4. Quotas Par Plan

Chaque plan SaaS doit definir au minimum:

| Ressource | Exemple de limite |
| --- | --- |
| Utilisateurs actifs | Nombre maximal par structure |
| Moyens et jumeaux numeriques | Nombre de vehicules, materiels, sacs, lots, kits |
| Checklists | Nombre de modeles actifs |
| Stockage | Volume total et taille maximale par fichier |
| Exports | Nombre mensuel, formats autorises, volume maximal |
| SMS | Quota mensuel, plafond journalier, option payante |
| Emails de briefing | Frequence et nombre de destinataires |
| Jobs specifiques | Frequence minimale autorisee pour certains traitements |
| Retention | Duree des exports temporaires, fichiers non critiques et logs |

Regle importante: un depassement de quota ne supprime jamais les donnees existantes. Il bloque ou degrade proprement la creation de nouveaux elements concernes, avec message clair et trace d'audit si l'action est critique.

## 5. Metriques Par Structure

ResQR V2 doit stocker ou consolider les metriques suivantes par structure:

| Metrique | Granularite minimale |
| --- | --- |
| Connexions Realtime actives | Structure, module, ecran, utilisateur si utile |
| Nombre de souscriptions ouvertes | Structure, module, type de vue |
| Volume egress estime | Structure, module, jour |
| Stockage utilise | Structure, bucket, categorie de fichier |
| Nombre de fichiers | Structure, categorie, mois |
| Invocations de fonctions | Structure si applicable, route, jour |
| Duree des fonctions | Route, percentile, erreurs |
| Executions de jobs | Job, structure, duree, volume traite |
| Exports generes | Structure, format, volume, utilisateur |
| Emails envoyes | Structure, type, destinataires |
| SMS envoyes | Structure, type, statut, cout estime |
| Logs et erreurs | Structure si applicable, severite, module |

Ces metriques doivent permettre de repondre rapidement a trois questions:

1. Quelle structure consomme le plus ?
2. Quel module provoque la consommation ?
3. Quelle action produit le cout: temps reel, fichier, export, job, email ou SMS ?

## 6. Alertes De Depassement

Des alertes internes doivent etre declenchees aux seuils suivants:

| Niveau | Seuil recommande | Action |
| --- | --- | --- |
| Information | 50% du quota mensuel | Affichage interne et suivi |
| Vigilance | 80% du quota mensuel | Notification admin structure ou plateforme selon ressource |
| Limite proche | 95% du quota mensuel | Avertissement explicite avant nouvelle action couteuse |
| Depassement | 100% du quota | Blocage controle, degradation ou achat d'option selon plan |
| Anomalie | Pic brutal hors tendance | Alerte plateforme et investigation |

Les alertes doivent distinguer un usage normal d'une anomalie. Exemple: une grosse structure peut envoyer beaucoup d'emails de briefing prevus; une petite structure qui ouvre soudain des centaines de souscriptions Realtime doit etre investiguee.

## 7. Tableau De Bord Interne De Consommation

Un tableau de bord interne doit etre prevu dans l'administration plateforme.

### 7.1 Vue Globale Plateforme

La vue globale affiche:

- consommation totale par poste: Realtime, egress, Storage, fonctions, jobs, exports, emails, SMS, logs;
- top structures consommatrices;
- evolution jour, semaine, mois;
- anomalies recentes;
- cout estime par structure et par module;
- repartition par plan SaaS.

### 7.2 Vue Structure

La fiche consommation d'une structure affiche:

- plan actif et quotas;
- consommation courante du mois;
- pourcentage de quota utilise;
- historique des 12 derniers mois;
- modules les plus consommateurs;
- exports recents;
- SMS recents;
- fichiers les plus volumineux ou categories les plus lourdes;
- souscriptions Realtime moyennes et pics;
- jobs executes pour la structure;
- alertes et depassements.

### 7.3 Vue Diagnostic

Une vue diagnostic doit permettre de filtrer par:

- structure;
- module;
- utilisateur;
- route ou fonction;
- job;
- periode;
- type de ressource;
- niveau d'alerte.

Cette vue sert a identifier les boucles, les ecrans trop bavards, les exports abusifs et les fichiers trop lourds avant qu'ils deviennent des couts recurrents.

## 8. Checklist Avant Nouvelle Fonctionnalite

Avant de livrer une fonctionnalite qui utilise Realtime, Storage, fonctions, jobs, exports, emails ou SMS, repondre a ces questions:

- Quelle structure est facturee ou mesuree ?
- Quel plan autorise cette fonctionnalite ?
- Quel quota s'applique ?
- Quelle metrique sera incrementee ?
- Quel seuil declenche une alerte ?
- La fonctionnalite est-elle filtree par structure active et permissions ?
- Existe-t-il une pagination ou une limite de volume ?
- Que se passe-t-il si le quota est atteint ?
- Que se passe-t-il si l'utilisateur ouvre plusieurs onglets ?
- Que se passe-t-il si un job echoue ou est rejoue ?
- Les logs evitent-ils les donnees sensibles ?

Aucune fonctionnalite couteuse ne doit etre consideree terminee si ces reponses ne sont pas documentees dans son ticket, sa specification ou son implementation.

## 9. Critere Anti-Piege De Couts

ResQR V2 ne doit pas reproduire le probleme des WU Bubble sous une autre forme.

Sont consideres comme des signaux rouges:

- une souscription Realtime ouverte sans filtre precis;
- un ecran qui charge toute une structure alors qu'il affiche une page ou un objet;
- un export synchrone non limite;
- un fichier uploadable sans limite de taille;
- un job qui recalcule globalement sans justification;
- un SMS envoye sans plan, quota et trace;
- un log de production verbeux sans retention courte;
- une metrique de consommation absente pour une ressource payante.

Decision: si une fonctionnalite apporte de la fluidite mais rend le cout imprevisible, elle doit etre redesign avant production.
