# 🔧 Installation Guide

This guide covers detailed installation instructions for QR Generator on various platforms and environments.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Local Development Setup](#local-development-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Production Deployment](#production-deployment)
- [Docker Setup](#docker-setup)
- [Troubleshooting](#troubleshooting)

## 🖥️ System Requirements

### Minimum Requirements

- **Node.js**: 18.17.0 or later
- **npm**: 9.0.0 or later (or yarn 1.22.0+, pnpm 8.0.0+)
- **Git**: 2.30.0 or later
- **Memory**: 4GB RAM minimum
- **Storage**: 2GB free disk space

### Recommended Requirements

- **Node.js**: 20.x LTS
- **npm**: Latest stable version
- **Memory**: 8GB RAM or more
- **Storage**: 10GB free disk space for development
- **OS**: macOS, Linux, or Windows 10/11

### External Services

- **Supabase Account**: Free tier available
- **PostgreSQL**: 14+ (if self-hosting database)

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/NicklausVega/qr-generator.git

# Using SSH (if you have SSH keys set up)
git clone git@github.com:NicklausVega/qr-generator.git

# Navigate to the project directory
cd qr-generator
```

### 2. Install Dependencies

Choose your preferred package manager:

#### Using npm (recommended)
```bash
npm install
```

#### Using yarn
```bash
yarn install
```

#### Using pnpm
```bash
pnpm install
```

### 3. Verify Installation

Check that everything is installed correctly:

```bash
# Check Node.js version
node --version  # Should be 18.17.0+

# Check npm version
npm --version

# Check project dependencies
npm list --depth=0
```

## 🗄️ Database Setup

### Option 1: Supabase Cloud (Recommended)

1. **Create a Supabase account**:
   - Visit [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get your credentials**:
   - Navigate to Settings > API
   - Copy the Project URL and anon key
   - Copy the service role key (for server-side operations)

3. **Run database migrations**:
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g @supabase/cli
   
   # Initialize Supabase (if not already done)
   npx supabase init
   
   # Link to your remote project
   npx supabase link --project-ref YOUR_PROJECT_REF
   
   # Push the database schema
   npx supabase db push
   ```

### Option 2: Local Supabase Development

1. **Start local Supabase**:
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Start local Supabase stack
   npx supabase start
   ```

2. **Apply migrations**:
   ```bash
   npx supabase db push
   ```

3. **Access local services**:
   - Database: `postgresql://postgres:postgres@localhost:54322/postgres`
   - API: `http://localhost:54321`
   - Dashboard: `http://localhost:54323`

### Option 3: Self-hosted PostgreSQL

1. **Install PostgreSQL 14+**
2. **Create a database**:
   ```sql
   CREATE DATABASE qr_generator;
   CREATE USER qr_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE qr_generator TO qr_user;
   ```

3. **Run migrations manually** (see `supabase/migrations/` folder)

## ⚙️ Environment Configuration

### 1. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your settings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 3. Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations key | ⚠️ | - |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL | ✅ | `http://localhost:3000` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | ❌ | - |

⚠️ **Security Note**: Service role key has admin privileges. Only use in server-side code.

## 🚀 Running the Application

### Development Mode

```bash
# Start the development server
npm run dev

# Or with other package managers
yarn dev
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Features

- **Hot Reload**: Changes automatically refresh the browser
- **Error Overlay**: Detailed error information during development
- **Source Maps**: Debug with original source code
- **Fast Refresh**: Preserves component state during updates

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix auto-fixable linting issues
npm run type-check   # Run TypeScript type checking

# Database (requires Supabase CLI)
npm run db:reset     # Reset local database
npm run db:seed      # Seed database with sample data
npm run db:push      # Push schema changes to remote
npm run db:pull      # Pull schema changes from remote

# Testing (when implemented)
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏭 Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Environment Setup

1. **Create production environment file**:
   ```bash
   cp .env.example .env.production
   ```

2. **Configure production variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

### Platform-Specific Deployments

#### Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Add environment variables** in Netlify dashboard

#### Custom Server

```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start npm --name "qr-generator" -- start
pm2 save
pm2 startup
```

## 🐳 Docker Setup

### Development with Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
         - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
       env_file:
         - .env.local
   ```

3. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```

### Production Docker

```bash
# Build production image
docker build -t qr-generator .

# Run container
docker run -p 3000:3000 --env-file .env.production qr-generator
```

## 🔧 Troubleshooting

### Common Issues

#### Node.js Version Issues

```bash
# Check current version
node --version

# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

#### Package Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

#### Database Connection Issues

1. **Check environment variables**:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Verify Supabase project status**:
   - Check Supabase dashboard
   - Verify API keys are correct
   - Ensure database is active

3. **Test connection**:
   ```bash
   npx supabase status
   ```

#### Build Issues

```bash
# Check TypeScript errors
npm run type-check

# Check linting issues
npm run lint

# Clear Next.js cache
rm -rf .next
npm run build
```

#### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 npm run dev
```

### Performance Issues

#### Slow Development Server

1. **Increase Node.js memory**:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run dev
   ```

2. **Disable source maps** (in `next.config.ts`):
   ```typescript
   module.exports = {
     productionBrowserSourceMaps: false,
   }
   ```

#### Large Bundle Size

1. **Analyze bundle**:
   ```bash
   npm install -g @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

2. **Check for large dependencies**:
   ```bash
   npm list --depth=0 --json | jq '.dependencies | to_entries | sort_by(.value.version) | reverse'
   ```

### Getting Help

If you encounter issues not covered here:

1. **Check existing issues**: [GitHub Issues](https://github.com/NicklausVega/qr-generator/issues)
2. **Search discussions**: [GitHub Discussions](https://github.com/NicklausVega/qr-generator/discussions)
3. **Create a new issue** with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Steps to reproduce

---

🎉 **Installation Complete!** You should now have QR Generator running locally. Check out the [Getting Started Guide](./getting-started.md) for your next steps. 