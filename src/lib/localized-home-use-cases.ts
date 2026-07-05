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

Object.assign(localizedHomeUseCases, {
  es: {
    title: 'Elige el retrato segun donde lo vas a usar',
    subtitle:
      'No todos los perfiles necesitan la misma imagen. Prepara una version sobria para trabajo, otra mas cercana para redes y una opcion clara para documentos o presentaciones.',
    items: [
      {
        title: 'Perfil profesional y LinkedIn',
        text: 'Un retrato limpio, con buena luz y fondo discreto, ayuda a que reclutadores, clientes y contactos reconozcan rapido tu perfil.',
        cta: 'Ver opciones para LinkedIn',
        href: '/sample',
      },
      {
        title: 'CV, bio y presentaciones',
        text: 'Para candidaturas, ponencias o paginas personales, conviene una imagen natural que se vea seria sin parecer una foto de documento.',
        cta: 'Preparar foto para CV',
        href: '/questions',
      },
      {
        title: 'Equipos y presencia de marca',
        text: 'Mantén una linea visual coherente entre fundadores, consultores y equipos remotos, aunque cada persona suba fotos tomadas en lugares distintos.',
        cta: 'Crear estilo corporativo',
        href: '/pricing',
      },
    ],
  },
  de: {
    title: 'Waehle dein Portrat nach dem echten Einsatz',
    subtitle:
      'Ein LinkedIn-Bild, eine Bewerbungsseite und ein Teamprofil brauchen nicht exakt denselben Look. Nutze klare Varianten fuer Beruf, Marke und Alltag.',
    items: [
      {
        title: 'LinkedIn und berufliche Profile',
        text: 'Ein ruhiges Portrat mit gutem Licht und aufgeraeumtem Hintergrund macht dein Profil schneller einordenbar fuer Recruiter, Kunden und Kontakte.',
        cta: 'LinkedIn-Optionen ansehen',
        href: '/sample',
      },
      {
        title: 'Bewerbung, Bio und Vortraege',
        text: 'Fuer Lebenslauf, Speaker-Profil oder persoenliche Website wirkt ein natuerliches Bild oft besser als ein zu steifes Passfoto.',
        cta: 'Foto fuer Bewerbung planen',
        href: '/questions',
      },
      {
        title: 'Teams und Markenauftritt',
        text: 'Gib Gruendern, Beratern und Remote-Teams eine einheitliche Bildsprache, auch wenn die Ausgangsfotos an verschiedenen Orten entstanden sind.',
        cta: 'Corporate Look erstellen',
        href: '/pricing',
      },
    ],
  },
  ja: {
    title: '使う場所に合わせて写真の印象を選ぶ',
    subtitle:
      'LinkedIn、履歴書、会社プロフィール、SNSでは、少しずつ合う見え方が違います。仕事用は落ち着き、個人発信では自然さや雰囲気も大切です。',
    items: [
      {
        title: 'LinkedInと仕事用プロフィール',
        text: '明るく自然な表情、すっきりした背景、清潔感のある服装で、採用担当者や取引先に伝わりやすい印象を作れます。',
        cta: 'LinkedIn向けを見る',
        href: '/sample',
      },
      {
        title: '履歴書、プロフィール、登壇紹介',
        text: '証明写真ほど硬すぎず、SNSほどラフすぎない写真は、応募書類や自己紹介ページで使いやすくなります。',
        cta: '履歴書向けを確認',
        href: '/questions',
      },
      {
        title: 'チームとブランドの統一感',
        text: '撮影場所が違うメンバー写真でも、背景や光の方向をそろえることで、会社ページや提案資料にまとまりが出ます。',
        cta: '法人向けを見る',
        href: '/pricing',
      },
    ],
  },
} satisfies Partial<Record<RoutedLocale, LocalizedHomeUseCaseContent>>)
