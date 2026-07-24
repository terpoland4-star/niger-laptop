
# Niger Laptops - Plateforme E-Commerce

Une plateforme e-commerce moderne et responsive pour Niger Laptops, un revendeur de matériel informatique basé à Niamey, Niger. Construit avec React 19, Tailwind CSS 4 et TypeScript.

## Fonctionnalités

### Fonctionnalités principales
- **Catalogue produits** : 34 produits soigneusement sélectionnés (ordinateurs, tablettes, accessoires)
- **Filtrage par catégorie** : Parcourez par Ordinateurs, Stockage ou Accessoires
- **Liste de souhaits** : Sauvegardez vos produits favoris (stockage localStorage)
- **Intégration WhatsApp** : Contact direct avec informations produit pré-remplies
- **Support bilingue** : Français et Anglais
- **Mode sombre** : Basculement manuel ou automatique

### PWA
- **Installable** : Ajout à l'écran d'accueil sur mobile et desktop
- **Support hors-ligne** : Service Worker pour le cache des assets essentiels
- **Expérience applicative** : Mode d'affichage standalone
- **Notifications push** : Prêt pour l'intégration OneSignal

### Design
- **Palette inspirée du Sahel** : Couleurs chaudes reflétant le paysage nigérien (sable, orange, terre)
- **Typographie premium** : Poppins pour les titres, Inter pour le corps de texte
- **Animations fluides** : Micro-interactions et transitions
- **Responsive** : Design mobile-first, entièrement adaptatif
- **Accessibilité** : Conforme WCAG AA, ratios de contraste élevés, navigation au clavier

## Structure du projet

```

niger-laptops/
├── client/
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   ├── service-worker.js      # Service Worker
│   │   ├── robots.txt             # SEO
│   │   └── favicon.ico            # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         # Navigation
│   │   │   ├── Hero.tsx           # Section héro
│   │   │   ├── Catalog.tsx        # Catalogue
│   │   │   ├── ProductCard.tsx    # Fiche produit
│   │   │   ├── About.tsx          # À propos
│   │   │   ├── Contact.tsx        # Contact
│   │   │   ├── Footer.tsx         # Pied de page
│   │   │   └── WishlistModal.tsx  # Modale liste de souhaits
│   │   ├── data/
│   │   │   ├── products.ts        # Données produits (34 articles)
│   │   │   └── company.ts         # Infos entreprise
│   │   ├── hooks/
│   │   │   ├── useWishlist.ts     # Gestion wishlist
│   │   │   └── useServiceWorker.ts # SW registration
│   │   ├── lib/
│   │   │   └── whatsapp.ts        # Utilitaires WhatsApp
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Page d'accueil
│   │   │   └── NotFound.tsx       # Page 404
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx   # Gestion du thème
│   │   ├── App.tsx                # Racine de l'application
│   │   ├── main.tsx               # Point d'entrée
│   │   └── index.css              # Styles globaux
│   └── index.html
├── server/
│   └── index.ts                   # Serveur Express
├── package.json
└── README.md

```

## Configuration

### Informations entreprise
Situées dans `client/src/data/company.ts` :
- **Adresse** : Cité Sonuci, Niamey, Niger
- **Téléphone** : +227 91 12 78 70 / +227 88 39 81 07 / +227 88 39 71 07
- **Email** : moctarhamadine54@gmail.com / zoubeirou.zakariya@gmail.com
- **Facebook** : https://www.facebook.com/100063546250480
- **Google Maps** : https://maps.app.goo.gl/AyfgGYvvXYMBTxBv8

### Services externes
- **EmailJS** : Pour le formulaire de contact
  - Service ID : `service_4vlnw9a`
  - Template ID : `template_kw3ckfd`
  - Clé publique : `5b0yYf5ZL1hfHE7vn`

- **OneSignal** : Pour les notifications push
  - App ID : `1ab8bdc3-c665-4b8f-909a-ac625d0478c7`

- **Webhook Discord** : Pour le suivi des visites
  - URL : configurée dans company.ts

## Palette de couleurs (inspirée du Sahel)

| Couleur | OKLCH | Usage |
|---------|-------|-------|
| Sable | `oklch(0.85 0.08 70)` | Arrière-plans secondaires |
| Orange coucher de soleil | `oklch(0.65 0.18 40)` | Accents, boutons |
| Terre brune | `oklch(0.25 0.04 60)` | Texte, éléments sombres |
| Clair | `oklch(0.95 0.02 70)` | Arrière-plans clairs |
| Sombre | `oklch(0.15 0.02 60)` | Mode sombre |

## Typographie

- **Titres** : Poppins (400, 600, 700)
- **Corps** : Inter (400, 500, 600)

## Développement

```bash
pnpm install        # Installation
pnpm dev            # Serveur développement (localhost:3000)
pnpm build          # Build production
pnpm preview        # Prévisualisation build
```

Améliorations futures

· Galerie d'images produits
· Avis et évaluations clients
· Newsletter
· Recherche avancée et filtres
· Comparateur de produits
· Blog / Actualités
· Chat en direct
· Tableau de bord analytics
· Gestion des stocks
· Suivi de commande

Développeur

Hamadine AG MOCTAR

· Entreprise : HAM Global Words
· Téléphone : +227 86 76 29 03
· Email : hamadineagmoctar@gmail.com
· Adresse : Tchangarey, Marché de Bétail, Niamey (Niger)

Licence

© 2026 Niger Laptops. Tous droits réservés.

Support

Pour toute assistance, contactez :

· Téléphone : +227 91 12 78 70
· Email : moctarhamadine54@gmail.com
· WhatsApp : +227 91 12 78 70
· Facebook : https://www.facebook.com/100063546250480

---

Fait avec ❤️ pour la communauté tech du Niger.
