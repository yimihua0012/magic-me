-- ============================================
-- Payment Idempotency Indexes
-- Prevent duplicate credit package creation on webhook retries.
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_packages_stripe_payment_id_unique
    ON credit_packages(stripe_payment_id)
    WHERE stripe_payment_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_packages_lemon_order_id_unique
    ON credit_packages(lemon_order_id)
    WHERE lemon_order_id IS NOT NULL;
