# Niger Laptops - Deployment Guide

## Pre-Deployment Checklist

- [ ] All product images are properly referenced
- [ ] Contact form is connected to EmailJS
- [ ] WhatsApp numbers are verified
- [ ] OneSignal app is configured
- [ ] PWA manifest is correct
- [ ] Service Worker is registered
- [ ] Meta tags are updated
- [ ] Analytics are configured
- [ ] SSL certificate is active
- [ ] Domain is pointing to server

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_4vlnw9a
VITE_EMAILJS_TEMPLATE_ID=template_kw3ckfd
VITE_EMAILJS_PUBLIC_KEY=5b0yYf5ZL1hfHE7vn

# OneSignal Configuration
VITE_ONESIGNAL_APP_ID=1ab8bdc3-c665-4b8f-909a-ac625d0478c7

# Discord Webhook (optional)
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Analytics (optional)
VITE_ANALYTICS_ID=your-analytics-id
```

## Building for Production

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build the Project
```bash
pnpm build
```

### 3. Test Production Build Locally
```bash
pnpm preview
```

## Deployment Options

### Option 1: Manus Hosting (Recommended)
The project is already configured for Manus hosting. Simply click "Publish" in the Management UI.

**Features:**
- Automatic SSL/TLS
- CDN distribution
- Auto-scaling
- Built-in analytics
- Custom domain support

### Option 2: Traditional Hosting (Vercel, Netlify, etc.)

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist/public
```

#### Self-Hosted (VPS/Dedicated Server)
```bash
# Build
pnpm build

# Copy dist/public to your web server
scp -r dist/public user@server:/var/www/niger-laptops

# Ensure Node.js is running the server
node dist/index.js
```

## Post-Deployment

### 1. Verify PWA Installation
- [ ] Test "Add to Home Screen" on mobile
- [ ] Verify Service Worker is registered
- [ ] Test offline functionality

### 2. Test WhatsApp Integration
- [ ] Click product WhatsApp button
- [ ] Verify pre-filled message includes product name
- [ ] Test wishlist sharing

### 3. Test Contact Form
- [ ] Submit test message
- [ ] Verify email is received
- [ ] Check Discord webhook (if configured)

### 4. Monitor Performance
- [ ] Check Lighthouse scores
- [ ] Monitor Core Web Vitals
- [ ] Review error logs
- [ ] Check analytics

### 5. SEO Verification
- [ ] Verify robots.txt is accessible
- [ ] Submit sitemap to Google Search Console
- [ ] Check meta tags in page source
- [ ] Test Open Graph tags

## Performance Optimization

### Current Metrics
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Further Optimization
- Enable image optimization (WebP conversion)
- Implement lazy loading for below-fold content
- Use CDN for static assets
- Enable compression (gzip/brotli)
- Minify CSS/JS (already done by Vite)

## Monitoring & Maintenance

### Daily Tasks
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review contact form submissions

### Weekly Tasks
- [ ] Review analytics
- [ ] Check for security updates
- [ ] Backup database (if applicable)

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Update product catalog if needed
- [ ] Check SSL certificate expiration

## Troubleshooting

### Service Worker Not Registering
```javascript
// Clear browser cache and service workers
// Then reload the page
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

### WhatsApp Links Not Working
- Verify phone numbers are in international format
- Check URL encoding
- Test on different devices

### Contact Form Not Sending
- Verify EmailJS credentials
- Check browser console for errors
- Test with different email addresses

### Images Not Loading
- Verify image paths are correct
- Check CORS headers
- Ensure images are accessible from production URL

## Rollback Procedure

If deployment issues occur:

1. **Manus Hosting**: Use "Rollback" in Management UI
2. **Vercel**: Use deployment history
3. **Netlify**: Use deploy history
4. **Self-Hosted**: Restore from backup

## Support & Contact

For deployment issues:
- **Developer**: Hamadine AG MOCTAR
- **Phone**: +227 86 76 29 03
- **Email**: hamadineagmoctar@gmail.com

For business inquiries:
- **Phone**: +227 91 12 78 70
- **Email**: moctarhamadine54@gmail.com
- **WhatsApp**: +227 91 12 78 70

## Security Considerations

- [ ] Enable HTTPS/SSL
- [ ] Set security headers (CSP, X-Frame-Options, etc.)
- [ ] Implement rate limiting on contact form
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Monitor for vulnerabilities

## Backup Strategy

- Daily automated backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures monthly

## Analytics Setup

### Google Analytics
1. Create GA4 property
2. Add tracking code to `index.html`
3. Monitor user behavior
4. Set up conversion tracking

### Hotjar (Optional)
1. Create Hotjar account
2. Add tracking code
3. Monitor user sessions
4. Analyze heatmaps

## Scaling Considerations

As traffic grows:
- Implement caching strategies
- Use CDN for static assets
- Consider database optimization
- Monitor server resources
- Plan for load balancing

---

Last Updated: July 23, 2026
