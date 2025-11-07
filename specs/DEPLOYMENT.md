# Deployment Guide

## Production Build

### Building the Application

```bash
# Create optimized production build
npm run build
```

**Build Process:**
1. TypeScript compilation
2. Next.js optimization
3. Bundle minification
4. Asset optimization
5. Static page generation

**Output:**
```
.next/
├── static/          # Static assets
├── server/          # Server-side code
└── cache/           # Build cache
```

**Build Stats:**
- Typical build time: 30-60 seconds
- Bundle size: ~300-500KB (gzipped)
- Babylon.js is the largest dependency

### Testing Production Build Locally

```bash
# Build and start
npm run build
npm start
```

Access at http://localhost:3000

**Differences from Dev:**
- Minified code
- No hot reload
- Better performance
- Production error handling

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Advantages:**
- Built for Next.js
- Automatic deployments
- Global CDN
- Zero configuration
- Free tier available

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Production Deploy:**
```bash
vercel --prod
```

**Environment Variables:**
- Add in Vercel dashboard
- Settings > Environment Variables
- Add `NEXT_PUBLIC_API_URL`

**Custom Domain:**
- Settings > Domains
- Add your domain
- Configure DNS

**Configuration File:** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Option 2: Netlify

**Advantages:**
- Simple deployment
- Free tier
- Good for static sites
- Edge functions support

**Steps:**

1. **Connect Repository:**
   - Sign in to Netlify
   - New site from Git
   - Select repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables:**
   - Site settings > Build & deploy
   - Add `NEXT_PUBLIC_API_URL`

4. **Deploy:**
   - Automatic on git push
   - Or manual: `netlify deploy --prod`

### Option 3: Docker Container

**Advantages:**
- Consistent environment
- Portable
- Works anywhere
- Self-hosted option

**Dockerfile:**
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

**Build and Run:**
```bash
# Build image
docker build -t beabodocl-babylon .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api.example.com \
  beabodocl-babylon
```

**Docker Compose:** `docker-compose.yml`
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    image: babocument-backend:latest
    ports:
      - "8000:8000"
```

### Option 4: Traditional VPS/Server

**Requirements:**
- Node.js 18+
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL certificate

**Server Setup:**

1. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2:**
```bash
sudo npm install -g pm2
```

3. **Deploy Application:**
```bash
# Clone repository
git clone <repo-url> /var/www/beabodocl-babylon
cd /var/www/beabodocl-babylon

# Install dependencies
npm ci --production

# Build
npm run build

# Start with PM2
pm2 start npm --name "beabodocl" -- start
pm2 save
pm2 startup
```

4. **Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 5: AWS (S3 + CloudFront)

**For Static Export Only:**

1. **Export Static Site:**
```bash
# Add to next.config.js
output: 'export'

# Build
npm run build

# Output in 'out' directory
```

2. **Upload to S3:**
```bash
aws s3 sync out/ s3://your-bucket-name
```

3. **Configure CloudFront:**
   - Create distribution
   - Point to S3 bucket
   - Configure caching

**Limitation:** No server-side features

## Environment Configuration

### Production Environment Variables

**Create `.env.production`:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

### Staging Environment

**Create `.env.staging`:**
```bash
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com
NEXT_PUBLIC_ENV=staging
```

### Loading Environment

```typescript
// Automatic in Next.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/assets/image.jpg"
  width={500}
  height={300}
  alt="Description"
/>
```

### Code Splitting

```typescript
// Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable SSR for Babylon.js
});
```

### Asset Optimization

**Compress Textures:**
- Use compressed formats (WEBP, KTX2)
- Reduce resolution where possible
- Use mipmaps

**Bundle Optimization:**
```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          babylon: {
            test: /[\\/]node_modules[\\/]@babylonjs[\\/]/,
            name: 'babylon',
            priority: 10
          }
        }
      };
    }
    return config;
  }
};
```

## Monitoring

### Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
});
```

### Performance Monitoring

**Web Vitals:**

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Analytics

**Vercel Analytics:**
```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

**Google Analytics:**
```typescript
// Install
npm install @next/third-parties

// Use
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XYZ" />
```

## SSL/HTTPS

### Why HTTPS is Required

- **WebXR:** Requires secure context
- **Camera/Microphone:** Needs HTTPS
- **Service Workers:** HTTPS only
- **Security:** Best practice

### Certificate Options

1. **Let's Encrypt** (Free)
   - Automated renewal
   - Works with most hosting

2. **Cloudflare** (Free)
   - Automatic SSL
   - CDN included
   - DDoS protection

3. **Commercial Certificate**
   - Extended validation
   - Wildcard support
   - Business requirement

## CDN Configuration

### Static Assets

**Cloudflare CDN:**
1. Point domain to Cloudflare
2. Enable caching rules
3. Set TTL for static assets

**Cache Headers:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Database Considerations

**Current State:**
- No frontend database
- All data from API
- Consider local caching

**Options for Offline Support:**
- **IndexedDB** - Browser storage
- **Service Worker** - Offline cache
- **LocalStorage** - Simple data only

## Backup Strategy

### Code Backup
- Git repository (already handled)
- Multiple remotes recommended

### Asset Backup
- S3 or cloud storage
- Versioned storage
- Automated backups

## Rollback Plan

### Vercel
```bash
# View deployments
vercel list

# Rollback to previous
vercel rollback <deployment-url>
```

### Docker
```bash
# Tag images with versions
docker tag app:latest app:v1.0.0

# Rollback
docker run app:v0.9.0
```

### PM2
```bash
# List apps
pm2 list

# Restart old version
pm2 restart beabodocl --update-env
```

## Health Checks

### Application Health

```typescript
// pages/api/health.ts (create this)
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### Monitoring Services

- **UptimeRobot** - Free monitoring
- **Pingdom** - Advanced monitoring
- **StatusCake** - Global checks

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured
- [ ] API rate limiting (backend)
- [ ] Content Security Policy
- [ ] Regular dependency updates
- [ ] No secrets in code
- [ ] Secure error handling

### Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Scaling Considerations

### Horizontal Scaling
- Multiple frontend instances
- Load balancer (Nginx, AWS ALB)
- Sticky sessions (if needed)

### Vertical Scaling
- Increase server resources
- Optimize bundle size
- Use CDN for assets

### Database Scaling (Backend)
- Read replicas
- Caching layer (Redis)
- Connection pooling

## Cost Estimation

### Vercel (Hobby - Free)
- Bandwidth: 100GB/month
- Builds: Unlimited
- Functions: 100GB-hours

### Vercel (Pro - $20/month)
- More bandwidth
- Team features
- Priority support

### VPS (DigitalOcean)
- Basic Droplet: $6/month
- Plus domain: $12/year
- Plus SSL: Free (Let's Encrypt)

### AWS
- Variable based on usage
- S3: ~$0.023/GB/month
- CloudFront: ~$0.085/GB
- Estimate: $20-100/month

## Post-Deployment Checklist

- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Health check passing
- [ ] API connectivity verified
- [ ] VR functionality tested
- [ ] Performance tested
- [ ] Error tracking configured
- [ ] Analytics set up
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Documentation updated
- [ ] Team notified

## Troubleshooting Deployment

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Runtime Errors

- Check environment variables
- Verify API URL is correct
- Check CORS configuration
- Review server logs

### Performance Issues

- Enable CDN
- Optimize images
- Check bundle size
- Profile with DevTools

### HTTPS Issues

- Verify certificate is valid
- Check mixed content warnings
- Update API URLs to HTTPS
- Clear browser cache

## Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update all (carefully)
npm update

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Security Updates

```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual fixes
npm audit fix --force
```

### Monitoring Updates

- Check Vercel dashboard daily
- Review error logs weekly
- Analyze performance monthly
- Update dependencies quarterly
