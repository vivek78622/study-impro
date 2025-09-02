# Production Deployment Guide

## Prerequisites
- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Vercel CLI: `npm install -g vercel` (optional)

## Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Firebase configuration values in `.env.local`

## Option 1: Vercel Deployment (Recommended)

### Initial Setup
1. Connect your GitHub repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `out`

2. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

### Auto-deployment
- Push to `main` branch triggers automatic deployment
- Pull requests create preview deployments
- GitHub Actions runs build checks on every PR

### Manual deployment
```bash
npm run deploy:vercel
```

## Option 2: Firebase Hosting

### Initial Setup
1. Initialize Firebase Hosting:
```bash
firebase login
firebase init hosting
# Select existing project
# Public directory: out
# Configure as SPA: Yes
# Overwrite index.html: No
```

2. Set up GitHub Actions secrets:
   - `FIREBASE_SERVICE_ACCOUNT`: Service account JSON
   - All `NEXT_PUBLIC_*` environment variables

### Deploy
```bash
npm run deploy:firebase
```

### Auto-deployment
- GitHub Actions automatically deploys on push to `main`
- Includes Firestore rules and Cloud Functions deployment

## Preview Branches

### Vercel
- Every PR automatically gets a preview URL
- Comment on PR with deployment status

### Firebase
- Use Firebase Hosting channels:
```bash
firebase hosting:channel:deploy preview-branch-name
```

## Performance Optimization

### Build Analysis
```bash
npm run build
# Check bundle size in .next/analyze/
```

### Lighthouse Score
- Target: 90+ on all metrics
- Use Vercel Analytics for monitoring
- Enable Core Web Vitals tracking

## Monitoring & Analytics

### Firebase Performance
Add to your app:
```javascript
import { getPerformance } from 'firebase/performance'
const perf = getPerformance(app)
```

### Vercel Analytics
Add to `layout.tsx`:
```javascript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown

### Firebase
1. Go to Firebase Console → Hosting
2. Add custom domain
3. Follow DNS configuration steps

## Troubleshooting

### Build Failures
- Check environment variables are set
- Verify Firebase configuration
- Run `npm run build` locally first

### Deployment Issues
- Check GitHub Actions logs
- Verify service account permissions (Firebase)
- Ensure all secrets are configured

### Performance Issues
- Enable static optimization
- Use dynamic imports for large components
- Optimize images with Next/Image

## Security Checklist
- ✅ Environment variables secured
- ✅ Firestore Security Rules deployed
- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ Firebase Auth configured properly

## Commands Reference
```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Deploy to Firebase
npm run deploy:firebase

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```