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
    title: 'Professional AI Headshot and ID Photo Examples',
    description:
      'Browse professional AI headshot and ID photo examples for LinkedIn, resumes, and documents: business portraits, executive looks, and ID photo backgrounds in white, blue, and red.',
    h1: 'Professional AI Headshot and ID Photo Style Gallery',
    eyebrow: 'Style examples',
    intro:
      'Compare how a few selfies can become professional headshots and ID photos: corporate portraits, executive looks, business casual, clean studio backgrounds, and document-ready ID photo backgrounds. Use the examples to compare likeness, lighting, wardrobe, background, and the result that fits LinkedIn, a resume, a company profile, or a document photo.',
    emptyTitle: 'More examples are coming soon',
    emptyText: 'We are preparing more professional AI portrait styles so you can compare polished, business-ready results.',
    ctaTitle: 'Choose a style before generating',
    ctaText:
      'Use the gallery to compare professional and document-ready portrait directions, then create AI headshots with a look that matches your goal.',
    ctaLabel: 'Generate Your Headshots',
    secondaryLink: 'Read AI headshot questions',
    keywords: ['AI headshot examples', 'professional AI portraits', 'ID photo backgrounds', 'business headshot styles', 'high likeness AI portraits'],
  },
  zh: {
    title: 'AI职业形象照示例：商务头像和证件照',
    description:
      '查看 AI 职业形象照示例，比较商务头像、高管职业照、商务休闲、影棚质感以及白底、蓝底、红底证件照效果。',
    h1: 'AI职业形象照和证件照风格示例',
    eyebrow: '风格示例',
    intro:
      '浏览自拍如何生成不同方向的职业形象照：商务头像、高管职业照、商务休闲、干净影棚背景,以及可直接用于报名表、工牌、学生证的证件照背景。你可以比较相似度、光线、服装、背景和适用场景,再决定生成哪种风格。',
    emptyTitle: '更多示例即将上线',
    emptyText: '我们正在准备更多商务和证件方向的 AI 职业形象照示例。',
    ctaTitle: '生成前先选择适合的风格',
    ctaText:
      '通过图库比较职业与证件方向的效果,再生成符合目标场景的职业形象照。',
    ctaLabel: '生成你的职业形象照',
    secondaryLink: '阅读常见问题',
    keywords: ['AI职业形象照示例', 'AI商务头像风格', '证件照背景'],
  },
  es: {
    title: 'Ejemplos de headshots IA profesionales y fotos para documentos y carnets',
    description:
      'Explora ejemplos de headshots IA profesionales: retratos corporativos, ejecutivos, business casual y fotos para documentos con fondos blanco, azul y rojo.',
    h1: 'Ejemplos de headshots IA profesionales y fotos de documento',
    eyebrow: 'Ejemplos de estilos',
    intro:
      'Descubre como unas selfies pueden convertirse en retratos profesionales y fotos para documentos: retratos corporativos, ejecutivos, business casual, fondos limpios de estudio y fondos listos para carnets o documentos. Usa los ejemplos para comparar parecido, iluminacion, ropa, fondo y el resultado adecuado para LinkedIn, CV, perfil de empresa o una foto de documento.',
    emptyTitle: 'Pronto habra nuevos ejemplos',
    emptyText: 'Estamos preparando mas estilos de retrato IA profesionales para que puedas comparar resultados pulidos y listos para el trabajo.',
    ctaTitle: 'Elige un estilo antes de generar',
    ctaText:
      'Usa la galeria para comparar retratos profesionales y de documentos, y crea headshots IA con el estilo que mejor encaja con tu objetivo.',
    ctaLabel: 'Generar headshots',
    secondaryLink: 'Leer preguntas sobre headshots IA',
    keywords: ['ejemplos headshot IA', 'retratos profesionales IA', 'fotos para documentos'],
  },
  fr: {
    title: 'Exemples de portraits IA professionnels et photos de documents',
    description:
      'Decouvrez des exemples de portraits IA professionnels: retraits corporatifs, executives, business casual et photos pour documents avec fonds blanc, bleu et rouge.',
    h1: 'Exemples de portraits IA professionnels et photos de documents',
    eyebrow: 'Exemples de styles',
    intro:
      'Voyez comment quelques selfies peuvent devenir des portraits professionnels et des photos de documents: portraits corporatifs, executives, business casual, fonds de studio sobres et fonds pretes pour les documents ou les documents d identite. Utilisez les exemples pour comparer la ressemblance, la lumiere, la tenue, le decor et le resultat adapte a LinkedIn, au CV, a un profil d entreprise ou a une photo de document.',
    emptyTitle: 'De nouveaux exemples arrivent bientot',
    emptyText: 'Nous preparons plus de styles de portraits IA professionnels pour comparer des rendus soignes et pret a l emploi.',
    ctaTitle: 'Choisissez un style avant de generer',
    ctaText:
      'Utilisez la galerie pour comparer des directions professionnelles et documentaires, puis creez des portraits IA adaptes a votre objectif.',
    ctaLabel: 'Generer mes portraits',
    secondaryLink: 'Lire les questions sur les portraits IA',
    keywords: ['exemples portrait IA', 'portraits IA professionnels', 'photos de documents'],
  },
  de: {
    title: 'Professionelle KI Headshot Beispiele und Passfotos',
    description:
      'Sieh dir professionelle KI Headshots und Passfotos an: Business-Portraits, Executive Looks, Business Casual und Passfoto-Hintergruende in Weiss, Blau und Rot.',
    h1: 'Professionelle KI Headshots und Passfoto Galerie',
    eyebrow: 'Style Beispiele',
    intro:
      'Sieh dir an, wie aus ein paar Selfies professionelle Headshots und Passfotos entstehen: Unternehmensportraits, Executive Looks, Business Casual, klare Studio-Hintergruende und dokumenttaugliche Passfoto-Hintergruende. Nutze die Beispiele, um Aehnlichkeit, Licht, Kleidung, Hintergrund und passende Ergebnisse fuer LinkedIn, Lebenslauf, Firmenprofil oder Dokumentfoto zu vergleichen.',
    emptyTitle: 'Weitere Beispiele kommen bald',
    emptyText: 'Wir bereiten mehr professionelle KI Portrait Styles vor, damit du elegante, arbeitsbereite Ergebnisse vergleichen kannst.',
    ctaTitle: 'Wahle vor dem Generieren einen Stil',
    ctaText:
      'Nutze die Galerie, um professionelle und dokumenttaugliche Portrait Richtungen zu vergleichen und KI Headshots passend zu deinem Ziel zu erstellen.',
    ctaLabel: 'Headshots generieren',
    secondaryLink: 'Fragen zu KI Headshots lesen',
    keywords: ['KI Headshot Beispiele', 'professionelle KI Portraits', 'Passfoto Hintergruende'],
  },
  ja: {
    title: 'AIヘッドショット事例: ビジネスポートレートと証明写真',
    description:
      'ビジネス向けAIヘッドショットと証明写真の例を比較できます。法人向け、経営者向け、ビジネスカジュアル、白・青・赤の証明写真背景など。',
    h1: 'AIビジネスポートレートと証明写真スタイル',
    eyebrow: 'スタイル事例',
    intro:
      '数枚の自撮りから、法人向けポートレート、経営者向けのポートレート、ビジネスカジュアル、落ち着いたスタジオ背景、書類に使える証明写真背景までを比較できます。再現度、ライティング、服装、背景を確認しながら、LinkedIn、履歴書、会社プロフィール、証明写真に合う方向性を選べます。',
    emptyTitle: '新しい事例を準備中です',
    emptyText: 'ビジネスや証明写真に使いやすい、洗練されたAIポートレート事例を追加しています。',
    ctaTitle: '生成前にスタイルを比較',
    ctaText:
      'ギャラリーでビジネス・証明写真向けの方向性を比較し、目的に合うAIヘッドショットを作成できます。',
    ctaLabel: 'ヘッドショットを生成',
    secondaryLink: 'AIヘッドショットの質問を見る',
    keywords: ['AIヘッドショット事例', 'ビジネスAIポートレート', '証明写真背景'],
  },
}

for (const content of Object.values(sampleGalleryContent)) {
  content.keywords = content.keywords.slice(0, 3)
}
