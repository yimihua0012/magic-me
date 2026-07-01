-- Migration: 012_headshot_styles_localization
-- Description: Add locale-specific display fields for headshot styles while keeping prompts and default names stable.

BEGIN;

ALTER TABLE headshot_styles
  ADD COLUMN IF NOT EXISTS localized_names JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS localized_category_labels JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN headshot_styles.name IS 'Default English display name. Generation prompts must keep using prompt/negative, not localized names.';
COMMENT ON COLUMN headshot_styles.localized_names IS 'Optional display-name translations keyed by locale, for example {"ja":"LinkedInプロフィール","de":"LinkedIn Profilbild"}.';
COMMENT ON COLUMN headshot_styles.localized_category_labels IS 'Optional display category labels keyed by locale. Category slugs remain in category.';

CREATE INDEX IF NOT EXISTS idx_headshot_styles_localized_names
  ON headshot_styles USING GIN (localized_names);

COMMIT;
