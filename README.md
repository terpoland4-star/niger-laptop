# Niger Laptops - E-Commerce Platform

A modern, responsive e-commerce platform for Niger Laptops, a tech retailer based in Niamey, Niger. Built with React 19, Tailwind CSS 4, and TypeScript.

## Features

### Core Features
- **Product Catalog**: 34 carefully curated tech products (laptops, tablets, accessories)
- **Category Filtering**: Browse by Computers, Storage, or Accessories
- **Wishlist System**: Save products to a personal wishlist with localStorage persistence
- **WhatsApp Integration**: Direct messaging with product information pre-filled
- **Bilingual Support**: Full French and English language support
- **Dark Mode**: Theme toggle for user preference

### PWA Features
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service Worker caches essential assets
- **App-like Experience**: Standalone display mode
- **Push Notifications**: Ready for OneSignal integration

### Design
- **Sahel-Inspired Palette**: Warm colors reflecting Niger's landscape (sand, orange, earth tones)
- **Premium Typography**: Poppins for headlines, Inter for body text
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Layout**: Mobile-first design, fully responsive
- **Accessibility**: WCAG AA compliant, high contrast ratios, keyboard navigation

## Project Structure

```
niger-laptops/
├── client/
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   ├── service-worker.js      # Service Worker for offline
│   │   ├── robots.txt             # SEO robots file
│   │   └── favicon.ico            # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         # Navigation header
│   │   │   ├── Hero.tsx           # Hero section
│   │   │   ├── Catalog.tsx        # Product catalog
│   │   │   ├── ProductCard.tsx    # Individual product card
│   │   │   ├── About.tsx          # About section
│   │   │   ├── Contact.tsx        # Contact form
│   │   │   ├── Footer.tsx         # Footer
│   │   │   └── WishlistModal.tsx  # Wishlist modal
│   │   ├── data/
│   │   │   ├── products.ts        # Product data (34 items)
│   │   │   └── company.ts         # Company info & config
│   │   ├── hooks/
│   │   │   ├── useWishlist.ts     # Wishlist management
│   │   │   └── useServiceWorker.ts # SW registration
│   │   ├── lib/
│   │   │   └── whatsapp.ts        # WhatsApp utilities
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Main page
│   │   │   └── NotFound.tsx       # 404 page
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx   # Theme management
│   │   ├── App.tsx                # App root
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles & Sahel palette
│   └── index.html
├── server/
│   └── index.ts                   # Express server
├── package.json
└── README.md
```

## Configuration

### Company Information
Located in `client/src/data/company.ts`:
- **Address**: Cité Sonuci, Niamey, Niger
- **Phone**: +227 91 12 78 70 / +227 88 39 81 07 / +227 88 39 71 07
- **Email**: moctarhamadine54@gmail.com / zoubeirou.zakariya@gmail.com
- **Facebook**: https://www.facebook.com/100063546250480
- **Google Maps**: https://maps.app.goo.gl/AyfgGYvvXYMBTxBv8

### External Services
- **EmailJS**: For contact form submissions
  - Service ID: `service_4vlnw9a`
  - Template ID: `template_kw3ckfd`
  - Public Key: `5b0yYf5ZL1hfHE7vn`

- **OneSignal**: For push notifications
  - App ID: `1ab8bdc3-c665-4b8f-909a-ac625d0478c7`

- **Discord Webhook**: For order tracking
  - URL: (configured in company.ts)

## Color Palette (Sahel-Inspired)

| Color | OKLCH | Usage |
|-------|-------|-------|
| Sand | `oklch(0.85 0.08 70)` | Secondary backgrounds |
| Sunset Orange | `oklch(0.65 0.18 40)` | Primary accent, CTAs |
| Earth Brown | `oklch(0.25 0.04 60)` | Text, dark elements |
| Light | `oklch(0.95 0.02 70)` | Light backgrounds |
| Dark | `oklch(0.15 0.02 60)` | Dark mode background |

## Typography

- **Display Font**: Poppins (400, 600, 700)
  - Headlines (H1-H6)
  - CTAs and emphasis
  
- **Body Font**: Inter (400, 500, 600)
  - Body text
  - Descriptions
  - UI labels

## Development

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Server runs at `http://localhost:3000`

### Build
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## Features Breakdown

### Product Management
- 34 products across 3 categories
- Bilingual names (French/English)
- Condition tracking (New/Used)
- Price masking ("Price on Request")
- Product descriptions
- Category filtering

### Wishlist
- LocalStorage persistence
- Add/remove products
- Share via WhatsApp
- Clear all functionality
- Visual indicator in header

### WhatsApp Integration
- Pre-filled product information
- Direct contact links
- Wishlist sharing
- Multiple contact numbers

### Accessibility
- WCAG AA compliance
- High contrast ratios
- Dark mode support
- Keyboard navigation
- Focus indicators
- Semantic HTML
- ARIA labels

### Performance
- Lazy loading for images
- Code splitting ready
- Service Worker caching
- Optimized bundle size
- Fast initial load

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## PWA Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Select "Install Niger Laptops"

### Mobile (Android)
1. Open in Chrome
2. Tap menu → "Install app"

### iOS
1. Open in Safari
2. Tap Share → "Add to Home Screen"

## Future Enhancements

- [ ] Product image gallery
- [ ] Customer reviews and ratings
- [ ] Newsletter subscription
- [ ] Advanced search and filters
- [ ] Product comparison
- [ ] Blog/News section
- [ ] Live chat support
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Order tracking

## Developer

**Hamadine AG MOCTAR**
- Company: HAM Global Words
- Phone: +227 86 76 29 03
- Email: hamadineagmoctar@gmail.com
- Address: Tchangarey, Marché de Bétail, Niamey (Niger)

## License

© 2026 Niger Laptops. All rights reserved.

## Support

For support, contact:
- **Phone**: +227 91 12 78 70
- **Email**: moctarhamadine54@gmail.com
- **WhatsApp**: +227 91 12 78 70
- **Facebook**: https://www.facebook.com/100063546250480

---

Built with ❤️ for Niger's tech community.
