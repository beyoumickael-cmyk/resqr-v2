# DESIGN SYSTEM RESQR V2

## 0. Rôle Du Document

Référence visuelle unique de ResQR V2. Il décrit l'intention produit, les règles de composition et les composants à utiliser. Les fichiers de tokens exécutent ces règles.

Sources de vérité techniques:
- `resqr-tokens.css`: variables CSS, importées une seule fois globalement.
- `tailwind.config.ts`: thème Tailwind pointant vers ces variables.

Règle absolue: aucune couleur, taille de police, hauteur de contrôle, ombre ou rayon en dur dans le code. On utilise les classes Tailwind du thème (`bg-surface`, `text-accent`, `h-control`, `rounded-md`) ou les variables CSS. Si une valeur manque, on l'ajoute au token avant usage.

ResQR V2 est en dark theme partout, sauf les popups en light theme (voir section 12). Le basculement se fait via `data-theme="popup"` sur le conteneur de popup, pas par des couleurs réécrites localement.

## 1. Direction Produit Et Visuelle

ResQR V2 doit ressembler à un SaaS opérationnel moderne, pas à une landing page ni à un dashboard décoratif. L'utilisateur vient d'abord savoir si ses moyens sont prêts, dégradés ou indisponibles.

Principes:
- état des moyens en premier, toujours visible sans chercher;
- pré-alertes et alertes qui sautent aux yeux par hiérarchie, forme, position et libellé, pas seulement par couleur;
- densité métier assumée, mais organisée en zones scannables;
- fond sombre profond, surfaces calmes, texte net, accent bleu réservé aux actions et sélections;
- rendu moderne par la précision, les espacements réguliers, les cartes sobres et les visuels véhicules 3D, jamais par des effets décoratifs gratuits.

La V1 conserve une essence à préserver:
- thème sombre terrain;
- navigation latérale claire;
- LED vert/ambre/rouge immédiatement reconnaissables;
- fiches véhicules/matériels compactes;
- priorité visuelle donnée aux pannes, péremptions, contrôles et éléments manquants.

La V2 modernise cette base:
- grilles plus rationnelles;
- typographie plus hiérarchisée;
- cartes moins lourdes;
- alertes plus structurées;
- véhicules 3D mieux intégrés aux fiches;
- composants cohérents sur Synthèse, Garage, Matériel, Stock, Messagerie et Activité.

## 2. Couleurs

### 2.1 Surfaces Dark

- `bg` #0d1117: fond applicatif principal.
- `bg-deep` #07090f: fond le plus profond, derrière les cartes et zones de navigation.
- `surface` #161b22: cartes, panneaux, conteneurs principaux.
- `surface-2` #1c232c: éléments imbriqués, lignes alternées, inputs.
- `border` / `border-strong`: séparations et contours.

Les surfaces doivent rester neutres. On évite les fonds massivement colorés hors statuts opérationnels.

### 2.2 Texte

- `text` #f0f0f0: texte principal.
- `text-muted`: secondaire, descriptions, dates.
- `text-faint`: états vides, placeholders, informations désactivées.

Le contraste prime sur l'effet visuel. Les données critiques ne passent jamais en `text-faint`.

### 2.3 Marque

- `accent` #039af5: action principale, sélection active, focus, lien.
- `teal` #02ecd1: accent secondaire, éléments illustratifs ou état actif non critique.

Le bleu ResQR ne concurrence jamais le rouge/ambre/vert opérationnel. Un bouton d'action peut être bleu; une alerte ne l'est pas.

### 2.4 Sémantiques Opérationnelles

- `success` #17db4e: conforme.
- `warning` #ffc36b: vigilance, pré-alerte, échéance proche.
- `critical` #ee6352: alerte, périmé, panne dangereuse, item manquant bloquant.

Les couleurs vert/ambre/rouge sont réservées aux états opérationnels et actions destructives. Elles ne servent jamais de décoration, de gradient de fond ou de simple accent graphique.

Gradient signature autorisé uniquement pour illustrations, écrans vides et visuels non critiques: #039AF5 -> #02ECD1 -> #EE6352.

## 3. Statut LED

Le statut LED est le composant central de ResQR. Il reflète la matrice métier déterministe et doit être visible dans toutes les vues où un moyen, un stock, une checklist ou une alerte est affiché.

| Statut | Token | Sens | Priorité Visuelle |
| --- | --- | --- | --- |
| noir | `led-black` | non établi, jamais vérifié, données insuffisantes | discret mais explicite |
| vert | `led-green` | conforme, prêt, vérifié | visible, sans dominer |
| ambre | `led-amber` | vigilance, pré-alerte, retard ou anomalie non bloquante | attire l'attention |
| rouge | `led-red` | critique, périmé, panne dangereuse, indisponible | dominant, impossible à ignorer |

Règles:
- une LED est un point plein, jamais un simple contour;
- elle peut avoir un halo léger pour les statuts ambre et rouge;
- elle est toujours accompagnée d'un libellé ou d'un `aria-label`;
- la couleur seule ne porte jamais l'information;
- sur une liste dense, la LED se place près du nom du moyen ou de la quantité concernée;
- sur une carte principale, elle se répète dans le résumé et dans la cause.

## 4. Grammaire Des Alertes

Les pré-alertes et alertes doivent "sauter aux yeux" sans rendre l'écran anxiogène en permanence. La distinction se fait par intensité, placement et action.

### 4.1 Pré-Alerte

Usage: échéance proche, stock sous seuil de pré-alerte, contrôle en retard léger, anomalie à surveiller.

Composition:
- LED ambre;
- bande latérale ambre de 3px à gauche;
- icône explicite;
- titre court;
- cause métier lisible;
- échéance ou quantité en `font-mono` si typée;
- CTA secondaire précis: `Planifier`, `Vérifier`, `Ajuster`, `Voir causes`.

Intensité:
- fond `surface`;
- halo ambre très léger autorisé;
- jamais de carte entièrement ambre.

### 4.2 Alerte Critique

Usage: périmé, incomplet bloquant, panne dangereuse, niveau critique, moyen enfant rouge, item manquant critique.

Composition:
- LED rouge;
- bande latérale rouge de 4px à gauche;
- icône d'alerte;
- titre direct: `Périmé`, `Incomplet`, `Panne critique`, `Niveau critique`;
- cause métier en clair;
- moyen concerné visible immédiatement;
- CTA primaire métier: `Traiter`, `Remplacer`, `Créer tâche`, `Voir moyen`.

Intensité:
- fond `surface`;
- halo rouge léger ou bordure `critical`;
- le rouge peut colorer le compteur, la LED, la bande et l'icône, mais pas tout le panneau.

### 4.3 Hiérarchie D'Alerte

Ordre d'affichage recommandé:
1. Alertes rouges actives.
2. Pré-alertes ambre.
3. Statuts non établis noirs si action attendue.
4. Conformes verts.
5. Historique et activité secondaire.

Un écran qui affiche à la fois état des moyens, messages et statistiques doit toujours placer les alertes avant les messages.

## 5. Typographie

- UI, titres, corps: Montserrat (`font-ui`).
- Données opérationnelles typées: JetBrains Mono (`font-mono`) pour immatriculations, références, EAN, codes PIN, quantités, dates courtes et tags.

Échelle dark app:

| Usage | Taille | Poids |
| --- | --- | --- |
| Titre de page | 22px | 600 |
| Titre de section | 18px | 600 |
| Label / champ | 16px | 600 |
| Corps / input | 14px | 500 |
| Helper / description | 14px | 400 |
| Tag / code mono | 12px | 400 |
| Badge | 11px | 600 |

Règles:
- pas de typographie hero dans l'application métier;
- les compteurs critiques peuvent être grands, mais restent contenus dans une carte opérationnelle;
- les noms de moyens sont plus importants que les métadonnées;
- les causes d'alerte doivent rester lisibles en un coup d'oeil.

## 6. Espacement, Rayons, Tailles

- Espacement: échelle 5 / 10 / 15 / 20px (`rq-1` à `rq-4`).
- Rayons: 5px imbriqué (`sm`), 10px boutons/inputs/cartes (`md`), 20px popup et pills (`lg` / `pill`).
- Hauteur de tout input et bouton: 48px (`h-control`).
- Icône standard: 22px.
- Cartes denses: padding 15px à 20px selon niveau.
- Lignes de liste: hauteur stable, aucune variation au hover.

Les composants fixes comme toolbars, filtres, listes de moyens, cartes matériel et chips véhicule doivent avoir des dimensions stables pour éviter les décalages visuels.

## 7. Icônes

- Set par défaut: Phosphor Icons, variante `regular`, 22px.
- Couleur posée sur le wrapper, pas en fill sur le SVG.
- Variante `fill` réservée aux indicateurs d'état opérationnel.
- Variante `light` tolérée pour les CTA renforcés à grosse icône.
- Les icônes de menu restent des assets locaux fournis.

Une icône ne remplace jamais seule un libellé critique. Pour les alertes, l'icône renforce le signal mais la cause reste écrite.

## 8. Composants De Base Dark

1. Bouton primaire: fond `accent`, texte `accent-contrast`, `rounded-md`, `h-control`, padding 12/16, poids 500.
2. Bouton secondaire: fond `surface-2`, texte `text`, même gabarit.
3. Bouton destructif: fond `critical`, label précisant l'action irréversible.
4. Bouton carré icône seule: 36-37px, fond `surface-2` ou `accent` selon contexte, icône 22px.
5. Input texte: fond `surface-2`, bordure `border`, `rounded-md`, `h-control`, texte 14px.
6. Badge de statut LED: LED + libellé + `aria-label`.
7. Chip / tag: texte `font-mono` 12px, pastille couleur 5px, `rounded-pill`, hauteur 24px.
8. Carte: fond `surface`, bordure `border`, `rounded-md`, padding 20px.
9. Table / liste dense: lignes alternées `surface` / `surface-2`, pagination ou virtualisation obligatoire sur listes longues.
10. État vide: illustration ou icône discrète, texte `text-faint`, action de sortie claire.
11. État de chargement: skeleton ou indicateur sobre, jamais d'écran blanc figé.

CTA:
- libellé descriptif obligatoire;
- jamais `OK`, `Valider` ou `Confirmer` seul;
- préférer `Ajouter une checklist`, `Créer une panne`, `Planifier le contrôle`, `Traiter l'alerte`.

## 9. Vues Clés

### 9.1 Synthèse

Objectif: donner l'état opérationnel global en moins de 5 secondes.

Composition:
- topbar compacte: structure active, utilisateur, actions session;
- navigation latérale stable;
- première rangée de KPI centrée sur les actions à faire: vérifications, tâches, périmés, items manquants;
- zone "État des moyens" visible au-dessus des contenus secondaires;
- alertes rouges et pré-alertes ambre avant messagerie et activité;
- graphiques uniquement s'ils expliquent une décision.

À éviter:
- grand hero;
- cartes décoratives;
- statistiques sans action;
- messagerie plus visible que les alertes.

### 9.2 Garage / Véhicules

Objectif: savoir quel véhicule est prêt, en vigilance ou indisponible, puis accéder à sa cause.

Composition:
- rail horizontal ou grille de véhicules avec LED près du nom;
- fiche véhicule principale avec visuel 3D, nom, immatriculation, statut, dernière vérification, kilométrage et QR code;
- bloc "Pourquoi ce statut ?" obligatoire si statut noir, ambre ou rouge;
- pannes, expirations, rendez-vous et fluides organisés par priorité;
- historique et statistiques en second niveau.

La sélection véhicule doit être évidente par fond `accent` ou bordure accent, pas par LED.

### 9.3 Matériel

Objectif: gérer des volumes importants sans perdre les anomalies.

Composition:
- barre de synthèse: total, conformes, pré-alertes, alertes;
- filtres par statut, catégorie, véhicule, checklist;
- cartes matériel compactes avec icône/image, nom, véhicule parent, LED, routine, péremption;
- badges d'alerte en bas ou à droite de la carte;
- panneau latéral alertes toujours prioritaire.

Les cartes conformes restent calmes. Les cartes ambre/rouge ajoutent bande latérale, LED, compteur ou badge cause.

### 9.4 Stock

Objectif: repérer les ruptures et sous-seuils, puis ajuster rapidement.

Composition:
- vue liste dense prioritaire;
- compteur total, conformes, pré-alertes, alertes;
- ligne stock avec produit, zone, quantité courante, capacité/seuil, barre de niveau, sparkline et CTA `Ajuster`;
- sparkline colorée selon état courant;
- état rouge si quantité <= seuil d'alerte, ambre si quantité <= seuil de pré-alerte.

Le stock garde ses propres états vert/ambre/rouge et n'impacte un moyen que via règle métier explicite.

### 9.5 Messagerie Et Dernière Activité

Objectif: informer sans concurrencer les alertes.

Composition:
- messages dans des panneaux secondaires;
- événements système courts, horodatés, reliés au moyen;
- filtre par module si nécessaire;
- l'activité critique peut créer une alerte, mais ne la remplace pas.

Les cartes message ne doivent pas imiter les cartes d'alerte rouge/ambre sauf si elles portent réellement un statut opérationnel.

## 10. Véhicules 3D Et Assets

Les véhicules "3D" de ResQR V2 sont des rendus image locaux déjà présents dans le projet. Ils servent à reconnaître rapidement le moyen et à moderniser l'interface.

Racine actuelle:
- `public/App images/`

Familles véhicules observées:
- `vehicules AP`
- `vehicules smur`
- `vehicules_aasc_generique`
- `vehicules_cfs`
- `vehicules_crf`
- `vehicules_croix_blanche`
- `vehicules_ffss`
- `vehicules_fnpc`
- `Vehicules_S_Anim`
- `vehicules_snsm`
- `vehicules_sp`

Règles d'usage:
- utiliser les images locales pour cartes véhicule, fiche détail et sélecteur;
- privilégier `.webp` quand disponible;
- ne jamais charger d'asset distant pour un véhicule critique;
- prévoir un placeholder neutre si l'image manque;
- ne pas déformer les véhicules: `object-fit: contain`;
- fond véhicule sombre ou transparent, sans carte imbriquée décorative;
- thumbnails stables en taille dans les listes;
- visuel plus grand sur fiche détail, jamais au détriment du statut.

Performance:
- images servies depuis `/public`;
- lazy loading hors premier viewport;
- dimensions déclarées;
- compression `.webp` prioritaire;
- aucune animation 3D lourde dans les listes denses.

Convention cible à terme:
- garder la racine existante tant que le projet l'utilise;
- si une normalisation est lancée, migrer vers `public/images/vehicles/<structure_type_slug>/` avec mapping explicite et sans rupture d'assets.

## 11. États D'Interaction

- Focus: anneau `accent` à faible opacité (`box-shadow 0 0 0 3px rgba(var(--rq-accent-rgb), 0.2)`).
- Désactivé / en attente: `opacity: 0.8`, curseur par défaut.
- Hover: transition de fond 200ms.
- Action mutative: protection double-clic obligatoire.
- Sauvegarde: feedback explicite, même bref.

Les états d'interaction ne doivent pas masquer le statut. Un hover ne retire jamais une LED, une bande d'alerte ou une cause.

## 12. Popups Light Theme

Les popups conservent le système light theme déjà éprouvé sur V1. Conteneur via `data-theme="popup"`.

Règles inviolables:
- fond blanc, jamais dark dans une popup;
- titre et sous-titre centrés, contenu aligné à gauche;
- inputs et boutons 48px;
- CTA principal à droite, secondaire à gauche;
- libellé descriptif;
- astérisque collé au label pour l'obligatoire, pas de rouge décoratif;
- largeur max 550px, au-delà c'est une page;
- toujours un bouton Annuler accessible;
- CTA destructif en `critical` avec action irréversible explicite.

Le détail composant par composant des popups suit la spécification popup V1, transposée aux tokens `--rq-*`.

## 13. Densité, Accessibilité Et Performance

ResQR V2 est une application métier dense, sobre et rapide. Le visuel ne doit jamais coûter la fluidité.

Règles:
- listes longues paginées ou virtualisées;
- dropdowns avec recherche serveur pour gros volumes;
- feedback de chargement, sauvegarde et erreur systématique;
- pas d'écran blanc figé;
- texte jamais tronqué sur une information critique;
- couleur jamais seule porteuse d'information;
- données typées en `font-mono`;
- responsive utile: mobile terrain lisible, desktop dense.

Les panneaux doivent rester scannables:
- titres courts;
- causes lisibles;
- compteurs alignés;
- actions constantes;
- hiérarchie verticale claire.

## 14. Règles Inviolables

1. Aucune valeur visuelle en dur: tout passe par les tokens.
2. Dark theme partout sauf popups.
3. Vert/ambre/rouge réservés aux états opérationnels et actions destructives.
4. Les alertes rouges et pré-alertes ambre doivent être visibles avant les contenus secondaires.
5. Contrôles à 48px de haut.
6. JetBrains Mono pour toute donnée typée.
7. Phosphor regular 22px par défaut, couleur sur le wrapper.
8. Icônes de menu locales, pas Phosphor.
9. CTA descriptif, jamais `OK`, `Valider` ou `Confirmer` seul.
10. La couleur seule ne porte jamais une information critique.
11. Toute liste longue est paginée ou virtualisée.
12. Les visuels véhicules ne remplacent jamais le statut ni sa cause.

## 15. Assets Public

Convention actuelle et usage des images locales.

### 15.1 Racine Existante

Dossier réellement présent:

```text
public/App images/
```

Cette racine contient les visuels applicatifs, empty states historiques, logos de structures et rendus véhicules.

### 15.2 Véhicules

Les véhicules sont actuellement stockés par famille dans `public/App images/<famille>/`.

Le code ne doit pas supposer qu'une image existe. Il doit:
- recevoir un slug ou chemin autorisé depuis la donnée métier;
- vérifier ou fallback sur placeholder;
- conserver `object-fit: contain`;
- afficher le statut indépendamment de l'image.

### 15.3 Empty States

Empty states actuellement présents:
- `public/empty states/`
- certains visuels dans `public/App images/`

Règle cible:
- centraliser l'appel via un composant `<EmptyState />`;
- passer un slug de module;
- ne jamais mettre une `<img>` directe répétée dans chaque écran;
- afficher un placeholder neutre si l'asset manque.

### 15.4 Icônes De Menu

Dossier actuel:

```text
public/icones/
```

Chaque feature du menu principal peut avoir deux fichiers:
- `<feature>.webp` ou `.svg` pour état actif;
- `<feature>_off.webp` ou `.svg` pour état inactif.

Le composant `<MenuIcon feature="stock" active />` choisit le fichier selon l'état. Cette règle prime sur la règle générale Phosphor.

### 15.5 Règles Communes

- Tout asset UI critique doit exister dans `/public`.
- `.webp` prioritaire pour les images.
- `.svg` autorisé pour les icônes.
- Pas d'image distante pour l'UI critique.
- Si un asset manque, afficher un placeholder neutre, jamais une erreur visible.

## 16. Tokens Futurs À Prévoir

Ces tokens peuvent être ajoutés si l'implémentation en a besoin. Ils ne doivent pas être hardcodés dans les composants.

- surface d'alerte rouge légère;
- surface de pré-alerte ambre légère;
- halo LED rouge / ambre / vert;
- bande latérale d'alerte;
- hauteur de ligne dense;
- largeur rail navigation;
- ombre de panneau opérationnel;
- dimensions thumbnails véhicules.

Tant qu'ils ne sont pas ajoutés aux fichiers techniques, on compose avec les tokens existants.
