-- ============================================
-- Generation Idempotency
-- Prevent duplicate generation rows and credit deductions when a client retries.
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_generations_user_client_generation_id_unique
    ON generations(user_id, (metadata->>'clientGenerationId'))
    WHERE metadata->>'clientGenerationId' IS NOT NULL;
