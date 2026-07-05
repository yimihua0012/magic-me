import type { Locale } from '@/lib/i18n'

export const sampleGalleryPath = '/ai-headshot-examples'

export type SampleGalleryContent = {
  title: string
  description: string
  h1: string
  intro: string
  eyebrow: string
  emptyTitle: string
  emptyText: string
  ctaTitle: string
  ctaText: string
  ctaLabel: string
  secondaryLink: string
  keywords: string[]
}

export const sampleGalleryContent: Record<Locale, SampleGalleryContent> = {
  en: {
    title: 'AI Headshot Examples Gallery: Professional Portrait Styles and Realistic Results',
    description:
      'Browse AI headshot examples by style, including LinkedIn portraits, resume photos, studio looks, creative portraits, and polished professional photo cases.',
    h1: 'AI Headshot Examples Gallery',
    eyebrow: 'Photo examples',
    intro:
      'Explore a curated gallery of AI headshot examples created for different professional and creative scenarios. Each image includes localized title, alt text, and style context so visitors can compare realistic portrait quality, lighting, wardrobe mood, background direction, and the kind of profile photo result that fits LinkedIn, resumes, business profiles, creator pages, or personal branding.',
    emptyTitle: 'Sample pictures are being prepared',
    emptyText: 'Upload active gallery images in the admin panel to publish this SEO gallery.',
    ctaTitle: 'Choose a style before generating',
    ctaText:
      'Use the gallery to compare portrait direction, then create professional AI headshots with a look that matches your profile goal.',
    ctaLabel: 'Generate Your Headshots',
    secondaryLink: 'Read AI headshot questions',
    keywords: ['AI headshot examples', 'AI headshot gallery', 'professional portrait examples', 'LinkedIn photo examples'],
  },
  es: {
    title: 'Galeria de ejemplos de headshots IA: estilos profesionales y retratos realistas',
    description:
      'Explora ejemplos de headshots IA por estilo, con retratos para LinkedIn, CV, perfiles de empresa, estudio y marca personal.',
    h1: 'Galeria de ejemplos de headshots IA',
    eyebrow: 'Ejemplos de fotos',
    intro:
      'Explora una galeria curada de ejemplos de headshots IA para escenarios profesionales y creativos. Cada imagen incluye titulo, texto alt y estilo localizado para comparar calidad realista, iluminacion, vestuario, fondo y el tipo de foto de perfil que encaja con LinkedIn, CV, perfiles de empresa o marca personal.',
    emptyTitle: 'Los ejemplos se estan preparando',
    emptyText: 'Sube imagenes activas desde el panel de administracion para publicar esta galeria SEO.',
    ctaTitle: 'Elige un estilo antes de generar',
    ctaText:
      'Usa la galeria para comparar direcciones visuales y crear headshots IA profesionales con un resultado adecuado para tu perfil.',
    ctaLabel: 'Generar headshots',
    secondaryLink: 'Leer preguntas sobre headshots IA',
    keywords: ['ejemplos headshot IA', 'galeria headshots IA', 'foto LinkedIn IA', 'foto CV profesional IA'],
  },
  fr: {
    title: 'Galerie exemples de portraits IA: styles professionnels et resultats realistes',
    description:
      'Parcourez des exemples de portraits IA pour LinkedIn, CV, profils business, studio, marque personnelle et styles creatifs.',
    h1: 'Galerie exemples de portraits IA',
    eyebrow: 'Exemples photo',
    intro:
      'Decouvrez une galerie d exemples de portraits IA concus pour des usages professionnels et creatifs. Chaque image contient un titre, un texte alt et un style localises afin de comparer le rendu realiste, la lumiere, la tenue, le decor et le type de photo de profil adapte a LinkedIn, au CV, au profil business ou a la marque personnelle.',
    emptyTitle: 'Les exemples sont en preparation',
    emptyText: 'Ajoutez des images actives dans l administration pour publier cette galerie SEO.',
    ctaTitle: 'Choisissez un style avant de generer',
    ctaText:
      'Utilisez la galerie pour comparer les directions visuelles, puis creez des portraits IA professionnels adaptes a votre objectif.',
    ctaLabel: 'Generer mes portraits',
    secondaryLink: 'Lire les questions sur les portraits IA',
    keywords: ['exemples portrait IA', 'galerie headshots IA', 'photo LinkedIn IA', 'photo CV IA'],
  },
  de: {
    title: 'KI Headshot Beispiele: Galerie fur professionelle Portraitstile',
    description:
      'Durchsuche KI Headshot Beispiele fur LinkedIn, Lebenslauf, Business Profile, Studio Looks und kreative Portraitstile.',
    h1: 'KI Headshot Beispiele Galerie',
    eyebrow: 'Fotobeispiele',
    intro:
      'Diese kuratierte Galerie zeigt KI Headshot Beispiele fur professionelle und kreative Einsatze. Jedes Bild hat lokalisierte Titel, Alt Texte und Stilnamen, damit Besucher realistische Portraitqualitat, Licht, Kleidung, Hintergrund und passende Profilfoto Richtungen fur LinkedIn, Lebenslauf, Business Profile oder Personal Branding vergleichen konnen.',
    emptyTitle: 'Beispielbilder werden vorbereitet',
    emptyText: 'Lade aktive Galerie Bilder im Admin Bereich hoch, um diese SEO Seite zu veroffentlichen.',
    ctaTitle: 'Wahle vor dem Generieren einen Stil',
    ctaText:
      'Nutze die Galerie, um Portrait Richtungen zu vergleichen und professionelle KI Headshots passend zu deinem Profilziel zu erstellen.',
    ctaLabel: 'Headshots generieren',
    secondaryLink: 'Fragen zu KI Headshots lesen',
    keywords: ['KI Headshot Beispiele', 'KI Portrait Galerie', 'LinkedIn Profilbild KI', 'Bewerbungsfoto KI'],
  },
  ja: {
    title: 'AIヘッドショット事例ギャラリー: プロフィール写真とポートレート例',
    description:
      'LinkedIn、履歴書、ビジネスプロフィール、スタジオ風、クリエイティブなAIヘッドショット事例を確認できます。',
    h1: 'AIヘッドショット事例ギャラリー',
    eyebrow: '写真事例',
    intro:
      'プロ用途とクリエイティブ用途に合わせたAIヘッドショット事例を一覧で確認できます。各画像にはローカライズされたタイトル、altテキスト、スタイル名を設定できるため、リアルな仕上がり、ライティング、服装、背景、LinkedInや履歴書、ビジネスプロフィール、個人ブランディングに合う写真の方向性を比較しやすくなります。',
    emptyTitle: '事例画像を準備中です',
    emptyText: '管理画面から有効なギャラリー画像をアップロードすると、このSEOページに表示されます。',
    ctaTitle: '生成前にスタイルを比較',
    ctaText:
      'ギャラリーで写真の方向性を確認し、目的に合うプロフェッショナルなAIヘッドショットを作成できます。',
    ctaLabel: 'ヘッドショットを生成',
    secondaryLink: 'AIヘッドショットの質問を見る',
    keywords: ['AIヘッドショット事例', 'AIプロフィール写真', 'LinkedIn写真 AI', '履歴書写真 AI'],
  },
}
