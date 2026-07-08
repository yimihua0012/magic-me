-- Migration: 025_blog_auto_publish_flag
-- Description: Track blog posts published by the hourly auto-publish cron.

BEGIN;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS auto_published BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_blog_posts_auto_publish
  ON blog_posts (status, auto_published, published_at DESC, updated_at DESC);

COMMIT;
