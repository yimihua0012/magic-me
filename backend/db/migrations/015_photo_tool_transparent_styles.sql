-- Migration: 015_photo_tool_transparent_styles
-- Description: Add print portrait styles for My Center Photo Tools.

BEGIN;

INSERT INTO headshot_styles (
  id,
  name,
  category,
  prompt,
  negative,
  sort_order,
  is_active,
  category_order,
  style_order,
  selection_count,
  localized_names,
  localized_category_labels
)
VALUES
(
  'print_professional_transparent',
  'Professional Print Portrait',
  'photo_tools',
  'professional ID photo portrait for printing, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
  'colored background, blue background, red background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
  570,
  TRUE,
  5,
  10,
  0,
  '{"zh":"职业打印专用"}'::jsonb,
  '{"zh":"证件打印"}'::jsonb
),
(
  'print_child_id_transparent',
  'Child ID Portrait',
  'photo_tools',
  'child ID photo portrait for printing, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, high resolution',
  'adult appearance, colored background, blue background, red background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  580,
  TRUE,
  5,
  20,
  0,
  '{"zh":"儿童证件类型"}'::jsonb,
  '{"zh":"证件打印"}'::jsonb
),
(
  'print_student_id_transparent',
  'Student ID Portrait',
  'photo_tools',
  'student ID photo portrait for printing, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
  'colored background, blue background, red background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  590,
  TRUE,
  5,
  30,
  0,
  '{"zh":"学生证件类型"}'::jsonb,
  '{"zh":"证件打印"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  prompt = EXCLUDED.prompt,
  negative = EXCLUDED.negative,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  category_order = EXCLUDED.category_order,
  style_order = EXCLUDED.style_order,
  localized_names = EXCLUDED.localized_names,
  localized_category_labels = EXCLUDED.localized_category_labels,
  updated_at = NOW();

COMMIT;
