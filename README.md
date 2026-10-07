# Fahd Auto — Trirex Motors Transit

Site vitrine de vente de véhicules d'occasion (inspiré de l'ergonomie de DubiCars), en **français, anglais et arabe**.
Chaque bouton « acheter / plus d'infos » ouvre **WhatsApp (+32 466 90 21 48)** ou un **email (fahdauto.transit@gmail.com)**
avec un message déjà rempli : modèle, référence, kilométrage, prix indiqué et lien vers l'annonce.

Site 100 % statique (React + Vite + Tailwind) : pas de serveur, pas de base de données, hébergement gratuit possible.

---

## 1. Lancer le site sur cet ordinateur

Prérequis : Node.js 20 ou plus et pnpm (`npm install -g pnpm`).

```bash
cd /home/nick/Bureau/fahd-auto
pnpm install
pnpm dev
```

Ouvrez ensuite l'adresse affichée (par défaut http://localhost:3000).

Construire la version de production (dossier `dist/`) :

```bash
pnpm build
pnpm preview
```

Le build génère **une vraie page HTML par véhicule et par langue** (`/`, `/en/…`, `/ar/…`), avec titre, description,
données structurées, `sitemap.xml` et `robots.txt` : c'est ce que Google indexe.

---

## 2. Mettre le site en ligne

### Option A — Vercel (recommandé, gratuit)

1. Créez un compte sur https://vercel.com (connexion avec GitHub conseillée).
2. Mettez le dossier sur GitHub :
   ```bash
   cd /home/nick/Bureau/fahd-auto
   git init
   git add .
   git commit -m "Site Fahd Auto"
   ```
   Créez un dépôt vide sur https://github.com/new, puis suivez les deux commandes `git remote add origin …` et `git push -u origin main` indiquées par GitHub.
3. Sur Vercel : **Add New → Project → Import** votre dépôt.
   - Framework : *Vite* (détecté automatiquement)
   - Build command : `pnpm build` — Output directory : `dist`
   - Variables d'environnement (voir `.env.example`) : **`VITE_SITE_URL` = `https://votre-domaine.com` (indispensable pour Google)**,
     et si vous le souhaitez `VITE_PLAUSIBLE_DOMAIN` ou `VITE_GA_ID`, `VITE_STOCK_SHEET_CSV`.
4. Cliquez **Deploy**. Le fichier `vercel.json` gère déjà les URL des annonces (`/voiture/...`).

Sans GitHub : `npx vercel` dans le dossier, puis suivez les questions.

### Option B — Netlify (gratuit)

- Glisser-déposer : lancez `pnpm build`, puis déposez le dossier `dist/` sur https://app.netlify.com/drop.
- Ou import GitHub : le fichier `netlify.toml` est déjà configuré (build `pnpm build`, dossier `dist`).
- Le fichier `public/_redirects` gère les URL des annonces.

### Option C — Hébergement classique (OVH, Hostinger, o2switch…)

1. `VITE_SITE_URL=https://votre-domaine.com pnpm build`
2. Envoyez **le contenu** du dossier `dist/` dans `public_html/` (FTP / gestionnaire de fichiers).
3. Ajoutez un fichier `.htaccess` dans `public_html/` pour que les liens directs vers les annonces fonctionnent :
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

### Nom de domaine

Achetez un domaine (ex. `fahdauto.com`, ~10–15 €/an) chez OVH, Namecheap, Gandi… puis dans Vercel/Netlify :
**Settings → Domains → Add**, et suivez les enregistrements DNS indiqués. Le HTTPS est automatique.

---

## 3. Modifier le site

| Je veux… | Fichier |
| --- | --- |
| Changer le numéro WhatsApp, le téléphone ou l'email | `src/config.ts` (`SITE`) |
| **Ajouter les informations légales de l'entreprise** (nom, BCE, TVA, adresse, hébergeur) | `src/config.ts` (`COMPANY`) : elles apparaissent automatiquement dans les pages légales |
| Mettre à jour les taux € → $ / AED | `src/config.ts` (`RATES`) |
| Ajuster les frais de transport et taxes du calculateur | `src/data/shipping.ts` |
| Modifier « Comment ça marche », la FAQ, les pages légales | `src/content/pages.ts` |
| Ajouter / modifier / retirer une voiture, changer un prix | `src/data/cars.ts` |
| Ajouter / modifier / retirer une moto ou un scooter | `src/data/motos.ts` (même principe ; références FM-2001…) |
| Changer un texte (FR / EN / AR) | `src/i18n/fr.ts`, `en.ts`, `ar.ts` |
| Changer les ports de destination affichés | `PORTS` dans `src/data/catalog.ts` |
| Changer les couleurs | `@theme` en haut de `src/index.css` |
| Changer le logo | `public/brand/emblem.png` (+ icônes `public/brand/icon-*.png`) |

### Ajouter un véhicule avec vos propres photos

1. Créez le dossier `public/cars/mon-vehicule/` et mettez-y vos photos au format WebP ou JPG
   (`1.webp`, `2.webp`… et une miniature `1-sm.webp` ~640 px de large pour les listes).
2. Dans `src/data/photos.json`, ajoutez une entrée :
   ```json
   "mon-vehicule": [
     { "src": "/cars/mon-vehicule/1.webp", "thumb": "/cars/mon-vehicule/1-sm.webp", "view": "front",
       "author": "Fahd Auto", "license": "Photo Fahd Auto", "licenseUrl": "", "source": "" }
   ]
   ```
3. Dans `src/data/cars.ts`, copiez un bloc `car({ ... })`, mettez `slug: "mon-vehicule"` et remplissez les champs.
4. Véhicule vendu : supprimez son bloc ou ajoutez `sold: true`.

La référence (FA-1001, FA-1002…) est attribuée automatiquement dans l'ordre du fichier.

---

## 3 bis. Changer prix et statuts (Réservé / Vendu) sans toucher au code

1. Créez une feuille Google Sheets avec ces colonnes (1re ligne) : `slug`, `status`, `priceFrom`, `priceXaf`.
   - `slug` : l'identifiant du véhicule, c'est la fin de son adresse (ex. `toyota-hilux` pour `/voiture/toyota-hilux`).
   - `status` : `available`, `reserved` ou `sold`.
   - `priceFrom` : nouveau prix en euros (facultatif). `priceXaf` : prix en FCFA (facultatif).
2. Fichier → Partager → **Publier sur le Web** → format **CSV** → copiez le lien.
3. Mettez ce lien dans la variable `VITE_STOCK_SHEET_CSV` chez votre hébergeur, puis redéployez une fois.

Ensuite, chaque modification de la feuille apparaît sur le site au chargement des pages (quelques minutes de délai côté Google).
Remarque : les pages lues par Google gardent les prix du dernier déploiement ; redéployez de temps en temps.

## 4. Structure

```
src/
  config.ts            coordonnées (WhatsApp, email)
  data/cars.ts         voitures (47) — data/motos.ts : motos et tricycles (30)
  data/shipping.ts     estimations du calculateur « prix livré »
  content/pages.ts     « Comment ça marche », FAQ, pages légales (FR / EN / AR)
  entry-server.tsx     rendu des pages HTML pour Google (tools/prerender.mjs)
  data/photos.json     photos + crédits (auteur, licence, source)
  i18n/                traductions FR / EN / AR (+ sens droite-à-gauche pour l'arabe)
  lib/contact.ts       construction des messages WhatsApp / email
  lib/describe.ts      description générée à partir des caractéristiques
  pages/               Accueil, Annonces, Fiche véhicule, Favoris, Comparateur, Export, Contact, Crédits
public/cars/           photos des véhicules (WebP, 1280 px + miniature 640 px)
tools/                 scripts Python ayant servi à récupérer les photos Wikimedia Commons
```
