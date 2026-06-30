-- ============================================
-- Credit Package Summary Performance
-- Speed up /api/credits summary queries by user/status/remaining/expiry.
-- ============================================

CREATE INDEX IF NOT EXISTS idx_credit_packages_user_status_remaining_expires
    ON credit_packages(user_id, status, remaining_credits, expires_at)
    WHERE remaining_credits > 0;
