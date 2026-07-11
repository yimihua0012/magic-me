export const PHOTO_TOOL_STYLE_IDS = [
  'print_professional_transparent',
  'print_child_id_transparent',
  'print_student_id_transparent',
] as const

export type PhotoToolStyleId = (typeof PHOTO_TOOL_STYLE_IDS)[number]

export const PHOTO_TOOL_STYLE_CONFIGS = [
  {
    id: 'print_professional_transparent',
    name: 'Professional ID Photo (No Background)',
    category: 'photo_tools',
    prompt: 'professional ID photo portrait for printing, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative: 'colored background, blue background, red background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
    sort_order: 570,
    category_order: 5,
    style_order: 10,
    selection_count: 0,
    last_selected_at: null,
    localized_names: {
      en: 'Professional ID Photo (No Background)',
      es: 'Foto profesional de documento sin fondo',
      fr: "Photo d'identite professionnelle sans fond",
      de: 'Professionelles Passfoto ohne Hintergrund',
      ja: '背景なしのビジネス証明写真',
    },
    localized_category_labels: {
      en: 'ID Photo (No Background)',
      es: 'Foto ID sin fondo',
      fr: 'Photo ID sans fond',
      de: 'Passfoto ohne Hintergrund',
      ja: '背景なし証明写真',
    },
  },
  {
    id: 'print_child_id_transparent',
    name: 'Child ID Photo (No Background)',
    category: 'photo_tools',
    prompt: 'child ID photo portrait for printing, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative: 'adult appearance, colored background, blue background, red background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
    sort_order: 580,
    category_order: 5,
    style_order: 20,
    selection_count: 0,
    last_selected_at: null,
    localized_names: {
      en: 'Child ID Photo (No Background)',
      es: 'Foto infantil de documento sin fondo',
      fr: "Photo d'identite enfant sans fond",
      de: 'Kinder-Passfoto ohne Hintergrund',
      ja: '背景なしの子ども証明写真',
    },
    localized_category_labels: {
      en: 'ID Photo (No Background)',
      es: 'Foto ID sin fondo',
      fr: 'Photo ID sans fond',
      de: 'Passfoto ohne Hintergrund',
      ja: '背景なし証明写真',
    },
  },
  {
    id: 'print_student_id_transparent',
    name: 'Student ID Photo (No Background)',
    category: 'photo_tools',
    prompt: 'student ID photo portrait for printing, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative: 'colored background, blue background, red background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
    sort_order: 590,
    category_order: 5,
    style_order: 30,
    selection_count: 0,
    last_selected_at: null,
    localized_names: {
      en: 'Student ID Photo (No Background)',
      es: 'Foto de estudiante sin fondo',
      fr: 'Photo etudiante sans fond',
      de: 'Studenten-Passfoto ohne Hintergrund',
      ja: '背景なしの学生証明写真',
    },
    localized_category_labels: {
      en: 'ID Photo (No Background)',
      es: 'Foto ID sin fondo',
      fr: 'Photo ID sans fond',
      de: 'Passfoto ohne Hintergrund',
      ja: '背景なし証明写真',
    },
  },
] as const

export function isPhotoToolStyleId(styleId: string): styleId is PhotoToolStyleId {
  return (PHOTO_TOOL_STYLE_IDS as readonly string[]).includes(styleId)
}
