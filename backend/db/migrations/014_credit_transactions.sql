-- ============================================
-- Credit Transactions
-- Canonical user-facing credit ledger.
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

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_time
    ON credit_transactions(user_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_package
    ON credit_transactions(credit_package_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_generation
    ON credit_transactions(generation_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_type
    ON credit_transactions(transaction_type);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit transactions"
    ON credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credit transactions"
    ON credit_transactions FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Backfill package purchase/manual grant records.
INSERT INTO credit_transactions (
    user_id,
    credit_package_id,
    transaction_type,
    amount_delta,
    balance_after,
    package_remaining_after,
    description,
    source,
    source_key,
    metadata,
    occurred_at,
    created_at
)
SELECT
    pkg.user_id,
    pkg.id,
    'credit_added',
    pkg.total_credits,
    NULL,
    pkg.remaining_credits,
    CONCAT(pkg.plan_type, ' credit package added'),
    CASE
        WHEN pkg.stripe_payment_id IS NOT NULL THEN 'stripe'
        WHEN pkg.paypal_order_id IS NOT NULL THEN 'paypal'
        WHEN pkg.lemon_order_id IS NOT NULL THEN 'lemon'
        ELSE 'manual'
    END,
    CONCAT('package:add:', pkg.id),
    jsonb_build_object(
        'planType', pkg.plan_type,
        'paymentId', COALESCE(pkg.stripe_payment_id, pkg.paypal_order_id, pkg.lemon_order_id),
        'status', pkg.status
    ),
    COALESCE(pkg.purchased_at, pkg.created_at, NOW()),
    COALESCE(pkg.created_at, NOW())
FROM credit_packages pkg
ON CONFLICT (source_key) DO NOTHING;

-- Backfill generation credit usage records.
INSERT INTO credit_transactions (
    user_id,
    credit_package_id,
    generation_id,
    transaction_type,
    amount_delta,
    balance_after,
    package_remaining_after,
    description,
    source,
    source_key,
    metadata,
    occurred_at,
    created_at
)
SELECT
    gen.user_id,
    gen.credit_package_id,
    gen.id,
    'credit_used',
    -GREATEST(COALESCE(gen.credits_used, gen.style_count, 0), 0),
    NULL,
    NULL,
    CONCAT(COALESCE(gen.style_count, 0), ' styles generated'),
    'generation',
    CONCAT('generation:use:', gen.id),
    jsonb_build_object(
        'status', gen.status,
        'styleCount', gen.style_count,
        'creditsUsed', gen.credits_used
    ),
    COALESCE(gen.completed_at, gen.updated_at, gen.created_at, NOW()),
    COALESCE(gen.created_at, NOW())
FROM generations gen
WHERE GREATEST(COALESCE(gen.credits_used, gen.style_count, 0), 0) > 0
ON CONFLICT (source_key) DO NOTHING;

-- Backfill expired remaining credits.
INSERT INTO credit_transactions (
    user_id,
    credit_package_id,
    transaction_type,
    amount_delta,
    balance_after,
    package_remaining_after,
    description,
    source,
    source_key,
    metadata,
    occurred_at,
    created_at
)
SELECT
    pkg.user_id,
    pkg.id,
    'credit_expired',
    -pkg.remaining_credits,
    NULL,
    pkg.remaining_credits,
    CONCAT(pkg.plan_type, ' package expired'),
    'system',
    CONCAT('package:expire:', pkg.id),
    jsonb_build_object('planType', pkg.plan_type, 'status', pkg.status),
    COALESCE(pkg.expires_at, pkg.updated_at, NOW()),
    NOW()
FROM credit_packages pkg
WHERE pkg.status = 'expired'
  AND pkg.remaining_credits > 0
ON CONFLICT (source_key) DO NOTHING;
