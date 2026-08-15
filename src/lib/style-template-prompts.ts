export type StyleTemplatePromptConfig = {
  prompt: string
  negative: string
}

const COMMON_NEGATIVE =
  'text, watermark, logo, signature, border, frame, low quality, low resolution, blurry, distorted face, bad anatomy, extra limbs, extra fingers, multiple people, cartoon, anime, illustration, painting, 3d render'

const MODEL_NEGATIVE =
  'multiple people, cartoon, anime, illustration, drawing, painting, watermark, text, logo, border, low quality, blurry, distorted face, bad anatomy, extra limbs'

export const STYLE_TEMPLATE_PROMPTS: Record<string, StyleTemplatePromptConfig> = {
  linkedin_professional: {
    prompt:
      'professional corporate headshot photograph of a well-groomed businessman in a tailored navy suit with crisp white shirt and silk tie, clean light-gray seamless studio background, soft even studio lighting, head and shoulders, centered composition, confident friendly expression, sharp focus, premium executive photography, 85mm portrait lens',
    negative: COMMON_NEGATIVE,
  },
  linkedin_professional_female: {
    prompt:
      'professional corporate headshot photograph of a young businesswoman in a tailored navy blazer with white blouse, no tie, clean light-gray seamless studio background, soft even studio lighting, head and shoulders, centered composition, confident friendly expression, sharp focus, premium executive photography, 85mm portrait lens',
    negative: COMMON_NEGATIVE,
  },
  business_casual: {
    prompt:
      'business casual portrait photograph of a polished professional, smart casual attire, blazer over an open-collar shirt with no tie, modern bright office setting with soft blurred daylight windows, natural flattering light, head and shoulders, centered composition, approachable relaxed smile, high-end corporate editorial photography',
    negative: COMMON_NEGATIVE,
  },
  executive_portrait: {
    prompt:
      'executive portrait photograph of a confident senior leader, dark charcoal tailored suit, luxury executive office background with soft bokeh, dramatic premium lighting, head and shoulders, centered composition, composed authoritative pose, fine-art corporate photography',
    negative: COMMON_NEGATIVE,
  },
  doctor_whitecoat: {
    prompt:
      'medical professional portrait photograph of a doctor in a clean white coat over light scrubs, no stethoscope, bright modern clinical examination room background, soft even lighting, head and shoulders, centered composition, trustworthy caring expression, professional healthcare photography',
    negative: COMMON_NEGATIVE + ', stethoscope, medical equipment, hospital machinery',
  },
  modern_tech: {
    prompt:
      'modern tech professional portrait photograph of a stylish knowledgeable professional, smart tech-casual attire, fitted sweater or clean t-shirt with light blazer, bright contemporary startup office with softly blurred monitors, natural daylight, head and shoulders, centered composition, relaxed confident smile, editorial tech photography',
    negative: COMMON_NEGATIVE,
  },
  finance_professional: {
    prompt:
      'finance professional portrait photograph of a polished banker, tailored dark navy suit, sharp professional grooming, refined modern financial office background with soft bokeh, premium executive lighting, head and shoulders, centered composition, confident composed expression, high-end corporate photography',
    negative: COMMON_NEGATIVE,
  },
  legal_professional: {
    prompt:
      'legal professional portrait photograph of an attorney, classic dark tailored suit, sophisticated law office background with softly blurred bookshelves, warm dignified lighting, head and shoulders, centered composition, composed trustworthy authoritative expression, high-end legal profile photography',
    negative: COMMON_NEGATIVE,
  },
  print_professional_transparent: {
    prompt:
      'professional ID photo portrait of an adult business professional, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'colored background, blue background, red background, scenic background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_professional_blue_png: {
    prompt:
      'professional ID photo portrait of an adult business professional, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid blue #428eda ID photo background, official document photo blue backdrop, high resolution',
    negative:
      'white background, red background, scenic background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_professional_red_png: {
    prompt:
      'professional ID photo portrait of an adult business professional, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid red #d62829 ID photo background, official document photo red backdrop, high resolution',
    negative:
      'white background, blue background, scenic background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_student_id_transparent: {
    prompt:
      'student ID photo portrait of a young adult female student in neat smart casual clothing, natural clean grooming, gentle neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative:
      'colored background, blue background, red background, office background, suit and tie, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_student_id_transparent_male: {
    prompt:
      'student ID photo portrait of a young adult male student in neat smart casual clothing, natural clean grooming, gentle neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, high resolution',
    negative:
      'colored background, blue background, red background, office background, suit and tie, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_student_id_blue_png: {
    prompt:
      'student ID photo portrait of a young adult student in neat smart casual clothing, natural clean grooming, gentle neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid blue #428eda ID photo background, official document photo blue backdrop, high resolution',
    negative:
      'white background, red background, office background, suit and tie, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_student_id_red_png: {
    prompt:
      'student ID photo portrait of a young adult student in neat smart casual clothing, natural clean grooming, gentle neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid red #d62829 ID photo background, official document photo red backdrop, high resolution',
    negative:
      'white background, blue background, office background, suit and tie, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_men_suit: {
    prompt:
      'ID photo portrait of an adult man in a formal dark business suit with tie, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'female appearance, casual clothes, t-shirt, uniform, colored background, blue background, red background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_men_shirt: {
    prompt:
      'ID photo portrait of an adult man in a crisp formal dress shirt with no tie, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'female appearance, casual clothes, suit jacket, t-shirt, colored background, blue background, red background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_women_suit: {
    prompt:
      'ID photo portrait of an adult woman in a formal tailored business suit, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'male appearance, casual clothes, t-shirt, uniform, colored background, blue background, red background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_women_shirt: {
    prompt:
      'ID photo portrait of an adult woman in a crisp formal blouse, formal clean grooming, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'male appearance, casual clothes, suit jacket, t-shirt, colored background, blue background, red background, office background, gradient, texture, shadow, border, hat, sunglasses, exaggerated smile, distorted face, extra limbs, watermark, text, logo, low quality, blurry',
  },
  print_child_boy: {
    prompt:
      'ID photo portrait of a young boy, neat age-appropriate clean clothing, natural gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'adult appearance, girl appearance, casual messy clothes, uniform, colored background, blue background, red background, classroom background, cartoon style, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  },
  print_child_girl: {
    prompt:
      'ID photo portrait of a young girl, neat age-appropriate clean clothing, natural gentle expression, front-facing head and shoulders, centered composition, even soft studio lighting, realistic natural skin texture, clean pure white background, official document photo, high resolution',
    negative:
      'adult appearance, boy appearance, casual messy clothes, uniform, colored background, blue background, red background, classroom background, cartoon style, crying, hat, sunglasses, shadow, border, watermark, text, distorted face, extra limbs, low quality, blurry',
  },
}

export function getStyleTemplatePrompt(styleId: string, category = 'professional'): StyleTemplatePromptConfig {
  const known = STYLE_TEMPLATE_PROMPTS[styleId]
  if (known) return known

  if (category === 'photo_tools') {
    return {
      prompt: `ID photo portrait of a person, neutral expression, front-facing head and shoulders, centered composition, even studio lighting, realistic natural skin texture, clean solid neutral background, high resolution (style id: ${styleId})`,
      negative: MODEL_NEGATIVE,
    }
  }

  return {
    prompt: `professional portrait photograph of a confident well-groomed person, appropriate business attire, clean flattering studio background, soft professional lighting, head and shoulders, centered composition, high-end corporate photography (style id: ${styleId})`,
    negative: MODEL_NEGATIVE,
  }
}