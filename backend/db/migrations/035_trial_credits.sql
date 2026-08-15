-- ============================================
-- Trial credit packages
-- 支持"先体验后付费"：credit_packages.kind 区分试用包与购买包
-- trial 包 plan_type 固定为 'basic'，仅通过 kind 区分，避免改动 plan_type CHECK。
-- ============================================

ALTER TABLE credit_packages ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'purchase'
    CHECK (kind IN ('purchase', 'trial'));

CREATE INDEX IF NOT EXISTS idx_credit_packages_user_kind
    ON credit_packages(user_id, kind)
    WHERE kind = 'trial';

-- ============================================
-- Migration Complete
-- ============================================