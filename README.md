# Niger Laptops - Plateforme E-Commerce

Une plateforme e-commerce complete pour Niger Laptops, revendeur de materiel informatique neuf et d'occasion base a Niamey, Niger. Frontend React/TypeScript sur GitHub Pages, backend Node/Express sur VPS OVHcloud.

## Fonctionnalites

### Catalogue et produits

- 51+ produits repartis en 17 categories (ordinateurs, composants, stockage, peripheriques, ecrans, reseau, imprimantes, gaming, telephones et tablettes, logiciels, photo et video, energie, bureautique, communication, audio, montres connectees, caisse et comptage de billets)
- Neuf et occasion geres separement, avec filtre dedie cote admin
- Page produit dediee par article : description, caracteristiques techniques structurees, galerie
- Carousel vedettes/promos en defilement automatique sur la page d'accueil
- Rangees horizontales par categorie facon streaming, avec bascule automatique vers une grille filtrable
- Recherche et tri (prix croissant/decroissant, mieux notes)

### Comptes et commandes

- Comptes clients avec historique des commandes
- Panier et liste de souhaits, sauvegarde possible par numero de telephone
- Suivi de commande public par lien dedie, sans authentification
- Recu PDF genere automatiquement
- Integration WhatsApp : discussion directe pre-remplie depuis chaque produit

### Administration

- Panneau admin complet : creation/edition produits, upload photo direct, gestion des caracteristiques techniques
- Gestion des commandes et des clients
- Historique des modifications produit

### PWA

- Installable sur mobile et desktop
- Support hors-ligne via Service Worker
- Mode d'affichage standalone

### Design

- Palette Sahel en oklch (vert, orange terre, sable, bleu discret)
- Typographie : Sora (titres) / Manrope (corps de texte)
- Micro-interactions : cartes animees, glassmorphism sur les modales
- Responsive mobile-first

## Stack technique

Frontend : React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Embla Carousel, wouter

Backend : Node.js, Express, TypeScript, Drizzle ORM, SQLite, JWT, Multer

Infrastructure : GitHub Pages (frontend) + VPS OVHcloud Debian 12, PM2, Nginx, Certbot (backend)

## Developpement

    pnpm install
    pnpm dev
    npm run build
    pm2 restart niger-laptops-api

## Note importante sur le gestionnaire de paquets

Ce projet utilise exclusivement pnpm. Le pipeline GitHub Actions depend de pnpm-lock.yaml en mode frozen-lockfile.

## Developpeur

Hamadine AG MOCTAR - HAM Global Words
hamadineagmoctar@gmail.com

## Licence

Copyright 2026 Niger Laptops. Tous droits reserves.
