# 🗄️ Database Schema

This document describes the database schema, relationships, and data models used in QR Generator.

## 📋 Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Data Models](#data-models)
- [Relationships](#relationships)
- [Indexes & Performance](#indexes--performance)
- [Migrations](#migrations)
- [Row Level Security](#row-level-security)
- [Database Functions](#database-functions)

## 🎯 Overview

QR Generator uses **PostgreSQL** via **Supabase** as its primary database. The schema is designed for:

- **User isolation** - Each user can only access their own data
- **Scalability** - Efficient queries and proper indexing
- **Analytics** - Comprehensive scan tracking
- **Security** - Row Level Security (RLS) policies

### Key Principles

- **JSONB for flexibility** - QR styling stored as JSONB
- **UUID primary keys** - Better for distributed systems
- **Timestamps everywhere** - Full audit trail
- **Soft deletes** - Data retention for analytics

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      users      │     │    qr_codes     │     │    qr_scans     │
│  (auth.users)   │     │                 │     │                 │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (uuid) PK    │◄────┤ user_id (fk)    │◄────┤ qr_code_id (fk) │
│ email           │     │ id (uuid) PK    │     │ id (uuid) PK    │
│ created_at      │     │ name            │     │ ip_address      │
│ updated_at      │     │ description     │     │ user_agent      │
│ email_confirmed │     │ url             │     │ referer         │
│ phone           │     │ code (unique)   │     │ country         │
│                 │     │ styling (jsonb) │     │ city            │
│                 │     │ is_active       │     │ device_type     │
│                 │     │ scan_count      │     │ browser         │
│                 │     │ created_at      │     │ os              │
│                 │     │ updated_at      │     │ scanned_at      │
│                 │     │ deleted_at      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📋 Data Models

### QR Codes Table

The main table storing QR code data and configuration.

```sql
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) > 0),
  description TEXT,
  url TEXT NOT NULL CHECK (url ~ '^https?://'),
  code TEXT UNIQUE NOT NULL DEFAULT generate_unique_code(),
  styling JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  scan_count INTEGER DEFAULT 0 CHECK (scan_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
```

#### Field Descriptions

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `user_id` | UUID | Reference to auth.users | Foreign key, NOT NULL |
| `name` | TEXT | QR code display name | NOT NULL, length > 0 |
| `description` | TEXT | Optional description | NULL allowed |
| `url` | TEXT | Target redirect URL | NOT NULL, valid URL format |
| `code` | TEXT | Unique short code | UNIQUE, auto-generated |
| `styling` | JSONB | QR code styling config | JSON object |
| `is_active` | BOOLEAN | Whether QR is active | DEFAULT true |
| `scan_count` | INTEGER | Total scan count | >= 0 |
| `created_at` | TIMESTAMPTZ | Creation timestamp | Auto-set |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Auto-updated |
| `deleted_at` | TIMESTAMPTZ | Soft delete timestamp | NULL = not deleted |

### QR Scans Table

Stores detailed analytics data for each QR code scan.

```sql
CREATE TABLE qr_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser TEXT,
  os TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Field Descriptions

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `qr_code_id` | UUID | Reference to qr_codes | Foreign key, NOT NULL |
| `ip_address` | INET | Scanner's IP address | Hashed for privacy |
| `user_agent` | TEXT | Browser user agent | Raw string |
| `referer` | TEXT | HTTP referer header | NULL allowed |
| `country` | TEXT | Country from IP | Derived from IP |
| `city` | TEXT | City from IP | Derived from IP |
| `region` | TEXT | Region/state from IP | Derived from IP |
| `device_type` | TEXT | Device category | Enum values |
| `browser` | TEXT | Browser name | Parsed from user agent |
| `os` | TEXT | Operating system | Parsed from user agent |
| `scanned_at` | TIMESTAMPTZ | Scan timestamp | Auto-set |

### QR Styling Schema

The `styling` JSONB field supports flexible QR code customization:

```typescript
interface QRStyling {
  // Core colors
  foregroundColor?: string;        // Default: '#000000'
  backgroundColor?: string;        // Default: '#FFFFFF'
  
  // Gradient support
  gradientType?: 'linear' | 'radial';
  gradientDirection?: number;      // Degrees for linear
  gradientColors?: string[];       // Color stops
  
  // Logo configuration
  logo?: {
    url: string;
    size: number;                  // Percentage of QR size
    position: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    borderRadius?: number;
    padding?: number;
  };
  
  // Module styling
  moduleStyle?: {
    shape: 'square' | 'dot' | 'rounded';
    size: number;                  // Percentage
  };
  
  // Error correction
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  
  // Border and margin
  margin?: number;                 // Pixels
  borderRadius?: number;          // Pixels
  
  // Advanced options
  quietZone?: number;             // Margin around QR
  customFinderPattern?: boolean;   // Custom corner squares
}
```

## 🔗 Relationships

### One-to-Many Relationships

```sql
-- One user has many QR codes
auth.users (1) ←→ (N) qr_codes

-- One QR code has many scans
qr_codes (1) ←→ (N) qr_scans
```

### Referential Integrity

```sql
-- Cascade deletes
ALTER TABLE qr_codes 
  ADD CONSTRAINT fk_qr_codes_user_id 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE qr_scans 
  ADD CONSTRAINT fk_qr_scans_qr_code_id 
  FOREIGN KEY (qr_code_id) REFERENCES qr_codes(id) ON DELETE CASCADE;
```

## 📈 Indexes & Performance

### Primary Indexes

```sql
-- Primary keys (automatic)
CREATE UNIQUE INDEX qr_codes_pkey ON qr_codes(id);
CREATE UNIQUE INDEX qr_scans_pkey ON qr_scans(id);

-- Unique constraints
CREATE UNIQUE INDEX qr_codes_code_unique ON qr_codes(code);
```

### Query Optimization Indexes

```sql
-- User queries (most common)
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_user_active ON qr_codes(user_id, is_active) 
  WHERE deleted_at IS NULL;

-- QR code lookups
CREATE INDEX idx_qr_codes_code ON qr_codes(code) WHERE is_active = true;

-- Analytics queries
CREATE INDEX idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX idx_qr_scans_scanned_at ON qr_scans(scanned_at);
CREATE INDEX idx_qr_scans_country ON qr_scans(country);

-- Time-based queries
CREATE INDEX idx_qr_codes_created_at ON qr_codes(created_at);
CREATE INDEX idx_qr_scans_recent ON qr_scans(qr_code_id, scanned_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_qr_codes_user_created ON qr_codes(user_id, created_at DESC)
  WHERE deleted_at IS NULL;
```

### Partial Indexes

```sql
-- Only index active QR codes
CREATE INDEX idx_qr_codes_active_code ON qr_codes(code) 
  WHERE is_active = true AND deleted_at IS NULL;

-- Only index recent scans (last 90 days)
CREATE INDEX idx_qr_scans_recent_90d ON qr_scans(qr_code_id, scanned_at)
  WHERE scanned_at > (NOW() - INTERVAL '90 days');
```

## 🔄 Migrations

### Migration Structure

```
supabase/migrations/
├── 20250703025451_create_qr_codes_table.sql
├── 20250703025452_create_qr_scans_table.sql
├── 20250703025453_create_functions.sql
├── 20250703025454_create_rls_policies.sql
└── 20250703025455_create_indexes.sql
```

### Initial Migration

```sql
-- 20250703025451_create_qr_codes_table.sql
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) > 0),
  description TEXT,
  url TEXT NOT NULL CHECK (url ~ '^https?://'),
  code TEXT UNIQUE NOT NULL DEFAULT generate_unique_code(),
  styling JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  scan_count INTEGER DEFAULT 0 CHECK (scan_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamps
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Running Migrations

```bash
# Apply all migrations
npx supabase db push

# Create new migration
npx supabase migration new add_qr_templates

# Reset database (development only)
npx supabase db reset

# Check migration status
npx supabase migration list
```

## 🔐 Row Level Security

### RLS Policies

#### QR Codes Policies

```sql
-- Users can only see their own QR codes
CREATE POLICY "qr_codes_select_own" ON qr_codes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own QR codes
CREATE POLICY "qr_codes_insert_own" ON qr_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own QR codes
CREATE POLICY "qr_codes_update_own" ON qr_codes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can soft delete their own QR codes
CREATE POLICY "qr_codes_delete_own" ON qr_codes
  FOR UPDATE
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (deleted_at IS NOT NULL);
```

#### QR Scans Policies

```sql
-- QR scans are publicly writable (for tracking)
CREATE POLICY "qr_scans_insert_public" ON qr_scans
  FOR INSERT
  WITH CHECK (true);

-- Users can view scans for their QR codes
CREATE POLICY "qr_scans_select_own" ON qr_scans
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes 
      WHERE qr_codes.id = qr_scans.qr_code_id 
      AND qr_codes.user_id = auth.uid()
    )
  );
```

### Security Functions

```sql
-- Check if user owns QR code
CREATE OR REPLACE FUNCTION user_owns_qr_code(qr_code_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM qr_codes 
    WHERE id = qr_code_id 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## ⚙️ Database Functions

### Utility Functions

#### Unique Code Generation

```sql
CREATE OR REPLACE FUNCTION generate_unique_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  attempts INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  LOOP
    result := '';
    
    -- Generate 8-character code
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check uniqueness
    IF NOT EXISTS (SELECT 1 FROM qr_codes WHERE code = result) THEN
      RETURN result;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique code after % attempts', max_attempts;
    END IF;
  END LOOP;
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
  WHERE code = qr_code 
  AND is_active = true 
  AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
```

#### Timestamp Updates

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Analytics Functions

#### Get QR Code Analytics

```sql
CREATE OR REPLACE FUNCTION get_qr_analytics(
  qr_code_id UUID,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  total_scans BIGINT,
  unique_ips BIGINT,
  top_countries JSON,
  device_breakdown JSON,
  daily_scans JSON
) AS $$
BEGIN
  -- Verify user owns this QR code
  IF NOT user_owns_qr_code(qr_code_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Set default date range (last 30 days)
  IF start_date IS NULL THEN
    start_date := NOW() - INTERVAL '30 days';
  END IF;
  IF end_date IS NULL THEN
    end_date := NOW();
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_scans,
    COUNT(DISTINCT ip_address)::BIGINT as unique_ips,
    (
      SELECT json_agg(json_build_object('country', country, 'count', count))
      FROM (
        SELECT country, COUNT(*) as count
        FROM qr_scans s
        WHERE s.qr_code_id = get_qr_analytics.qr_code_id
        AND s.scanned_at BETWEEN start_date AND end_date
        AND country IS NOT NULL
        GROUP BY country
        ORDER BY count DESC
        LIMIT 10
      ) countries
    ) as top_countries,
    (
      SELECT json_agg(json_build_object('device', device_type, 'count', count))
      FROM (
        SELECT device_type, COUNT(*) as count
        FROM qr_scans s
        WHERE s.qr_code_id = get_qr_analytics.qr_code_id
        AND s.scanned_at BETWEEN start_date AND end_date
        GROUP BY device_type
        ORDER BY count DESC
      ) devices
    ) as device_breakdown,
    (
      SELECT json_agg(json_build_object('date', scan_date, 'count', count))
      FROM (
        SELECT DATE(scanned_at) as scan_date, COUNT(*) as count
        FROM qr_scans s
        WHERE s.qr_code_id = get_qr_analytics.qr_code_id
        AND s.scanned_at BETWEEN start_date AND end_date
        GROUP BY DATE(scanned_at)
        ORDER BY scan_date
      ) daily
    ) as daily_scans
  FROM qr_scans
  WHERE qr_scans.qr_code_id = get_qr_analytics.qr_code_id
  AND scanned_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Maintenance Functions

#### Cleanup Old Scans

```sql
CREATE OR REPLACE FUNCTION cleanup_old_scans(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM qr_scans 
  WHERE scanned_at < (NOW() - (retention_days || ' days')::INTERVAL);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run monthly)
SELECT cron.schedule('cleanup-old-scans', '0 0 1 * *', 'SELECT cleanup_old_scans(365);');
```

## 📊 Performance Monitoring

### Query Performance

```sql
-- Monitor slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE query LIKE '%qr_codes%' 
ORDER BY mean_time DESC;

-- Check index usage
SELECT 
  indexrelname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public';
```

### Database Size Monitoring

```sql
-- Table sizes
SELECT 
  table_name,
  pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Growth tracking
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('qr_codes', 'qr_scans');
```

---

This database schema provides a solid foundation for scalable QR code management with comprehensive analytics while maintaining security and performance. 🗄️ 