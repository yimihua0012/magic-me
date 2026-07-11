-- Migration: 025_photo_tool_no_background_labels
-- Description: Clarify Photo Tools ID photo styles as no-background outputs in display labels.

BEGIN;

WITH updates(id, name, localized_names) AS (
  VALUES
    (
      'print_professional_transparent',
      'Professional ID Photo (No Background)',
      jsonb_build_object(
        'en', 'Professional ID Photo (No Background)',
        'es', 'Foto profesional de documento sin fondo',
        'fr', 'Photo d''identite professionnelle sans fond',
        'de', 'Professionelles Passfoto ohne Hintergrund',
        'ja', '背景なしのビジネス証明写真'
      )
    ),
    (
      'print_child_id_transparent',
      'Child ID Photo (No Background)',
      jsonb_build_object(
        'en', 'Child ID Photo (No Background)',
        'es', 'Foto infantil de documento sin fondo',
        'fr', 'Photo d''identite enfant sans fond',
        'de', 'Kinder-Passfoto ohne Hintergrund',
        'ja', '背景なしの子ども証明写真'
      )
    ),
    (
      'print_student_id_transparent',
      'Student ID Photo (No Background)',
      jsonb_build_object(
        'en', 'Student ID Photo (No Background)',
        'es', 'Foto de estudiante sin fondo',
        'fr', 'Photo etudiante sans fond',
        'de', 'Studenten-Passfoto ohne Hintergrund',
        'ja', '背景なしの学生証明写真'
      )
    )
)
UPDATE headshot_styles AS style
SET
  name = updates.name,
  localized_names = COALESCE(style.localized_names, '{}'::jsonb) || updates.localized_names,
  localized_category_labels = COALESCE(style.localized_category_labels, '{}'::jsonb) ||
    jsonb_build_object(
      'en', 'ID Photo (No Background)',
      'es', 'Foto ID sin fondo',
      'fr', 'Photo ID sans fond',
      'de', 'Passfoto ohne Hintergrund',
      'ja', '背景なし証明写真'
    ),
  updated_at = NOW()
FROM updates
WHERE style.id = updates.id;

COMMIT;
