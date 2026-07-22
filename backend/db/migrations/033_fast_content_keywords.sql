CREATE TABLE IF NOT EXISTS fast_content_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  keyword TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  blog_slug TEXT,
  prompt TEXT,
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fast_content_keywords_locale_check CHECK (locale IN ('en', 'es', 'fr', 'de', 'ja')),
  CONSTRAINT fast_content_keywords_status_check CHECK (status IN ('pending', 'generating', 'draft', 'failed', 'published')),
  CONSTRAINT fast_content_keywords_keyword_check CHECK (char_length(trim(keyword)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fast_content_keywords_locale_keyword
  ON fast_content_keywords (locale, lower(trim(keyword)));

CREATE INDEX IF NOT EXISTS idx_fast_content_keywords_locale_status_updated
  ON fast_content_keywords (locale, status, updated_at DESC);

CREATE OR REPLACE FUNCTION set_fast_content_keywords_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fast_content_keywords_updated_at ON fast_content_keywords;
CREATE TRIGGER trg_fast_content_keywords_updated_at
  BEFORE UPDATE ON fast_content_keywords
  FOR EACH ROW
  EXECUTE FUNCTION set_fast_content_keywords_updated_at();
