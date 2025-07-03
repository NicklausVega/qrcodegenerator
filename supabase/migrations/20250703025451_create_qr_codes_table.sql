-- Enable RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create qr_codes table
CREATE TABLE public.qr_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- QR Code identification
    code VARCHAR(8) UNIQUE NOT NULL, -- Short unique code for the QR URL
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- QR Code content and redirect
    redirect_url TEXT NOT NULL,
    
    -- QR Code styling (JSON for flexibility)
    styling JSONB DEFAULT '{
        "width": 300,
        "height": 300,
        "margin": 10,
        "dotsType": "rounded",
        "dotsColor": "#000000",
        "dotsGradientEnabled": false,
        "dotsGradientType": "linear",
        "dotsGradientRotation": 0,
        "dotsGradientStartColor": "#000000",
        "dotsGradientEndColor": "#666666",
        "backgroundColor": "#ffffff",
        "backgroundTransparent": false,
        "backgroundGradientEnabled": false,
        "backgroundGradientType": "linear",
        "backgroundGradientRotation": 0,
        "backgroundGradientStartColor": "#ffffff",
        "backgroundGradientEndColor": "#f0f0f0",
        "errorCorrectionLevel": "Q",
        "hideBackgroundDots": true,
        "imageSize": 0.4,
        "imageMargin": 20
    }'::jsonb,
    
    -- Logo/Image
    image_url TEXT,
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    scan_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create qr_scans table for analytics
CREATE TABLE public.qr_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE NOT NULL,
    
    -- Scan metadata
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    city VARCHAR(255),
    
    -- Timestamp
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_qr_codes_user_id ON public.qr_codes(user_id);
CREATE INDEX idx_qr_codes_code ON public.qr_codes(code);
CREATE INDEX idx_qr_codes_active ON public.qr_codes(is_active) WHERE is_active = true;
CREATE INDEX idx_qr_scans_qr_code_id ON public.qr_scans(qr_code_id);
CREATE INDEX idx_qr_scans_date ON public.qr_scans(scanned_at);

-- Enable Row Level Security
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for qr_codes
CREATE POLICY "Users can view their own QR codes" ON public.qr_codes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own QR codes" ON public.qr_codes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR codes" ON public.qr_codes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes" ON public.qr_codes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for qr_scans
CREATE POLICY "Users can view scans for their QR codes" ON public.qr_scans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.qr_codes 
            WHERE qr_codes.id = qr_scans.qr_code_id 
            AND qr_codes.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert scan records" ON public.qr_scans
    FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_qr_codes_updated_at 
    BEFORE UPDATE ON public.qr_codes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique short codes
CREATE OR REPLACE FUNCTION generate_unique_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
    code_exists BOOLEAN;
BEGIN
    LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars))::int + 1, 1);
        END LOOP;
        
        SELECT EXISTS(SELECT 1 FROM public.qr_codes WHERE code = result) INTO code_exists;
        
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to increment scan count
CREATE OR REPLACE FUNCTION increment_scan_count(qr_code TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.qr_codes 
    SET scan_count = scan_count + 1 
    WHERE code = qr_code AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
