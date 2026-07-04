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
}

export function getLocalizedSeo(locale: RoutedLocale, page: LocalizedSeoPage) {
  return localizedSeoContent[locale][page]
}
