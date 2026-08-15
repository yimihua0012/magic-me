import type { Locale } from '@/lib/i18n'

export type LocalizedHomeContent = {
  title: string
  description: string
  badge: string
  heading: string
  subheading: string
  primaryCta: string
  secondaryCta: string
  highlights: string[]
  howItWorksTitle: string
  howItWorksSubtitle: string
  steps: { title: string; text: string }[]
  featuresTitle: string
  featuresSubtitle: string
  features: { title: string; text: string }[]
  examplesTitle: string
  examplesSubtitle: string
  styleNames: string[]
  examplesCta: string
  testimonialsTitle: string
  testimonialsSubtitle: string
  testimonials: { name: string; role: string; quote: string; avatar: string }[]
  pricingTitle: string
  pricingSubtitle: string
  mostPopular: string
  perPurchase: string
  headshots: string
  days: string
  planCtaTemplate: string
  viewAllPlans: string
  bottomTitle: string
  bottomText: string
  bottomPrimaryCta: string
  bottomSecondaryCta: string
}


export const localizedHomeContent: Record<Exclude<Locale, 'en'>, LocalizedHomeContent> = {
  zh: {
    title: 'AI头像生成器和证件照工具：职业头像、裁剪换底',
    description:
      '上传自拍生成 AI 职业头像和证件照，支持头像背景、裁剪缩放、换底、去背景和打印排版。',
    badge: 'AI头像生成和照片处理工具',
    heading: '生成职业头像，也处理证件照和照片背景',
    subheading:
      '上传清晰自拍生成自然可信的职业头像，也可以使用证件照工具处理头像背景、图片裁剪、图片缩放、换底、去背景和打印排版。',
    primaryCta: '生成职业头像',
    secondaryCta: '上传照片',
    highlights: ['AI头像生成和职业头像', '证件照、换底和去背景', '裁剪、缩放和打印排版'],
    howItWorksTitle: '如何使用',
    howItWorksSubtitle: '从自拍到职业头像、证件照和可打印照片，按用途选择处理方式',
    steps: [
      { title: '上传清晰自拍或照片', text: '选择近期自拍、头像或证件照原图，保证脸部清楚、光线均匀。' },
      { title: '选择生成或处理工具', text: '生成职业头像，或处理证件照背景、头像裁剪、图片裁剪、图片缩放、换底和去背景。' },
      { title: '下载并用于真实场景', text: '导出头像、证件照、透明 PNG 或打印排版图，用于 LinkedIn、简历、报名表和资料页。' },
    ],
    featuresTitle: '为什么选择 Magic-Headshot',
    featuresSubtitle: '同时覆盖头像生成和常用照片处理，适合职业资料和证件照准备',
    features: [
      { title: 'AI头像生成', text: '从自拍生成自然可信的职业头像，适合 LinkedIn、简历、团队页面和个人资料。' },
      { title: '证件照处理', text: '准备白底、蓝底、红底等证件照，适合报名表、工牌、学生证和日常资料照。' },
      { title: '头像背景和换底', text: '处理头像背景颜色，生成白底、蓝底、红底或透明 PNG，减少重复修图。' },
      { title: '裁剪和缩放', text: '支持头像裁剪、图片裁剪、常用比例裁剪和图片缩放，适配不同上传尺寸要求。' },
      { title: '去背景和 PNG', text: '移除人物或物品背景，导出透明 PNG，再按需要合成证件照或资料头像。' },
      { title: '打印排版', text: '把处理好的证件照排版到 6 寸或 A4，相纸打印、家用打印和照相馆打印都更方便。' },
    ],
    examplesTitle: '职业头像、证件照和照片处理场景',
    examplesSubtitle: '比较商务头像、影棚风头像、证件照背景、头像裁剪、去背景和打印排版等不同用途。',
    styleNames: ['商务头像', '高管职业照', '影棚头像', '商务休闲', '简历照片', '资料头像'],
    examplesCta: '开始生成头像',
    testimonialsTitle: '适合需要头像和照片处理的人',
    testimonialsSubtitle: '用于职业头像、证件照、头像背景、裁剪缩放、换底、去背景和打印排版',
    testimonials: [
      { name: 'Sarah Chen', role: 'Product Manager', quote: '我先生成职业头像，再裁剪成适合资料页的尺寸，当天就更新了 LinkedIn。', avatar: 'SC' },
      { name: 'Marcus Johnson', role: 'Founder', quote: '团队头像、头像背景和尺寸处理可以放在一个流程里完成，省了很多沟通。', avatar: 'MJ' },
      { name: 'Emily Rodriguez', role: 'Marketing Director', quote: '证件照换底、去背景和打印排版都能一起处理，准备资料照片更省心。', avatar: 'ER' },
    ],
    pricingTitle: '购买点数，按需要生成职业头像',
    pricingSubtitle: '一次性付款，点数加入账户，用于生成不同职业头像风格；免费照片工具可辅助处理证件照和图片尺寸。',
    mostPopular: '最受欢迎',
    perPurchase: '一次性购买',
    headshots: '张头像',
    days: '天',
    planCtaTemplate: '选择 {planName}',
    viewAllPlans: '查看全部方案',
    bottomTitle: '准备生成头像或处理证件照了吗？',
    bottomText: '上传清晰照片，生成职业头像；也可以裁剪头像、缩放图片、换底、去背景，并制作证件照打印排版。',
    bottomPrimaryCta: '生成职业头像',
    bottomSecondaryCta: '查看照片工具',
  },
  es: {
    title: 'Generador de retratos profesionales con IA para LinkedIn y CV',
    description:
      'Crea retratos profesionales realistas con IA para LinkedIn, CV y perfiles de negocio con paquetes de créditos de pago único.',
    badge: 'Generador de retratos IA para LinkedIn',
    heading: 'Retratos profesionales con IA en minutos',
    subheading:
      'Compra créditos una vez, elige los estilos que necesitas y genera retratos profesionales realistas para LinkedIn, CV, perfiles de negocio y páginas de equipo, sin reservar una sesión de fotos.',
    primaryCta: 'Ver precios',
    secondaryCta: 'Subir fotos',
    highlights: ['Pago único, sin suscripción', 'Créditos por estilo seleccionado', 'Descargas en alta resolución'],
    howItWorksTitle: 'Cómo funciona',
    howItWorksSubtitle: 'Tres pasos rápidos para crear retratos profesionales realistas',
    steps: [
      { title: 'Sube selfies claros', text: 'Usa 1-3 fotos recientes con buena luz y el rostro visible.' },
      { title: 'Elige estilos profesionales', text: 'Selecciona los estilos que necesitas según tus créditos.' },
      { title: 'Descarga y usa', text: 'Guarda tus retratos en alta resolución para LinkedIn, CV y perfiles.' },
    ],
    featuresTitle: 'Por qué elegir Magic-Headshot',
    featuresSubtitle: 'Creado para retratos realistas, rápidos y listos para uso profesional',
    features: [
      { title: 'Modelo enfocado en retratos', text: 'Diseñado para resultados profesionales con parecido natural.' },
      { title: 'Estilos para trabajo', text: 'Opciones para LinkedIn, CV, sitios web, perfiles de empresa y equipos.' },
      { title: 'Privacidad primero', text: 'Tus fotos se usan solo para generar los retratos que solicitas.' },
      { title: 'Descargas HD', text: 'Imágenes 1024x1024 listas para perfiles y materiales profesionales.' },
      { title: 'Resultados rápidos', text: 'Actualiza tu perfil en minutos, no en días.' },
      { title: 'Útil para equipos', text: 'Crea retratos consistentes para equipos remotos y páginas corporativas.' },
    ],
    examplesTitle: '56 estilos de retrato IA agrupados por tipo',
    examplesSubtitle: 'Retratos profesionales y fotos para documentos y carnets, con fondos y estilos listos para usar.',
    styleNames: ['Oficina corporativa', 'Retrato ejecutivo', 'Business casual', 'Estudio sobrio', 'Foto LinkedIn', 'Foto para documento'],
    examplesCta: 'Probar el plan Basic',
    testimonialsTitle: 'Usado por profesionales de LinkedIn',
    testimonialsSubtitle: 'Para actualizar perfiles, CV y páginas de equipo con mejor presencia visual',
    testimonials: [
      { name: 'Sarah Chen', role: 'Product Manager', quote: 'El retrato quedó profesional y natural. Lo usé el mismo día en LinkedIn.', avatar: 'SC' },
      { name: 'Marcus Johnson', role: 'Founder', quote: 'Nos ahorró una sesión de fotos para el equipo remoto y mantuvo un estilo consistente.', avatar: 'MJ' },
      { name: 'Emily Rodriguez', role: 'Marketing Director', quote: 'La variedad de estilos me ayudó a elegir una foto más creíble para mi marca personal.', avatar: 'ER' },
    ],
    pricingTitle: 'Compra créditos y genera los estilos que quieras',
    pricingSubtitle: 'Un pago único, créditos añadidos a tu cuenta y uso por estilo seleccionado.',
    mostPopular: 'Más popular',
    perPurchase: 'pago único',
    headshots: 'retratos',
    days: 'días',
    planCtaTemplate: 'Elegir {planName}',
    viewAllPlans: 'Ver todos los planes',
    bottomTitle: '¿Listo para mejorar tu imagen profesional?',
    bottomText: 'Genera retratos realistas para LinkedIn, CV y perfiles de negocio cuando los necesites.',
    bottomPrimaryCta: 'Crear retratos ahora',
    bottomSecondaryCta: 'Ver precios',
  },
  fr: {
    title: 'Générateur de portraits professionnels IA pour LinkedIn et CV',
    description:
      'Créez des portraits professionnels réalistes avec l’IA pour LinkedIn, CV et profils business grâce à des packs de crédits à paiement unique.',
    badge: 'Générateur de portraits IA pour LinkedIn',
    heading: 'Portraits professionnels IA en quelques minutes',
    subheading:
      'Achetez des crédits une seule fois, choisissez les styles dont vous avez besoin et générez des portraits réalistes pour LinkedIn, CV, profils business et pages d’équipe, sans réserver de séance photo.',
    primaryCta: 'Voir les prix',
    secondaryCta: 'Importer des photos',
    highlights: ['Paiement unique, sans abonnement', 'Crédits déduits par style choisi', 'Téléchargements haute résolution'],
    howItWorksTitle: 'Comment ça marche',
    howItWorksSubtitle: 'Trois étapes rapides pour créer des portraits professionnels réalistes',
    steps: [
      { title: 'Importez des selfies clairs', text: 'Utilisez 1-3 photos récentes, bien éclairées, avec le visage visible.' },
      { title: 'Choisissez vos styles', text: 'Sélectionnez les styles professionnels adaptés à vos crédits.' },
      { title: 'Téléchargez vos portraits', text: 'Utilisez les images haute résolution sur LinkedIn, CV et profils business.' },
    ],
    featuresTitle: 'Pourquoi choisir Magic-Headshot',
    featuresSubtitle: 'Pensé pour des portraits réalistes, rapides et prêts pour un usage professionnel',
    features: [
      { title: 'Modèle orienté portrait', text: 'Conçu pour des résultats professionnels avec une ressemblance naturelle.' },
      { title: 'Styles professionnels', text: 'Options pour LinkedIn, CV, sites web, profils d’entreprise et équipes.' },
      { title: 'Confidentialité', text: 'Vos photos servent uniquement à créer les portraits demandés.' },
      { title: 'Téléchargements HD', text: 'Images 1024x1024 prêtes pour vos profils et supports professionnels.' },
      { title: 'Résultats rapides', text: 'Mettez votre profil à jour en quelques minutes, pas en plusieurs jours.' },
      { title: 'Adapté aux équipes', text: 'Créez des portraits cohérents pour équipes distantes et pages d’entreprise.' },
    ],
    examplesTitle: '56 styles de portraits IA, regroupés par type',
    examplesSubtitle: 'Portraits professionnels et photos pour documents et pièces d’identité, avec des fonds et des styles prêts à l’emploi.',
    styleNames: ['Bureau corporate', 'Portrait exécutif', 'Business casual', 'Studio sobre', 'Photo LinkedIn', 'Photo de document'],
    examplesCta: 'Essayer le plan Basic',
    testimonialsTitle: 'Apprécié par les professionnels LinkedIn',
    testimonialsSubtitle: 'Pour améliorer profils, CV et pages d’équipe avec une image plus crédible',
    testimonials: [
      { name: 'Sarah Chen', role: 'Product Manager', quote: 'Le portrait paraît professionnel et naturel. Je l’ai utilisé sur LinkedIn le jour même.', avatar: 'SC' },
      { name: 'Marcus Johnson', role: 'Fondateur', quote: 'Nous avons évité une séance photo d’équipe tout en gardant un style cohérent.', avatar: 'MJ' },
      { name: 'Emily Rodriguez', role: 'Marketing Director', quote: 'Les styles m’ont aidée à choisir une photo plus crédible pour ma marque personnelle.', avatar: 'ER' },
    ],
    pricingTitle: 'Achetez des crédits puis générez les styles souhaités',
    pricingSubtitle: 'Un paiement unique, des crédits ajoutés à votre compte et utilisés par style choisi.',
    mostPopular: 'Le plus populaire',
    perPurchase: 'paiement unique',
    headshots: 'portraits',
    days: 'jours',
    planCtaTemplate: 'Choisir {planName}',
    viewAllPlans: 'Voir tous les plans',
    bottomTitle: 'Prêt à améliorer votre image professionnelle ?',
    bottomText: 'Générez des portraits réalistes pour LinkedIn, CV et profils business selon vos besoins.',
    bottomPrimaryCta: 'Créer des portraits',
    bottomSecondaryCta: 'Voir les prix',
  },
  de: {
    title: 'KI-Headshot-Generator fur LinkedIn und Lebenslauf',
    description:
      'Erstelle realistische professionelle KI-Headshots fur LinkedIn, Lebenslauf und Business-Profile mit einmaligen Credit-Paketen.',
    badge: 'KI-Headshot-Generator fur LinkedIn',
    heading: 'Professionelle KI-Headshots in Minuten',
    subheading:
      'Kaufe Credits einmalig, wahle die benotigten Stile und erstelle realistische professionelle Headshots fur LinkedIn, Lebenslauf, Business-Profile und Teamseiten, ohne einen Fototermin zu planen.',
    primaryCta: 'Preise ansehen',
    secondaryCta: 'Fotos hochladen',
    highlights: ['Einmalzahlung, kein Abo', 'Credits pro ausgewahltem Stil', 'Downloads in hoher Auflosung'],
    howItWorksTitle: 'So funktioniert es',
    howItWorksSubtitle: 'Drei schnelle Schritte zu realistischen professionellen Headshots',
    steps: [
      { title: 'Klare Selfies hochladen', text: 'Nutze 1-3 aktuelle Fotos mit gutem Licht und sichtbarem Gesicht.' },
      { title: 'Professionelle Stile wählen', text: 'Wähle die Looks, die zu deinen Credits und deinem Profil passen.' },
      { title: 'Herunterladen und nutzen', text: 'Speichere hochauflösende Headshots für LinkedIn, Lebenslauf und Profile.' },
    ],
    featuresTitle: 'Warum Magic-Headshot',
    featuresSubtitle: 'Für realistische, schnelle und professionell nutzbare Profilbilder entwickelt',
    features: [
      { title: 'Portrait-fokussiertes Modell', text: 'Für professionelle Ergebnisse mit natürlicher Ähnlichkeit entwickelt.' },
      { title: 'Business-Stile', text: 'Optionen für LinkedIn, Lebenslauf, Websites, Unternehmensprofile und Teams.' },
      { title: 'Privatsphäre zuerst', text: 'Deine Fotos werden nur für die angeforderten Headshots verwendet.' },
      { title: 'HD-Downloads', text: '1024x1024 Bilder für Profile und berufliche Materialien.' },
      { title: 'Schnelle Ergebnisse', text: 'Aktualisiere dein Profil in Minuten statt in Tagen.' },
      { title: 'Teamfreundlich', text: 'Erstelle konsistente Headshots für Remote-Teams und Unternehmensseiten.' },
    ],
    examplesTitle: '56 KI-Headshot-Stile, nach Typ gruppiert',
    examplesSubtitle: 'Bewerbungs- und Business-Fotos sowie Passfotos in mehreren Hintergrundfarben, bereit zum Hochladen oder Drucken.',
    styleNames: ['Corporate Office', 'Executive Portrait', 'Business Casual', 'Clean Studio', 'LinkedIn Photo', 'Document Photo'],
    examplesCta: 'Basic Plan testen',
    testimonialsTitle: 'Geschätzt von LinkedIn-Profis',
    testimonialsSubtitle: 'Für Profilupdates, Bewerbungen und Teamseiten mit glaubwürdigerem Auftritt',
    testimonials: [
      { name: 'Sarah Chen', role: 'Product Manager', quote: 'Der Headshot wirkt professionell und natürlich. Ich habe ihn direkt auf LinkedIn genutzt.', avatar: 'SC' },
      { name: 'Marcus Johnson', role: 'Founder', quote: 'Für unser Remote-Team haben wir Zeit und Fototermin gespart und trotzdem einen einheitlichen Look bekommen.', avatar: 'MJ' },
      { name: 'Emily Rodriguez', role: 'Marketing Director', quote: 'Die Auswahl an Stilen half mir, ein glaubwürdigeres Bild für meine Personal Brand zu wählen.', avatar: 'ER' },
    ],
    pricingTitle: 'Credits kaufen und gewünschte Stile generieren',
    pricingSubtitle: 'Einmalzahlung, Credits im Konto und Abzug pro ausgewähltem Stil.',
    mostPopular: 'Am beliebtesten',
    perPurchase: 'Einmalzahlung',
    headshots: 'Headshots',
    days: 'Tage',
    planCtaTemplate: '{planName} wählen',
    viewAllPlans: 'Alle Pläne ansehen',
    bottomTitle: 'Bereit für ein besseres professionelles Profilbild?',
    bottomText: 'Erstelle realistische Headshots für LinkedIn, Lebenslauf und Business-Profile nach Bedarf.',
    bottomPrimaryCta: 'Headshots erstellen',
    bottomSecondaryCta: 'Preise ansehen',
  },
  ja: {
    title: 'LinkedIn・履歴書向けAIヘッドショット生成',
    description:
      'LinkedIn、履歴書、ビジネスプロフィール向けに、リアルなAIヘッドショットを一回払いのクレジットで作成できます。',
    badge: 'LinkedIn向けAIヘッドショット生成',
    heading: 'プロ向けAIヘッドショットを数分で作成',
    subheading:
      '一度クレジットを購入し、必要なスタイルを選んで、LinkedIn、履歴書、ビジネスプロフィール、チームページに使えるリアルなヘッドショットを、写真スタジオなしで生成できます。',
    primaryCta: '料金を見る',
    secondaryCta: '写真をアップロード',
    highlights: ['サブスクリプションなしの一回払い', '選択したスタイルごとにクレジット消費', '高解像度ダウンロード'],
    howItWorksTitle: '使い方',
    howItWorksSubtitle: 'リアルなプロ向けヘッドショットを3ステップで作成',
    steps: [
      { title: '鮮明な写真をアップロード', text: '明るく顔がはっきり見える最近のセルフィーを1〜3枚使います。' },
      { title: 'スタイルを選択', text: 'クレジットに合わせて、プロフィールに合うプロ向けスタイルを選びます。' },
      { title: 'ダウンロードして利用', text: 'LinkedIn、履歴書、ビジネスプロフィールに使える高解像度画像を保存します。' },
    ],
    featuresTitle: 'Magic-Headshotが選ばれる理由',
    featuresSubtitle: '自然でリアルなプロフィール写真を、すばやくプロ用途に使える形で作成',
    features: [
      { title: 'ポートレート向けモデル', text: '自然な似せ方とプロらしい仕上がりを重視しています。' },
      { title: 'ビジネス向けスタイル', text: 'LinkedIn、履歴書、会社プロフィール、チームページに使えます。' },
      { title: 'プライバシー重視', text: '写真は依頼されたヘッドショット作成のためにのみ扱われます。' },
      { title: 'HDダウンロード', text: '1024x1024画像をプロフィールや仕事用素材に利用できます。' },
      { title: '短時間で作成', text: '数日待たずに、数分でプロフィールを更新できます。' },
      { title: 'チームにも対応', text: 'リモートチームや会社ページ向けに統一感のある写真を作成できます。' },
    ],
    examplesTitle: '56種類のAIヘッドショットスタイル',
    examplesSubtitle: 'ビジネス向けポートレート、履歴書写真、証明写真を用途別に選べます。',
    styleNames: ['企業オフィス', '役員風ポートレート', 'ビジネスカジュアル', '落ち着いたスタジオ', 'LinkedIn用写真', '証明写真'],
    examplesCta: 'Basicプランを試す',
    testimonialsTitle: 'LinkedInユーザーに選ばれています',
    testimonialsSubtitle: 'プロフィール、履歴書、チームページをより信頼感のある印象に',
    testimonials: [
      { name: 'Sarah Chen', role: 'Product Manager', quote: '自然でプロらしい写真になり、その日のうちにLinkedInで使いました。', avatar: 'SC' },
      { name: 'Marcus Johnson', role: 'Founder', quote: 'リモートチーム用の写真を短時間で統一感のある見た目にできました。', avatar: 'MJ' },
      { name: 'Emily Rodriguez', role: 'Marketing Director', quote: '複数のスタイルから、自分のブランドに合う信頼感のある写真を選べました。', avatar: 'ER' },
    ],
    pricingTitle: 'クレジットを購入して、必要なスタイルを生成',
    pricingSubtitle: '一回払いでクレジットを追加し、選択したスタイルごとに利用します。',
    mostPopular: '人気',
    perPurchase: '一回払い',
    headshots: '枚',
    days: '日',
    planCtaTemplate: '{planName}を選択',
    viewAllPlans: 'すべてのプランを見る',
    bottomTitle: 'プロフィール写真をアップグレードしませんか？',
    bottomText: 'LinkedIn、履歴書、ビジネスプロフィール向けのリアルなAIヘッドショットを作成できます。',
    bottomPrimaryCta: '今すぐ作成',
    bottomSecondaryCta: '料金を見る',
  },
}

Object.assign(localizedHomeContent, {
  es: {
    ...localizedHomeContent.es,
    title: 'Fotos profesionales con IA para CV, LinkedIn y perfiles',
    description: 'Crea fotos profesionales con IA desde selfies para CV, LinkedIn, webs, perfiles de empresa y equipos con resultados naturales.',
    heading: 'Fotos profesionales con IA que siguen pareciendo tuyas',
    subheading: 'Sube selfies claras, elige estilos utiles y genera retratos para trabajo, redes profesionales, bios, propuestas y paginas de equipo sin organizar una sesion de fotos.',
    highlights: ['Resultados reconocibles', 'Estilos para trabajo real', 'Listo para perfiles y webs'],
    howItWorksSubtitle: 'Un flujo pensado para quien necesita actualizar su imagen publica sin perder tiempo coordinando estudio, ropa, agenda y retoques.',
    featuresSubtitle: 'En vez de una galeria generica, elige resultados que encajen con el mercado, el sector y el uso donde se vera la foto.',
    examplesSubtitle: 'Compara retratos profesionales y fotos para documentos o carnets antes de decidir cual usar en tus perfiles.',
    bottomText: 'Prepara una imagen profesional que puedas usar en LinkedIn, CV, pagina personal, propuesta comercial o directorio de equipo.',
  },
  de: {
    ...localizedHomeContent.de,
    title: 'Professionelle KI Fotos fuer Profile, Teams und Personal Branding',
    description: 'Erstelle realistische berufliche Portraits aus eigenen Fotos fuer LinkedIn, Lebenslauf, Website, Teamseite und oeffentliche Profile.',
    heading: 'KI Portraits, die professionell wirken und erkennbar bleiben',
    subheading: 'Lade klare Selfies hoch, waehle passende Stilrichtungen und erzeuge Fotos fuer berufliche Profile, Bios, Angebote und Teamseiten ohne Fototermin.',
    highlights: ['Erkennbare Ergebnisse', 'Stile fuer echte Berufskontexte', 'Geeignet fuer Profile und Websites'],
    howItWorksSubtitle: 'Ein praktischer Ablauf fuer alle, die ein aktuelles berufliches Bild brauchen, ohne Studio, Terminplanung und lange Abstimmung.',
    featuresSubtitle: 'Waehle nicht nur das schoenste Bild, sondern ein Ergebnis, das zu Rolle, Branche und Einsatzort passt.',
    examplesSubtitle: 'Vergleiche professionelle Portraits und Passfotos, bevor du ein Bild veroeffentlichst.',
    bottomText: 'Erstelle ein professionelles Foto fuer LinkedIn, Lebenslauf, Website, Verkaufsunterlagen oder Teamverzeichnis.',
  },
  ja: {
    ...localizedHomeContent.ja,
    title: 'プロフィール、チーム、仕事用に使えるAI写真',
    description: '自分の写真から、LinkedIn、履歴書、Webサイト、社員紹介、公開プロフィールで使いやすい自然な仕事用ポートレートを作成できます。',
    heading: '本人らしさを残した仕事用AIプロフィール写真',
    subheading: 'はっきりした自撮りをアップロードし、用途に合うスタイルを選ぶだけで、プロフィール、自己紹介、提案資料、チームページに使える写真を作れます。',
    highlights: ['本人らしい仕上がり', '仕事の用途に合うスタイル', 'プロフィールやWebサイトで使いやすい'],
    howItWorksSubtitle: 'スタジオ予約や撮影準備をせずに、今の自分に近い仕事用写真を用意するための流れです。',
    featuresSubtitle: '派手な写真ではなく、職種、見られる場面、使うページに合う写真を選びやすくしています。',
    examplesSubtitle: '落ち着いた仕事用写真と証明写真を比較してから選べます。',
    bottomText: 'LinkedIn、履歴書、個人サイト、営業資料、社員紹介で使いやすい写真を準備できます。',
  },
})
