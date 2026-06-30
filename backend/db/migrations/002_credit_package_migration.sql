-- ============================================
-- Credit Package Migration
-- 从旧的 pending generations 模式迁移到新的 credit_packages 模式
-- ============================================

-- 1. 创建 credit_packages 表
CREATE TABLE IF NOT EXISTS credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 套餐信息
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'pro', 'premium')),
    total_credits INTEGER NOT NULL,
    remaining_credits INTEGER NOT NULL,
    
    -- 有效期（从第一次生成开始计算）
    purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    validity_days INTEGER NOT NULL,
    
    -- 支付信息
    stripe_payment_id TEXT,
    lemon_order_id TEXT,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- 状态
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'expired', 'depleted')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_credit_packages_user_id ON credit_packages(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_packages_status ON credit_packages(status);
CREATE INDEX IF NOT EXISTS idx_credit_packages_expires_at ON credit_packages(expires_at);

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

-- 2. 修改 generations 表
-- 移除 pending 状态，新增 credit_package_id 和 credits_used 字段

-- 修改 status CHECK 约束（移除 pending）
ALTER TABLE generations DROP CONSTRAINT IF EXISTS generations_status_check;
ALTER TABLE generations ADD CONSTRAINT generations_status_check 
    CHECK (status IN ('processing', 'completed', 'failed'));

-- 修改 plan_type CHECK 约束（添加 premium，移除 enterprise）
ALTER TABLE generations DROP CONSTRAINT IF EXISTS generations_plan_type_check;
ALTER TABLE generations ADD CONSTRAINT generations_plan_type_check 
    CHECK (plan_type IN ('basic', 'pro', 'premium'));

-- 新增字段
ALTER TABLE generations ADD COLUMN IF NOT EXISTS credit_package_id UUID REFERENCES credit_packages(id) ON DELETE SET NULL;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_generations_credit_package_id ON generations(credit_package_id);

-- 3. 数据迁移：将现有 pending 记录转为 credit_package
-- 每条 pending 记录转为一个 basic 信用包（1次，30天有效期）
INSERT INTO credit_packages (
    user_id,
    plan_type,
    total_credits,
    remaining_credits,
    validity_days,
    stripe_payment_id,
    amount_paid,
    currency,
    status,
    purchased_at,
    created_at
)
SELECT 
    user_id,
    'basic' as plan_type,
    1 as total_credits,
    1 as remaining_credits,
    30 as validity_days,
    stripe_payment_id,
    amount_paid,
    currency,
    'inactive' as status,
    created_at as purchased_at,
    created_at
FROM generations
WHERE status = 'pending'
ON CONFLICT DO NOTHING;

-- 4. 删除所有 pending 记录（已转换为 credit_package）
DELETE FROM generations WHERE status = 'pending';

-- 5. 更新 profiles 表的 plan_type 约束
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_type_check 
    CHECK (plan_type IN ('basic', 'pro', 'premium'));

-- ============================================
-- Migration Complete
-- ============================================