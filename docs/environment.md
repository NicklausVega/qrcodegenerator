# ⚙️ Environment Setup

This guide covers environment configuration for different deployment scenarios and development environments.

## 📋 Table of Contents

- [Environment Variables](#environment-variables)
- [Development Environment](#development-environment)
- [Staging Environment](#staging-environment)
- [Production Environment](#production-environment)
- [Environment Security](#environment-security)
- [Supabase Configuration](#supabase-configuration)
- [Troubleshooting](#troubleshooting)

## 🔐 Environment Variables

### Required Variables

All environments require these core variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsIn...` | ✅ |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations key | `eyJhbGciOiJIUzI1NiIsIn...` | - |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL | `https://yourapp.com` | `http://localhost:3000` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | `G-XXXXXXXXXX` | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking DSN | `https://xxx@sentry.io/xxx` | - |
| `DATABASE_URL` | Direct database connection | `postgresql://...` | - |

### Environment Variable Naming

- **`NEXT_PUBLIC_`** prefix - Exposed to the browser
- **No prefix** - Server-side only (secure)
- **Case sensitive** - Use exact casing
- **Underscore separated** - Use snake_case

## 🛠️ Development Environment

### Local Development Setup

1. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure development variables**:
   ```env
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional development settings
   NEXT_PUBLIC_ANALYTICS_ID=
   NEXT_PUBLIC_DEBUG_MODE=true
   ```

### Development-Specific Configuration

```env
# Development debugging
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_TELEMETRY_DISABLED=1

# Development database (if using local Supabase)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key

# Development ports
PORT=3000
SUPABASE_PORT=54321
```

### VS Code Environment Setup

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🚧 Staging Environment

### Staging Configuration

```env
# .env.staging
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging_anon_key
NEXT_PUBLIC_APP_URL=https://staging.yourapp.com

# Staging-specific settings
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_API_RATE_LIMIT=100
NEXT_PUBLIC_DEBUG_MODE=false

# Optional staging tools
NEXT_PUBLIC_SENTRY_DSN=https://staging-sentry-dsn@sentry.io/project
```

### Staging Best Practices

1. **Use separate Supabase project** for staging
2. **Mirror production configuration** as closely as possible
3. **Enable debug logging** for testing
4. **Use test data** instead of production data
5. **Implement basic auth** to restrict access

### Staging Deployment

```bash
# Deploy to staging (example with Vercel)
vercel --env .env.staging

# Or with environment variables
ENVIRONMENT=staging vercel
```

## 🚀 Production Environment

### Production Configuration

```env
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_anon_key
NEXT_PUBLIC_APP_URL=https://yourapp.com

# Production settings
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production

# Security settings
SUPABASE_SERVICE_ROLE_KEY=production_service_role_key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://production-sentry-dsn@sentry.io/project
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
```

### Production Security Checklist

- [ ] **No debug flags** enabled
- [ ] **HTTPS only** for all URLs
- [ ] **Service role key** properly secured
- [ ] **Rate limiting** configured
- [ ] **Error tracking** enabled
- [ ] **Analytics** configured
- [ ] **Backup strategy** in place

### Production Deployment Variables

Different platforms have different ways to set environment variables:

#### Vercel

```bash
# Set via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Or in vercel.json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://prod.supabase.co"
  }
}
```

#### Netlify

```bash
# Set via CLI
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://prod.supabase.co"

# Or in netlify.toml
[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://prod.supabase.co"
```

#### Docker

```dockerfile
# In Dockerfile
ENV NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co

# Or in docker-compose.yml
environment:
  - NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
```

## 🔒 Environment Security

### Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use different keys** for different environments
3. **Rotate keys regularly** (quarterly recommended)
4. **Limit service role key usage** to server-side only
5. **Use environment-specific Supabase projects**

### .gitignore Configuration

```gitignore
# Environment files
.env
.env.local
.env.development
.env.staging
.env.production
.env.*.local

# Supabase
.env.supabase
.env.supabase.local
```

### Key Rotation Process

1. **Generate new keys** in Supabase dashboard
2. **Update staging environment** first
3. **Test functionality** thoroughly
4. **Update production environment**
5. **Verify deployment** works correctly
6. **Revoke old keys** after confirmation

### Environment Validation

Create an environment validation utility:

```typescript
// lib/env-validation.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Call in app startup
validateEnvironment();
```

## 🗄️ Supabase Configuration

### Project Setup

1. **Create Supabase projects**:
   - Development: `yourapp-dev`
   - Staging: `yourapp-staging`  
   - Production: `yourapp-prod`

2. **Configure authentication**:
   ```sql
   -- Enable email confirmation
   UPDATE auth.config SET email_confirm = true;
   
   -- Set JWT expiry
   UPDATE auth.config SET jwt_exp = 3600;
   ```

3. **Set up Row Level Security**:
   ```sql
   -- Enable RLS on tables
   ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
   ```

### Database Configuration

```sql
-- Development: Looser constraints
CREATE POLICY "dev_full_access" ON qr_codes FOR ALL USING (true);

-- Staging: Production-like policies
CREATE POLICY "staging_user_access" ON qr_codes 
  FOR SELECT USING (auth.uid() = user_id);

-- Production: Strict security
CREATE POLICY "prod_user_access" ON qr_codes 
  FOR ALL USING (auth.uid() = user_id);
```

### Environment-Specific Settings

#### Development
```json
{
  "auth": {
    "email_confirm": false,
    "phone_confirm": false,
    "sms_test_otp": "123456"
  },
  "storage": {
    "file_size_limit": 52428800
  }
}
```

#### Production
```json
{
  "auth": {
    "email_confirm": true,
    "phone_confirm": true,
    "password_min_length": 8
  },
  "storage": {
    "file_size_limit": 10485760
  }
}
```

## 🔧 Environment-Specific Features

### Feature Flags

```typescript
// lib/feature-flags.ts
export const featureFlags = {
  analytics: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  betaFeatures: process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
  errorTracking: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// Usage in components
if (featureFlags.analytics) {
  // Track analytics
}
```

### Environment Detection

```typescript
// lib/environment.ts
export const environment = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isStaging: process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging',
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
  isServer: typeof window === 'undefined',
  isClient: typeof window !== 'undefined',
};

export const config = {
  apiUrl: environment.isProduction 
    ? 'https://api.yourapp.com'
    : environment.isStaging
    ? 'https://staging-api.yourapp.com'
    : 'http://localhost:3000/api',
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
};
```

## 🚨 Troubleshooting

### Common Issues

#### Missing Environment Variables

```bash
# Error: Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined
echo $NEXT_PUBLIC_SUPABASE_URL

# Solution: Check .env.local file exists and contains the variable
cat .env.local | grep SUPABASE_URL
```

#### Environment Variable Not Loading

1. **Check file naming**:
   - Development: `.env.local`
   - Production: Set in deployment platform

2. **Verify prefix**:
   - Browser variables need `NEXT_PUBLIC_` prefix
   - Server variables don't need prefix

3. **Restart development server**:
   ```bash
   # Kill the process and restart
   npm run dev
   ```

#### Supabase Connection Issues

```typescript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Test connection
async function testConnection() {
  const { data, error } = await supabase.auth.getSession();
  console.log('Connection test:', { data, error });
}
```

### Environment Debugging

```typescript
// Debug environment variables
console.log('Environment check:', {
  nodeEnv: process.env.NODE_ENV,
  customEnv: process.env.NEXT_PUBLIC_ENVIRONMENT,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});
```

### Deployment Issues

1. **Platform-specific checks**:
   ```bash
   # Vercel
   vercel env ls
   
   # Netlify
   netlify env:list
   
   # Docker
   docker exec container_name env | grep NEXT_PUBLIC
   ```

2. **Build-time vs Runtime**:
   - Build-time: Variables baked into build
   - Runtime: Variables read during execution

3. **Caching issues**:
   ```bash
   # Clear build cache
   rm -rf .next
   npm run build
   ```

---

Proper environment configuration is crucial for security, functionality, and maintainability. Always use environment-specific configurations and never expose sensitive data! 🔐 