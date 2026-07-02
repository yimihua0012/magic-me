-- Migration: 016_photo_tool_white_background_prompts
-- Description: Convert Photo Tools generation prompts back to white-background portraits.

BEGIN;

UPDATE headshot_styles
SET
  prompt = 'professional ID photo portrait for printing, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
  negative = 'colored background, blue background, red background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
  updated_at = NOW()
WHERE id = 'print_professional_transparent';

UPDATE headshot_styles
SET
  prompt = 'child ID photo portrait for printing, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, high resolution',
  negative = 'adult appearance, colored background, blue background, red background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  updated_at = NOW()
WHERE id = 'print_child_id_transparent';

UPDATE headshot_styles
SET
  prompt = 'student ID photo portrait for printing, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
  negative = 'colored background, blue background, red background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  updated_at = NOW()
WHERE id = 'print_student_id_transparent';

COMMIT;
