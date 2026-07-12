-- Migration: 031_photo_process_results
-- Description: Store backend photo post-processing tasks for mini-program orders.

BEGIN;

CREATE TABLE IF NOT EXISTS photo_process_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    openid TEXT NOT NULL,
    orderid TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('idphoto', 'portrait')),
    source_task_id TEXT,
    suit_color TEXT,
    input_urls TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'processing',
    progress INTEGER NOT NULL DEFAULT 0,
    current_step TEXT,
    preview_urls TEXT[] NOT NULL DEFAULT '{}',
    id_photo_urls JSONB NOT NULL DEFAULT '{}',
    layout_urls JSONB NOT NULL DEFAULT '{}',
    zip_url TEXT,
    error_message TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_photo_process_results_orderid
    ON photo_process_results(orderid);

CREATE INDEX IF NOT EXISTS idx_photo_process_results_status
    ON photo_process_results(status);

CREATE INDEX IF NOT EXISTS idx_photo_process_results_created_at
    ON photo_process_results(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_photo_process_results_order_type
    ON photo_process_results(orderid, type);

ALTER TABLE photo_process_results ENABLE ROW LEVEL SECURITY;

COMMIT;
