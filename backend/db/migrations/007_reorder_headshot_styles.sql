-- Migration: 007_reorder_headshot_styles
-- Description: Reorder headshot styles by popularity, keeping professional styles first.

BEGIN;

UPDATE headshot_styles SET sort_order = CASE id
  WHEN 'linkedin_professional' THEN 10
  WHEN 'corporate_office' THEN 20
  WHEN 'business_casual' THEN 30
  WHEN 'executive_portrait' THEN 40
  WHEN 'doctor_whitecoat' THEN 50
  WHEN 'modern_tech' THEN 60
  WHEN 'creative_agency' THEN 70
  WHEN 'clean_luxury_social' THEN 80
  WHEN 'creator_headshot' THEN 90
  WHEN 'instagram_creator' THEN 100
  WHEN 'tiktok_trend' THEN 110
  WHEN 'streetwear_drop' THEN 120
  WHEN 'editorial_fashion' THEN 130
  WHEN 'cosplay_hero' THEN 140
  WHEN 'comic_book_style' THEN 150
  WHEN 'multiverse_adventure' THEN 160
  WHEN 'neon_dreamscape' THEN 170
  WHEN 'oriental_classic' THEN 180
  WHEN 'hanfu_elegance' THEN 190
  WHEN 'guofeng_portrait' THEN 200
  WHEN 'ink_wash_art' THEN 210
  WHEN 'imperial_portrait' THEN 220
  WHEN 'luxury_boutique' THEN 230
  WHEN 'minimal_studio' THEN 240
  WHEN 'startup_founder' THEN 250
  WHEN 'podcast_host' THEN 260
  WHEN 'gamer_streamer' THEN 270
  WHEN 'travel_creator' THEN 280
  WHEN 'fitness_brand' THEN 290
  WHEN 'beauty_influencer' THEN 300
  WHEN 'music_artist' THEN 310
  WHEN 'fashion_portrait' THEN 320
  WHEN 'cinematic_portrait' THEN 330
  WHEN 'summer_sunshine' THEN 340
  WHEN 'beach_golden_hour' THEN 350
  WHEN 'city_street' THEN 360
  WHEN 'coffee_shop' THEN 370
  WHEN 'autumn_park' THEN 380
  WHEN 'library_study' THEN 390
  WHEN 'garden_spring' THEN 400
  WHEN 'spring_blossom' THEN 410
  WHEN 'autumn_foliage' THEN 420
  WHEN 'winter_snow' THEN 430
  WHEN 'black_white_classic' THEN 440
  WHEN 'vintage_film' THEN 450
  WHEN 'rembrandt_lighting' THEN 460
  WHEN 'soft_glamour' THEN 470
  WHEN 'oil_painting' THEN 480
  WHEN 'watercolor_art' THEN 490
  WHEN 'anime_illustration' THEN 500
  WHEN 'pixel_art_retro' THEN 510
  WHEN 'pop_art_comic' THEN 520
  WHEN 'cyberpunk_neon' THEN 530
  WHEN 'astronaut_space' THEN 540
  WHEN 'royal_portrait' THEN 550
  WHEN 'superhero_style' THEN 560
  ELSE sort_order
END,
updated_at = NOW();

COMMIT;
