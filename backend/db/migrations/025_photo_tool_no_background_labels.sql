-- Migration: 025_photo_tool_no_background_labels
-- Description: Clarify Photo Tools ID photo styles as white-background outputs in display labels.

BEGIN;

WITH updates(id, name, localized_names) AS (
  VALUES
    (
      'print_professional_transparent',
      'Professional ID Photo PNG (White Background)',
      jsonb_build_object(
        'en', 'Professional ID Photo PNG (White Background)',
        'es', 'Foto profesional de documento con fondo blanco',
        'fr', 'Photo d''identite professionnelle sur fond blanc',
        'de', 'Professionelles Passfoto mit weissem Hintergrund',
        'ja', '白背景のビジネス証明写真'
      )
    ),
    (
      'print_child_id_transparent',
      'Child ID Photo PNG (White Background)',
      jsonb_build_object(
        'en', 'Child ID Photo PNG (White Background)',
        'es', 'Foto infantil de documento con fondo blanco',
        'fr', 'Photo d''identite enfant sur fond blanc',
        'de', 'Kinder-Passfoto mit weissem Hintergrund',
        'ja', '白背景の子ども証明写真'
      )
    ),
    (
      'print_student_id_transparent',
      'Student ID Photo PNG (White Background)',
      jsonb_build_object(
        'en', 'Student ID Photo PNG (White Background)',
        'es', 'Foto de estudiante con fondo blanco',
        'fr', 'Photo etudiante sur fond blanc',
        'de', 'Studenten-Passfoto mit weissem Hintergrund',
        'ja', '白背景の学生証明写真'
      )
    )
)
UPDATE headshot_styles AS style
SET
  name = updates.name,
  localized_names = COALESCE(style.localized_names, '{}'::jsonb) || updates.localized_names,
  localized_category_labels = COALESCE(style.localized_category_labels, '{}'::jsonb) ||
    jsonb_build_object(
      'en', 'ID Photo And PNG',
      'es', 'Foto ID y PNG',
      'fr', 'Photo ID et PNG',
      'de', 'Passfoto und PNG',
      'ja', '証明写真とPNG'
    ),
  updated_at = NOW()
FROM updates
WHERE style.id = updates.id;

COMMIT;
