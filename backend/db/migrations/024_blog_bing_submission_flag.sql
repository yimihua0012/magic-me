-- Migration: 024_blog_bing_submission_flag
-- Description: Track whether a CMS blog post has been submitted to Bing IndexNow.

BEGIN;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS submitted_to_bing BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_blog_posts_bing_submission
  ON blog_posts (status, submitted_to_bing, published_at DESC, updated_at DESC);

COMMIT;
