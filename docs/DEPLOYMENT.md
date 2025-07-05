# 🚀 DizziGo Website Deployment Guide

This guide covers deploying the DizziGo website to various hosting platforms. The website is built as a static site and can be deployed to any static hosting service.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All links work correctly
- [ ] Images are optimized
- [ ] Meta tags are properly configured
- [ ] PWA manifest is valid
- [ ] Service worker is functioning
- [ ] Performance scores are acceptable (Lighthouse > 90)
- [ ] Mobile responsiveness is tested
- [ ] Accessibility compliance is verified
- [ ] Cross-browser compatibility is confirmed

### Quick Checks

```bash
# Install dependencies
npm install

# Run local server
npm run dev

# Validate HTML
npm run validate

# Check performance
npm run lighthouse

# Test for broken links
npm run check:links

# Lint code
npm run lint
```

## 🌐 Deployment Platforms

### 1. Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Excellent performance
- Git integration

**Deployment Steps:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# For production deployment
vercel --prod
```

**Or using the web interface:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect it's a static site
4. Click "Deploy"

**Custom Domain Setup:**
1. In Vercel dashboard, go to your project
2. Click "Domains"
3. Add your custom domain (e.g., `dizzigo.dev`)
4. Update your DNS records as instructed

### 2. Netlify

**Why Netlify?**
- Drag-and-drop deployment
- Form handling capabilities
- Continuous deployment
- Branch previews

**Deployment Steps:**

**Option A: Drag and Drop**
1. Build your site (or just use the files as-is)
2. Go to [netlify.com](https://netlify.com)
3. Drag your project folder to the deployment area

**Option B: Git Integration**
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build` (or leave empty)
   - Publish directory: `.` (root directory)

**Option C: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Custom Domain Setup:**
1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain
3. Update DNS records as instructed

### 3. GitHub Pages

**Why GitHub Pages?**
- Free hosting for open source projects
- Integrated with GitHub repositories
- Custom domain support

**Deployment Steps:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy website"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose branch: `main`
   - Choose folder: `/ (root)`

3. **Custom Domain (Optional):**
   - Add `CNAME` file to root with your domain
   - Configure DNS records

**GitHub Actions for Auto-Deploy:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

### 4. Firebase Hosting

**Why Firebase?**
- Google's infrastructure
- Global CDN
- SSL certificates
- Preview channels for testing

**Deployment Steps:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

**Firebase Configuration:**

When initializing, choose:
- Public directory: `.` (current directory)
- Single-page app: `No`
- Overwrite index.html: `No`

### 5. AWS S3 + CloudFront

**Why AWS?**
- Enterprise-grade infrastructure
- Fine-grained control
- Integration with other AWS services

**Deployment Steps:**

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://your-website-bucket
   ```

2. **Upload Files:**
   ```bash
   aws s3 sync . s3://your-website-bucket --delete
   ```

3. **Configure Bucket for Static Hosting:**
   ```bash
   aws s3 website s3://your-website-bucket \
     --index-document index.html \
     --error-document error.html
   ```

4. **Set up CloudFront for CDN (Recommended)**

### 6. DigitalOcean App Platform

**Deployment Steps:**

1. **Create App:**
   - Go to DigitalOcean control panel
   - Create new App
   - Connect your GitHub repository

2. **Configure Build:**
   - Build command: `npm run build` (or leave empty)
   - Output directory: `.`

3. **Deploy:**
   - DigitalOcean will automatically deploy on git push

## 🔧 Environment Configuration

### Environment Variables

For different environments, you might need:

```bash
# Production
ENVIRONMENT=production
SITE_URL=https://dizzigo.dev
ANALYTICS_ID=your-analytics-id

# Staging
ENVIRONMENT=staging
SITE_URL=https://staging.dizzigo.dev

# Development
ENVIRONMENT=development
SITE_URL=http://localhost:3000
```

### Build Scripts

Update `package.json` for different environments:

```json
{
  "scripts": {
    "build": "echo 'No build needed for static site'",
    "build:staging": "NODE_ENV=staging npm run build",
    "build:production": "NODE_ENV=production npm run build",
    "deploy:staging": "npm run build:staging && vercel",
    "deploy:production": "npm run build:production && vercel --prod"
  }
}
```

## 🌍 Custom Domain Setup

### DNS Configuration

For most hosting providers, you'll need these DNS records:

```
# For root domain (dizzigo.dev)
Type: A
Name: @
Value: [Your hosting provider's IP]

# For www subdomain
Type: CNAME
Name: www
Value: your-site.vercel.app

# For verification (varies by provider)
Type: TXT
Name: @
Value: [Verification code]
```

### SSL/HTTPS

Most modern hosting providers include free SSL certificates:
- **Vercel**: Automatic HTTPS
- **Netlify**: Automatic HTTPS
- **GitHub Pages**: Automatic HTTPS for custom domains
- **Firebase**: Automatic HTTPS
- **CloudFront**: Requires ACM certificate setup

## 📊 Performance Optimization

### Pre-deployment Optimization

```bash
# Optimize images
npm run optimize:images

# Check bundle sizes
npm run size

# Compress assets
npm run compress

# Generate different icon sizes
npm run generate:icons
```

### CDN Configuration

**Recommended Cache Headers:**

```
# HTML files
Cache-Control: public, max-age=0, must-revalidate

# CSS/JS files
Cache-Control: public, max-age=31536000, immutable

# Images
Cache-Control: public, max-age=31536000

# Fonts
Cache-Control: public, max-age=31536000
```

### Service Worker Configuration

Ensure your service worker is properly configured for your domain:

```javascript
// In sw.js, update the cache name
const CACHE_NAME = 'dizzigo-website-v1.0.0';

// Update static assets with your domain
const STATIC_ASSETS = [
    'https://dizzigo.dev/',
    'https://dizzigo.dev/index.html',
    // ... other assets
];
```

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Website

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run lint
    - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### Netlify Deployment

Create `netlify.toml`:

```toml
[build]
  publish = "."
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/docs"
  to = "https://docs.dizzigo.dev"
  status = 301
```

## 🚨 Monitoring and Analytics

### Google Analytics 4

Add to your HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Monitoring

Consider adding error monitoring:

```javascript
// Simple error tracking
window.addEventListener('error', (event) => {
  // Send error to your analytics service
  gtag('event', 'exception', {
    description: event.error.message,
    fatal: false
  });
});
```

### Performance Monitoring

```javascript
// Core Web Vitals tracking
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔧 Troubleshooting

### Common Issues

**Issue: Service Worker not updating**
```javascript
// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.update();
    });
  });
}
```

**Issue: CSS/JS not loading**
- Check file paths are correct
- Verify MIME types are set correctly
- Check for CORS issues

**Issue: PWA not installing**
- Verify manifest.json is valid
- Check service worker is registered
- Ensure HTTPS is enabled

**Issue: Poor performance scores**
- Optimize images (WebP format)
- Minify CSS/JS
- Enable compression
- Use CDN
- Implement lazy loading

### Debugging Tools

```bash
# Check SSL certificate
openssl s_client -connect dizzigo.dev:443

# Test DNS propagation
dig dizzigo.dev

# Check HTTP headers
curl -I https://dizzigo.dev

# Validate HTML
npm run validate

# Check accessibility
npx axe-cli https://dizzigo.dev
```

## 📈 Post-Deployment

### SEO Setup

1. **Submit to Search Engines:**
   - Google Search Console
   - Bing Webmaster Tools

2. **Generate Sitemap:**
   - Already included in the project
   - Submit sitemap.xml to search engines

3. **Set up Analytics:**
   - Google Analytics
   - Google Tag Manager (optional)

### Performance Monitoring

1. **Regular Audits:**
   ```bash
   npm run lighthouse
   ```

2. **Core Web Vitals:**
   - Monitor LCP, FID, CLS
   - Use Google Search Console

3. **Uptime Monitoring:**
   - UptimeRobot
   - Pingdom
   - StatusCake

---

## 🎉 Deployment Complete!

Your DizziGo website should now be live! Remember to:

- Monitor performance and errors
- Keep dependencies updated
- Backup your deployment configurations
- Document any custom setup steps

For questions about deployment, create an issue in the repository or join our Discord community.

**Happy deploying! 🚀**