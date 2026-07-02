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
    plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'premium')),
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
-- CREDIT PACKAGES TABLE
-- 用户购买的信用包（套餐配额）
-- ============================================
CREATE TABLE IF NOT EXISTS credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 套餐信息
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'pro', 'premium')),
    total_credits INTEGER NOT NULL,
    remaining_credits INTEGER NOT NULL,
    
    -- 有效期（从第一次生成开始计算）
    purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMP WITH TIME ZONE,        -- 第一次生成时设置
    expires_at TIMESTAMP WITH TIME ZONE,          -- activated_at + validity_days
    validity_days INTEGER NOT NULL,               -- 套餐有效期天数
    
    -- 支付信息
    stripe_payment_id TEXT,
    lemon_order_id TEXT,
    paypal_order_id TEXT,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- 状态
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'expired', 'depleted')),
    -- inactive: 未使用，有效期未开始
    -- active: 已激活（第一次生成后），在有效期内
    -- expired: 已过期
    -- depleted: 次数用完
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_credit_packages_user_id ON credit_packages(user_id);
CREATE INDEX idx_credit_packages_status ON credit_packages(status);
CREATE INDEX idx_credit_packages_expires_at ON credit_packages(expires_at);
CREATE UNIQUE INDEX idx_credit_packages_stripe_payment_id_unique
    ON credit_packages(stripe_payment_id)
    WHERE stripe_payment_id IS NOT NULL;
CREATE UNIQUE INDEX idx_credit_packages_lemon_order_id_unique
    ON credit_packages(lemon_order_id)
    WHERE lemon_order_id IS NOT NULL;
CREATE UNIQUE INDEX idx_credit_packages_paypal_order_id_unique
    ON credit_packages(paypal_order_id)
    WHERE paypal_order_id IS NOT NULL;

-- RLS
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit packages"
    ON credit_packages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credit packages"
    ON credit_packages FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Trigger for credit_packages updated_at
DROP TRIGGER IF EXISTS update_credit_packages_updated_at ON credit_packages;
CREATE TRIGGER update_credit_packages_updated_at
    BEFORE UPDATE ON credit_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GENERATIONS TABLE
-- AI headshot generation records
-- ============================================
CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    plan_type TEXT NOT NULL DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'premium')),
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
    error_message TEXT,
    
    -- 新增字段：关联信用包
    credit_package_id UUID REFERENCES credit_packages(id) ON DELETE SET NULL,
    credits_used INTEGER DEFAULT 0
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
CREATE INDEX idx_generations_credit_package_id ON generations(credit_package_id);

-- ============================================
-- CREDIT TRANSACTIONS TABLE
-- Canonical credit ledger for user-facing records
-- ============================================
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credit_package_id UUID REFERENCES credit_packages(id) ON DELETE SET NULL,
    generation_id UUID REFERENCES generations(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL CHECK (
        transaction_type IN (
            'credit_added',
            'credit_used',
            'credit_refunded',
            'credit_expired',
            'manual_adjustment',
            'package_renewed'
        )
    ),
    amount_delta INTEGER NOT NULL,
    balance_after INTEGER,
    package_remaining_after INTEGER,
    description TEXT,
    source TEXT NOT NULL DEFAULT 'system',
    source_key TEXT,
    metadata JSONB DEFAULT '{}',
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_transactions_source_key_unique
    ON credit_transactions(source_key);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_time ON credit_transactions(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_package ON credit_transactions(credit_package_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_generation ON credit_transactions(generation_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit transactions"
    ON credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credit transactions"
    ON credit_transactions FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- BUTTON CLICK LOGS TABLE
-- Analytics for marketing and pricing page button clicks
-- ============================================
CREATE TABLE IF NOT EXISTS button_click_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    button_type TEXT NOT NULL,
    source TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE button_click_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all button click logs"
    ON button_click_logs FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE INDEX idx_button_click_logs_clicked_at ON button_click_logs(clicked_at DESC);
CREATE INDEX idx_button_click_logs_button_type ON button_click_logs(button_type);
CREATE INDEX idx_button_click_logs_source ON button_click_logs(source);
CREATE INDEX idx_button_click_logs_user_id ON button_click_logs(user_id);

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
-- Generation status: processing, completed, failed
-- Credit package status: inactive, active, expired, depleted
-- Plan types: basic, pro, premium
