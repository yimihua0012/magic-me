-- Migration: 027_photo_tool_background_color_png_styles
-- Description: Add blue/red ID Photo PNG styles and clarify existing white-background PNG styles.

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
  'print_professional_blue_png',
  'Professional ID Photo PNG (Blue Background)',
  'photo_tools',
  'professional ID photo portrait for printing and PNG export, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid blue ID photo background, official document photo blue backdrop, high resolution',
  'white background, red background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
  580,
  TRUE,
  5,
  20,
  0,
  jsonb_build_object('en', 'Professional ID Photo PNG (Blue Background)', 'es', 'Foto profesional de documento PNG con fondo azul', 'fr', 'Photo d''identite professionnelle PNG sur fond bleu', 'de', 'Professionelles Passfoto PNG mit blauem Hintergrund', 'ja', '青背景のビジネス証明写真 PNG'),
  jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG')
),
(
  'print_professional_red_png',
  'Professional ID Photo PNG (Red Background)',
  'photo_tools',
  'professional ID photo portrait for printing and PNG export, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid red ID photo background, official document photo red backdrop, high resolution',
  'white background, blue background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
  590,
  TRUE,
  5,
  30,
  0,
  jsonb_build_object('en', 'Professional ID Photo PNG (Red Background)', 'es', 'Foto profesional de documento PNG con fondo rojo', 'fr', 'Photo d''identite professionnelle PNG sur fond rouge', 'de', 'Professionelles Passfoto PNG mit rotem Hintergrund', 'ja', '赤背景のビジネス証明写真 PNG'),
  jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG')
),
(
  'print_child_id_blue_png',
  'Child ID Photo PNG (Blue Background)',
  'photo_tools',
  'child ID photo portrait for printing and PNG export, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean solid blue ID photo background, official document photo blue backdrop, high resolution',
  'adult appearance, white background, red background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  610,
  TRUE,
  5,
  50,
  0,
  jsonb_build_object('en', 'Child ID Photo PNG (Blue Background)', 'es', 'Foto infantil de documento PNG con fondo azul', 'fr', 'Photo d''identite enfant PNG sur fond bleu', 'de', 'Kinder-Passfoto PNG mit blauem Hintergrund', 'ja', '青背景の子ども証明写真 PNG'),
  jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG')
),
(
  'print_child_id_red_png',
  'Child ID Photo PNG (Red Background)',
  'photo_tools',
  'child ID photo portrait for printing and PNG export, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean solid red ID photo background, official document photo red backdrop, high resolution',
  'adult appearance, white background, blue background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  620,
  TRUE,
  5,
  60,
  0,
  jsonb_build_object('en', 'Child ID Photo PNG (Red Background)', 'es', 'Foto infantil de documento PNG con fondo rojo', 'fr', 'Photo d''identite enfant PNG sur fond rouge', 'de', 'Kinder-Passfoto PNG mit rotem Hintergrund', 'ja', '赤背景の子ども証明写真 PNG'),
  jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG')
),
(
  'print_student_id_blue_png',
  'Student ID Photo PNG (Blue Background)',
  'photo_tools',
  'student ID photo portrait for printing and PNG export, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid blue ID photo background, official document photo blue backdrop, high resolution',
  'white background, red background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  640,
  TRUE,
  5,
  80,
  0,
  jsonb_build_object('en', 'Student ID Photo PNG (Blue Background)', 'es', 'Foto de estudiante PNG con fondo azul', 'fr', 'Photo etudiante PNG sur fond bleu', 'de', 'Studenten-Passfoto PNG mit blauem Hintergrund', 'ja', '青背景の学生証明写真 PNG'),
  jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG')
),
(
  'print_student_id_red_png',
  'Student ID Photo PNG (Red Background)',
  'photo_tools',
  'student ID photo portrait for printing and PNG export, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid red ID photo background, official document photo red backdrop, high resolution',
  'white background, blue background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  650,
  TRUE,
  5,
  90,
  0,
  jsonb_build_object('en', 'Student ID Photo PNG (Red Background)', 'es', 'Foto de estudiante PNG con fondo rojo', 'fr', 'Photo etudiante PNG sur fond rouge', 'de', 'Studenten-Passfoto PNG mit rotem Hintergrund', 'ja', '赤背景の学生証明写真 PNG'),
  jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG')
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

WITH updates(id, name, prompt, negative, sort_order, style_order, localized_names) AS (
  VALUES
    (
      'print_professional_transparent',
      'Professional ID Photo PNG (White Background)',
      'professional ID photo portrait for printing and PNG export, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
      'colored background, blue background, red background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
      570,
      10,
      jsonb_build_object('en', 'Professional ID Photo PNG (White Background)', 'es', 'Foto profesional de documento PNG con fondo blanco', 'fr', 'Photo d''identite professionnelle PNG sur fond blanc', 'de', 'Professionelles Passfoto PNG mit weissem Hintergrund', 'ja', '白背景のビジネス証明写真 PNG')
    ),
    (
      'print_child_id_transparent',
      'Child ID Photo PNG (White Background)',
      'child ID photo portrait for printing and PNG export, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, high resolution',
      'adult appearance, colored background, blue background, red background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
      600,
      40,
      jsonb_build_object('en', 'Child ID Photo PNG (White Background)', 'es', 'Foto infantil de documento PNG con fondo blanco', 'fr', 'Photo d''identite enfant PNG sur fond blanc', 'de', 'Kinder-Passfoto PNG mit weissem Hintergrund', 'ja', '白背景の子ども証明写真 PNG')
    ),
    (
      'print_student_id_transparent',
      'Student ID Photo PNG (White Background)',
      'student ID photo portrait for printing and PNG export, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
      'colored background, blue background, red background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
      630,
      70,
      jsonb_build_object('en', 'Student ID Photo PNG (White Background)', 'es', 'Foto de estudiante PNG con fondo blanco', 'fr', 'Photo etudiante PNG sur fond blanc', 'de', 'Studenten-Passfoto PNG mit weissem Hintergrund', 'ja', '白背景の学生証明写真 PNG')
    )
)
UPDATE headshot_styles AS style
SET
  name = updates.name,
  prompt = updates.prompt,
  negative = updates.negative,
  sort_order = updates.sort_order,
  style_order = updates.style_order,
  localized_names = COALESCE(style.localized_names, '{}'::jsonb) || updates.localized_names,
  localized_category_labels = COALESCE(style.localized_category_labels, '{}'::jsonb) ||
    jsonb_build_object('en', 'ID Photo And PNG', 'es', 'Foto ID y PNG', 'fr', 'Photo ID et PNG', 'de', 'Passfoto und PNG', 'ja', '証明写真とPNG'),
  updated_at = NOW()
FROM updates
WHERE style.id = updates.id;

COMMIT;
