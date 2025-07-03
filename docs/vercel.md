# 🚀 Vercel Deployment Guide

Deploy your QR Generator to Vercel for production with this step-by-step guide.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Deploy](#quick-deploy)
- [Manual Deployment](#manual-deployment)
- [Environment Variables](#environment-variables)
- [Domain Configuration](#domain-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

Before deploying to Vercel, ensure you have:

- **GitHub Account** - For repository hosting
- **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
- **Supabase Project** - Production database setup
- **Domain** (optional) - Custom domain for your app

### Supabase Setup

1. **Create Production Project**:
   - Visit [supabase.com](https://supabase.com)
   - Create new project: `qr-generator-prod`
   - Note the project URL and keys

2. **Run Migrations**:
   ```bash
   # Link to your production project
   npx supabase link --project-ref YOUR_PROD_PROJECT_REF
   
   # Push your database schema
   npx supabase db push
   ```

3. **Configure Authentication**:
   - Enable email confirmation
   - Set up OAuth providers (optional)
   - Configure password requirements

## ⚡ Quick Deploy

### One-Click Deploy

1. **Use Deploy Button**:
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NicklausVega/qr-generator&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=qr-generator&repository-name=qr-generator)

2. **Follow the Setup**:
   - Connect your GitHub account
   - Fork or import the repository
   - Configure environment variables
   - Deploy!

### Environment Variables Setup

During deployment, you'll need to set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## 🔧 Manual Deployment

### Step 1: Fork Repository

1. **Fork the project** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/qr-generator.git
   cd qr-generator
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

### Step 2: Vercel CLI Setup

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Initialize project**:
   ```bash
   vercel
   ```
   - Choose your team (if applicable)
   - Confirm project settings
   - Set as production deployment

### Step 3: Configure Environment

1. **Add environment variables**:
   ```bash
   # Production Supabase URL
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # Enter: https://your-prod-project.supabase.co
   
   # Production Supabase Anon Key
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   # Enter: your_production_anon_key
   
   # Optional: App URL
   vercel env add NEXT_PUBLIC_APP_URL production
   # Enter: https://your-domain.vercel.app
   ```

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## 🔐 Environment Variables

### Required Variables

Set these in your Vercel dashboard or via CLI:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production anon key | `eyJhbGciOiJIUzI1NiIs...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Your app's domain | Auto-detected |
| `NEXT_PUBLIC_ANALYTICS_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking | - |

### Setting Variables in Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** > **Environment Variables**
4. Add each variable for **Production** environment
5. Redeploy to apply changes

### Setting Variables via CLI

```bash
# Set production environment variables
vercel env add VARIABLE_NAME production

# List all environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME production
```

## 🌐 Domain Configuration

### Using Vercel Domain

Your app will be available at:
```
https://your-project-name.vercel.app
```

### Custom Domain Setup

1. **Add Domain in Vercel**:
   - Go to project settings
   - Click **Domains**
   - Enter your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   
   **For Apex Domain** (`example.com`):
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   ```
   
   **For Subdomain** (`app.example.com`):
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**:
   - Automatically provisioned by Vercel
   - Usually takes 10-60 minutes
   - HTTPS redirect enabled by default

### Updating Environment Variables

When using custom domain, update:
```bash
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://your-custom-domain.com
```

## ⚡ Performance Optimization

### Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    },
    {
      "source": "/qr/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Next.js Configuration

Optimize `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['qrcode'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  
  // Compression
  compress: true,
  
  // Power pack optimizations
  swcMinify: true,
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Performance Best Practices

1. **Enable Edge Functions**:
   ```typescript
   // src/app/api/qr/route.ts
   export const runtime = 'edge';
   ```

2. **Optimize Images**:
   - Use Next.js Image component
   - Enable WebP/AVIF formats
   - Set appropriate cache headers

3. **Bundle Analysis**:
   ```bash
   # Analyze bundle size
   npm install -g @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**:
   - Go to project settings
   - Navigate to **Analytics**
   - Enable Web Analytics
   - View insights in dashboard

2. **Speed Insights**:
   - Automatic Core Web Vitals tracking
   - Real user metrics
   - Performance recommendations

### Custom Analytics

1. **Google Analytics**:
   ```bash
   vercel env add NEXT_PUBLIC_ANALYTICS_ID production
   # Enter your GA4 measurement ID
   ```

2. **Error Tracking with Sentry**:
   ```bash
   vercel env add NEXT_PUBLIC_SENTRY_DSN production
   # Enter your Sentry DSN
   ```

### Function Logs

1. **View logs in dashboard**:
   - Go to **Functions** tab
   - Click on any function
   - View real-time logs

2. **CLI log streaming**:
   ```bash
   vercel logs --follow
   ```

## 🔧 Troubleshooting

### Common Issues

#### **Build Failures**

1. **Check build logs**:
   ```bash
   vercel logs --since 1h
   ```

2. **Common fixes**:
   ```bash
   # Clear cache and rebuild
   vercel --force
   
   # Check for TypeScript errors
   npm run type-check
   
   # Verify environment variables
   vercel env ls
   ```

#### **Environment Variable Issues**

1. **Variables not loading**:
   - Ensure `NEXT_PUBLIC_` prefix for client-side variables
   - Check variable names for typos
   - Redeploy after adding variables

2. **Debug environment**:
   ```typescript
   // Add to a component for debugging
   console.log('Environment check:', {
     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20),
     hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
   });
   ```

#### **Database Connection Issues**

1. **Verify Supabase settings**:
   - Check project URL and keys
   - Ensure database is active
   - Verify RLS policies

2. **Test connection**:
   ```typescript
   // Test API endpoint
   const response = await fetch('/api/qr');
   console.log('API test:', response.status);
   ```

#### **Function Timeouts**

1. **Increase timeout** in `vercel.json`:
   ```json
   {
     "functions": {
       "src/app/api/**/*.ts": {
         "maxDuration": 60
       }
     }
   }
   ```

2. **Optimize slow functions**:
   - Add caching
   - Reduce database queries
   - Use edge runtime when possible

### Performance Issues

#### **Slow Page Loads**

1. **Check Core Web Vitals** in Vercel Analytics
2. **Optimize images** with Next.js Image component
3. **Enable compression** in `next.config.ts`
4. **Use Edge Functions** for API routes

#### **High Memory Usage**

1. **Monitor function usage** in Vercel dashboard
2. **Optimize bundle size**:
   ```bash
   npm run analyze
   ```
3. **Use dynamic imports** for large components

### Getting Help

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Vercel Support**: Available in dashboard
3. **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
4. **Status Page**: [vercel-status.com](https://vercel-status.com)

## 🚀 Deployment Checklist

Before going live, verify:

- [ ] **Environment variables** are set correctly
- [ ] **Database migrations** are applied
- [ ] **Custom domain** is configured (if using)
- [ ] **SSL certificate** is active
- [ ] **Analytics** are enabled
- [ ] **Error tracking** is configured
- [ ] **Performance** is optimized
- [ ] **Monitoring** is set up
- [ ] **Backup strategy** is in place

---

🎉 **Congratulations!** Your QR Generator is now live on Vercel. Monitor performance and user feedback to continue improving your application. 