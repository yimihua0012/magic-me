-- Migration: 030_internal_background_removals
-- Description: Store internal API background removal tasks separately from metered user photo tools.

BEGIN;

CREATE TABLE IF NOT EXISTS internal_background_removals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'processing',
    input_photo TEXT NOT NULL,
    prepared_input_photo TEXT,
    output_photo TEXT,
    progress INTEGER NOT NULL DEFAULT 0,
    current_step TEXT,
    client_task_id TEXT,
    error_message TEXT,
    model TEXT,
    metrics JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_internal_background_removals_status
    ON internal_background_removals(status);

CREATE INDEX IF NOT EXISTS idx_internal_background_removals_created_at
    ON internal_background_removals(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_internal_background_removals_client_task_id
    ON internal_background_removals(client_task_id)
    WHERE client_task_id IS NOT NULL;

ALTER TABLE internal_background_removals ENABLE ROW LEVEL SECURITY;

COMMIT;
