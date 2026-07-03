-- Migration: 017_blog_cms
-- Description: Add database-backed blog content with locale-ready fields for ISR publishing.

BEGIN;

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL DEFAULT 'en',
  translation_group_id UUID NOT NULL DEFAULT gen_random_uuid(),
  source_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  intro TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_enhancement JSONB NOT NULL DEFAULT '{}'::jsonb,
  localized_slugs JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blog_posts_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT blog_posts_locale_check CHECK (locale IN ('en', 'es', 'fr', 'de', 'ja')),
  CONSTRAINT blog_posts_slug_check CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT blog_posts_unique_locale_slug UNIQUE (locale, slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_locale_published
  ON blog_posts (status, locale, published_at DESC, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_translation_group
  ON blog_posts (translation_group_id, locale);

CREATE OR REPLACE FUNCTION set_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_blog_posts_updated_at();

COMMIT;
