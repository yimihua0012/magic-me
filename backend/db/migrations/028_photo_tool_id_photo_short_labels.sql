-- Migration: 028_photo_tool_id_photo_short_labels
-- Description: Shorten ID Photo And PNG style labels to type plus background color.

BEGIN;

WITH updates(id, name, localized_names) AS (
  VALUES
    (
      'print_professional_transparent',
      'Professional ID Photo(White)',
      jsonb_build_object('en', 'Professional ID Photo(White)', 'es', 'Foto ID profesional(fondo blanco)', 'fr', 'Photo ID professionnelle(fond blanc)', 'de', 'Professionelles ID-Foto(weisser Hintergrund)', 'ja', 'プロ向け証明写真(白)')
    ),
    (
      'print_professional_blue_png',
      'Professional ID Photo(Blue)',
      jsonb_build_object('en', 'Professional ID Photo(Blue)', 'es', 'Foto ID profesional(fondo azul)', 'fr', 'Photo ID professionnelle(fond bleu)', 'de', 'Professionelles ID-Foto(blauer Hintergrund)', 'ja', 'プロ向け証明写真(青)')
    ),
    (
      'print_professional_red_png',
      'Professional ID Photo(Red)',
      jsonb_build_object('en', 'Professional ID Photo(Red)', 'es', 'Foto ID profesional(fondo rojo)', 'fr', 'Photo ID professionnelle(fond rouge)', 'de', 'Professionelles ID-Foto(roter Hintergrund)', 'ja', 'プロ向け証明写真(赤)')
    ),
    (
      'print_child_id_transparent',
      'Child ID Photo(White)',
      jsonb_build_object('en', 'Child ID Photo(White)', 'es', 'Foto ID infantil(fondo blanco)', 'fr', 'Photo ID enfant(fond blanc)', 'de', 'Kinder-ID-Foto(weisser Hintergrund)', 'ja', '子ども証明写真(白)')
    ),
    (
      'print_child_id_blue_png',
      'Child ID Photo(Blue)',
      jsonb_build_object('en', 'Child ID Photo(Blue)', 'es', 'Foto ID infantil(fondo azul)', 'fr', 'Photo ID enfant(fond bleu)', 'de', 'Kinder-ID-Foto(blauer Hintergrund)', 'ja', '子ども証明写真(青)')
    ),
    (
      'print_child_id_red_png',
      'Child ID Photo(Red)',
      jsonb_build_object('en', 'Child ID Photo(Red)', 'es', 'Foto ID infantil(fondo rojo)', 'fr', 'Photo ID enfant(fond rouge)', 'de', 'Kinder-ID-Foto(roter Hintergrund)', 'ja', '子ども証明写真(赤)')
    ),
    (
      'print_student_id_transparent',
      'Student ID Photo(White)',
      jsonb_build_object('en', 'Student ID Photo(White)', 'es', 'Foto ID estudiante(fondo blanco)', 'fr', 'Photo ID etudiant(fond blanc)', 'de', 'Studenten-ID-Foto(weisser Hintergrund)', 'ja', '学生証明写真(白)')
    ),
    (
      'print_student_id_blue_png',
      'Student ID Photo(Blue)',
      jsonb_build_object('en', 'Student ID Photo(Blue)', 'es', 'Foto ID estudiante(fondo azul)', 'fr', 'Photo ID etudiant(fond bleu)', 'de', 'Studenten-ID-Foto(blauer Hintergrund)', 'ja', '学生証明写真(青)')
    ),
    (
      'print_student_id_red_png',
      'Student ID Photo(Red)',
      jsonb_build_object('en', 'Student ID Photo(Red)', 'es', 'Foto ID estudiante(fondo rojo)', 'fr', 'Photo ID etudiant(fond rouge)', 'de', 'Studenten-ID-Foto(roter Hintergrund)', 'ja', '学生証明写真(赤)')
    )
)
UPDATE headshot_styles AS style
SET
  name = updates.name,
  localized_names = COALESCE(style.localized_names, '{}'::jsonb) || updates.localized_names,
  updated_at = NOW()
FROM updates
WHERE style.id = updates.id;

COMMIT;
