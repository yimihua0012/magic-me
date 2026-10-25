-- ============================================
-- Prevent duplicate trial packages under concurrent requests.
--
-- The application performs a read-before-insert. Two concurrent calls can
-- both observe no trial package and both insert one. This migration first
-- deactivates historical duplicates, then adds a database-level invariant.
--
-- Duplicate handling:
-- 1. Keep the active trial with remaining credits when possible.
-- 2. Otherwise keep the earliest trial so history remains deterministic.
-- 3. Archive other duplicates as trial_duplicate, mark them depleted, and
--    clear their remaining credits. Keeping the rows preserves audit history
--    and foreign-key references without granting duplicate credits.
-- 4. Record removed remaining credits in the ledger when applicable.
-- ============================================

BEGIN;

-- Prevent application writes between deduplication and unique-index creation.
LOCK TABLE credit_packages IN SHARE ROW EXCLUSIVE MODE;

ALTER TABLE credit_packages
    DROP CONSTRAINT IF EXISTS credit_packages_kind_check;

ALTER TABLE credit_packages
    ADD CONSTRAINT credit_packages_kind_check
    CHECK (kind IN ('purchase', 'trial', 'trial_duplicate'));

WITH ranked_trials AS (
    SELECT
        id,
        user_id,
        remaining_credits,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY
                CASE
                    WHEN status = 'active' AND remaining_credits > 0 THEN 0
                    WHEN status = 'inactive' AND remaining_credits > 0 THEN 1
                    ELSE 2
                END,
                created_at ASC,
                id ASC
        ) AS duplicate_rank
    FROM credit_packages
    WHERE kind = 'trial'
),
duplicates AS (
    SELECT id, user_id, remaining_credits
    FROM ranked_trials
    WHERE duplicate_rank > 1
)
INSERT INTO credit_transactions (
    user_id,
    credit_package_id,
    transaction_type,
    amount_delta,
    package_remaining_after,
    description,
    source,
    source_key,
    metadata,
    occurred_at
)
SELECT
    user_id,
    id,
    'manual_adjustment',
    -remaining_credits,
    0,
    'Duplicate trial package deactivated',
    'trial_deduplication',
    'package:trial:dedupe:' || id,
    jsonb_build_object(
        'reason', 'duplicate_trial_package',
        'remainingCreditsRemoved', remaining_credits
    ),
    NOW()
FROM duplicates
WHERE remaining_credits > 0
ON CONFLICT (source_key) DO NOTHING;

WITH ranked_trials AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY
                CASE
                    WHEN status = 'active' AND remaining_credits > 0 THEN 0
                    WHEN status = 'inactive' AND remaining_credits > 0 THEN 1
                    ELSE 2
                END,
                created_at ASC,
                id ASC
        ) AS duplicate_rank
    FROM credit_packages
    WHERE kind = 'trial'
)
UPDATE credit_packages AS package
SET
    kind = 'trial_duplicate',
    status = 'depleted',
    remaining_credits = 0,
    updated_at = NOW()
FROM ranked_trials
WHERE
    package.id = ranked_trials.id
    AND ranked_trials.duplicate_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_packages_one_trial_per_user
    ON credit_packages(user_id)
    WHERE kind = 'trial';

COMMIT;
