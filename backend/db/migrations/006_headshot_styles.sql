-- Migration: 006_headshot_styles
-- Description: Store headshot styles in database so UI and generation prompts can be managed without code changes.

BEGIN;

CREATE TABLE IF NOT EXISTS headshot_styles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    prompt TEXT NOT NULL,
    negative TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_headshot_styles_active ON headshot_styles(is_active, sort_order);

INSERT INTO headshot_styles (id, name, category, prompt, negative, sort_order, is_active)
VALUES
('linkedin_professional', 'LinkedIn Professional', 'professional', 'professional corporate headshot, linkedin profile photo, business suit, studio lighting, clean white background, confident friendly smile, canon dslr, 85mm lens', 'casual clothes, outdoor, messy hair, dark shadows, blurry, low quality, distorted face, bad anatomy, multiple people', 10, TRUE),
('corporate_office', 'Corporate Office', 'professional', 'corporate business portrait, modern office background, business attire, professional lighting, confident pose, high-end corporate photography', 'casual, messy, unprofessional, dark, blurry, distorted face', 20, TRUE),
('business_casual', 'Business Casual', 'professional', 'business casual portrait, smart casual attire, relaxed professional look, modern startup vibe, natural lighting, friendly expression', 'formal suit, overly corporate, stiff pose, dark, blurry', 30, TRUE),
('executive_portrait', 'Executive Portrait', 'professional', 'executive headshot, c-level executive, confident powerful pose, luxury office background, dramatic lighting, high-end professional photography', 'casual, young, inexperienced, messy, unprofessional, blurry', 40, TRUE),
('doctor_whitecoat', 'Doctor Whitecoat', 'professional', 'medical professional portrait, white coat, stethoscope, clean clinical background, trustworthy expression, healthcare professional', 'casual clothes, messy, unprofessional, dark, distorted face', 50, TRUE),
('modern_tech', 'Modern Tech', 'professional', 'tech professional portrait, modern tech office, casual tech attire, startup environment, natural lighting, friendly smile', 'formal suit, corporate, outdated, dark, blurry', 60, TRUE),
('creative_agency', 'Creative Agency', 'professional', 'creative professional portrait, modern creative agency, trendy stylish outfit, artistic background, vibrant colors, confident creative look', 'corporate suit, boring, dull, dark, blurry', 70, TRUE),
('oil_painting', 'Oil Painting', 'artistic', 'classical oil painting portrait, van gogh style, thick brushstrokes, impasto technique, artistic, textured canvas, museum quality fine art', 'photograph, digital art, smooth, 3d render, photography, modern, pixel perfect, clean lines', 80, TRUE),
('watercolor_art', 'Watercolor Art', 'artistic', 'watercolor portrait painting, soft watercolor wash, delicate brushwork, artistic, elegant, fine art, gallery quality', 'photograph, digital art, sharp lines, 3d render, modern, pixel perfect', 90, TRUE),
('anime_illustration', 'Anime Illustration', 'artistic', 'studio ghibli anime portrait, soft watercolor background, gentle expression, hand drawn animation style, beautiful illustration, pastel colors, whimsical', 'realistic, 3d, photograph, dark, scary, horror, mature, photorealistic', 100, TRUE),
('cyberpunk_neon', 'Cyberpunk Neon', 'artistic', 'cyberpunk portrait, neon lights, futuristic city background, tech wear, holographic elements, night, high contrast, edgy, blade runner aesthetic', 'daylight, natural, rural, vintage, historical, bright sunny, countryside', 110, TRUE),
('pixel_art_retro', 'Pixel Art Retro', 'artistic', 'retro pixel art portrait, 16-bit video game style, nostalgic, colorful pixels, retro gaming aesthetic, 80s 90s style', 'photograph, modern, realistic, 3d, high resolution, smooth', 120, TRUE),
('pop_art_comic', 'Pop Art Comic', 'artistic', 'pop art portrait, andy warhol style, bold colors, comic book aesthetic, vibrant, graphic design, art museum quality', 'photograph, realistic, dark, dull, muted colors, boring', 130, TRUE),
('coffee_shop', 'Coffee Shop', 'lifestyle', 'cozy coffee shop portrait, warm atmosphere, casual outfit, relaxed smile, soft natural lighting, urban café background', 'formal, corporate, dark, cold, harsh lighting, studio', 140, TRUE),
('beach_golden_hour', 'Beach Golden Hour', 'lifestyle', 'beach portrait, golden hour sunset, ocean waves background, linen white shirt, warm lighting, relaxed natural smile, shallow depth of field, 8k', 'studio, formal suit, winter, snow, dark, indoor, harsh lighting, overcast', 150, TRUE),
('autumn_park', 'Autumn Park', 'lifestyle', 'autumn park portrait, fallen leaves, warm orange tones, cozy sweater, gentle smile, golden autumn light, peaceful atmosphere', 'summer, beach, bright sun, harsh lighting, cold winter, studio', 160, TRUE),
('city_street', 'City Street', 'lifestyle', 'urban street portrait, city background, stylish casual outfit, street photography style, candid natural pose, modern city vibe', 'studio, formal, boring background, dark, blurry', 170, TRUE),
('library_study', 'Library Study', 'lifestyle', 'library portrait, bookshelf background, intellectual look, cozy sweater, gentle expression, warm lighting, studious atmosphere', 'casual, party, bright neon, modern tech, dark, blurry', 180, TRUE),
('garden_spring', 'Garden Spring', 'lifestyle', 'spring garden portrait, cherry blossoms, floral background, pastel colors, soft dress, gentle smile, fresh spring atmosphere', 'winter, dark, cold, formal suit, studio, harsh lighting', 190, TRUE),
('spring_blossom', 'Spring Blossom', 'seasonal', 'spring portrait, cherry blossoms, pink flowers, soft pastel colors, gentle lighting, fresh spring atmosphere, floral background', 'winter, dark, cold, harsh lighting, autumn, summer heat', 200, TRUE),
('summer_sunshine', 'Summer Sunshine', 'seasonal', 'summer portrait, bright sunshine, warm golden tones, casual summer outfit, beach or park setting, happy smile, vibrant energy', 'winter, cold, dark, studio, formal, overcast', 210, TRUE),
('autumn_foliage', 'Autumn Foliage', 'seasonal', 'autumn portrait, golden autumn leaves, warm orange red tones, cozy sweater, gentle smile, fall atmosphere', 'summer, beach, bright sun, winter snow, studio', 220, TRUE),
('winter_snow', 'Winter Snow', 'seasonal', 'winter portrait, gentle snowfall, cozy winter coat, rosy cheeks, soft magical lighting, snowflakes, warm smile, fairytale atmosphere', 'summer, beach, hot, sweating, bright sun, tropical, shorts, sand', 230, TRUE),
('black_white_classic', 'Black & White Classic', 'artistic', 'timeless black and white portrait, high contrast, film noir style, dramatic shadows, classic hollywood, leica monochrome, fine art photography', 'color, neon, modern digital effects, filters, overexposed, flat lighting', 240, TRUE),
('vintage_film', 'Vintage Film', 'artistic', 'vintage film portrait, film grain texture, retro colors, nostalgic feel, 1950s 1960s style, warm tones, classic photography', 'modern digital, high tech, neon, futuristic, clean digital art', 250, TRUE),
('rembrandt_lighting', 'Rembrandt Lighting', 'artistic', 'rembrandt lighting portrait, dramatic chiaroscuro, classical painting style, theatrical lighting, fine art portrait, museum quality', 'flat lighting, bright even lighting, modern digital, casual, boring', 260, TRUE),
('soft_glamour', 'Soft Glamour', 'artistic', 'soft glamour portrait, soft diffused lighting, elegant pose, glamorous look, professional makeup, high-end beauty photography', 'harsh lighting, casual, unprofessional, dark, blurry, distorted', 270, TRUE),
('superhero_style', 'Superhero', 'artistic', 'superhero movie poster portrait, marvel style, dramatic lighting, dynamic pose, cape, heroic, cinematic, epic, professional cosplay quality', 'casual, everyday, normal clothes, boring, dull, ordinary background', 280, TRUE),
('royal_portrait', 'Royal Portrait', 'artistic', 'royal portrait painting, classical renaissance style, regal attire, crown, luxurious background, oil painting texture, museum masterpiece', 'modern, casual, everyday, boring, plain background, digital art', 290, TRUE),
('astronaut_space', 'Astronaut Space', 'artistic', 'astronaut portrait, space background, stars galaxies, space suit, helmet, sci-fi aesthetic, cinematic, epic space exploration', 'earth, normal clothes, casual, boring, plain background, dark', 300, TRUE),
('comic_book_style', 'Comic Book Style', 'artistic', 'bold comic book portrait, clean ink outlines, vibrant color palette, dynamic framing, modern graphic novel aesthetic, expressive lighting, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 310, TRUE),
('multiverse_adventure', 'Multiverse Adventure', 'artistic', 'multiverse adventure portrait, portal glow, layered reality, cinematic energy, futuristic wardrobe, vivid color contrast, imaginative storytelling, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 320, TRUE),
('cosplay_hero', 'Cosplay Hero', 'artistic', 'cosplay portrait, convention style character look, detailed costume design, dramatic lighting, confident pose, polished makeup, high detail, social media ready', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 330, TRUE),
('instagram_creator', 'Instagram Creator', 'lifestyle', 'instagram creator portrait, polished social media aesthetic, clean composition, trendy outfit, bright natural light, confident expression, modern lifestyle branding', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 340, TRUE),
('tiktok_trend', 'TikTok Trend', 'lifestyle', 'tiktok trend portrait, playful social media energy, vibrant styling, expressive pose, eye-catching colors, modern creator look, polished finish', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 350, TRUE),
('editorial_fashion', 'Editorial Fashion', 'artistic', 'editorial fashion portrait, high-end magazine styling, runway-inspired pose, refined lighting, premium wardrobe, striking composition, luxury aesthetic', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 360, TRUE),
('streetwear_drop', 'Streetwear Drop', 'lifestyle', 'streetwear portrait, urban fashion styling, clean sneakers, relaxed pose, modern city backdrop, bold but polished social media look, crisp details', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 370, TRUE),
('neon_dreamscape', 'Neon Dreamscape', 'artistic', 'neon dreamscape portrait, vivid glow, futuristic color accents, glossy highlights, cinematic atmosphere, modern digital art, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 380, TRUE),
('luxury_boutique', 'Luxury Boutique', 'lifestyle', 'luxury boutique portrait, refined styling, soft premium lighting, elegant wardrobe, polished social media aesthetic, upscale modern portrait, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 390, TRUE),
('minimal_studio', 'Minimal Studio', 'professional', 'minimal studio portrait, clean background, soft directional lighting, understated wardrobe, modern personal brand aesthetic, crisp composition, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 400, TRUE),
('startup_founder', 'Startup Founder', 'professional', 'startup founder portrait, modern office vibe, relaxed confidence, smart casual wardrobe, clean branding, contemporary headshot, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 410, TRUE),
('podcast_host', 'Podcast Host', 'lifestyle', 'podcast host portrait, conversational media branding, cozy studio vibe, confident expression, polished microphone-side aesthetic, modern creator look, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 420, TRUE),
('gamer_streamer', 'Gamer Streamer', 'lifestyle', 'gamer streamer portrait, streaming setup glow, neon accents, expressive personality, modern creator branding, polished digital aesthetic, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 430, TRUE),
('travel_creator', 'Travel Creator', 'lifestyle', 'travel creator portrait, wanderlust branding, sunlit outdoor setting, casual stylish outfit, vibrant destination feel, polished social media portrait, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 440, TRUE),
('fitness_brand', 'Fitness Brand', 'lifestyle', 'fitness brand portrait, athletic styling, clean daylight, confident pose, modern wellness branding, crisp and energetic portrait, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 450, TRUE),
('beauty_influencer', 'Beauty Influencer', 'artistic', 'beauty influencer portrait, polished makeup, soft glow lighting, premium editorial styling, refined composition, social media ready portrait, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 460, TRUE),
('music_artist', 'Music Artist', 'artistic', 'music artist portrait, expressive stage-inspired lighting, fashion-forward styling, cinematic mood, creative personal brand, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 470, TRUE),
('fashion_portrait', 'Fashion Portrait', 'artistic', 'fashion portrait, editorial wardrobe, runway-inspired attitude, elegant lighting, striking composition, premium magazine aesthetic, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 480, TRUE),
('creator_headshot', 'Creator Headshot', 'professional', 'creator headshot, modern personal brand portrait, clean composition, approachable confidence, polished social media profile look, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 490, TRUE),
('cinematic_portrait', 'Cinematic Portrait', 'artistic', 'cinematic portrait, dramatic yet refined lighting, film-inspired color grading, modern portrait storytelling, polished high detail finish', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 500, TRUE),
('oriental_classic', 'Oriental Classic', 'artistic', 'oriental classic portrait, elegant eastern aesthetic, refined traditional styling, soft warm lighting, graceful posture, timeless cultural portrait, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 510, TRUE),
('hanfu_elegance', 'Hanfu Elegance', 'artistic', 'hanfu portrait, traditional Chinese clothing, delicate fabric layers, graceful pose, poetic atmosphere, soft natural light, refined cultural styling, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 520, TRUE),
('ink_wash_art', 'Ink Wash Art', 'artistic', 'ink wash portrait, shui-mo inspired aesthetic, monochrome brush texture, serene composition, artistic minimalism, cultural elegance, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 530, TRUE),
('guofeng_portrait', 'Guofeng Portrait', 'artistic', 'guofeng portrait, modern chinese style, elegant traditional motifs, rich yet tasteful color palette, refined cultural branding, polished portrait, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 540, TRUE),
('imperial_portrait', 'Imperial Portrait', 'artistic', 'imperial portrait, classical eastern royal aesthetic, ornate styling, dignified posture, luxurious traditional details, cinematic elegance, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 550, TRUE),
('clean_luxury_social', 'Clean Luxury Social', 'lifestyle', 'clean luxury social portrait, polished modern aesthetic, neutral tones, premium wardrobe, soft natural light, elegant personal branding, high detail', 'low quality, blurry, distorted face, extra limbs, extra fingers, watermark, text, cropped image', 560, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  prompt = EXCLUDED.prompt,
  negative = EXCLUDED.negative,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

COMMIT;
