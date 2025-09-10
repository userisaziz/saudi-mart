# Saudi B2B CRM - Vercel Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed locally
- GitHub account
- Vercel account (free tier available)

### Step 1: Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite React project

### Step 3: Configure Build Settings
Vercel should automatically detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Environment Variables
In Vercel Dashboard > Settings > Environment Variables, add:

#### Required Variables
```
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_NODE_ENV=production
VITE_APP_NAME=Saudi B2B CRM
VITE_APP_VERSION=1.0.0
```

#### Authentication
```
VITE_JWT_SECRET_KEY=your-secure-jwt-secret
VITE_REFRESH_TOKEN_KEY=your-refresh-token-key
VITE_SESSION_TIMEOUT=3600000
```

#### Saudi-Specific Settings
```
VITE_DEFAULT_CURRENCY=SAR
VITE_DEFAULT_LOCALE=en-SA
VITE_ARABIC_SUPPORT=true
VITE_HIJRI_CALENDAR=true
```

#### Optional Services
```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
```

#### Feature Flags
```
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENT_GATEWAY=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEBUG=false
VITE_LOG_LEVEL=error
```

### Step 5: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔧 Local Development

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Build Testing
```bash
# Test production build locally
npm run build
npm run preview
```

### Run Deployment Script (Optional)
```bash
# Make script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment preparation
./deploy.sh
```

## 📊 Performance Optimization

The build is optimized with:
- **Code Splitting**: Automatic vendor and feature-based splitting
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser optimization
- **Asset Optimization**: Hashed filenames for caching
- **Bundle Analysis**: Separate chunks for admin/seller modules

## 🌐 Domain Configuration

### Custom Domain Setup
1. In Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

### Redirects & Rewrites
The `vercel.json` configuration handles:
- SPA routing (all routes serve `index.html`)
- Asset caching (1 year for static assets)
- Security headers
- Service worker caching

## 🔒 Security Configuration

Applied security measures:
- Content Security Policy headers
- XSS protection
- Frame options (clickjacking protection)
- HTTPS enforcement
- Secure cookie settings

## 📱 Mobile & PWA

The application includes:
- Responsive design for mobile devices
- Touch-friendly interfaces
- Optimized loading for mobile networks
- Arabic RTL support

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Environment Variable Issues
- Ensure all `VITE_*` prefixed variables are set
- Check for typos in variable names
- Verify values don't contain special characters without proper escaping

#### Routing Issues
- Ensure `vercel.json` is properly configured
- Check that all route paths are correctly defined
- Verify navigation components use proper React Router patterns

### Logs & Monitoring
- Check Vercel Function Logs for runtime errors
- Use browser dev tools for client-side issues
- Monitor Core Web Vitals in Vercel Analytics

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Test build locally first
4. Verify all environment variables are set

## 📈 Analytics & Monitoring

Optional integrations:
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking and performance monitoring
- **Core Web Vitals**: Performance optimization insights