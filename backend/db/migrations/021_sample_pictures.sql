-- Migration: 021_sample_pictures
-- Description: Store SEO gallery sample pictures and localized image metadata.

BEGIN;

CREATE TABLE IF NOT EXISTS sample_picture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt TEXT NOT NULL,
  title TEXT NOT NULL,
  style_name TEXT NOT NULL,
  localized_alt JSONB NOT NULL DEFAULT '{}'::jsonb,
  localized_title JSONB NOT NULL DEFAULT '{}'::jsonb,
  localized_style_name JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sample_picture_active_order
  ON sample_picture(is_active, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sample_picture_style_name
  ON sample_picture(style_name);

CREATE INDEX IF NOT EXISTS idx_sample_picture_localized_alt
  ON sample_picture USING GIN (localized_alt);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sample-pictures',
  'sample-pictures',
  TRUE,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anyone can view sample pictures" ON storage.objects;
CREATE POLICY "Anyone can view sample pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sample-pictures');

DROP POLICY IF EXISTS "Service role can manage sample pictures" ON storage.objects;
CREATE POLICY "Service role can manage sample pictures"
  ON storage.objects FOR ALL
  USING (bucket_id = 'sample-pictures' AND auth.jwt()->>'role' = 'service_role')
  WITH CHECK (bucket_id = 'sample-pictures' AND auth.jwt()->>'role' = 'service_role');

COMMIT;
