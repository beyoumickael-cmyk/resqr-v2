# MATRICE STATUT RESQR V2

Ce document definit la matrice deterministe du statut operationnel ResQR V2.
Il sert de reference avant toute implementation du moteur de statut et doit pouvoir etre transforme directement en tests unitaires.

## 1. Objectif

Chaque moyen ResQR possede un statut unique visible par LED.

Le statut doit etre:

- deterministe: les memes faits produisent toujours le meme statut;
- recalculable: le cache d'affichage ne remplace jamais les faits sources;
- explicable: chaque statut courant doit pouvoir afficher les causes actives;
- testable: chaque regle doit pouvoir etre verifiee par un cas d'entree/sortie.

## 2. Statuts

| Rang | Statut | Definition normative |
| --- | --- | --- |
| 0 | noir | Statut non etabli, jamais verifie, donnees insuffisantes. |
| 1 | vert | Conforme. |
| 2 | jaune | Vigilance, pre-alerte, retard ou anomalie non bloquante. |
| 3 | rouge | Non conforme, critique, perime, panne dangereuse ou blocage operationnel. |

L'ordre strict est:

```text
noir = 0
vert = 1
jaune = 2
rouge = 3
```

Tout calcul de statut doit comparer les rangs numeriques ci-dessus.

## 3. Vocabulaire De Calcul

### 3.1 Moyen

Un moyen est un vehicule, sac, lot, kit, appareil, materiel isole ou contenant personnalise possedant un jumeau numerique ResQR.

### 3.2 Fait Source

Un fait source est une donnee metier pouvant contribuer au statut:

- verification signee;
- reponse de checklist;
- item manquant;
- quantite sous seuil;
- peremption proche ou atteinte;
- panne;
- retard de verification;
- retard d'hygiene;
- rendez-vous critique;
- echeance vehicule expiree;
- incoherence de scelle;
- champ obligatoire manquant;
- statut propage depuis un enfant;
- autre regle explicite d'un module.

### 3.3 Cause

Une cause est la contribution normalisee d'un fait source au statut.

Une cause doit au minimum porter:

- `status`: noir, vert, jaune ou rouge;
- `rank`: 0, 1, 2 ou 3;
- `module`: module d'origine;
- `criticality`: niveau de criticite interne au module;
- `occurred_at` ou `detected_at`: date utile au tri;
- `active`: vrai si la cause participe au statut courant;
- `resolved_at`: renseigne si la cause est resolue;
- `archived_at`: renseigne si la cause est archivee;
- `source_id`: identifiant du fait source;
- `message`: libelle affichable.

## 4. Regles Deterministes

### R1 - Le Pire Etat Gagne

Le statut courant d'un moyen est le statut de rang le plus eleve parmi toutes les causes actives retenues.

```text
current_status = max(active_causes.rank)
```

Si aucune cause suffisante n'existe, le statut est noir.

### R2 - Rouge Gagne Toujours

Toute cause active rouge impose le statut courant rouge, quels que soient les autres faits.

Exemples de causes rouges:

- item perime;
- panne dangereuse;
- panne critique ou HS;
- controle technique expire si la regle le rend bloquant;
- moyen enfant rouge propage au parent;
- checklist signee comme non conforme bloquante.

### R3 - Jaune Gagne Sur Vert Et Noir

Toute cause active jaune impose le statut courant jaune si aucune cause rouge active n'existe.

Exemples de causes jaunes:

- peremption proche;
- verification de routine en retard;
- panne mineure ou a surveiller;
- anomalie non bloquante;
- quantite inferieure ou egale au seuil de pre-alerte mais non critique;
- moyen enfant jaune propage au parent.

### R4 - Vert Gagne Sur Noir Seulement Avec Un Fait Conforme Recent

Le statut vert ne peut remplacer noir que si au moins un fait conforme recent et suffisant existe.

Un fait conforme recent peut etre:

- une verification complete signee dans la fenetre de validite;
- une checklist conforme cloturee;
- un controle metier conforme explicitement reconnu par la regle du module.

Un moyen cree mais jamais verifie reste noir.

Un moyen dont les donnees sont partielles reste noir si aucun fait conforme suffisant ne permet d'etablir la conformite.

### R5 - Noir Reste Si Aucun Fait Suffisant N'Existe

Le statut noir signifie que le moteur ne peut pas etablir un statut operationnel fiable.

Noir s'applique notamment si:

- le moyen n'a jamais ete verifie;
- les faits requis sont absents;
- les donnees importees ne permettent pas un recalcul fiable;
- la checklist requise n'a jamais ete cloturee;
- le seul fait disponible est incomplet ou trop ancien pour etablir vert.

### R6 - Causes Resolues Ou Archivees Ignorees

Les causes resolues ou archivees ne participent pas au statut courant.

Une cause est ignoree si:

```text
resolved_at != null
OR archived_at != null
OR active = false
```

Ces causes restent visibles dans l'historique et dans les exports selon permissions, mais ne doivent pas influencer le statut courant.

### R7 - Causes Actives Conservees Et Affichables

Toutes les causes actives ayant contribue au calcul doivent etre conservees et affichables.

Le moteur doit permettre une vue "pourquoi ce statut" contenant:

- la cause gagnante;
- les autres causes actives de meme rang;
- les causes actives de rang inferieur utiles au diagnostic.

### R8 - Tri Deterministe Des Causes En Egalite

En egalite de rang, les causes sont conservees et triees de maniere stable.

Ordre de tri:

1. criticite decroissante;
2. date decroissante, de la plus recente a la plus ancienne;
3. module croissant par ordre alphabetique;
4. `source_id` croissant pour stabiliser les egalites parfaites.

Ce tri ne change pas le statut final; il change seulement l'ordre d'affichage et la cause principale expliquee.

### R9 - Propagation Enfant Vers Parent

La propagation suit la relation contenant/contenu.

Si un moyen enfant a un statut actif jaune ou rouge et que la relation avec le parent autorise la propagation, le parent recoit une cause derivee:

| Statut enfant | Cause derivee sur parent |
| --- | --- |
| noir | Aucune propagation par defaut. |
| vert | Aucune propagation. |
| jaune | Cause jaune sur le parent. |
| rouge | Cause rouge sur le parent. |

La cause derivee doit conserver le lien vers l'enfant source pour que l'interface explique quel sac, lot, kit ou materiel provoque le statut du parent.

Exemple:

```text
Ambulance A contient Sac B.
Sac B = rouge pour item perime.
Ambulance A recoit une cause rouge: "Enfant rouge: Sac B".
Ambulance A = rouge.
```

### R10 - Propagation Selon Relation Active

Une relation contenant/contenu archivee, supprimee logiquement ou terminee ne propage plus de statut.

Une propagation ne doit etre appliquee que si:

```text
relation.active = true
AND relation.archived_at = null
AND child.archived_at = null
AND parent.archived_at = null
```

### R11 - Stock Separe Du Statut Moyen Par Defaut

Le module Stock possede ses propres etats:

| Etat stock | Definition |
| --- | --- |
| vert | Quantite superieure au seuil de pre-alerte. |
| orange | Quantite inferieure ou egale au seuil de pre-alerte. |
| rouge | Quantite inferieure ou egale au seuil d'alerte. |

L'etat stock ne doit pas impacter le statut d'un moyen par defaut.

Il ne peut impacter le statut moyen que si une regle explicite relie une ligne de stock, un produit ou un mouvement a un moyen, une checklist ou une obligation operationnelle.

Exemples de liens explicites possibles:

- une checklist exige que le vehicule contienne 5 compresses steriles;
- une action de realimentation retire du stock et met a jour un item de checklist;
- une regle structure decide qu'un stock critique lie a un vehicule rend le moyen jaune ou rouge.

Sans lien explicite, un stock rouge reste un stock rouge, mais ne rend pas automatiquement un vehicule rouge.

## 5. Algorithme Normatif

Pseudo-code de reference:

```text
function computeStatus(moyen):
  causes = collectCauses(moyen)
  propagated_causes = collectPropagatedCausesFromActiveChildren(moyen)
  all_causes = causes + propagated_causes

  active_causes = all_causes where:
    active = true
    and resolved_at is null
    and archived_at is null

  sufficient_causes = active_causes where:
    cause is valid for current calculation window

  if sufficient_causes contains rank 3:
    return rouge with sorted causes

  if sufficient_causes contains rank 2:
    return jaune with sorted causes

  if sufficient_causes contains rank 1:
    if exists recent compliant fact:
      return vert with sorted causes

  return noir with sorted causes
```

Les fenetres de validite sont definies par les modules et checklists. Le moteur central applique la matrice; il ne doit pas inventer une validite metier absente.

## 6. Exemples Concrets

### Exemple 1 - Moyen Jamais Verifie

Entree:

```text
Moyen: Sac A
Faits: aucun
Causes actives: aucune
```

Resultat attendu:

```text
Statut: noir
Raison: aucun fait suffisant
```

### Exemple 2 - Verification Conforme Recente

Entree:

```text
Moyen: Sac A
Fait: verification complete signee hier, conforme
Cause active: vert, module=checklists
```

Resultat attendu:

```text
Statut: vert
Raison: fait conforme recent
```

### Exemple 3 - Verification Conforme Mais Peremption Proche

Entree:

```text
Moyen: Sac A
Cause active 1: vert, verification conforme recente
Cause active 2: jaune, item proche peremption
```

Resultat attendu:

```text
Statut: jaune
Raison: jaune gagne sur vert
```

### Exemple 4 - Panne Dangereuse

Entree:

```text
Moyen: Ambulance 12
Cause active 1: vert, verification conforme recente
Cause active 2: jaune, hygiene bientot en retard
Cause active 3: rouge, panne dangereuse
```

Resultat attendu:

```text
Statut: rouge
Raison: rouge gagne toujours
```

### Exemple 5 - Panne Archivee

Entree:

```text
Moyen: Ambulance 12
Cause 1: rouge, panne critique, archived_at renseigne
Cause active 2: vert, verification conforme recente
```

Resultat attendu:

```text
Statut: vert
Raison: la panne archivee est ignoree du statut courant
```

### Exemple 6 - Panne Resolue

Entree:

```text
Moyen: Appareil DSA 1
Cause 1: rouge, panne HS, resolved_at renseigne
Cause active 2: jaune, verification de routine en retard
```

Resultat attendu:

```text
Statut: jaune
Raison: la panne resolue est ignoree; le retard actif reste jaune
```

### Exemple 7 - Propagation Enfant Rouge

Entree:

```text
Parent: Ambulance A
Enfant: Sac B
Relation: active
Statut enfant: rouge
Cause enfant: item perime
```

Resultat attendu:

```text
Statut parent: rouge
Cause parent: enfant rouge, Sac B, item perime
```

### Exemple 8 - Relation Archivee Sans Propagation

Entree:

```text
Parent: Ambulance A
Enfant: Sac B
Relation: archived_at renseigne
Statut enfant: rouge
```

Resultat attendu:

```text
Statut parent: noir, vert, jaune ou rouge selon ses propres causes
Raison: la relation archivee ne propage plus le statut enfant
```

### Exemple 9 - Egalite De Causes Jaunes

Entree:

```text
Moyen: Sac A
Cause active 1: jaune, criticality=2, date=2026-06-01, module=peremptions, source_id=P1
Cause active 2: jaune, criticality=3, date=2026-05-30, module=pannes, source_id=F1
Cause active 3: jaune, criticality=3, date=2026-06-02, module=hygiene, source_id=H1
```

Resultat attendu:

```text
Statut: jaune
Ordre des causes:
1. hygiene H1, criticite 3, date 2026-06-02
2. pannes F1, criticite 3, date 2026-05-30
3. peremptions P1, criticite 2, date 2026-06-01
```

Raison: criticite decroissante, puis date decroissante, puis module.

### Exemple 10 - Stock Rouge Sans Lien Explicite

Entree:

```text
Ligne stock: compresses steriles, etat rouge
Moyen: Ambulance A
Lien explicite stock -> moyen: absent
Cause active moyen: vert, verification conforme recente
```

Resultat attendu:

```text
Etat stock: rouge
Statut moyen: vert
Raison: le stock n'impacte pas le statut moyen sans regle explicite
```

### Exemple 11 - Stock Rouge Avec Lien Explicite

Entree:

```text
Ligne stock: compresses steriles, etat rouge
Regle explicite: stock critique des compresses lie a Ambulance A rend le moyen jaune
Moyen: Ambulance A
Cause active 1: vert, verification conforme recente
Cause active 2: jaune, stock critique lie explicitement
```

Resultat attendu:

```text
Etat stock: rouge
Statut moyen: jaune
Raison: la regle explicite transforme l'etat stock en cause statut jaune
```

### Exemple 12 - Import Bubble Insuffisant

Entree:

```text
Moyen: Sac importe
Faits importes: donnees partielles, pas de verification exploitable
Causes actives: aucune cause conforme suffisante
```

Resultat attendu:

```text
Statut: noir
Raison: donnees insuffisantes pour etablir vert
```

## 7. Table De Verite Minimale Pour Tests Unitaires

| Cas | Causes actives suffisantes | Causes ignorees | Fait conforme recent | Relation enfant | Resultat attendu |
| --- | --- | --- | --- | --- | --- |
| T01 | aucune | aucune | non | aucune | noir |
| T02 | vert | aucune | oui | aucune | vert |
| T03 | vert | aucune | non | aucune | noir |
| T04 | jaune | aucune | non requis | aucune | jaune |
| T05 | vert + jaune | aucune | oui | aucune | jaune |
| T06 | vert + rouge | aucune | oui | aucune | rouge |
| T07 | jaune + rouge | aucune | non requis | aucune | rouge |
| T08 | rouge archivee + vert | rouge archivee | oui | aucune | vert |
| T09 | rouge resolue + jaune | rouge resolue | non requis | aucune | jaune |
| T10 | vert parent + enfant jaune propage | aucune | oui | active | jaune |
| T11 | vert parent + enfant rouge propage | aucune | oui | active | rouge |
| T12 | vert parent + enfant rouge non propage | aucune | oui | relation archivee | vert |
| T13 | stock rouge seul | aucune | oui | aucun lien explicite | vert |
| T14 | stock rouge transforme en cause jaune | aucune | oui | lien explicite | jaune |
| T15 | donnees importees insuffisantes | aucune | non | aucune | noir |

## 8. Contraintes D'Implementation

- Le moteur central doit utiliser les rangs numeriques stricts.
- Les statuts metier restent limites a noir, vert, jaune et rouge.
- Le statut affiche peut etre mis en cache, mais le cache doit etre recalculable depuis les faits et causes.
- Toute action critique modifiant une cause doit produire un evenement d'audit.
- Le recalcul doit etre declenchable par evenement critique, par job planifie et par action admin autorisee.
- Les tests doivent couvrir au minimum la table de verite de ce document.
- Aucune cause archivee ou resolue ne doit etre incluse dans le calcul courant.
- Toute cause active retenue doit etre affichable dans une vue d'explication.

## 9. Definition De Pret Pour Le Moteur De Statut

Le moteur de statut peut etre implemente lorsque:

- les types de causes sont modelises;
- les modules savent produire des causes normalisees;
- les relations parent/enfant actives sont representables;
- les causes resolues et archivees sont distinguables;
- la fraicheur d'un fait conforme est definie par chaque module concerne;
- le stock reste separe sauf regle explicite de liaison;
- les tests unitaires reprennent les exemples et la table de verite ci-dessus.
