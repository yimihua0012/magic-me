-- Remove real-world space agency and national-symbol cues from Astronaut Space.
UPDATE headshot_styles
SET
  prompt = 'breathtaking cinematic astronaut portrait, deep starfield and glowing nebula backdrop, sleek generic space suit, reflective helmet details, blue-white rim lighting, stunning sci-fi exploration mood, beautiful cosmic atmosphere, no real-world agency branding, no national symbols',
  negative = 'NASA logo, NASA text, space agency logo, national flag, flag patch, country flag, official insignia, mission patch, government emblem, earth, normal clothes, casual, boring, plain background, text, watermark',
  updated_at = NOW()
WHERE id = 'astronaut_space';
