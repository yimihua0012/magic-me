import type { BlogCategorySummary } from '@/lib/blog-store'
import type { Locale } from '@/lib/i18n'

type BlogCategoryFaq = {
  question: string
  answer: string
}

export type BlogCategorySeoContent = {
  title: string
  h1: string
  description: string
  intro: string
  keywords: string[]
  faqs: BlogCategoryFaq[]
  backToBlog: string
  articleCount: string
  readArticle: string
  faqHeading: string
  blogName: string
  toolsHeading: string
  toolsDescription: string
  toolsLink: string
  workflowHeading: string
  workflowDescription: string
  workflowLink: string
  pricingHeading: string
  pricingDescription: string
  pricingLink: string
}

export function getBlogCategorySeoContent(locale: Locale, category: BlogCategorySummary): BlogCategorySeoContent {
  const label = category.label
  const count = category.count
  const keywords = Array.from(new Set([label, ...category.keywords])).slice(0, 3)

  const content = categoryContentByLocale[locale](label, count)
  return {
    ...content,
    keywords,
  }
}

function boundedDescription(value: string, maxLength = 140) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 3).replace(/\s+\S*$/, '')}...`
}

const categoryContentByLocale: Record<Locale, (label: string, count: number) => Omit<BlogCategorySeoContent, 'keywords'>> = {
  en: (label, count) => ({
    title: `${label} Guides | Magic-Headshot Blog`,
    h1: `${label} Guides`,
    description: boundedDescription(`Explore ${label} guides from Magic-Headshot, with ${count} articles on AI headshots, profile photos, document photos, and practical publishing workflows.`),
    intro: `This category collects Magic-Headshot articles about ${label}. Use these guides to compare workflows, prepare better source photos, choose practical image styles, and publish professional profile or document-style photos with more confidence.`,
    faqs: [
      {
        question: `What does the ${label} category cover?`,
        answer: `It groups articles that share the ${label} topic, including practical AI headshot workflows, profile photo decisions, quality checks, and publishing advice.`,
      },
      {
        question: 'How is this category updated?',
        answer: 'The page is generated from published blog posts. When a new published article uses this category, it appears here and is included in the sitemap automatically.',
      },
      {
        question: 'Which article should I read first?',
        answer: 'Start with the most recent or most specific guide in the list, then use related articles to compare use cases such as LinkedIn, resumes, document photos, or team profile pages.',
      },
    ],
    backToBlog: 'Back to all blog articles',
    articleCount: `${count} article${count === 1 ? '' : 's'}`,
    readArticle: 'Read article',
    faqHeading: 'Category FAQ',
    blogName: 'Magic-Headshot Blog',
    toolsHeading: 'Try the photo tools',
    toolsDescription: `Use the photo tools after reading these ${label} guides to crop, resize, prepare printable layouts, or adjust a background before you publish a profile, resume, or document-style photo.`,
    toolsLink: 'Open photo tools',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: `Use the ${label} guidance to choose a realistic AI headshot style, then generate polished profile, resume, team, or document-style images in Magic-Headshot.`,
    workflowLink: 'Generate headshots',
    pricingHeading: 'Choose the right credit pack',
    pricingDescription: `Review pricing before turning ${label} planning into final images for profile updates, applications, team pages, or everyday document photo needs.`,
    pricingLink: 'View pricing',
  }),
  zh: (label, count) => ({
    title: `${label} 指南 | Magic-Headshot Blog`,
    h1: `${label} 指南`,
    description: boundedDescription(`查看 Magic-Headshot 的 ${label} 指南，共 ${count} 篇文章，覆盖 AI 职业形象照、资料头像、证件照工具和发布检查。`),
    intro: `这个分类整理了关于 ${label} 的 Magic-Headshot 文章，帮助你准备更清晰的原图，选择合适风格，并更稳妥地处理职业头像或日常资料照片。`,
    faqs: [
      {
        question: `${label} 分类主要包含什么？`,
        answer: `这里会收录与 ${label} 相关的 AI 职业头像、证件照工具、图片质量检查和实际发布建议。`,
      },
      {
        question: '这些文章适合什么场景？',
        answer: '适合准备 LinkedIn 头像、简历照片、团队资料、考试报名照、员工证或学生证照片的人参考。',
      },
    ],
    backToBlog: '返回 Blog',
    articleCount: `${count} 篇文章`,
    readArticle: '阅读文章',
    faqHeading: '分类常见问题',
    blogName: 'Magic-Headshot Blog',
    toolsHeading: 'Try the photo tools',
    toolsDescription: '阅读指南后，可以使用 Photo Tools 裁剪证件照、压缩图片、处理背景或准备打印排版。',
    toolsLink: '打开 Photo Tools',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: '需要更自然的职业头像时，可以上传自拍并生成适合 LinkedIn、简历和个人资料的 AI 形象照。',
    workflowLink: '生成职业形象照',
    pricingHeading: '选择合适的点数包',
    pricingDescription: '比较一次性点数包，再决定生成多少职业风格照片。',
    pricingLink: '查看价格',
  }),
  es: (label, count) => ({
    title: `${label}: guías prácticas para fotos profesionales | Magic-Headshot`,
    h1: `${label}: guías prácticas y casos de uso`,
    description: boundedDescription(`${count} guías sobre ${label}: fotos profesionales con IA para LinkedIn, CV, documentos, perfiles y decisiones antes de publicar.`),
    intro: `Aquí reunimos guías sobre ${label} pensadas para búsquedas reales en español: perfiles de LinkedIn, CV, documentos cotidianos, fotos de equipo y presencia profesional. La idea es ayudarte a elegir una imagen útil, no solo bonita.`,
    faqs: [
      {
        question: `¿Qué incluye la categoría ${label}?`,
        answer: `Agrupa artículos relacionados con ${label}, incluyendo decisiones de perfil, preparación de fotos, controles de calidad y usos habituales como LinkedIn, CV o documentos no oficiales.`,
      },
      {
        question: '¿Cómo se actualiza esta categoría?',
        answer: 'La página se genera desde los artículos publicados. Cuando un nuevo blog usa esta categoría, aparece aquí y entra automáticamente en el sitemap.',
      },
      {
        question: '¿Qué artículo conviene leer primero?',
        answer: 'Empieza por la guía que coincida con tu uso concreto: búsqueda de empleo, perfil profesional, foto para CV, documento cotidiano o página de equipo.',
      },
    ],
    backToBlog: 'Volver al blog',
    articleCount: `${count} artículo${count === 1 ? '' : 's'}`,
    readArticle: 'Leer artículo',
    faqHeading: 'FAQ de la categoría',
    blogName: 'Blog de Magic-Headshot',
    toolsHeading: 'Try the photo tools',
    toolsDescription: 'Después de elegir una guía, usa las herramientas de foto para recortar, cambiar tamaño, preparar una hoja imprimible o revisar el fondo antes de publicar o enviar la imagen.',
    toolsLink: 'Abrir herramientas de foto',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: `Usa las guías de ${label} para elegir un estilo creíble y generar retratos para LinkedIn, CV, perfiles profesionales, equipos o fotos tipo documento.`,
    workflowLink: 'Crear retratos',
    pricingHeading: 'Elige el paquete de creditos adecuado',
    pricingDescription: `Revisa los precios antes de convertir la planificación de ${label} en imágenes finales para perfil, empleo, equipo o documentos cotidianos.`,
    pricingLink: 'Ver precios',
  }),
  fr: (label, count) => ({
    title: `${label}: guides photo professionnelle IA | Magic-Headshot`,
    h1: `${label}: guides pour profils, CV et usages pro`,
    description: boundedDescription(`${count} guides sur ${label}: portraits IA, photos LinkedIn, CV, documents du quotidien et choix de publication professionnelle.`),
    intro: `Cette rubrique traite de ${label} dans des situations concrètes: profil LinkedIn, CV, page équipe, bio professionnelle ou photo de document courant. Les guides privilégient une image crédible, reconnaissable et adaptée au contexte.`,
    faqs: [
      {
        question: `Que couvre la catégorie ${label} ?`,
        answer: `Elle regroupe les articles liés à ${label}, avec des conseils pour choisir une photo de profil, préparer ses images sources, contrôler le rendu et l utiliser dans un contexte professionnel.`,
      },
      {
        question: 'Comment cette catégorie est-elle mise à jour ?',
        answer: 'La page est générée depuis les articles publiés. Quand un nouveau blog utilise cette catégorie, il apparaît ici et rejoint automatiquement le sitemap.',
      },
      {
        question: 'Quel article lire en premier ?',
        answer: 'Commencez par le guide le plus proche de votre besoin: profil LinkedIn, CV, bio, document courant ou cohérence visuelle d une équipe.',
      },
    ],
    backToBlog: 'Retour au blog',
    articleCount: `${count} article${count === 1 ? '' : 's'}`,
    readArticle: 'Lire l article',
    faqHeading: 'FAQ de la catégorie',
    blogName: 'Blog Magic-Headshot',
    toolsHeading: 'Try the photo tools',
    toolsDescription: 'Après avoir choisi un guide, utilisez les outils photo pour recadrer, alléger le fichier, préparer une planche imprimable ou ajuster le fond avant publication.',
    toolsLink: 'Ouvrir les outils photo',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: `Utilisez les guides ${label} pour choisir un style credible, puis generer des portraits pour LinkedIn, CV, profils professionnels, equipes ou documents.`,
    workflowLink: 'Creer des portraits',
    pricingHeading: 'Choisir le bon pack de credits',
    pricingDescription: `Consultez les tarifs avant de transformer votre preparation ${label} en images finales pour profil, candidature, equipe ou documents courants.`,
    pricingLink: 'Voir les tarifs',
  }),
  de: (label, count) => ({
    title: `${label}: Ratgeber fuer Profilbilder und Bewerbungsfotos | Magic-Headshot`,
    h1: `${label}: Ratgeber fuer berufliche Fotos`,
    description: boundedDescription(`${count} Ratgeber zu ${label}: KI-Headshots, LinkedIn Profilbilder, Bewerbungsfotos, einfache Dokumentfotos und Praxischecks.`),
    intro: `Diese Kategorie behandelt ${label} aus praktischer Sicht: LinkedIn Profilbild, Bewerbungsfoto, Teamseite, berufliche Bio oder alltaegliche Dokumentfotos. Im Mittelpunkt steht ein glaubwuerdiges Bild, das zum jeweiligen Einsatz passt.`,
    faqs: [
      {
        question: `Was deckt die Kategorie ${label} ab?`,
        answer: `Sie sammelt Artikel rund um ${label}, darunter Profilfoto-Entscheidungen, Vorbereitung der Ausgangsbilder, Qualitaetschecks und typische berufliche Einsatzbereiche.`,
      },
      {
        question: 'Wie wird diese Kategorie aktualisiert?',
        answer: 'Die Seite entsteht automatisch aus veröffentlichten Blogartikeln. Nutzt ein neuer Artikel diese Kategorie, erscheint er hier und wird automatisch in die Sitemap aufgenommen.',
      },
      {
        question: 'Welchen Artikel sollte ich zuerst lesen?',
        answer: 'Beginne mit dem Guide, der deinem Ziel am naechsten kommt: LinkedIn, Bewerbung, berufliche Bio, Dokumentfoto oder einheitliche Teamseite.',
      },
    ],
    backToBlog: 'Zurück zum Blog',
    articleCount: `${count} Artikel`,
    readArticle: 'Artikel lesen',
    faqHeading: 'Kategorie FAQ',
    blogName: 'Magic-Headshot Blog',
    toolsHeading: 'Try the photo tools',
    toolsDescription: 'Nach dem passenden Guide kannst du die Fotowerkzeuge nutzen, um Bilder zuzuschneiden, Dateigroessen anzupassen, Drucklayouts vorzubereiten oder den Hintergrund zu pruefen.',
    toolsLink: 'Fotowerkzeuge oeffnen',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: `Nutze die ${label} Guides fuer die Stilentscheidung und erstelle anschliessend KI-Portrats fuer LinkedIn, Bewerbung, Teamseiten oder dokumentaehnliche Fotos.`,
    workflowLink: 'Portrats erstellen',
    pricingHeading: 'Passendes Credit-Paket waehlen',
    pricingDescription: `Pruefe die Preise, bevor du deine ${label} Planung in finale Bilder fuer Profil, Bewerbung, Teamseite oder Dokumentfoto umsetzt.`,
    pricingLink: 'Preise ansehen',
  }),
  ja: (label, count) => ({
    title: `${label}の用途別ガイド | Magic-Headshot`,
    h1: `${label}の用途別ガイド`,
    description: boundedDescription(`${label}に関する記事一覧です。履歴書、LinkedIn、仕事用プロフィール、証明写真風の画像など用途別に確認できます。`),
    intro: `${label}について、履歴書、LinkedIn、仕事用プロフィール、社員紹介、日常の書類写真などの場面別に確認できる記事をまとめています。見た目のきれいさだけでなく、本人らしさと使いやすさを重視しています。`,
    faqs: [
      {
        question: `${label}カテゴリでは何を読めますか？`,
        answer: `${label}に関連する記事をまとめています。プロフィール写真、履歴書向け写真、元写真の選び方、公開前の確認ポイントなどを扱います。`,
      },
      {
        question: 'このカテゴリはどのように更新されますか？',
        answer: '公開済みブログから自動生成されます。新しい記事がこのカテゴリで公開されると、このページとsitemapに自動で反映されます。',
      },
      {
        question: '最初に読む記事はどう選べばよいですか？',
        answer: 'LinkedIn、履歴書、仕事用プロフィール、書類用写真など、自分の用途に近い記事から読むのがおすすめです。',
      },
    ],
    backToBlog: 'ブログ一覧へ戻る',
    articleCount: `${count}件の記事`,
    readArticle: '記事を読む',
    faqHeading: 'カテゴリFAQ',
    blogName: 'Magic-Headshotブログ',
    toolsHeading: 'Try the photo tools',
    toolsDescription: '用途に合う記事を確認したあと、写真ツールで切り抜き、サイズ調整、印刷用レイアウト、背景色の確認を行い、公開や提出前の状態を整えられます。',
    toolsLink: '写真ツールを開く',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: `${label}の記事で用途やスタイルを整理したあと、LinkedIn、履歴書、チーム紹介、書類風写真に使える自然なAI写真を作成できます。`,
    workflowLink: '写真を作成',
    pricingHeading: 'クレジットプランを確認',
    pricingDescription: `${label}向けの最終画像を作る前に、プロフィール更新、応募、チームページ、書類風写真に必要なクレジットを確認できます。`,
    pricingLink: '料金を見る',
  }),
}
