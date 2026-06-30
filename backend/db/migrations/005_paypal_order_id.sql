-- ============================================
-- PayPal Payment Idempotency
-- Link captured PayPal orders to credit packages.
-- ============================================

ALTER TABLE credit_packages
    ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_packages_paypal_order_id_unique
    ON credit_packages(paypal_order_id)
    WHERE paypal_order_id IS NOT NULL;
