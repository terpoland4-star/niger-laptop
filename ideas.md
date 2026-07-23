# Niger Laptops - Design Philosophy

## Design Approach: Sahel Heritage Modern

### Design Movement
**Sahel Minimalism with Warmth** — A contemporary aesthetic grounded in the natural palette and cultural identity of the Sahel region, blending minimalist principles with warm, inviting textures and generous whitespace.

### Core Principles
1. **Authenticity First** — Every design choice reflects the Sahel's natural beauty and Niger's commercial spirit, not generic tech aesthetics
2. **Warmth Over Cold** — Reject sterile tech-store vibes; embrace the warmth of desert sands, sunset oranges, and human connection
3. **Clarity Through Simplicity** — Minimize visual noise to highlight products and build trust; every element serves a purpose
4. **Accessibility as Default** — High contrast, readable typography, dark mode support, and touch-friendly interactions for all users

### Color Philosophy
- **Primary Palette**: Warm sands (OKLCH 0.85 / 0.08 / 70°), sunset orange (OKLCH 0.65 / 0.18 / 40°), deep earth (OKLCH 0.25 / 0.04 / 60°)
- **Reasoning**: These colors evoke the Sahel landscape—not borrowed from tech trends, but rooted in Niger's geography
- **Emotional Intent**: Trustworthy (earth tones), energetic (warm orange), approachable (light sand)
- **Accessibility**: High contrast ratios; dark mode inverts to cool deep blues with warm highlights

### Layout Paradigm
- **Hero Section**: Full-width with asymmetric layout—product showcase on one side, trust messaging on the other
- **Catalog Grid**: Responsive masonry that adapts to content, not rigid columns
- **Whitespace-Driven**: Large breathing room between sections; no cramped layouts
- **Sticky Navigation**: Persistent header with WhatsApp CTA always visible

### Signature Elements
1. **Sahel Gradient Dividers**: Subtle wave/sand-dune SVG dividers between sections in warm tones
2. **Product Cards with Depth**: Soft shadows, warm hover states, and a "badge" for product condition (neuf/occasion)
3. **WhatsApp-First CTAs**: Orange buttons with WhatsApp icon, always prominent, never hidden

### Interaction Philosophy
- **Micro-interactions**: Hover effects on products (slight lift + shadow), button presses (scale 0.97), smooth scroll behavior
- **Feedback**: Toast notifications for wishlist additions, visual confirmation on WhatsApp link clicks
- **Accessibility**: Keyboard navigation fully supported, focus rings visible, reduced-motion respected

### Animation
- **Entrance**: Products fade in + slide up on page load (staggered 30-50ms per item)
- **Hover**: Product cards lift with shadow expansion (150ms ease-out)
- **Transitions**: All UI transitions under 250ms; snappy but not jarring
- **Respect Motion**: `prefers-reduced-motion` disables all non-essential animations

### Typography System
- **Display Font**: "Poppins" (bold, geometric, modern) for headlines and CTAs
- **Body Font**: "Inter" (clean, readable) for product descriptions and body text
- **Hierarchy**: 
  - H1: 2.5rem Poppins 700 (hero title)
  - H2: 1.875rem Poppins 600 (section titles)
  - H3: 1.25rem Poppins 600 (product names)
  - Body: 1rem Inter 400 (descriptions)
  - Small: 0.875rem Inter 400 (metadata, prices)

### Brand Essence
**One-line positioning**: Niger Laptops is the trusted, locally-rooted expert for quality tech in Niamey—where authenticity meets innovation.

**Three personality adjectives**: Trustworthy, Warm, Expert

### Brand Voice
- **Headlines**: Direct, confident, locally relevant. Examples:
  - "Votre expert informatique au Niger" (Your tech expert in Niger)
  - "Qualité garantie, prix sur demande" (Quality guaranteed, price on request)
- **CTAs**: Action-oriented, human. Examples:
  - "Discutez sur WhatsApp" (Chat on WhatsApp)
  - "Ajouter à ma liste d'intérêt" (Add to my wishlist)
- **Microcopy**: Warm, never corporate. "Produit neuf" instead of "New", "Occasion" instead of "Used"

### Wordmark & Logo
- **Logo Concept**: A bold, geometric symbol combining a laptop screen and a compass rose (representing direction/expertise in Niger's market). No text in the mark itself—the brand name appears separately in Poppins 700.
- **Logo Usage**: Header (48px), favicon (32px), footer (24px)

### Signature Brand Color
**Warm Sunset Orange** (OKLCH 0.65 / 0.18 / 40°) — unmistakably Niger Laptops' own, used for WhatsApp buttons, accents, and hover states.

---

## Implementation Notes

### CSS Variables (in `client/src/index.css`)
```css
:root {
  --color-sahel-sand: oklch(0.85 0.08 70);
  --color-sahel-orange: oklch(0.65 0.18 40);
  --color-sahel-earth: oklch(0.25 0.04 60);
  --color-sahel-light: oklch(0.95 0.02 70);
  --color-sahel-dark: oklch(0.15 0.02 60);
}

.dark {
  --color-sahel-sand: oklch(0.25 0.04 60);
  --color-sahel-orange: oklch(0.72 0.15 40);
  --color-sahel-light: oklch(0.15 0.02 60);
  --color-sahel-dark: oklch(0.95 0.02 70);
}
```

### Font Stack
- Google Fonts: Poppins (400, 600, 700), Inter (400, 500, 600)
- Fallback: system fonts (SF Pro Display, Segoe UI)

### Responsive Breakpoints
- Mobile: 320px–640px (Poppins 1.5rem for H1, 1rem for body)
- Tablet: 641px–1024px (Poppins 2rem for H1, 1.1rem for body)
- Desktop: 1025px+ (Poppins 2.5rem for H1, 1rem for body)

---

## Visual Assets to Generate
1. **Hero Background**: Warm gradient with subtle Sahel texture (sand dunes, sunset)
2. **Logo Mark**: Laptop + compass rose symbol, PNG with transparency
3. **Product Placeholder**: Elegant card template with depth and warm accents
4. **Divider SVG**: Sand-dune wave shape in warm orange tones

---

## Accessibility Checklist
- [ ] WCAG AA contrast ratios on all text
- [ ] Dark mode support with proper color inversion
- [ ] Keyboard navigation for all interactive elements
- [ ] Focus rings visible and styled
- [ ] `prefers-reduced-motion` respected
- [ ] Alt text on all product images
- [ ] Form labels properly associated
- [ ] Touch targets ≥ 44px × 44px

---

## PWA Features
- [ ] Service Worker for offline support
- [ ] manifest.json with Sahel-inspired theme colors
- [ ] Install prompts on mobile/desktop
- [ ] Wishlist persistence via localStorage
- [ ] Push notifications via OneSignal

---

## External Integrations
- **WhatsApp API**: Pre-filled messages with product name + image URL
- **EmailJS**: Contact form submissions (service_4vlnw9a / template_kw3ckfd)
- **OneSignal**: Push notifications (appId: 1ab8bdc3-c665-4b8f-909a-ac625d0478c7)
- **Discord Webhook**: Order/inquiry tracking
- **Facebook**: Social proof via embedded feed

---

## Success Metrics
- Page load time < 2s on 4G
- 95+ Lighthouse score
- Zero layout shifts (CLS < 0.1)
- 100% WCAG AA compliance
- Mobile-first, responsive on all devices
