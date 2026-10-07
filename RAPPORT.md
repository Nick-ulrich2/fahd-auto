# Rapport de livraison — Fahd Auto

**Projet :** `/home/nick/Bureau/fahd-auto` · **Date :** 5 octobre 2026

## Ce qui a été construit

Une plateforme de vente de véhicules d'occasion qui reprend l'ergonomie de DubiCars, aux couleurs du logo Fahd Auto (vert et rouge).
Le zip « Afrirex » de départ a servi de base technique : même pile React + Vite + Tailwind + wouter. Le code a été réécrit proprement,
sans les dépendances Manus ni les 100 articles généralistes.

### Pages
| Page | URL | Contenu |
| --- | --- | --- |
| Accueil | `/` | Recherche rapide (marque, modèle, carrosserie, prix max.) avec compteur en direct, carrosseries, sélection, marques, « comment acheter », derniers arrivages, arguments, appel à l'action WhatsApp |
| Annonces | `/voitures` | 10 filtres combinables (marque, modèle, carrosserie, prix, année, km, énergie, boîte, transmission, places, couleur), tri, filtres conservés dans l'URL (partageables), tiroir de filtres sur mobile |
| Fiche véhicule | `/voiture/<slug>` | Galerie avec zoom plein écran, prix « à partir de », 4 boutons de contact, aperçu, description générée, ~45 caractéristiques techniques, équipements par catégorie, historique et documents, livraison et export, véhicules similaires, barre d'action fixe sur mobile |
| Favoris | `/favoris` | Liste sauvegardée dans le navigateur + « demander les prix de mes favoris » en un message |
| Comparateur | `/comparer` | Jusqu'à 3 véhicules côte à côte |
| Export & transport | `/export` | Services, ports desservis (chaque port ouvre un devis WhatsApp) |
| Contact | `/contact` | WhatsApp, email, téléphone |
| Crédits | `/credits` | Auteur et licence de chaque photo, mentions sur les prix |

### Contact client (votre demande principale)
- **WhatsApp** → `wa.me/32466902148` avec un message pré-rempli :
  *« Bonjour Fahd Auto, je suis intéressé(e) par ce véhicule… • Toyota Hilux Double Cab Invincible 2.8 D-4D 2021 — Réf. FA-1003 • 52 300 km · Diesel · Automatique • Prix indiqué : à partir de 38 900 € • Lien : … Quel est votre meilleur prix ? »*
- **Email** → `fahdauto.transit@gmail.com`, avec le même contenu et un objet « Demande — modèle (réf.) ».
- **Faire une offre** : le client saisit son prix, son nom et son pays → envoi sur WhatsApp ou par email.
- Le message est rédigé **dans la langue choisie par le client** (FR / EN / AR).
- Bouton WhatsApp flottant sur toutes les pages, et WhatsApp dans l'en-tête et le pied de page.

### Langues
Français, anglais et arabe (≈ 340 textes chacun), avec mise en page de droite à gauche pour l'arabe.
La langue est détectée automatiquement, mémorisée, et peut être forcée par lien : `?lang=ar`, `?lang=en`.

### Catalogue : 42 véhicules, 15 marques
Toyota (Land Cruiser 300, Prado, Hilux, RAV4, Corolla, Camry, C-HR), Mercedes (Classe C, Classe E, GLE, Classe G, GLC, Sprinter 9 places),
BMW (X5, Série 3, X3, Série 5), Audi (Q5, Q7), Volkswagen (Golf, Tiguan, Touareg, Passat), Hyundai (Tucson, Santa Fe), Kia (Sportage, Sorento),
Nissan (Patrol V8, Qashqai, Navara), Land Rover (Range Rover Sport, Evoque, Defender 110), Mitsubishi (L200, Pajero Sport), Peugeot 3008,
Dacia Duster, Ford (Transit, Ranger), Lexus (RX 450h, LX 570), Škoda Octavia Combi.

Chaque fiche contient : version, génération, année, 1re immatriculation, kilométrage, cylindrée, architecture moteur, puissance (ch et kW), couple,
boîte et nombre de rapports, transmission, 0-100, vitesse max., consommation WLTP, CO₂, norme Euro, dimensions, poids, réservoir, coffre ou charge utile,
remorquage, places, portes, couleurs, sellerie, jantes, airbags, propriétaires, clés, carnet, Car-Pass, COC, garantie, localisation, et 20 à 45 équipements.

### Photos
**166 vraies photos** (4 par véhicule en général : avant, arrière, intérieur, 2e vue), aucune image générée par IA.
Elles viennent de **Wikimedia Commons** sous licences libres (CC BY-SA, CC BY, CC0), qui autorisent l'usage commercial **à condition de créditer l'auteur**.
C'est fait sous chaque photo et sur la page `/credits`. Les galeries ont été vérifiées une à une : 10 modèles corrigés à la main
(mauvaise génération, gros plans, camping-car…), et la couleur annoncée correspond à celle de la photo principale.
Format WebP (1280 px + miniature 640 px) : 28 Mo au total.

Je n'ai pas copié les photos de DubiCars ni de concessionnaires : elles sont protégées par le droit d'auteur, et les réutiliser exposerait votre site
à un retrait ou à des poursuites.

### Vérifications faites
- Compilation TypeScript stricte et build de production : OK (JS 123 Ko compressé).
- Testé dans le navigateur : accueil, annonces et filtres, fiche, formulaire d'offre, liens WhatsApp et email, version arabe, version mobile (375 px, sans défilement horizontal).

---

## Ajout : section Motos (20 motos et scooters)

- Pages `/motos` (annonces) et `/moto/<slug>` (fiche), onglet **Voitures | Motos** dans la recherche de l'accueil,
  section « Motos & scooters » sur l'accueil, lien « Motos » dans le menu et le pied de page.
- Modèles : Yamaha MT-07, Tracer 900 GT, Ténéré 700, TMAX 560, XMAX 300 · Honda CB650R, Africa Twin CRF1100L DCT, NC750X DCT ·
  Kawasaki Z900, Ninja 650 · Suzuki V-Strom 650 XT, GSX-S1000 · BMW R 1250 GS HP, S 1000 RR · KTM 390 Duke · Triumph Tiger 900 GT Pro ·
  Harley-Davidson Fat Boy 114 · Royal Enfield Himalayan · Ducati Monster +, Multistrada V4 S.
- Fiche moto propre : cylindrée et architecture moteur (bicylindre, boxer, V4…), puissance, couple, boîte, transmission finale
  (chaîne, courroie ou cardan), refroidissement, hauteur de selle, poids, réservoir, suspensions et débattements, freins (nombre et diamètre
  des disques), dimensions des pneus, **permis requis (A ou A2)**, et des équipements spécifiques (ABS en courbe, contrôle de traction, shifter,
  poignées chauffantes, TFT, suspensions pilotées, valises, pare-carters…).
- Filtres : types de motos (roadster, trail, sportive, routière, maxi-scooter, custom), **« compatible permis A2 »**, prix et kilométrages adaptés.
- **71 photos réelles** de Wikimedia Commons, triées à la main. Le catalogue Commons est plus pauvre pour les motos :
  la TMAX 560 et la Tiger 900 n'ont que 2 photos, la S 1000 RR 3. J'ai donc ajusté trois fiches pour qu'elles correspondent aux photos
  disponibles (S 1000 RR 2018, V-Strom 650 à la place du 1050, Forza 350 retiré).
- Les motos sont indiquées **sans Car-Pass** : à ma connaissance ce certificat belge ne concerne pas les motos (à vérifier de votre côté).

## Ajout : motos et tricycles du marché africain (Cameroun)

**Ajoutés (10 modèles avec de vraies photos libres de droits)**, prix en **FCFA + équivalent en euros**,
catégories « Moto utilitaire / moto-taxi » et « Tricycle cargo », filtre **Neuf / Occasion**, permis A1 pour les 125 cm³ :

| Modèle de votre liste | Fiche créée | État | Prix indicatif |
| --- | --- | --- | --- |
| Bajaj Boxer 100 | Bajaj Boxer BM 100 ES | Neuf | 650 000 FCFA |
| Bajaj Boxer 150 | Bajaj Boxer BM 150 X | Neuf | 850 000 FCFA |
| Haojue 150 (+ « Haoudjo ») | Haojue HJ150-9 | Neuf | 950 000 FCFA |
| Lifan 150 | Lifan LF150-7 | Neuf | 700 000 FCFA |
| Loncin 125 | Loncin LX125 | Neuf | 600 000 FCFA |
| Hero | Hero Splendor+ | Neuf | 700 000 FCFA |
| Honda CG 125 | Honda CG 125 Fan ES (2019) | Occasion | 550 000 FCFA |
| Yamaha 125 | Yamaha YBR 125 ED (2020) | Occasion | 850 000 FCFA |
| Yamaha 110 | Yamaha Crux 110 (2021) | Occasion | 650 000 FCFA |
| Lifan LF200ZH-2 / -3, Lifan 3 roues, Lifan 200ZH | Tricycle cargo Lifan 200ZH (une seule fiche, variantes sur demande) | Neuf | 1 950 000 FCFA |

À vérifier : les prix sont des estimations du marché camerounais, et les fiches techniques sont les données habituelles de ces modèles,
à confirmer avec vos fournisseurs. J'ai aussi indiqué « Anvers, Belgique » comme localisation, à remplacer par votre vrai point de stock
(Douala, par exemple). Le choix neuf ou occasion de chaque fiche est un exemple.

**Sans photo libre de droits : pas encore ajoutés**

Motos :
- TVS HLS Plus, TVS 110, TVS 125, TVS 150 (Commons n'a que des TVS Apache et Ntorq, pas les HLX).
- Bajaj Boxer 125. Bajaj CT 125 (seule la CT 100 a des photos).
- Haojue Winner 125, Lucky 110, Glory 125, Elegant 125.
- Sanili TS 110, TS 125, TS 150, TS 200.
- Lifan 125, Lifan 200, Lifan 250.
- Nanfang 150, Eagle 150, Gold Star 150, CG 150, Wolf 150 (+ « Sanfang », que je suppose être Nanfang).
- Nanya 110 et 125. Senke 150 (seule la Senke SK125 a une photo).
- Loncin 150. Zongshen 125 et 150. Jialing 125 et 150. Qlink 125 et 150. Sanya 125 et 150.
- Royal, Bazar, BLI, Fenghao.

Tricycles : Bazar GB200ZH-A, GB200ZH-B, JB200ZH-B · Sanili TS200ZH-B, TS200ZH-4B, TS150ZH-A · Royal · Agro.

**Comment obtenir les photos manquantes, légalement**
1. **Le mieux : vos propres photos.** 4 photos par moto prises au téléphone (avant 3/4, arrière 3/4, profil, compteur) suffisent.
   Ce sont aussi les photos qui rassurent le plus les acheteurs. Envoyez-les-moi, j'ajoute les fiches.
2. **Le kit presse du fabricant ou de son distributeur** (Sanili, Haojue, Lifan, Bajaj Cameroun…). Les marques fournissent souvent
   leurs photos officielles aux revendeurs, sur simple demande par email. Gardez une trace écrite de l'autorisation.
3. Je ne copie pas les photos des sites constructeurs sans autorisation : elles sont protégées par le droit d'auteur, et leur
   utilisation non autorisée peut entraîner un retrait du site ou une réclamation.

## Version 3 : confiance, référencement et fonctions « pro »

Cible confirmée : **les particuliers du monde entier** (Afrique, Europe, Dubaï), avec la négociation sur WhatsApp.

### Confiance
- **Page « Comment ça marche »** (`/comment-ca-marche`) : les 6 étapes d'un achat, le paiement sécurisé (facture proforma,
  virement uniquement sur le compte de l'entreprise, reçu, inspection possible), la mise en garde **« Attention aux arnaques »**
  (seuls contacts officiels), les documents remis et une **FAQ de 11 questions**.
- **Bandeau de confiance** sur l'accueil et **encadré « Achat sécurisé »** sur chaque fiche, avec le seul numéro officiel.
- **Pages légales** : mentions légales, conditions générales de vente, politique de confidentialité (FR / EN / AR).
  Les informations de l'entreprise se remplissent dans `src/config.ts` → `COMPANY` ; tant qu'elles sont vides, ces lignes ne s'affichent pas.
- **Statuts « Réservé » / « Vendu »** : badge sur les cartes, photo en noir et blanc si vendu, et bouton « Trouver un équivalent ».

### Pour l'acheteur
- **Choix de la devise : € / FCFA / $ / AED**, proposé automatiquement selon le pays du visiteur (FCFA en Afrique centrale et de l'Ouest,
  AED à Dubaï, $ aux Amériques). Prix, filtres, offres et messages WhatsApp suivent la devise choisie.
- **Calculateur « Prix livré estimé »** sur chaque fiche : 20 destinations (Douala, Abidjan, Dakar, Lagos, Mombasa, Casablanca, Dubaï, Europe…),
  avec transport estimé selon l'origine (Europe ou Dubaï) et le type de véhicule, et droits et taxes estimés en option.
  Il se termine par un bouton « Recevoir un devis exact » sur WhatsApp.
- **Recherche personnalisée** (`/recherche-vehicule`) : le client décrit le véhicule voulu, son budget et son pays, et la demande part sur WhatsApp ou par email.
- **Commande en lot** sur les fiches des motos utilitaires et des tricycles (revendeurs, flottes de motos-taxis).
- **Origine affichée** : « Depuis l'Europe » ou « Depuis Dubaï (spéc. GCC) », avec le texte de livraison adapté (port de Jebel Ali).

### Stock (augmenté, rien n'a été retiré)
- **5 véhicules de Dubaï ajoutés**, très demandés en Afrique : Toyota Land Cruiser 79 double cabine V8, Toyota Fortuner V6,
  Nissan Sunny, Hyundai Elantra, Kia Picanto. Vraies photos libres de droits, triées à la main ; deux photos du LC79 sont des « versions Afrique ».
- Les Land Cruiser 300, Patrol, LX 570 et Pajero Sport (spéc. GCC) sont désormais localisés à Dubaï.
- Total : **77 véhicules** (47 voitures, 30 motos et tricycles), 29 marques.

### Référencement Google
- **Une adresse par langue** : `/…` (français), `/en/…`, `/ar/…`. Les anciens liens `?lang=` redirigent automatiquement.
- **Pré-rendu** : le build génère **264 vraies pages HTML** (88 adresses × 3 langues), avec titre, description, contenu complet,
  balises canonical et hreflang, et aperçu de partage (Open Graph : la photo du véhicule s'affiche quand on partage le lien sur WhatsApp ou Facebook).
- **Données structurées schema.org** : concessionnaire (AutoDealer), voiture ou moto avec prix et disponibilité, fil d'Ariane, FAQ.
- **sitemap.xml multilingue** et **robots.txt** générés automatiquement. Il faut définir `VITE_SITE_URL` au déploiement.

### Mesure et gestion
- **Mesure d'audience prête** : Plausible (sans cookie) ou Google Analytics avec bandeau de consentement. Chaque clic **WhatsApp, Email ou Appel**
  est enregistré avec la page d'origine : vous saurez quelles annonces génèrent des contacts. À activer avec `VITE_PLAUSIBLE_DOMAIN` ou `VITE_GA_ID`.
- **Prix et statuts modifiables depuis une feuille Google Sheets**, sans toucher au code (voir README § 3 bis).

### Ce que je n'ai pas pu faire (dépend de vous)
1. **Informations de l'entreprise** : nom légal, numéro BCE, TVA, adresse, responsable de publication, hébergeur (`src/config.ts` → `COMPANY`).
2. **WhatsApp Business** : profil vérifié, catalogue, message d'accueil, réponses rapides.
3. **Nom de domaine, mise en ligne et Google Search Console** : déclarer le site et envoyer le sitemap.
4. **Comptes de mesure d'audience** (Plausible ou Google Analytics), puis renseigner l'identifiant.
5. **Valider le processus de vente et les conditions** : acompte, délais, garanties, politique en cas de litige. J'ai rédigé des modèles
   prudents, à faire relire par un juriste.
6. **Vérifier les tarifs du calculateur** (`src/data/shipping.ts`) avec votre transitaire : ce sont des ordres de grandeur.
7. **Vrai stock, vraies photos, vrais avis clients** : je n'invente pas d'avis.

## ⚠️ À faire avant la mise en ligne

1. **Le catalogue est un exemple réaliste, pas votre stock.** Kilométrages, années, propriétaires, couleurs, localisations et prix ont été choisis pour être plausibles.
   Publier des annonces pour des véhicules que vous n'avez pas serait de la publicité trompeuse. Remplacez-les par vos vrais véhicules
   (voir README, § 3) ou retirez ceux que vous n'avez pas.
2. **Prix « à partir de »** : ce sont des estimations du marché européen de l'occasion en 2026, à ajuster.
3. **Données techniques** : ce sont les données constructeur de chaque version, issues de mes connaissances. Faites-les relire par vos soins avant publication.
   Les LC 300, Patrol V8, LX 570 et Pajero Sport sont indiqués comme « spécifications export / GCC » (pas de Car-Pass ni de COC européen).
4. **Photos** : ce sont des photos *du modèle*, signalées comme « photos d'illustration ». Dès que possible, remplacez-les par les photos réelles de chaque véhicule,
   c'est ce qui rassure le plus les acheteurs. Les intérieurs sont souvent en conduite à droite (photos prises au Royaume-Uni ou en Asie).
5. **Affirmations commerciales à confirmer** : départ d'Anvers en RoRo ou conteneur, liste des ports, Car-Pass fourni, « visite sur rendez-vous en Belgique ».
   Modifiez les textes dans `src/i18n/*.ts` si ça ne correspond pas à votre activité.
6. **Mentions légales** : une entreprise belge doit afficher son numéro BCE / TVA et son adresse. Envoyez-les-moi et je les ajoute au pied de page.
7. Définissez `VITE_SITE_URL` au moment du build pour obtenir le `sitemap.xml` et des liens corrects dans les messages.

## Questions ouvertes (pour aller plus loin)
- Avez-vous une adresse de showroom à afficher (avec carte) ?
- Voulez-vous une petite interface d'administration pour ajouter des véhicules sans toucher au code (ex. Google Sheet ou CMS) ?
- Faut-il des prix dans d'autres devises (FCFA, MAD, USD) ?
- Souhaitez-vous des statistiques de visite (ex. Plausible ou Google Analytics) ?
