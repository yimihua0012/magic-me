-- Migration: 033_internal_human_segmentation_tasks
-- Description: Store internal human segmentation and clothing-processing tasks separately.

BEGIN;

CREATE TABLE IF NOT EXISTS internal_human_segmentation_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    orderid TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    input_photo TEXT NOT NULL,
    prepared_input_photo TEXT,
    request_config JSONB NOT NULL DEFAULT '{}',
    output_urls JSONB NOT NULL DEFAULT '{}',
    zip_url TEXT,
    progress INTEGER NOT NULL DEFAULT 0,
    current_step TEXT,
    error_message TEXT,
    model TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_internal_human_segmentation_orderid
    ON internal_human_segmentation_tasks(orderid);

CREATE INDEX IF NOT EXISTS idx_internal_human_segmentation_status
    ON internal_human_segmentation_tasks(status);

CREATE INDEX IF NOT EXISTS idx_internal_human_segmentation_created_at
    ON internal_human_segmentation_tasks(created_at DESC);

ALTER TABLE internal_human_segmentation_tasks ENABLE ROW LEVEL SECURITY;

COMMIT;
