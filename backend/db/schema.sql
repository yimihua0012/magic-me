-- ============================================
-- HeadshotAI Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extension of Supabase auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    stripe_customer_id TEXT UNIQUE,
    stripe_session_id TEXT,
    plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'enterprise')),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
    ON profiles FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- GENERATIONS TABLE
-- AI headshot generation records
-- ============================================
CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    plan_type TEXT NOT NULL DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro')),
    style_count INTEGER NOT NULL DEFAULT 30,
    
    -- Input photos (stored in Supabase Storage)
    input_photos TEXT[] NOT NULL DEFAULT '{}',
    
    -- Output photos (URLs to generated headshots)
    output_photos TEXT[] DEFAULT '{}',
    
    -- Progress tracking
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_step TEXT,
    
    -- Payment info
    stripe_payment_id TEXT,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    error_message TEXT
);

-- RLS for generations
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generations"
    ON generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations"
    ON generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
    ON generations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
    ON generations FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for generations
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('input-photos', 'input-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('output-photos', 'output-photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own input photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'input-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own input photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'input-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view output photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'output-photos');

CREATE POLICY "Service role can manage all photos"
    ON storage.objects FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for generations updated_at
DROP TRIGGER IF EXISTS update_generations_updated_at ON generations;
CREATE TRIGGER update_generations_updated_at
    BEFORE UPDATE ON generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENUMS (for reference)
-- ============================================
-- Generation status: pending, processing, completed, failed
-- Plan types: basic, pro, enterprise
