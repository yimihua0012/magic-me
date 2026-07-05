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
    title: 'AI Headshot Examples: Realistic Portraits, Creative Styles, and Avatar Ideas',
    description:
      'Explore AI headshot examples with realistic portraits, high likeness AI portraits, fast headshot generation, studio looks, creative avatars, and artistic photo styles.',
    h1: 'AI Headshot Examples and Portrait Style Gallery',
    eyebrow: 'Style examples',
    intro:
      'Explore how one photo can become many AI headshot and portrait styles, from natural studio portraits to polished profile photos, cinematic looks, creator avatars, editorial lighting, and expressive artistic directions. Use the examples to compare likeness, lighting, wardrobe mood, background direction, and the kind of result that fits personal branding, social profiles, creative projects, LinkedIn, resumes, or business use.',
    emptyTitle: 'More examples are coming soon',
    emptyText: 'We are preparing more AI portrait styles so you can compare realistic, polished, and creative results.',
    ctaTitle: 'Choose a style before generating',
    ctaText:
      'Use the gallery to compare realistic, polished, and creative portrait directions, then create AI headshots with a look that matches your goal.',
    ctaLabel: 'Generate Your Headshots',
    secondaryLink: 'Read AI headshot questions',
    keywords: ['AI headshot examples', 'AI portrait styles', 'AI avatar examples', 'high likeness AI portraits', 'fast headshot generation'],
  },
  es: {
    title: 'Ejemplos de headshots IA: retratos realistas, estilos creativos e ideas de avatar',
    description:
      'Explora ejemplos de headshots IA con retratos realistas, gran parecido, generacion rapida, looks de estudio, avatares creativos y estilos artisticos.',
    h1: 'Ejemplos de headshots IA y estilos de retrato',
    eyebrow: 'Ejemplos de estilos',
    intro:
      'Descubre como una sola foto puede convertirse en muchos estilos de headshot IA y retrato: desde retratos naturales de estudio hasta fotos de perfil pulidas, looks cinematicos, avatares para creadores, iluminacion editorial y direcciones artisticas mas expresivas. Usa los ejemplos para comparar parecido, iluminacion, ropa, fondo y resultados utiles para marca personal, redes sociales, proyectos creativos, LinkedIn, CV o uso profesional.',
    emptyTitle: 'Pronto habra nuevos ejemplos',
    emptyText: 'Estamos preparando mas estilos de retrato IA para que puedas comparar resultados realistas, pulidos y creativos.',
    ctaTitle: 'Elige un estilo antes de generar',
    ctaText:
      'Usa la galeria para comparar retratos realistas, pulidos y creativos, y crea headshots IA con el estilo que mejor encaja con tu objetivo.',
    ctaLabel: 'Generar headshots',
    secondaryLink: 'Leer preguntas sobre headshots IA',
    keywords: ['ejemplos headshot IA', 'estilos de retrato IA', 'avatares IA', 'retratos IA realistas', 'generar headshots rapido'],
  },
  fr: {
    title: 'Exemples de portraits IA: rendus realistes, styles creatifs et idees avatar',
    description:
      'Parcourez des exemples de portraits IA avec rendu realiste, forte ressemblance, generation rapide, looks studio, avatars creatifs et styles artistiques.',
    h1: 'Exemples de portraits IA et galerie de styles',
    eyebrow: 'Exemples de styles',
    intro:
      'Decouvrez comment une seule photo peut devenir plusieurs styles de portrait IA: portrait studio naturel, photo de profil soignee, rendu cinematographique, avatar createur, lumiere editoriale ou direction artistique plus expressive. Utilisez les exemples pour comparer la ressemblance, la lumiere, la tenue, le decor et les resultats adaptes a la marque personnelle, aux reseaux sociaux, aux projets creatifs, a LinkedIn, au CV ou a un usage professionnel.',
    emptyTitle: 'De nouveaux exemples arrivent bientot',
    emptyText: 'Nous preparons plus de styles de portraits IA pour comparer des rendus realistes, soignes et creatifs.',
    ctaTitle: 'Choisissez un style avant de generer',
    ctaText:
      'Utilisez la galerie pour comparer des directions realistes, elegantes et creatives, puis creez des portraits IA adaptes a votre objectif.',
    ctaLabel: 'Generer mes portraits',
    secondaryLink: 'Lire les questions sur les portraits IA',
    keywords: ['exemples portrait IA', 'styles portrait IA', 'avatar IA', 'portraits IA realistes', 'generation rapide portrait IA'],
  },
  de: {
    title: 'KI Headshot Beispiele: Realistische Portraits, kreative Styles und Avatar Ideen',
    description:
      'Entdecke KI Headshot Beispiele mit realistischen Portraits, hoher Aehnlichkeit, schneller Erstellung, Studio Looks, kreativen Avataren und Kunststilen.',
    h1: 'KI Headshot Beispiele und Portrait Style Galerie',
    eyebrow: 'Style Beispiele',
    intro:
      'Sieh dir an, wie aus einem Foto viele KI Headshot und Portrait Styles entstehen konnen: naturliche Studio Portraits, gepflegte Profilbilder, cineastische Looks, Creator Avatare, editorial wirkendes Licht und ausdrucksstarke kuenstlerische Richtungen. Nutze die Beispiele, um Aehnlichkeit, Licht, Kleidung, Hintergrund und passende Ergebnisse fur Personal Branding, Social Media, kreative Projekte, LinkedIn, Lebenslauf oder Business zu vergleichen.',
    emptyTitle: 'Weitere Beispiele kommen bald',
    emptyText: 'Wir bereiten mehr KI Portrait Styles vor, damit du realistische, elegante und kreative Ergebnisse vergleichen kannst.',
    ctaTitle: 'Wahle vor dem Generieren einen Stil',
    ctaText:
      'Nutze die Galerie, um realistische, elegante und kreative Portrait Richtungen zu vergleichen und KI Headshots passend zu deinem Ziel zu erstellen.',
    ctaLabel: 'Headshots generieren',
    secondaryLink: 'Fragen zu KI Headshots lesen',
    keywords: ['KI Headshot Beispiele', 'KI Portrait Styles', 'KI Avatar Beispiele', 'realistische KI Portraits', 'schnelle Headshot Erstellung'],
  },
  ja: {
    title: 'AIヘッドショット事例: リアルなポートレート、クリエイティブスタイル、アバター例',
    description:
      'リアルなAIヘッドショット、高い再現度のAIポートレート、短時間生成、スタジオ風、クリエイティブなアバターやアート風の事例を比較できます。',
    h1: 'AIヘッドショット事例とポートレートスタイル',
    eyebrow: 'スタイル事例',
    intro:
      '一枚の写真から、自然なスタジオポートレート、洗練されたプロフィール写真、映画のような雰囲気、クリエイター向けアバター、エディトリアル風の光、印象的なアートスタイルまで、さまざまなAIヘッドショットとポートレート表現を比較できます。事例を見ながら、再現度、ライティング、服装、背景、SNS、個人ブランディング、作品づくり、LinkedIn、履歴書、ビジネス用途に合う方向性を選べます。',
    emptyTitle: '新しい事例を準備中です',
    emptyText: 'リアルで洗練された表現からクリエイティブなスタイルまで、比較しやすいAIポートレート事例を追加しています。',
    ctaTitle: '生成前にスタイルを比較',
    ctaText:
      'ギャラリーでリアル、上品、クリエイティブな方向性を比較し、目的に合うAIヘッドショットを作成できます。',
    ctaLabel: 'ヘッドショットを生成',
    secondaryLink: 'AIヘッドショットの質問を見る',
    keywords: ['AIヘッドショット事例', 'AIポートレートスタイル', 'AIアバター事例', 'リアルなAIポートレート', 'ヘッドショット短時間生成'],
  },
}
