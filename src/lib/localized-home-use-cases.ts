import type { RoutedLocale } from '@/lib/i18n'

export type LocalizedHomeUseCase = {
  title: string
  text: string
  cta: string
  href: '/pricing' | '/sample' | '/questions'
}

export type LocalizedHomeUseCaseContent = {
  title: string
  subtitle: string
  items: LocalizedHomeUseCase[]
}

export const localizedHomeUseCases: Record<RoutedLocale, LocalizedHomeUseCaseContent> = {
  es: {
    title: 'Retratos IA para LinkedIn, CV y perfiles profesionales',
    subtitle:
      'Elige el flujo segun tu objetivo: foto de LinkedIn, foto para CV o retrato profesional sin fotografo.',
    items: [
      {
        title: 'Foto profesional para LinkedIn',
        text: 'Crea una foto de perfil LinkedIn con IA que se vea actual, clara y profesional.',
        cta: 'Ver planes',
        href: '/pricing',
      },
      {
        title: 'Foto CV profesional',
        text: 'Genera retratos limpios para CV, solicitudes de empleo y perfiles de negocio.',
        cta: 'Ver muestras',
        href: '/sample',
      },
      {
        title: 'Sin fotografo ni estudio',
        text: 'Convierte selfies en fotos profesionales sin coordinar una sesion de fotos.',
        cta: 'Leer preguntas',
        href: '/questions',
      },
    ],
  },
  fr: {
    title: 'Portraits IA pour LinkedIn, CV et profils professionnels',
    subtitle:
      'Choisissez le parcours adapte a votre objectif : photo LinkedIn, photo CV ou portrait professionnel sans photographe.',
    items: [
      {
        title: 'Photo professionnelle pour LinkedIn',
        text: 'Creez une photo de profil LinkedIn IA claire, actuelle et credible.',
        cta: 'Voir les plans',
        href: '/pricing',
      },
      {
        title: 'Photo CV professionnelle',
        text: 'Generez des portraits sobres pour CV, candidatures et profils business.',
        cta: 'Voir les exemples',
        href: '/sample',
      },
      {
        title: 'Sans photographe ni studio',
        text: 'Transformez des selfies en photos professionnelles sans organiser de seance photo.',
        cta: 'Lire les questions',
        href: '/questions',
      },
    ],
  },
  de: {
    title: 'KI-Headshots fur LinkedIn, Lebenslauf und professionelle Profile',
    subtitle:
      'Wahle den passenden Ablauf fur dein Ziel: LinkedIn Profilbild, KI Bewerbungsfoto oder professionelles Profilbild ohne Fotograf.',
    items: [
      {
        title: 'Professionelles LinkedIn Profilbild',
        text: 'Erstelle ein aktuelles, klares und glaubwurdiges LinkedIn Foto mit KI.',
        cta: 'Plane ansehen',
        href: '/pricing',
      },
      {
        title: 'KI Bewerbungsfoto',
        text: 'Generiere ruhige Portraits fur Lebenslauf, Bewerbung und Business-Profile.',
        cta: 'Beispiele ansehen',
        href: '/sample',
      },
      {
        title: 'Ohne Fotograf oder Studio',
        text: 'Verwandle Selfies in professionelle Profilfotos ohne Fototermin.',
        cta: 'Fragen lesen',
        href: '/questions',
      },
    ],
  },
  ja: {
    title: 'LinkedIn・履歴書・ビジネス用のAIプロフィール写真',
    subtitle:
      '目的に合わせて、LinkedInプロフィール写真、履歴書写真、写真館なしのビジネス写真を作成できます。',
    items: [
      {
        title: 'LinkedInプロフィール写真',
        text: 'AIで、今の印象に合う自然で信頼感のあるLinkedIn写真を作成します。',
        cta: 'プランを見る',
        href: '/pricing',
      },
      {
        title: '履歴書・職務経歴書の写真',
        text: '応募書類やビジネスプロフィールに使いやすい、落ち着いた写真を生成します。',
        cta: 'サンプルを見る',
        href: '/sample',
      },
      {
        title: '写真館なしで作成',
        text: '撮影予約をせず、セルフィーからプロ向けプロフィール写真を作れます。',
        cta: 'よくある質問',
        href: '/questions',
      },
    ],
  },
}
