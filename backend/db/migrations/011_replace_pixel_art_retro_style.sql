-- Migration: 011_replace_pixel_art_retro_style
-- Description: Replace the Pixel Art Retro style with a more photorealistic vintage editorial style.

UPDATE headshot_styles
SET
  name = 'Vintage Editorial',
  prompt = 'vintage editorial portrait, classic magazine photography, refined retro wardrobe, cinematic film tones, elegant composition, soft studio lighting, premium fashion portrait',
  negative = 'pixel art, 16-bit, low resolution, blocky pixels, cartoon, video game style, blurry, distorted face',
  updated_at = NOW()
WHERE id = 'pixel_art_retro';
