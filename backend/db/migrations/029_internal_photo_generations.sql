-- Migration: 029_internal_photo_generations
-- Description: Store internal API photo generation tasks separately from user credit generations.

BEGIN;

CREATE TABLE IF NOT EXISTS internal_photo_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'processing',
    style_id TEXT,
    style_name TEXT,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    input_photos TEXT[] NOT NULL DEFAULT '{}',
    output_photos TEXT[] NOT NULL DEFAULT '{}',
    progress INTEGER NOT NULL DEFAULT 0,
    current_step TEXT,
    client_generation_id TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_internal_photo_generations_status
    ON internal_photo_generations(status);

CREATE INDEX IF NOT EXISTS idx_internal_photo_generations_created_at
    ON internal_photo_generations(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_internal_photo_generations_client_generation_id
    ON internal_photo_generations(client_generation_id)
    WHERE client_generation_id IS NOT NULL;

ALTER TABLE internal_photo_generations ENABLE ROW LEVEL SECURITY;

COMMIT;
