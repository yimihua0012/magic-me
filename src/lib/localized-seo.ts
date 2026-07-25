import type { RoutedLocale } from '@/lib/i18n'

export type LocalizedSeoPage =
  | 'home'
  | 'landing'
  | 'pricing'
  | 'contact'
  | 'questions'
  | 'sample'
  | 'upload'
  | 'aiHeadshotLinkedIn'
  | 'aiHeadshotCorporate'
  | 'aiHeadshotResume'
  | 'aiHeadshotStudioStyle'
  | 'aiHeadshotProfessionalPhoto'

type LocalizedSeoEntry = {
  keywords: string[]
  title?: string
  description?: string
}

const coreKeywords: Record<RoutedLocale, string[]> = {
  es: [
    'generador de headshots IA',
    'fotos profesionales IA',
    'foto LinkedIn IA',
    'foto CV profesional',
  ],
  fr: [
    'generateur portrait professionnel IA',
    'photo LinkedIn IA',
    'photo CV professionnelle',
    'portrait professionnel LinkedIn',
  ],
  de: [
    'KI Headshot Generator',
    'KI Bewerbungsfoto',
    'LinkedIn Profilbild KI',
    'professionelles Profilbild',
  ],
  ja: [
    'AIヘッドショットジェネレーター',
    'AI証明写真',
    'LinkedInプロフィール写真',
    'プロフィール写真 AI',
  ],
  zh: [
    'AI职业形象照',
    'LinkedIn头像',
    '简历照片',
  ],
}

type UseCaseSeoPage = Extract<
  LocalizedSeoPage,
  | 'aiHeadshotLinkedIn'
  | 'aiHeadshotCorporate'
  | 'aiHeadshotResume'
  | 'aiHeadshotStudioStyle'
  | 'aiHeadshotProfessionalPhoto'
>

const useCaseSeoContent: Record<RoutedLocale, Record<UseCaseSeoPage, LocalizedSeoEntry>> = {
  es: {
    aiHeadshotLinkedIn: {
      keywords: [...coreKeywords.es, 'foto LinkedIn IA para reclutadores', 'headshot profesional LinkedIn'],
    },
    aiHeadshotCorporate: {
      keywords: [...coreKeywords.es, 'retratos corporativos IA', 'headshots equipo empresa'],
    },
    aiHeadshotResume: {
      keywords: [...coreKeywords.es, 'foto CV IA', 'generador foto curriculum IA'],
    },
    aiHeadshotStudioStyle: {
      keywords: [...coreKeywords.es, 'retrato estilo estudio IA', 'headshot estudio profesional'],
    },
    aiHeadshotProfessionalPhoto: {
      keywords: [...coreKeywords.es, 'foto profesional IA', 'creador foto profesional IA'],
    },
  },
  fr: {
    aiHeadshotLinkedIn: {
      keywords: [...coreKeywords.fr, 'photo LinkedIn IA recruteur', 'portrait LinkedIn professionnel'],
    },
    aiHeadshotCorporate: {
      keywords: [...coreKeywords.fr, 'portraits corporate IA', 'headshots equipe entreprise'],
    },
    aiHeadshotResume: {
      keywords: [...coreKeywords.fr, 'photo CV IA', 'generateur photo CV IA'],
    },
    aiHeadshotStudioStyle: {
      keywords: [...coreKeywords.fr, 'portrait style studio IA', 'headshot studio professionnel'],
    },
    aiHeadshotProfessionalPhoto: {
      keywords: [...coreKeywords.fr, 'photo professionnelle IA', 'createur photo professionnelle IA'],
    },
  },
  de: {
    aiHeadshotLinkedIn: {
      keywords: [...coreKeywords.de, 'LinkedIn Profilbild KI fur Recruiter', 'KI Headshot LinkedIn'],
    },
    aiHeadshotCorporate: {
      keywords: [...coreKeywords.de, 'Corporate Headshots KI', 'Team Headshot Generator'],
    },
    aiHeadshotResume: {
      keywords: [...coreKeywords.de, 'KI Bewerbungsfoto Lebenslauf', 'Lebenslauf Foto KI'],
    },
    aiHeadshotStudioStyle: {
      keywords: [...coreKeywords.de, 'KI Studio Headshot', 'Studio Portrait KI'],
    },
    aiHeadshotProfessionalPhoto: {
      keywords: [...coreKeywords.de, 'professionelles Foto KI', 'Business Profilfoto KI'],
    },
  },
  ja: {
    aiHeadshotLinkedIn: {
      keywords: [...coreKeywords.ja, 'LinkedIn 写真 AI', 'LinkedIn用AIヘッドショット'],
    },
    aiHeadshotCorporate: {
      keywords: [...coreKeywords.ja, '企業写真 AI', '社員紹介 写真 AI'],
    },
    aiHeadshotResume: {
      keywords: [...coreKeywords.ja, '履歴書 写真 AI', '職務経歴書 写真 AI'],
    },
    aiHeadshotStudioStyle: {
      keywords: [...coreKeywords.ja, 'スタジオ写真 AI', 'AIヘッドショット スタジオ'],
    },
    aiHeadshotProfessionalPhoto: {
      keywords: [...coreKeywords.ja, '仕事用 写真 AI', 'プロフィール写真 AI'],
    },
  },
  zh: {
    aiHeadshotLinkedIn: {
      keywords: [...coreKeywords.zh, 'LinkedIn头像生成'],
    },
    aiHeadshotCorporate: {
      keywords: [...coreKeywords.zh, '企业形象照'],
    },
    aiHeadshotResume: {
      keywords: [...coreKeywords.zh, '简历照片生成'],
    },
    aiHeadshotStudioStyle: {
      keywords: [...coreKeywords.zh, '影棚风职业照'],
    },
    aiHeadshotProfessionalPhoto: {
      keywords: [...coreKeywords.zh, '职业头像生成'],
    },
  },
}

export const localizedSeoContent: Record<RoutedLocale, Record<LocalizedSeoPage, LocalizedSeoEntry>> = {
  es: {
    ...useCaseSeoContent.es,
    home: { keywords: coreKeywords.es },
    landing: {
      keywords: [...coreKeywords.es, 'retratos IA profesionales'],
    },
    pricing: {
      keywords: [...coreKeywords.es, 'precios fotos profesionales IA'],
    },
    contact: {
      keywords: [...coreKeywords.es, 'soporte generador headshots IA'],
    },
    questions: {
      keywords: [...coreKeywords.es, 'preguntas headshots IA'],
    },
    sample: {
      keywords: [...coreKeywords.es, 'ejemplos fotos profesionales IA'],
    },
    upload: {
      title: 'Subir fotos para crear retratos IA',
      description:
        'Sube selfies claros para generar retratos profesionales realistas con IA para LinkedIn, CV y perfiles de negocio.',
      keywords: [...coreKeywords.es, 'subir selfies para retratos IA'],
    },
  },
  fr: {
    ...useCaseSeoContent.fr,
    home: { keywords: coreKeywords.fr },
    landing: {
      keywords: [...coreKeywords.fr, 'portraits IA professionnels'],
    },
    pricing: {
      keywords: [...coreKeywords.fr, 'tarifs photo professionnelle IA'],
    },
    contact: {
      keywords: [...coreKeywords.fr, 'support generateur portrait IA'],
    },
    questions: {
      keywords: [...coreKeywords.fr, 'questions portraits IA'],
    },
    sample: {
      keywords: [...coreKeywords.fr, 'exemples photo professionnelle IA'],
    },
    upload: {
      title: 'Importer des photos pour creer des portraits IA',
      description:
        'Importez des selfies clairs pour generer des portraits professionnels realistes avec IA pour LinkedIn, CV et profils business.',
      keywords: [...coreKeywords.fr, 'importer selfies portrait IA'],
    },
  },
  de: {
    ...useCaseSeoContent.de,
    home: { keywords: coreKeywords.de },
    landing: {
      keywords: [...coreKeywords.de, 'professionelle KI Headshots'],
    },
    pricing: {
      keywords: [...coreKeywords.de, 'KI Bewerbungsfoto Preise'],
    },
    contact: {
      keywords: [...coreKeywords.de, 'KI Headshot Support'],
    },
    questions: {
      keywords: [...coreKeywords.de, 'KI Headshot Fragen'],
    },
    sample: {
      keywords: [...coreKeywords.de, 'KI Bewerbungsfoto Beispiele'],
    },
    upload: {
      title: 'Fotos fur KI-Headshots hochladen',
      description:
        'Lade klare Selfies hoch, um realistische professionelle KI-Headshots fur LinkedIn, Lebenslauf und Business-Profile zu erstellen.',
      keywords: [...coreKeywords.de, 'Selfies fur KI Bewerbungsfoto hochladen'],
    },
  },
  ja: {
    ...useCaseSeoContent.ja,
    home: { keywords: coreKeywords.ja },
    landing: {
      keywords: [...coreKeywords.ja, 'AIプロフィール写真作成'],
    },
    pricing: {
      keywords: [...coreKeywords.ja, 'AI証明写真 料金'],
    },
    contact: {
      keywords: [...coreKeywords.ja, 'AIヘッドショット サポート'],
    },
    questions: {
      keywords: [...coreKeywords.ja, 'AI証明写真 よくある質問'],
    },
    sample: {
      keywords: [...coreKeywords.ja, 'AIプロフィール写真 サンプル'],
    },
    upload: {
      title: 'AIヘッドショット用の写真をアップロード',
      description:
        '鮮明なセルフィーをアップロードして、LinkedIn、履歴書、ビジネスプロフィール向けのリアルなAIヘッドショットを作成します。',
      keywords: [...coreKeywords.ja, 'AI証明写真 アップロード'],
    },
  },
  zh: {
    ...useCaseSeoContent.zh,
    home: {
      title: 'AI职业形象照生成器：LinkedIn、简历和个人资料 | Magic Headshot',
      description: '上传自拍生成自然可信的 AI 职业形象照，适合 LinkedIn、简历、团队页面、个人网站和商务头像。',
      keywords: coreKeywords.zh,
    },
    landing: {
      title: '几分钟生成 AI 职业形象照 | Magic Headshot',
      description: '上传清晰自拍，几分钟生成自然可信的 AI 职业形象照，适合 LinkedIn、简历、公司简介和个人品牌展示。',
      keywords: [...coreKeywords.zh, 'AI头像生成'],
    },
    pricing: {
      title: 'AI职业形象照价格和点数包 | Magic Headshot',
      description: '比较一次性点数包，按需要生成 AI 职业形象照，用于 LinkedIn、简历、团队页面和商务资料更新。',
      keywords: [...coreKeywords.zh, '职业照价格'],
    },
    contact: {
      title: '联系 Magic Headshot 支持 | Magic Headshot',
      description: '如需帮助处理点数、付款、照片生成、风格选择、账号或团队使用问题，请联系 Magic Headshot 支持。',
      keywords: [...coreKeywords.zh, 'Magic Headshot支持'],
    },
    questions: {
      title: 'AI职业形象照常见问题 | Magic Headshot',
      description: '了解照片上传、本人相似度、风格选择、点数、隐私和职业用途，生成 AI 职业形象照前先确认关键问题和限制。',
      keywords: [...coreKeywords.zh, 'AI职业照问题'],
    },
    sample: {
      title: 'AI职业形象照前后对比示例 | Magic Headshot',
      description: '查看自拍原图和 AI 职业形象照前后对比，比较本人相似度、光线、背景、服装和不同职业场景效果差异表现。',
      keywords: [...coreKeywords.zh, 'AI职业照示例'],
    },
    upload: {
      title: '上传照片生成 AI 职业形象照 | Magic Headshot',
      description: '上传清晰自拍，选择职业风格，生成适合 LinkedIn、简历、公司资料和个人品牌展示的 AI 头像。',
      keywords: [...coreKeywords.zh, '上传照片生成头像'],
    },
  },
}

export function getLocalizedSeo(locale: RoutedLocale, page: LocalizedSeoPage) {
  const content = localizedSeoContent[locale][page]
  return {
    ...content,
    keywords: content.keywords.slice(0, 3),
  }
}

Object.assign(localizedSeoContent.es, {
  home: {
    ...localizedSeoContent.es.home,
    title: 'Fotos profesionales con IA para CV, LinkedIn y perfiles | Magic-Headshot',
    description: 'Crea fotos profesionales con IA desde selfies para CV, LinkedIn, webs, perfiles de empresa y equipos con resultados naturales.',
  },
  landing: {
    ...localizedSeoContent.es.landing,
    title: 'Convierte selfies en fotos profesionales con IA | Magic-Headshot',
    description: 'Genera fotos profesionales para perfiles, webs, propuestas y equipos sin sesion de estudio, con estilos naturales y reutilizables.',
  },
  questions: {
    ...localizedSeoContent.es.questions,
    title: 'Preguntas sobre fotos profesionales con IA | Magic-Headshot',
    description: 'Respuestas sobre subida de fotos, parecido, estilos, privacidad, creditos y uso practico de retratos profesionales generados con IA.',
  },
  sample: {
    ...localizedSeoContent.es.sample,
    title: 'Ejemplos de fotos profesionales con IA | Magic-Headshot',
    description: 'Compara ejemplos antes y despues para elegir luz, fondo, encuadre y estilo segun tu perfil, sector y canal de uso.',
  },
})

Object.assign(localizedSeoContent.de, {
  home: {
    ...localizedSeoContent.de.home,
    title: 'Professionelle KI Fotos fuer Profile und Teams | Magic-Headshot',
    description: 'Erstelle realistische berufliche Portraits aus eigenen Fotos fuer LinkedIn, Lebenslauf, Website, Teamseite und oeffentliche Profile.',
  },
  landing: {
    ...localizedSeoContent.de.landing,
    title: 'Aus Selfies professionelle KI Fotos erstellen | Magic-Headshot',
    description: 'Erzeuge berufliche Portraits fuer Profile, Websites, Angebote und Teams ohne Studio-Termin, mit natuerlichen und wiederverwendbaren Stilen.',
  },
  questions: {
    ...localizedSeoContent.de.questions,
    title: 'Fragen zu professionellen KI Fotos | Magic-Headshot',
    description: 'Antworten zu Uploads, Wiedererkennbarkeit, Stilen, Datenschutz, Credits und praktischer Nutzung von KI Portraits.',
  },
  sample: {
    ...localizedSeoContent.de.sample,
    title: 'Beispiele fuer professionelle KI Fotos | Magic-Headshot',
    description: 'Vergleiche Vorher-Nachher Beispiele und waehle Licht, Hintergrund, Ausschnitt und Stil passend zu Rolle und Einsatzort.',
  },
})

Object.assign(localizedSeoContent.ja, {
  home: {
    ...localizedSeoContent.ja.home,
    title: '仕事用AIプロフィール写真を作成 | Magic-Headshot',
    description: '自分の写真から、LinkedIn、履歴書、Webサイト、社員紹介、公開プロフィールで使いやすい自然な仕事用ポートレートを作成できます。',
  },
  landing: {
    ...localizedSeoContent.ja.landing,
    title: '自撮りから仕事用プロフィール写真を作成 | Magic-Headshot',
    description: 'プロフィール、自己紹介、提案資料、社員紹介、Webサイトで使いやすい自然なAI写真を作成できます。',
  },
  questions: {
    ...localizedSeoContent.ja.questions,
    title: 'AIプロフィール写真のよくある質問 | Magic-Headshot',
    description: '写真のアップロード、本人らしさ、スタイル、クレジット、プライバシー、仕事での使い方を確認できます。',
  },
  sample: {
    ...localizedSeoContent.ja.sample,
    title: 'AIプロフィール写真のビフォーアフター事例 | Magic-Headshot',
    description: '光、背景、構図、服装の違いを比較し、自分のプロフィールや職種に合うAI写真を選べます。',
  },
})

Object.assign(localizedSeoContent.es, {
  pricing: {
    ...localizedSeoContent.es.pricing,
    title: 'Precios de AI headshots y retratos profesionales | Magic Headshot',
    description:
      'Compara paquetes de creditos para crear AI headshots, retratos profesionales y fotos de perfil para LinkedIn, CV, web personal, equipos y redes.',
  },
  contact: {
    ...localizedSeoContent.es.contact,
    title: 'Contacto y soporte para AI headshots | Magic Headshot',
    description:
      'Contacta con Magic Headshot para dudas sobre creditos, pagos, calidad de retratos IA, estilos profesionales, cuenta o uso en equipo.',
  },
  upload: {
    ...localizedSeoContent.es.upload,
    title: 'Subir fotos para crear AI headshots profesionales | Magic Headshot',
    description:
      'Sube selfies claras, elige estilos y genera AI headshots para LinkedIn, CV, perfiles de empresa, marca personal, redes y proyectos creativos.',
  },
})

Object.assign(localizedSeoContent.de, {
  pricing: {
    ...localizedSeoContent.de.pricing,
    title: 'Preise fur KI-Headshots und professionelle Portrats | Magic Headshot',
    description:
      'Vergleiche Credit-Pakete fur KI-Headshots, professionelle Profilbilder, LinkedIn, Bewerbungen, Teamseiten, Personal Branding und Social Media.',
  },
  contact: {
    ...localizedSeoContent.de.contact,
    title: 'Kontakt und Support fur KI-Headshots | Magic Headshot',
    description:
      'Kontaktiere Magic Headshot bei Fragen zu Credits, Zahlung, Bildqualitaet, beruflichen Styles, Konto oder Teamnutzung.',
  },
  upload: {
    ...localizedSeoContent.de.upload,
    title: 'Fotos hochladen und professionelle KI-Headshots erstellen | Magic Headshot',
    description:
      'Lade klare Selfies hoch, waehle passende Styles und erstelle KI-Headshots fur LinkedIn, Bewerbung, Firmenprofil, Personal Branding und kreative Profile.',
  },
})

Object.assign(localizedSeoContent.ja, {
  pricing: {
    ...localizedSeoContent.ja.pricing,
    title: 'AIヘッドショットとプロフィール写真の料金 | Magic Headshot',
    description:
      'LinkedIn、履歴書、会社プロフィール、個人ブランディング、SNS向けのAIヘッドショットを作成するクレジットプランを比較できます。',
  },
  contact: {
    ...localizedSeoContent.ja.contact,
    title: 'AIヘッドショットの問い合わせ・サポート | Magic Headshot',
    description:
      'Magic Headshotのクレジット、支払い、AIポートレートの品質、仕事用スタイル、アカウント、チーム利用について問い合わせできます。',
  },
  upload: {
    ...localizedSeoContent.ja.upload,
    title: '写真をアップロードしてAIヘッドショットを作成 | Magic Headshot',
    description:
      '明るく自然な自撮り写真をアップロードし、用途に合うスタイルを選んで、LinkedIn、履歴書、会社プロフィール、SNS向けのAIポートレートを生成できます。',
  },
})
