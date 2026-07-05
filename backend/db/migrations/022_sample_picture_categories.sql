-- Migration: 022_sample_picture_categories
-- Description: Add category grouping metadata to sample gallery pictures.

BEGIN;

ALTER TABLE sample_picture
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS localized_category JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_sample_picture_category_order
  ON sample_picture(category, sort_order, created_at DESC);

UPDATE sample_picture
SET category = 'General'
WHERE category IS NULL OR btrim(category) = '';

COMMIT;
