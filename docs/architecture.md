# 🏗️ Architecture Overview

This document provides a comprehensive overview of the QR Generator architecture, including system design, data flow, and technical decisions.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [QR Code Generation Pipeline](#qr-code-generation-pipeline)
- [Analytics System](#analytics-system)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)

## 🎯 System Overview

QR Generator is a modern, full-stack web application built with a **Jamstack architecture** that provides:

- **Frontend**: React/Next.js for the user interface
- **Backend**: Next.js API routes for server-side logic
- **Database**: Supabase (PostgreSQL) for data persistence
- **Authentication**: Supabase Auth for user management
- **Storage**: Supabase Storage for file uploads
- **Analytics**: Custom analytics system for scan tracking

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Client App    │◄──►│   Next.js API   │◄──►│    Supabase     │
│   (React/Next)  │    │     Routes      │    │   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   shadcn/ui     │    │  QR Generation  │    │  Row Level      │
│   Components    │    │    Libraries    │    │   Security      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.x |
| **Next.js** | Full-stack Framework | 15.x |
| **TypeScript** | Type Safety | 5.x |
| **Tailwind CSS** | Styling | 4.x |
| **shadcn/ui** | Component Library | Latest |
| **Lucide React** | Icons | Latest |

### Backend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Server-side Logic | 15.x |
| **Supabase** | Backend-as-a-Service | Latest |
| **PostgreSQL** | Database | 15.x |
| **Row Level Security** | Access Control | Native |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **TypeScript** | Static Type Checking |
| **Supabase CLI** | Database Management |

## 🏛️ Application Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── forgot-password/
│   ├── dashboard/                # Main dashboard
│   ├── customize/                # QR customization studio
│   ├── analytics/[id]/           # Analytics pages
│   ├── qr/[code]/               # QR redirect handler
│   └── api/                     # API routes
│       └── qr/                  # QR generation API
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── dashboard/               # Dashboard-specific components
│   ├── qr/                      # QR-related components
│   └── analytics/               # Analytics components
├── lib/                         # Utility libraries
│   ├── supabase/               # Supabase clients
│   ├── qr-codes.ts             # QR code utilities
│   └── utils.ts                # General utilities
└── hooks/                      # Custom React hooks
```

### Component Architecture

```
┌─────────────────────────────────────────┐
│                Layout                   │
│  ┌─────────────────────────────────────┐│
│  │            Header                   ││
│  │  ┌─────────────┐ ┌─────────────────┐││
│  │  │    Logo     │ │ User Menu/Auth  │││
│  │  └─────────────┘ └─────────────────┘││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │            Page Content             ││
│  │                                     ││
│  │  ┌─────────────┐ ┌─────────────────┐││
│  │  │  Sidebar    │ │   Main Content  │││
│  │  │  (if any)   │ │                 │││
│  │  └─────────────┘ └─────────────────┘││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### State Management

- **Server State**: Supabase real-time subscriptions
- **Client State**: React hooks and Context API
- **URL State**: Next.js router for navigation state
- **Form State**: React Hook Form for complex forms

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      users      │     │    qr_codes     │     │    qr_scans     │
│                 │     │                 │     │                 │
│ id (uuid)       │◄────┤ user_id (fk)    │◄────┤ qr_code_id (fk) │
│ email           │     │ id (uuid)       │     │ id (uuid)       │
│ created_at      │     │ name            │     │ ip_address      │
│ updated_at      │     │ description     │     │ user_agent      │
│                 │     │ url             │     │ referer         │
│                 │     │ code (unique)   │     │ country         │
│                 │     │ styling (jsonb) │     │ city            │
│                 │     │ is_active       │     │ scanned_at      │
│                 │     │ scan_count      │     │                 │
│                 │     │ created_at      │     │                 │
│                 │     │ updated_at      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Table Schemas

#### `qr_codes` Table

```sql
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL DEFAULT generate_unique_code(),
  styling JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `qr_scans` Table

```sql
CREATE TABLE qr_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Functions

#### Unique Code Generation

```sql
CREATE OR REPLACE FUNCTION generate_unique_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  
  -- Ensure uniqueness
  IF EXISTS (SELECT 1 FROM qr_codes WHERE code = result) THEN
    RETURN generate_unique_code();
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### Scan Count Increment

```sql
CREATE OR REPLACE FUNCTION increment_scan_count(qr_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE qr_codes 
  SET scan_count = scan_count + 1,
      updated_at = NOW()
  WHERE code = qr_code;
END;
$$ LANGUAGE plpgsql;
```

## 🔐 Authentication Flow

### User Authentication Process

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │  Next.js    │    │  Supabase   │    │  Database   │
│             │    │             │    │    Auth     │    │             │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │ 1. Login Request │                  │                  │
       ├─────────────────►│                  │                  │
       │                  │ 2. Validate     │                  │
       │                  ├─────────────────►│                  │
       │                  │                  │ 3. Check User   │
       │                  │                  ├─────────────────►│
       │                  │ 4. User Data    │
       │                  │◄─────────────────┤
       │                  │ 5. JWT Token    │                  │
       │                  │◄─────────────────┤                  │
       │ 6. Auth Response │                  │                  │
       │◄─────────────────┤                  │                  │
```

### Row Level Security (RLS)

```sql
-- Users can only access their own QR codes
CREATE POLICY "Users can view own qr_codes" ON qr_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own qr_codes" ON qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own qr_codes" ON qr_codes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own qr_codes" ON qr_codes
  FOR DELETE USING (auth.uid() = user_id);

-- QR scans are publicly readable for analytics
CREATE POLICY "QR scans are publicly readable" ON qr_scans
  FOR SELECT USING (true);
```

## 🎨 QR Code Generation Pipeline

### Generation Process Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │    API      │    │   QR Lib    │    │  Database   │
│  Request    │    │   Route     │    │             │    │             │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │ 1. Create QR     │                  │                  │
       ├─────────────────►│                  │                  │
       │                  │ 2. Validate     │                  │
       │                  │    Data         │                  │
       │                  │                  │                  │
       │                  │ 3. Generate     │                  │
       │                  │    Unique Code  │                  │
       │                  ├─────────────────►│                  │
       │                  │                  │ 4. Create QR    │
       │                  │                  │    Image        │
       │                  │                  │                  │
       │                  │ 5. Save to DB   │                  │
       │                  ├─────────────────────────────────────►│
       │                  │                  │                  │
       │ 6. Return QR     │                  │                  │
       │◄─────────────────┤                  │                  │
```

### Styling Configuration

QR code styling is stored as JSONB in the database:

```typescript
interface QRStyling {
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  gradientType?: 'linear' | 'radial';
  gradientColors?: string[];
  
  // Logo
  logoUrl?: string;
  logoSize?: number;
  logoPosition?: 'center' | 'corner';
  
  // Modules
  moduleShape?: 'square' | 'dot' | 'rounded';
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  
  // Border
  margin?: number;
  borderRadius?: number;
}
```

## 📊 Analytics System

### Data Collection Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Scanner   │    │ QR Redirect │    │  Analytics  │    │  Database   │
│   Device    │    │   Handler   │    │   Service   │    │             │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │ 1. Scan QR Code  │                  │                  │
       ├─────────────────►│                  │                  │
       │                  │ 2. Extract       │                  │
       │                  │    Metadata      │                  │
       │                  ├─────────────────►│                  │
       │                  │                  │ 3. Store Scan   │
       │                  │                  ├─────────────────►│
       │                  │                  │                  │
       │                  │ 4. Increment     │                  │
       │                  │    Counter       │                  │
       │                  ├─────────────────────────────────────►│
       │                  │                  │                  │
       │ 5. Redirect to   │                  │                  │
       │    Target URL    │                  │                  │
       │◄─────────────────┤                  │                  │
```

### Metrics Calculation

- **Real-time metrics**: Calculated on-demand from scan data
- **Aggregated metrics**: Pre-computed for performance
- **Geographic data**: Derived from IP address using GeoIP services
- **Device analytics**: Parsed from User-Agent strings

## 🔒 Security Architecture

### Security Layers

1. **Authentication**: Supabase Auth with JWT tokens
2. **Authorization**: Row Level Security (RLS) policies
3. **API Security**: Rate limiting and input validation
4. **Data Protection**: HTTPS everywhere, encrypted storage
5. **CSRF Protection**: Built-in Next.js CSRF protection

### Data Privacy

- **IP Address Hashing**: IP addresses are hashed for privacy
- **GDPR Compliance**: User data deletion capabilities
- **Data Retention**: Configurable data retention policies
- **Anonymization**: Personal data anonymization options

## ⚡ Performance Considerations

### Frontend Performance

- **Static Generation**: Pre-built pages where possible
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Browser caching and CDN integration

### Backend Performance

- **Database Indexing**: Proper indexes on frequently queried columns
- **Connection Pooling**: Supabase built-in connection pooling
- **Caching**: Redis caching for expensive operations (future)
- **Rate Limiting**: API rate limiting to prevent abuse

### Database Optimization

```sql
-- Indexes for performance
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_code ON qr_codes(code);
CREATE INDEX idx_qr_codes_created_at ON qr_codes(created_at);
CREATE INDEX idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX idx_qr_scans_scanned_at ON qr_scans(scanned_at);
```

## 🔮 Future Architecture Considerations

### Scalability Plans

- **Microservices**: Potential service separation for high-scale
- **Caching Layer**: Redis for caching frequently accessed data
- **CDN Integration**: Global content delivery network
- **Database Scaling**: Read replicas and horizontal partitioning

### Additional Services

- **Email Service**: Transactional email capabilities
- **File Storage**: Expanded file storage for logos and exports
- **Analytics Service**: Dedicated analytics processing service
- **API Gateway**: Centralized API management and security

---

This architecture provides a solid foundation for a scalable, secure, and maintainable QR code generation platform while maintaining simplicity and developer experience. 