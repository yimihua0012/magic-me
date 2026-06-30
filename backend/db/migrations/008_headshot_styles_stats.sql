-- Migration: 008_headshot_styles_stats
-- Description: Add separate ordering and selection stats for headshot styles.

BEGIN;

ALTER TABLE headshot_styles
  ADD COLUMN IF NOT EXISTS category_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS style_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS selection_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_selected_at TIMESTAMP WITH TIME ZONE;

UPDATE headshot_styles
SET
  category_order = CASE category
    WHEN 'professional' THEN 1
    WHEN 'lifestyle' THEN 2
    WHEN 'artistic' THEN 3
    WHEN 'seasonal' THEN 4
    ELSE 9
  END,
  style_order = sort_order
WHERE category_order = 0 OR style_order = 0;

UPDATE headshot_styles
SET selection_count = CASE id
  WHEN 'linkedin_professional' THEN 128
  WHEN 'corporate_office' THEN 116
  WHEN 'business_casual' THEN 112
  WHEN 'executive_portrait' THEN 104
  WHEN 'clean_luxury_social' THEN 96
  WHEN 'modern_tech' THEN 90
  WHEN 'creator_headshot' THEN 88
  WHEN 'instagram_creator' THEN 84
  WHEN 'tiktok_trend' THEN 80
  WHEN 'streetwear_drop' THEN 74
  WHEN 'editorial_fashion' THEN 72
  WHEN 'cosplay_hero' THEN 66
  WHEN 'comic_book_style' THEN 64
  WHEN 'multiverse_adventure' THEN 60
  WHEN 'neon_dreamscape' THEN 58
  WHEN 'oriental_classic' THEN 56
  WHEN 'hanfu_elegance' THEN 54
  WHEN 'guofeng_portrait' THEN 52
  WHEN 'ink_wash_art' THEN 50
  WHEN 'imperial_portrait' THEN 48
  WHEN 'luxury_boutique' THEN 46
  WHEN 'minimal_studio' THEN 44
  WHEN 'startup_founder' THEN 42
  WHEN 'podcast_host' THEN 40
  WHEN 'travel_creator' THEN 38
  WHEN 'fitness_brand' THEN 36
  WHEN 'beauty_influencer' THEN 34
  WHEN 'music_artist' THEN 32
  WHEN 'fashion_portrait' THEN 30
  WHEN 'cinematic_portrait' THEN 28
  WHEN 'coffee_shop' THEN 26
  WHEN 'city_street' THEN 24
  WHEN 'beach_golden_hour' THEN 22
  WHEN 'autumn_park' THEN 20
  WHEN 'library_study' THEN 18
  WHEN 'garden_spring' THEN 16
  WHEN 'spring_blossom' THEN 14
  WHEN 'summer_sunshine' THEN 14
  WHEN 'autumn_foliage' THEN 12
  WHEN 'winter_snow' THEN 12
  WHEN 'black_white_classic' THEN 28
  WHEN 'vintage_film' THEN 26
  WHEN 'rembrandt_lighting' THEN 24
  WHEN 'soft_glamour' THEN 22
  WHEN 'oil_painting' THEN 20
  WHEN 'watercolor_art' THEN 18
  WHEN 'anime_illustration' THEN 18
  WHEN 'pixel_art_retro' THEN 16
  WHEN 'pop_art_comic' THEN 16
  WHEN 'cyberpunk_neon' THEN 20
  WHEN 'astronaut_space' THEN 14
  WHEN 'royal_portrait' THEN 12
  WHEN 'superhero_style' THEN 12
  ELSE 10
END
WHERE selection_count = 0;

CREATE INDEX IF NOT EXISTS idx_headshot_styles_category_order ON headshot_styles(category_order, style_order);
CREATE INDEX IF NOT EXISTS idx_headshot_styles_selection_count ON headshot_styles(selection_count DESC, last_selected_at DESC);

COMMIT;
