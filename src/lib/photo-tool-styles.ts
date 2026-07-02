export const PHOTO_TOOL_STYLE_IDS = [
  'print_professional_transparent',
  'print_child_id_transparent',
  'print_student_id_transparent',
] as const

export type PhotoToolStyleId = (typeof PHOTO_TOOL_STYLE_IDS)[number]

export const PHOTO_TOOL_STYLE_CONFIGS = [
  {
    id: 'print_professional_transparent',
    name: 'Professional Print Portrait',
    category: 'photo_tools',
    prompt: 'professional ID photo portrait for printing, adult business profile, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative: 'colored background, blue background, red background, scenic background, office background, gradient, texture, shadow, border, watermark, text, logo, hat, sunglasses, exaggerated smile, distorted face, extra limbs, low quality, blurry',
    sort_order: 570,
    category_order: 5,
    style_order: 10,
    selection_count: 0,
    last_selected_at: null,
    localized_names: {},
    localized_category_labels: {},
  },
  {
    id: 'print_child_id_transparent',
    name: 'Child ID Portrait',
    category: 'photo_tools',
    prompt: 'child ID photo portrait for printing, natural child face, age-appropriate neat clothing, neutral gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative: 'adult appearance, colored background, blue background, red background, toy background, cartoon style, exaggerated smile, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
    sort_order: 580,
    category_order: 5,
    style_order: 20,
    selection_count: 0,
    last_selected_at: null,
    localized_names: {},
    localized_category_labels: {},
  },
  {
    id: 'print_student_id_transparent',
    name: 'Student ID Portrait',
    category: 'photo_tools',
    prompt: 'student ID photo portrait for printing, school application photo, neat student clothing, clean youthful appearance, neutral friendly expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative: 'colored background, blue background, red background, classroom background, campus background, dramatic pose, hat, sunglasses, heavy makeup, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
    sort_order: 590,
    category_order: 5,
    style_order: 30,
    selection_count: 0,
    last_selected_at: null,
    localized_names: {},
    localized_category_labels: {},
  },
] as const

export function isPhotoToolStyleId(styleId: string): styleId is PhotoToolStyleId {
  return (PHOTO_TOOL_STYLE_IDS as readonly string[]).includes(styleId)
}
