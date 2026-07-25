import type { Metadata } from 'next'
import { appConfig } from '@/lib/config'
import { OPEN_GRAPH_LOCALES, languageAlternatesForPath, localePath, type Locale } from '@/lib/i18n'

export const USE_CASE_PAGE_SLUGS = [
  'ai-headshot-linkedin',
  'ai-headshot-corporate',
  'ai-headshot-resume',
  'ai-headshot-studio-style',
  'ai-headshot-professional-photo',
] as const

export type UseCasePageSlug = (typeof USE_CASE_PAGE_SLUGS)[number]

export type UseCasePageContent = {
  title: string
  description: string
  keywords: string[]
  eyebrow: string
  h1: string
  intro: string
  primaryCta: string
  secondaryCta: string
  casesTitle: string
  casesText: string
  cases: { title: string; text: string }[]
  guidanceTitle: string
  guidanceText: string
  checklist: string[]
  linksTitle: string
  linksText: string
  relatedLinks: { href: string; label: string; description: string }[]
  faqTitle: string
  faqText: string
  faqs: { question: string; answer: string }[]
}

export const useCaseHeroImage = '/home-pages/Ai%20headshot-linkedin-professional.jpg'

const englishRelated: Record<UseCasePageSlug, UseCasePageContent['relatedLinks']> = {
  'ai-headshot-linkedin': [
    { href: '/ai-headshot-corporate', label: 'Corporate headshots', description: 'Plan a consistent profile image for teams and company pages.' },
    { href: '/ai-headshot-resume', label: 'Resume photo guidance', description: 'Choose a calmer image for CVs, resumes, and applications.' },
    { href: '/sample', label: 'Sample comparisons', description: 'Compare source selfies with generated professional portraits.' },
    { href: '/questions', label: 'Upload questions', description: 'Check photo quality, credits, and commercial usage before starting.' },
  ],
  'ai-headshot-corporate': [
    { href: '/ai-headshot-linkedin', label: 'LinkedIn profile headshots', description: 'Keep employee LinkedIn photos aligned with the public team page.' },
    { href: '/ai-headshot-studio-style', label: 'Studio-style portraits', description: 'Use a polished background direction when the brand needs formality.' },
    { href: '/sample', label: 'Team-ready samples', description: 'Review examples before setting a style rule for everyone.' },
    { href: '/pricing', label: 'Credit packs', description: 'Pick a one-time pack before generating portraits.' },
  ],
  'ai-headshot-resume': [
    { href: '/ai-headshot-linkedin', label: 'LinkedIn headshots', description: 'Match the application photo with your public profile.' },
    { href: '/ai-headshot-professional-photo', label: 'Professional photo maker', description: 'Build a broader work profile image for bios and directories.' },
    { href: '/questions', label: 'Photo upload FAQ', description: 'Prepare source photos that protect likeness and avoid artifacts.' },
    { href: '/sample', label: 'Resume-style examples', description: 'Inspect realistic examples before choosing a plan.' },
  ],
  'ai-headshot-studio-style': [
    { href: '/ai-headshot-professional-photo', label: 'Professional photo page', description: 'Compare a studio look with a more flexible work profile image.' },
    { href: '/ai-headshot-corporate', label: 'Corporate team headshots', description: 'Apply the same studio direction across staff pages.' },
    { href: '/sample', label: 'Before and after samples', description: 'Use examples to judge background, lighting, and expression.' },
    { href: '/pricing', label: 'View plans', description: 'Choose credits for the number of styles you want to generate.' },
  ],
  'ai-headshot-professional-photo': [
    { href: '/ai-headshot-linkedin', label: 'LinkedIn use case', description: 'Tune the same portrait for recruiter and network discovery.' },
    { href: '/ai-headshot-resume', label: 'Resume use case', description: 'Choose a restrained version for applications and CV contexts.' },
    { href: '/ai-headshot-studio-style', label: 'Studio-style option', description: 'Use a more formal portrait direction when needed.' },
    { href: '/questions', label: 'Common questions', description: 'Understand credits, uploads, downloads, and commercial use.' },
  ],
}

const localizedRelated: Record<Exclude<Locale, 'en' | 'zh'>, Record<UseCasePageSlug, UseCasePageContent['relatedLinks']>> = {
  es: {
    'ai-headshot-linkedin': [
      { href: '/ai-headshot-corporate', label: 'Retratos corporativos', description: 'Mantén una imagen coherente para equipos, webs y perfiles de empresa.' },
      { href: '/ai-headshot-resume', label: 'Foto para CV', description: 'Prepara una versión más sobria cuando el mercado espera foto en el CV.' },
      { href: '/sample', label: 'Ejemplos antes/después', description: 'Compara selfies originales con retratos generados.' },
      { href: '/questions', label: 'Preguntas de subida', description: 'Revisa calidad de fotos, créditos y uso profesional.' },
    ],
    'ai-headshot-corporate': [
      { href: '/ai-headshot-linkedin', label: 'LinkedIn profesional', description: 'Alinea la foto del equipo con su presencia pública.' },
      { href: '/ai-headshot-studio-style', label: 'Estilo estudio', description: 'Usa fondos y luz más formales para marcas conservadoras.' },
      { href: '/sample', label: 'Muestras visuales', description: 'Evalúa parecido, ropa y fondo antes de generar.' },
      { href: '/pricing', label: 'Planes de créditos', description: 'Elige un paquete único para crear los estilos necesarios.' },
    ],
    'ai-headshot-resume': [
      { href: '/ai-headshot-linkedin', label: 'Foto para LinkedIn', description: 'Mantén coherencia entre candidatura y perfil público.' },
      { href: '/ai-headshot-professional-photo', label: 'Foto profesional', description: 'Crea una imagen útil para bio, firma y perfiles.' },
      { href: '/questions', label: 'FAQ de fotos', description: 'Prepara selfies claros y evita resultados con artefactos.' },
      { href: '/sample', label: 'Ejemplos para CV', description: 'Mira muestras realistas antes de elegir plan.' },
    ],
    'ai-headshot-studio-style': [
      { href: '/ai-headshot-professional-photo', label: 'Foto profesional', description: 'Compara un estilo estudio con un perfil más flexible.' },
      { href: '/ai-headshot-corporate', label: 'Equipo corporativo', description: 'Aplica una dirección visual común a todo el equipo.' },
      { href: '/sample', label: 'Antes y después', description: 'Comprueba fondo, iluminación y expresión.' },
      { href: '/pricing', label: 'Ver planes', description: 'Compra créditos según los estilos que quieras generar.' },
    ],
    'ai-headshot-professional-photo': [
      { href: '/ai-headshot-linkedin', label: 'Uso en LinkedIn', description: 'Adapta la imagen para búsqueda, networking y reclutadores.' },
      { href: '/ai-headshot-resume', label: 'Uso en CV', description: 'Prepara una versión sobria para candidaturas.' },
      { href: '/ai-headshot-studio-style', label: 'Estilo estudio', description: 'Elige un look más formal cuando la marca lo requiere.' },
      { href: '/questions', label: 'Preguntas comunes', description: 'Entiende créditos, descargas y uso comercial.' },
    ],
  },
  fr: {
    'ai-headshot-linkedin': [
      { href: '/ai-headshot-corporate', label: 'Portraits corporate', description: 'Gardez une image cohérente entre équipe, site et profils publics.' },
      { href: '/ai-headshot-resume', label: 'Photo de CV', description: 'Préparez une version plus sobre quand la candidature l exige.' },
      { href: '/sample', label: 'Exemples avant/après', description: 'Comparez selfies sources et portraits générés.' },
      { href: '/questions', label: 'Questions d import', description: 'Vérifiez qualité photo, crédits et droits d usage.' },
    ],
    'ai-headshot-corporate': [
      { href: '/ai-headshot-linkedin', label: 'Photo LinkedIn', description: 'Alignez le profil public des collaborateurs avec la page entreprise.' },
      { href: '/ai-headshot-studio-style', label: 'Style studio', description: 'Choisissez une lumière et un fond plus formels pour la marque.' },
      { href: '/sample', label: 'Exemples visuels', description: 'Jugez ressemblance, tenue et arrière-plan avant de générer.' },
      { href: '/pricing', label: 'Packs de crédits', description: 'Achetez un pack unique selon les styles nécessaires.' },
    ],
    'ai-headshot-resume': [
      { href: '/ai-headshot-linkedin', label: 'Portrait LinkedIn', description: 'Gardez une image cohérente entre candidature et profil public.' },
      { href: '/ai-headshot-professional-photo', label: 'Photo professionnelle', description: 'Créez une image utile pour bio, annuaire et signature.' },
      { href: '/questions', label: 'FAQ photos', description: 'Préparez des selfies clairs pour limiter les artefacts.' },
      { href: '/sample', label: 'Exemples CV', description: 'Inspectez des résultats réalistes avant de choisir.' },
    ],
    'ai-headshot-studio-style': [
      { href: '/ai-headshot-professional-photo', label: 'Photo professionnelle', description: 'Comparez un rendu studio avec une photo de profil plus souple.' },
      { href: '/ai-headshot-corporate', label: 'Équipe corporate', description: 'Déployez une direction visuelle commune sur le site équipe.' },
      { href: '/sample', label: 'Avant/après', description: 'Vérifiez fond, lumière et expression.' },
      { href: '/pricing', label: 'Voir les plans', description: 'Choisissez des crédits selon les styles à générer.' },
    ],
    'ai-headshot-professional-photo': [
      { href: '/ai-headshot-linkedin', label: 'Usage LinkedIn', description: 'Adaptez la photo à la découverte recruteur et réseau.' },
      { href: '/ai-headshot-resume', label: 'Usage CV', description: 'Préparez une version sobre pour les candidatures.' },
      { href: '/ai-headshot-studio-style', label: 'Option studio', description: 'Utilisez un rendu plus formel lorsque nécessaire.' },
      { href: '/questions', label: 'Questions courantes', description: 'Comprenez crédits, téléchargements et usage commercial.' },
    ],
  },
  de: {
    'ai-headshot-linkedin': [
      { href: '/ai-headshot-corporate', label: 'Corporate Headshots', description: 'Halte Teamseite, Firmenprofil und öffentliche Profile konsistent.' },
      { href: '/ai-headshot-resume', label: 'Bewerbungsfoto', description: 'Wähle eine ruhigere Version für Lebenslauf und Bewerbung.' },
      { href: '/sample', label: 'Vorher-nachher Beispiele', description: 'Vergleiche Selfies mit generierten Business-Portraits.' },
      { href: '/questions', label: 'Upload Fragen', description: 'Prüfe Fotoqualität, Credits und berufliche Nutzung.' },
    ],
    'ai-headshot-corporate': [
      { href: '/ai-headshot-linkedin', label: 'LinkedIn Profilbild', description: 'Stimme Mitarbeiterprofile mit der öffentlichen Teamseite ab.' },
      { href: '/ai-headshot-studio-style', label: 'Studio-Stil', description: 'Nutze formellere Hintergründe für konservative Marken.' },
      { href: '/sample', label: 'Visuelle Beispiele', description: 'Bewerte Ähnlichkeit, Kleidung und Hintergrund vorab.' },
      { href: '/pricing', label: 'Credit-Pakete', description: 'Kaufe einmalig Credits für die benötigten Stile.' },
    ],
    'ai-headshot-resume': [
      { href: '/ai-headshot-linkedin', label: 'LinkedIn Headshot', description: 'Halte Bewerbung und öffentliches Profil visuell zusammen.' },
      { href: '/ai-headshot-professional-photo', label: 'Professionelles Foto', description: 'Erstelle ein Bild für Bio, Verzeichnis und Signatur.' },
      { href: '/questions', label: 'Foto FAQ', description: 'Bereite klare Selfies vor und vermeide Artefakte.' },
      { href: '/sample', label: 'Bewerbungsfoto Beispiele', description: 'Prüfe realistische Ergebnisse vor der Planauswahl.' },
    ],
    'ai-headshot-studio-style': [
      { href: '/ai-headshot-professional-photo', label: 'Professionelles Foto', description: 'Vergleiche Studio-Look mit einem flexibleren Profilbild.' },
      { href: '/ai-headshot-corporate', label: 'Corporate Team', description: 'Übertrage eine visuelle Richtung auf Teamseiten.' },
      { href: '/sample', label: 'Vorher und nachher', description: 'Prüfe Hintergrund, Licht und Ausdruck.' },
      { href: '/pricing', label: 'Pläne ansehen', description: 'Wähle Credits passend zu den gewünschten Stilen.' },
    ],
    'ai-headshot-professional-photo': [
      { href: '/ai-headshot-linkedin', label: 'LinkedIn Einsatz', description: 'Passe das Bild für Recruiter, Netzwerk und Suche an.' },
      { href: '/ai-headshot-resume', label: 'Lebenslauf Einsatz', description: 'Wähle eine zurückhaltende Version für Bewerbungen.' },
      { href: '/ai-headshot-studio-style', label: 'Studio-Option', description: 'Nutze einen formelleren Look, wenn der Kontext es braucht.' },
      { href: '/questions', label: 'Häufige Fragen', description: 'Verstehe Credits, Downloads und kommerzielle Nutzung.' },
    ],
  },
  ja: {
    'ai-headshot-linkedin': [
      { href: '/ai-headshot-corporate', label: '企業向け写真', description: '社員紹介、会社サイト、公開プロフィールの印象をそろえます。' },
      { href: '/ai-headshot-resume', label: '履歴書向け写真', description: '応募書類で使いやすい落ち着いた写真を準備します。' },
      { href: '/sample', label: '生成サンプル', description: '元写真と生成結果を見比べて品質を確認できます。' },
      { href: '/questions', label: 'よくある質問', description: '写真の選び方、クレジット、商用利用を確認できます。' },
    ],
    'ai-headshot-corporate': [
      { href: '/ai-headshot-linkedin', label: 'LinkedIn用写真', description: '社員の公開プロフィールと会社ページの印象を合わせます。' },
      { href: '/ai-headshot-studio-style', label: 'スタジオ風写真', description: 'よりフォーマルな背景と光の方向性を選べます。' },
      { href: '/sample', label: 'サンプルを見る', description: '顔の自然さ、服装、背景を事前に確認できます。' },
      { href: '/pricing', label: '料金を見る', description: '必要なスタイル数に合わせてクレジットを選べます。' },
    ],
    'ai-headshot-resume': [
      { href: '/ai-headshot-linkedin', label: 'LinkedIn用写真', description: '応募書類と公開プロフィールの見え方をそろえます。' },
      { href: '/ai-headshot-professional-photo', label: '仕事用プロフィール写真', description: '職務経歴、自己紹介、社内プロフィールにも使えます。' },
      { href: '/questions', label: '写真FAQ', description: '明るい元写真を用意して不自然な生成を避けます。' },
      { href: '/sample', label: '履歴書向けサンプル', description: '生成例を見てからプランを選べます。' },
    ],
    'ai-headshot-studio-style': [
      { href: '/ai-headshot-professional-photo', label: '仕事用写真', description: 'スタジオ風と汎用プロフィール写真を比較できます。' },
      { href: '/ai-headshot-corporate', label: '企業チーム向け', description: '社員紹介ページに合う統一感を作れます。' },
      { href: '/sample', label: 'ビフォーアフター', description: '背景、光、表情の違いを確認できます。' },
      { href: '/pricing', label: 'プランを見る', description: '生成したいスタイルに合わせて選べます。' },
    ],
    'ai-headshot-professional-photo': [
      { href: '/ai-headshot-linkedin', label: 'LinkedInで使う', description: '採用担当者や取引先に見られるプロフィール向けです。' },
      { href: '/ai-headshot-resume', label: '履歴書で使う', description: '応募書類向けに落ち着いた写真を選べます。' },
      { href: '/ai-headshot-studio-style', label: 'スタジオ風', description: 'より正式な場面に合う写真を作れます。' },
      { href: '/questions', label: 'よくある質問', description: 'クレジット、ダウンロード、商用利用を確認できます。' },
    ],
  },
}

export const useCasePages: Record<UseCasePageSlug, Record<Exclude<Locale, 'zh'>, UseCasePageContent>> = {
  'ai-headshot-linkedin': {
    en: {
      title: 'AI Headshot for LinkedIn Profiles | Magic-Headshot',
      description: 'Create a realistic AI headshot for LinkedIn profiles, recruiter search, founder bios, and business networking without booking a studio.',
      keywords: ['AI headshot for LinkedIn', 'LinkedIn profile photo maker', 'professional LinkedIn headshot', 'AI LinkedIn photo'],
      eyebrow: 'LinkedIn profile photo use case',
      h1: 'AI Headshot for LinkedIn Profiles That Need a Credible First Impression',
      intro: 'A LinkedIn headshot has to do a different job than a studio portrait. It appears in recruiter search, connection requests, comment threads, sales outreach, speaker bios, and company announcements, often at a very small size. This page is built for professionals who want a clear, approachable image that still feels business-ready. Use it when your current selfie looks too casual, your old corporate photo no longer matches you, or you need a profile refresh before applications, client outreach, or a new role announcement.',
      primaryCta: 'Generate LinkedIn headshots',
      secondaryCta: 'Compare samples',
      casesTitle: 'Where this LinkedIn headshot works best',
      casesText: 'Use the page as a practical brief before generating, especially when one photo needs to support multiple LinkedIn moments.',
      cases: [
        { title: 'Recruiter discovery', text: 'Use a direct, well-lit portrait that stays readable in search results and profile previews.' },
        { title: 'Founder and expert profiles', text: 'Choose a confident but approachable look for investor updates, podcasts, and speaking pages.' },
        { title: 'Sales and client outreach', text: 'Avoid overly stylized images; trust matters more than drama in a cold message preview.' },
      ],
      guidanceTitle: 'LinkedIn-specific guidance',
      guidanceText: 'The strongest LinkedIn image usually feels current, calm, and easy to recognize. Keep the crop close enough for mobile, use simple clothing, and avoid backgrounds that compete with the face.',
      checklist: ['Clear face and eye contact', 'Modern business or smart-casual wardrobe', 'Neutral background with enough contrast', 'Expression that feels reachable, not staged'],
      linksTitle: 'Plan the rest of your profile photo set',
      linksText: 'These pages help you adapt the same generation session for a resume, team page, or comparison review.',
      relatedLinks: englishRelated['ai-headshot-linkedin'],
      faqTitle: 'LinkedIn headshot questions',
      faqText: 'Answers focused on LinkedIn profile use, source photos, and style choices.',
      faqs: [
        { question: 'Can I use the same AI headshot on LinkedIn and a company bio?', answer: 'Yes. Many people use one polished portrait across LinkedIn, company bios, speaker pages, and email signatures, as long as the crop and tone fit each context.' },
        { question: 'What should I upload for a LinkedIn-style result?', answer: 'Upload recent selfies with clear lighting, a visible face, and no heavy filters. A few angles help the generator keep your likeness stable.' },
        { question: 'Should a LinkedIn photo look formal?', answer: 'It should match your field. Corporate, legal, and consulting profiles often benefit from a formal look, while creative or startup roles can use a warmer smart-casual portrait.' },
      ],
    },
    es: {
      title: "Foto para LinkedIn con IA: guia practica para perfiles en Espana y Latam",
      description: "Como elegir una foto de LinkedIn con IA que parezca actual, reconocible y util para busqueda, networking y mensajes profesionales.",
      keywords: ['foto LinkedIn IA', 'headshot LinkedIn IA', 'foto profesional LinkedIn', 'retrato profesional IA'],
      eyebrow: 'Caso de uso para LinkedIn',
      h1: "Foto para LinkedIn con IA que no parezca una plantilla",
      intro: "En muchos mercados hispanos LinkedIn se revisa desde el movil, antes de una llamada, una candidatura o una conversacion comercial. La foto no tiene que parecer una sesion de lujo; debe ayudar a que te reconozcan rapido, se lea bien en pequeno y encaje con el sector donde quieres generar confianza.",
      primaryCta: 'Generar fotos para LinkedIn',
      secondaryCta: 'Ver ejemplos',
      casesTitle: 'Uso local para LinkedIn',
      casesText: "Piensa en el contexto local antes de elegir el estilo: reclutamiento, venta consultiva, marca personal o una red profesional donde la cercania pesa tanto como el acabado.",
      cases: [
        {
          title: "Busqueda de empleo",
          text: "Usa un encuadre limpio y una expresion natural, porque muchas visitas llegan desde busquedas y recomendaciones.",
        },
        {
          title: "Consultores y perfiles expertos",
          text: "Elige ropa y fondo acordes con el tipo de cliente, sin convertir la foto en anuncio.",
        },
        {
          title: "Ventas y networking",
          text: "Una imagen demasiado artificial puede bajar confianza; mejor claridad, mirada directa y fondo tranquilo.",
        },
      ],
      guidanceTitle: "Criterios locales para LinkedIn",
      guidanceText: "Evita el exceso de retoque y los fondos demasiado aspiracionales. En Espana y Latinoamerica suele funcionar mejor una foto clara, cercana y profesional que una imagen hiperproducida.",
      checklist: ["Rostro reconocible en vista movil", "Ropa coherente con el sector", "Fondo simple sin ruido visual", "Expresion cercana, no rigida"],
      linksTitle: 'Completa tu set profesional',
      linksText: 'Usa estos enlaces para adaptar la foto a CV, equipo o revisión visual.',
      relatedLinks: localizedRelated.es['ai-headshot-linkedin'],
      faqTitle: "Preguntas sobre fotos para LinkedIn",
      faqText: "Respuestas practicas para elegir una foto de perfil sin caer en un resultado generico.",
      faqs: [
        {
          question: "Debe parecer una foto de estudio?",
          answer: "No siempre. Para muchos perfiles funciona mejor una imagen natural, bien iluminada y creible que una foto demasiado formal.",
        },
        {
          question: "Puedo usar la misma foto en CV y LinkedIn?",
          answer: "Si, si el estilo es sobrio. Si LinkedIn necesita mas cercania, genera una version ligeramente mas expresiva.",
        },
      ],
    },
    fr: {
      title: 'Photo LinkedIn IA pour profils professionnels',
      description: 'Créez une photo LinkedIn IA pour recruteurs, réseau, prospection et profils entreprise sans séance studio.',
      keywords: ['photo LinkedIn IA', 'portrait LinkedIn IA', 'photo professionnelle LinkedIn', 'portrait professionnel IA'],
      eyebrow: 'Usage LinkedIn',
      h1: 'Photo LinkedIn IA pour un profil crédible dès le premier contact',
      intro: 'Sur LinkedIn, la photo accompagne les recherches recruteur, les invitations, les commentaires, les messages de prospection et les pages entreprise. En France, en Belgique ou au Canada francophone, elle doit rester professionnelle sans donner l impression d une photo figée. Cette page aide à préparer un portrait clair, reconnaissable et adapté à un profil consultant, manager, fondateur ou candidat, avec un rendu utilisable aussi sur une bio courte, une signature ou une page équipe.',
      primaryCta: 'Générer des photos LinkedIn',
      secondaryCta: 'Voir les exemples',
      casesTitle: 'Contextes LinkedIn fréquents',
      casesText: 'Choisissez le style selon le moment où la photo sera vue.',
      cases: [
        { title: 'Recherche recruteur', text: 'Un visage net et bien cadré reste lisible dans les listes de profils.' },
        { title: 'Indépendants et consultants', text: 'Le portrait doit inspirer confiance sans paraître distant.' },
        { title: 'Fondateurs et managers', text: 'Utile pour LinkedIn, pages presse, événements et bios entreprise.' },
      ],
      guidanceTitle: 'Conseils pour LinkedIn',
      guidanceText: 'Privilégiez une image actuelle, sobre et facile à reconnaître. Les métiers conseil, finance et direction acceptent un rendu plus formel; les profils produit, design ou tech peuvent rester plus naturels.',
      checklist: ['Visage clair et regard direct', 'Tenue adaptée au secteur', 'Fond discret avec contraste', 'Expression ouverte et professionnelle'],
      linksTitle: 'Préparer les autres usages',
      linksText: 'Ces pages aident à décliner la photo pour CV, équipe ou comparaison.',
      relatedLinks: localizedRelated.fr['ai-headshot-linkedin'],
      faqTitle: 'Questions photo LinkedIn',
      faqText: 'Style, selfies source et usages professionnels.',
      faqs: [
        { question: 'Puis-je utiliser la même photo sur LinkedIn et une bio entreprise ?', answer: 'Oui, si le cadrage et le niveau de formalité conviennent aux deux supports. Une version plus sobre peut mieux fonctionner sur un site corporate.' },
        { question: 'Quelles photos importer ?', answer: 'Utilisez des selfies récents, bien éclairés, sans filtre fort. Plusieurs angles améliorent la stabilité de la ressemblance.' },
        { question: 'La photo doit-elle être très formelle ?', answer: 'Cela dépend du métier. Conseil, finance ou juridique demandent souvent plus de sobriété; tech et création peuvent tolérer un rendu plus chaleureux.' },
      ],
    },
    de: {
      title: "LinkedIn Profilbild mit KI: serioes, erkennbar und mobil lesbar",
      description: "So waehlst du ein KI Profilbild fuer LinkedIn, das in Suche, Nachrichten und Recruiter-Ansicht glaubwuerdig wirkt.",
      keywords: ['LinkedIn Profilbild KI', 'KI Headshot LinkedIn', 'professionelles LinkedIn Foto', 'Business Profilbild KI'],
      eyebrow: 'LinkedIn Profilbild',
      h1: "LinkedIn Profilbild mit KI ohne Standard-Look",
      intro: "Im deutschsprachigen Markt wirkt ein gutes LinkedIn Foto oft ruhiger als eine Werbeanzeige. Es soll Kompetenz zeigen, aber nicht uebertreiben. Wichtig sind Wiedererkennbarkeit, klare Augen, ein sauberer Ausschnitt und ein Stil, der zu Branche und Senioritaet passt.",
      primaryCta: 'LinkedIn Headshots generieren',
      secondaryCta: 'Beispiele ansehen',
      casesTitle: 'Typische LinkedIn-Situationen',
      casesText: "Denke zuerst an die Situation, in der das Bild gesehen wird: Recruiter-Suche, Beratung, Vertrieb, Gruenderprofil oder fachliche Sichtbarkeit.",
      cases: [
        {
          title: "Jobsuche und Recruiting",
          text: "Das Gesicht muss in kleinen Vorschauen klar bleiben und zum Lebenslauf passen.",
        },
        {
          title: "Beratung und Expertenprofil",
          text: "Ein ruhiger Hintergrund und passende Kleidung wirken oft staerker als ein dramatischer Look.",
        },
        {
          title: "Netzwerk und Vertrieb",
          text: "Vertrauen entsteht eher durch Klarheit und Natuerlichkeit als durch zu viel Inszenierung.",
        },
      ],
      guidanceTitle: "Was im DACH-Kontext gut funktioniert",
      guidanceText: "Waehle lieber ein glaubwuerdiges, aktuelles Foto als das spektakulaerste Ergebnis. Zu glatte Haut, Luxus-Hintergrund oder uebertriebene Pose koennen schnell kuenstlich wirken.",
      checklist: ["Gesicht in mobiler Vorschau lesbar", "Kleidung passend zu Branche und Rolle", "Ruhiger Hintergrund", "Natuerlicher Ausdruck statt starrer Pose"],
      linksTitle: 'Weitere Profilbilder planen',
      linksText: 'Diese Seiten helfen bei Bewerbung, Teamseite und Qualitätsvergleich.',
      relatedLinks: localizedRelated.de['ai-headshot-linkedin'],
      faqTitle: "Fragen zum LinkedIn Profilbild",
      faqText: "Praktische Orientierung fuer ein professionelles Bild ohne Ueberinszenierung.",
      faqs: [
        {
          question: "Muss es wie ein Studiofoto aussehen?",
          answer: "Nein. Ein klares, aktuelles und natuerliches Foto ist oft glaubwuerdiger als ein sehr formeller Studio-Look.",
        },
        {
          question: "Kann ich es auch im Lebenslauf nutzen?",
          answer: "Ja, wenn es ruhig genug ist. Fuer Bewerbungen kann eine etwas neutralere Variante sinnvoll sein.",
        },
      ],
    },
    ja: {
      title: "LinkedIn用プロフィール写真をAIで作成",
      description: "採用担当者や取引先に見られるLinkedInプロフィール向けに、自然で信頼感のある仕事用プロフィール写真をAIで作成するための実用ガイドです。",
      keywords: ['LinkedIn 写真 AI', 'AIヘッドショット LinkedIn', 'プロフィール写真 AI', '仕事用写真 AI'],
      eyebrow: 'LinkedInプロフィール向け',
      h1: "LinkedInで信頼感を伝えるプロフィール写真",
      intro: "LinkedInのプロフィール写真は、検索結果、つながり申請、コメント欄、営業メッセージ、会社紹介など小さな表示で何度も見られます。大切なのは、過度に加工された写真ではなく、今の自分に近く、表情が読み取りやすく、仕事の文脈に合うことです。このページでは、手元の写真からLinkedInで使いやすいプロフィール写真を用意する考え方をまとめています。",
      primaryCta: 'LinkedIn写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: 'LinkedInで使いやすい場面',
      casesText: "プロフィール閲覧、転職活動、営業、登壇者紹介など、同じ写真を複数の接点で使う場合に向いています。",
      cases: [
        {
          title: "採用担当者の検索",
          text: "小さな検索結果でも顔が読み取りやすい、明るく正面に近い写真が役立ちます。",
        },
        {
          title: "専門家・創業者プロフィール",
          text: "登壇、投資家向け資料、会社紹介でも使える落ち着いた印象を作れます。",
        },
        {
          title: "営業・ネットワーキング",
          text: "初対面の相手にも安心感を与えやすい、自然で親しみのある写真を選べます。",
        },
      ],
      guidanceTitle: "LinkedIn向けの選び方",
      guidanceText: "顔がはっきり見え、背景が主張しすぎず、服装が職種と合っている写真を選びます。親しみやすさと信頼感のバランスが大切です。",
      checklist: ["顔と目線がはっきり見える", "スマートカジュアルまたはビジネス寄りの服装", "背景がシンプルで顔を邪魔しない", "自然で近づきやすい表情"],
      linksTitle: 'ほかの用途も準備する',
      linksText: '履歴書、社員紹介、サンプル確認に進めます。',
      relatedLinks: localizedRelated.ja['ai-headshot-linkedin'],
      faqTitle: "LinkedIn写真のよくある質問",
      faqText: "AIで作るLinkedIn向けプロフィール写真の使い方と注意点。",
      faqs: [
        {
          question: "会社紹介ページにも同じ写真を使えますか？",
          answer: "はい。LinkedIn、会社紹介、登壇者プロフィール、メール署名などで同じ写真を使えます。用途ごとに切り抜きを調整すると自然です。",
        },
        {
          question: "どんな元写真をアップロードすべきですか？",
          answer: "明るく、顔がはっきり見える最近の自撮り写真を使ってください。強いフィルターや大きな影がある写真は避けるのがおすすめです。",
        },
      ],
    },
  },
  'ai-headshot-corporate': {
    en: {
      title: 'AI Corporate Headshots for Teams and Company Pages',
      description: 'Create AI corporate headshots for staff pages, team directories, sales profiles, and consistent business portraits.',
      keywords: ['AI corporate headshots', 'team headshot generator', 'business headshot AI', 'company profile photos'],
      eyebrow: 'Corporate team photo use case',
      h1: 'AI Corporate Headshots for Teams, Staff Pages, and Company Profiles',
      intro: 'Corporate headshots need consistency more than glamour. A team page with mixed crops, old photos, casual selfies, and different backgrounds can make even a strong company look improvised. This page is for founders, operators, HR teams, agencies, and sales leaders who need a practical visual direction for staff portraits. Use it before onboarding new employees, refreshing an about page, preparing proposal decks, or aligning distributed teams that cannot visit the same photographer on the same day.',
      primaryCta: 'Generate corporate headshots',
      secondaryCta: 'Review samples',
      casesTitle: 'Corporate scenarios this page supports',
      casesText: 'Use these cases to decide how formal, uniform, or approachable the team set should be.',
      cases: [
        { title: 'Team and about pages', text: 'Create a consistent visual language across employee portraits.' },
        { title: 'Sales and customer success', text: 'Give client-facing teams a polished image for proposals and email profiles.' },
        { title: 'Remote onboarding', text: 'Add new hires without waiting for everyone to attend a physical shoot.' },
      ],
      guidanceTitle: 'Corporate style rules',
      guidanceText: 'Decide the background, clothing range, crop, and expression before generating. Consistency across the set matters more than making every person look identical.',
      checklist: ['Shared crop and background direction', 'Business clothing range defined upfront', 'Enough contrast for staff directory thumbnails', 'Natural expression that matches company tone'],
      linksTitle: 'Extend the corporate set',
      linksText: 'Use related pages for LinkedIn alignment, studio formality, examples, and credits.',
      relatedLinks: englishRelated['ai-headshot-corporate'],
      faqTitle: 'Corporate headshot questions',
      faqText: 'Practical answers for team pages and business use.',
      faqs: [
        { question: 'Can remote employees use different source photos?', answer: 'Yes, but ask everyone for recent, clear selfies with similar lighting expectations so the final set feels more consistent.' },
        { question: 'Should all corporate headshots use the same background?', answer: 'A shared background direction helps, but small differences are fine if crop, lighting, and formality stay aligned.' },
        { question: 'Can these be used in proposals or company decks?', answer: 'Yes. Plans include commercial use for business profiles, websites, presentations, and public professional materials.' },
      ],
    },
    es: {
      title: "Headshots corporativos con IA para equipos y paginas de empresa",
      description: "Guia para crear retratos corporativos coherentes sin que todos parezcan iguales ni demasiado retocados.",
      keywords: ['retratos corporativos IA', 'headshots equipo IA', 'foto empresa IA', 'retrato profesional empresa'],
      eyebrow: 'Caso de uso corporativo',
      h1: "Headshots corporativos con IA para equipos reales",
      intro: "Las paginas de equipo en empresas hispanas suelen mezclar fotos antiguas, recortes de eventos y selfies. El objetivo no es fabricar una fila identica, sino dar orden visual: mismo nivel de luz, encuadre parecido y una presencia profesional que siga dejando ver a cada persona.",
      primaryCta: 'Generar retratos corporativos',
      secondaryCta: 'Ver muestras',
      casesTitle: 'Escenarios corporativos',
      casesText: "Usa esta pagina para decidir reglas sencillas antes de pedir fotos o generar retratos para un equipo distribuido.",
      cases: [
        {
          title: "Pagina de equipo",
          text: "Define fondo, encuadre y formalidad para que el sitio se vea cuidado.",
        },
        {
          title: "Propuestas y decks",
          text: "Un retrato coherente ayuda a que el equipo parezca preparado sin verse impersonal.",
        },
        {
          title: "Equipos remotos",
          text: "La IA reduce diferencias de luz y fondo cuando nadie puede ir al mismo estudio.",
        },
      ],
      guidanceTitle: "Consistencia sin rigidez",
      guidanceText: "El mejor resultado corporativo mantiene una familia visual, pero no borra edad, estilo ni expresion. Decide primero el nivel de formalidad y despues revisa el conjunto como una sola pagina.",
      checklist: ["Mismo tipo de encuadre", "Fondos compatibles entre si", "Ropa dentro de un rango definido", "Expresiones naturales y reconocibles"],
      linksTitle: 'Amplía el set corporativo',
      linksText: 'Estos enlaces ayudan a coordinar LinkedIn, estilo estudio, muestras y créditos.',
      relatedLinks: localizedRelated.es['ai-headshot-corporate'],
      faqTitle: "Preguntas sobre equipos",
      faqText: "Puntos a revisar antes de publicar headshots corporativos.",
      faqs: [
        {
          question: "Todos deben usar el mismo fondo?",
          answer: "No hace falta que sea identico, pero si debe tener luminosidad y formalidad parecidas.",
        },
        {
          question: "Sirve para equipos pequenos?",
          answer: "Si. En equipos pequenos, la coherencia visual suele notarse incluso mas.",
        },
      ],
    },
    fr: {
      title: 'Portraits corporate IA pour équipes et pages entreprise',
      description: 'Créez des portraits corporate IA pour pages équipe, profils commerciaux, annuaires et supports entreprise.',
      keywords: ['portraits corporate IA', 'headshots equipe IA', 'photo entreprise IA', 'portrait business IA'],
      eyebrow: 'Usage corporate',
      h1: 'Portraits corporate IA pour équipes, sites et profils entreprise',
      intro: 'Une page équipe avec des cadrages différents, des photos trop anciennes et des arrière-plans incohérents peut donner une impression moins professionnelle que l entreprise elle-même. Pour une agence, un cabinet de conseil, une ESN, une startup B2B ou une équipe commerciale répartie, la cohérence visuelle aide à présenter les personnes clairement. Cette page sert à définir une direction de portrait avant une refonte de site, une proposition client, une arrivée collaborateur ou une harmonisation LinkedIn.',
      primaryCta: 'Générer des portraits corporate',
      secondaryCta: 'Voir les exemples',
      casesTitle: 'Scénarios corporate',
      casesText: 'Choisissez le niveau de formalité selon le rôle public de l équipe.',
      cases: [
        { title: 'Page équipe', text: 'Unifiez cadrage, fond et niveau de tenue pour une page plus crédible.' },
        { title: 'Vente et relation client', text: 'Donnez aux profils exposés une image claire et rassurante.' },
        { title: 'Équipes distribuées', text: 'Ajoutez de nouvelles personnes sans organiser une séance commune.' },
      ],
      guidanceTitle: 'Règles de style corporate',
      guidanceText: 'Décidez le fond, la tenue, le cadrage et l expression avant de générer. Une cohérence lisible compte plus qu une uniformité excessive.',
      checklist: ['Cadrage commun', 'Tenue professionnelle définie', 'Contraste lisible en annuaire', 'Expression naturelle alignée à la marque'],
      linksTitle: 'Compléter le set corporate',
      linksText: 'Ces liens aident à gérer LinkedIn, le style studio, les exemples et les crédits.',
      relatedLinks: localizedRelated.fr['ai-headshot-corporate'],
      faqTitle: 'Questions portrait corporate',
      faqText: 'Réponses pour pages équipe, supports commerciaux et usage entreprise.',
      faqs: [
        { question: 'Les collaborateurs distants peuvent-ils importer des photos différentes ?', answer: 'Oui, mais demandez des selfies récents, nets et bien éclairés pour garder une cohérence visuelle.' },
        { question: 'Faut-il exactement le même fond ?', answer: 'Un fond commun aide, mais le cadrage, la lumière et le niveau de formalité sont souvent plus importants.' },
        { question: 'Peut-on utiliser ces portraits dans des présentations ?', answer: 'Oui. Les plans couvrent les sites, profils publics, présentations et supports professionnels.' },
      ],
    },
    de: {
      title: "KI Headshots fuer Teamseiten und Unternehmensprofile",
      description: "Wie Teams einheitliche KI Portraits nutzen, ohne dass alle Personen gleich oder ueberretuschiert wirken.",
      keywords: ['Corporate Headshots KI', 'Team Headshot Generator', 'Business Headshot KI', 'Firmenprofil Fotos'],
      eyebrow: 'Corporate Teamfotos',
      h1: "KI Headshots fuer echte Teams",
      intro: "Viele Teamseiten zeigen einen Mix aus alten Fotos, Event-Ausschnitten und Webcam-Bildern. Ein KI Workflow kann Ordnung schaffen, wenn Ausschnitt, Licht und Hintergrund zusammenpassen. Ziel ist nicht Gleichmacherei, sondern ein professioneller Gesamteindruck mit echten Personen.",
      primaryCta: 'Corporate Headshots generieren',
      secondaryCta: 'Beispiele prüfen',
      casesTitle: 'Corporate Einsatzbereiche',
      casesText: "Nutze diese Seite, um einfache Bildregeln fuer Teamseite, Pitch Decks und interne Verzeichnisse festzulegen.",
      cases: [
        {
          title: "Teamseite",
          text: "Einheitlicher Ausschnitt und aehnliche Helligkeit lassen die Seite ruhiger wirken.",
        },
        {
          title: "Vertrieb und Praesentationen",
          text: "Konsistente Portraits helfen, ohne unpersoenlich zu werden.",
        },
        {
          title: "Remote Teams",
          text: "Unterschiedliche Ausgangsfotos koennen visuell naeher zusammengebracht werden.",
        },
      ],
      guidanceTitle: "Konsistenz ohne Schablone",
      guidanceText: "Definiere Formalitaet, Hintergrund und Ausschnitt. Danach pruefst du alle Bilder gemeinsam, nicht nur einzeln.",
      checklist: ["Aehnlicher Ausschnitt", "Kompatible Hintergruende", "Definierter Kleidungsrahmen", "Erkennbare individuelle Gesichter"],
      linksTitle: 'Corporate Set erweitern',
      linksText: 'Diese Seiten helfen bei LinkedIn, Studio-Stil, Beispielen und Credits.',
      relatedLinks: localizedRelated.de['ai-headshot-corporate'],
      faqTitle: "Fragen zu Team Headshots",
      faqText: "Worauf Teams vor der Veroeffentlichung achten sollten.",
      faqs: [
        {
          question: "Brauchen alle denselben Hintergrund?",
          answer: "Nicht zwingend. Wichtig sind aehnliche Helligkeit, Ausschnitt und Formalitaet.",
        },
        {
          question: "Ist das fuer kleine Teams sinnvoll?",
          answer: "Ja. Gerade kleine Teams wirken schnell professioneller, wenn die Fotos zusammenpassen.",
        },
      ],
    },
    ja: {
      title: "社員紹介・チームページ向けAIプロフィール写真",
      description: "社員紹介ページ、会社プロフィール、営業資料、社内ディレクトリ向けに、統一感のあるAIビジネス写真を作成するためのガイドです。",
      keywords: ['企業写真 AI', '社員紹介 写真 AI', 'AIヘッドショット 企業', 'ビジネス写真 AI'],
      eyebrow: '企業・チーム向け',
      h1: "企業ページに使いやすい社員プロフィール写真",
      intro: "チーム写真では、一人ひとりが完全に同じに見えることよりも、明るさ、切り抜き、背景、服装のフォーマル度がそろっていることが大切です。AIヘッドショットを使うと、リモートチームや新入社員の追加でも、会社ページや営業資料に使いやすい写真を準備しやすくなります。",
      primaryCta: '企業向け写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: '企業で使いやすい場面',
      casesText: "社員紹介、営業資料、社内ディレクトリ、採用ページなど、複数人の写真をそろえたい場面に向いています。",
      cases: [
        {
          title: "社員紹介ページ",
          text: "顔の大きさ、背景、明るさを近づけることで、ページ全体の信頼感を高められます。",
        },
        {
          title: "営業資料・提案書",
          text: "顧客に見られるメンバー紹介で、清潔感のある写真を使いやすくなります。",
        },
        {
          title: "リモートチーム",
          text: "全員が同じ場所に集まらなくても、近いトーンのビジネス写真を用意できます。",
        },
      ],
      guidanceTitle: "統一感を作るポイント",
      guidanceText: "背景を完全に同じにする必要はありません。明るさ、切り抜き、顔の大きさ、服装のフォーマル度を近づけるだけでも、チーム全体がまとまって見えます。",
      checklist: ["明るさと顔の大きさをそろえる", "背景の系統を近づける", "服装のフォーマル度を合わせる", "過度な加工を避ける"],
      linksTitle: '企業写真セットを広げる',
      linksText: 'LinkedIn、スタジオ風、サンプル、料金を確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-corporate'],
      faqTitle: "企業向けAI写真の質問",
      faqText: "チームで使うときの写真選びと統一感について。",
      faqs: [
        {
          question: "全員が同じ背景である必要はありますか？",
          answer: "必須ではありません。背景の色味や明るさ、切り抜きの近さをそろえるだけでも十分に統一感が出ます。",
        },
        {
          question: "少人数のチームでも使えますか？",
          answer: "はい。小規模チームほど写真の印象が目立つため、そろったプロフィール写真は会社ページや営業資料で役立ちます。",
        },
      ],
    },
  },
  'ai-headshot-resume': {
    en: {
      title: 'AI Resume Photo Generator for CVs and Applications',
      description: 'Create a restrained AI resume photo for CVs, applications, portfolios, and professional profiles when a photo is appropriate.',
      keywords: ['AI resume photo generator', 'AI CV photo', 'professional resume photo', 'application photo AI'],
      eyebrow: 'Resume and CV photo use case',
      h1: 'AI Resume Photo Generator for CVs, Applications, and Professional Profiles',
      intro: 'A resume photo is not always expected, especially in the United States, but many professionals still need a restrained portrait for CV markets, portfolio profiles, internal mobility pages, academic bios, or application portals that request an image. This page is built for people who want a photo that supports the document instead of overpowering it. The goal is simple: look current, clear, and professional, with a calm expression and styling that does not distract from your experience, skills, and role fit.',
      primaryCta: 'Generate resume photos',
      secondaryCta: 'See resume examples',
      casesTitle: 'When a resume-style image is useful',
      casesText: 'Use this direction when the photo needs to feel more document-ready than social-profile oriented.',
      cases: [
        { title: 'International CVs', text: 'Use a clean portrait for markets or portals where a CV photo is common.' },
        { title: 'Portfolio and academic bios', text: 'Keep the image professional without making the page feel like a personal brand campaign.' },
        { title: 'Internal applications', text: 'Use a current photo for employee profiles, internal mobility, and professional directories.' },
      ],
      guidanceTitle: 'Resume photo guidance',
      guidanceText: 'A resume-style headshot should be quieter than a marketing portrait. Choose neutral clothing, a simple crop, and a background that lets the document stay the focus.',
      checklist: ['Calm expression and direct face view', 'Simple clothing without loud patterns', 'Neutral background and conservative crop', 'Current likeness that matches interviews and profiles'],
      linksTitle: 'Adapt this photo for other channels',
      linksText: 'A resume photo can also feed your LinkedIn, bio, and sample review workflow.',
      relatedLinks: englishRelated['ai-headshot-resume'],
      faqTitle: 'AI resume photo questions',
      faqText: 'How to use a resume-style portrait without making the document feel overdone.',
      faqs: [
        { question: 'Should I put a photo on every resume?', answer: 'No. Use a resume photo only when it is expected in your market, requested by a portal, or appropriate for a CV, bio, or portfolio context.' },
        { question: 'What style works best for a resume photo?', answer: 'Choose a restrained business look with a neutral background, clear face, and minimal styling.' },
        { question: 'Can I use the same image on LinkedIn?', answer: 'Yes, but LinkedIn can tolerate a slightly warmer expression and tighter crop than a conservative resume photo.' },
      ],
    },
    es: {
      title: "Foto para CV con IA: cuando usarla y como mantenerla sobria",
      description: "Consejos para crear una foto de CV con IA que encaje en candidaturas sin parecer exagerada ni falsa.",
      keywords: ['foto CV IA', 'generador foto curriculum IA', 'foto profesional CV', 'foto candidatura IA'],
      eyebrow: 'Caso de uso para CV',
      h1: "Foto para CV con IA sin aspecto artificial",
      intro: "En algunos paises y sectores hispanos la foto en el CV sigue siendo habitual; en otros, conviene evitarla. Si decides incluirla, la foto debe ser discreta y actual. Tiene que apoyar la candidatura, no competir con la experiencia ni llamar la atencion por exceso de retoque.",
      primaryCta: 'Generar foto para CV',
      secondaryCta: 'Ver ejemplos',
      casesTitle: 'Cuándo usar una foto tipo CV',
      casesText: "Antes de generar, piensa si el CV realmente necesita foto y que tono espera el mercado al que aplicas.",
      cases: [
        {
          title: "CV tradicional",
          text: "Usa fondo claro, ropa sencilla y expresion serena.",
        },
        {
          title: "Portales de empleo",
          text: "Elige una imagen legible en miniatura y coherente con tu perfil.",
        },
        {
          title: "Candidaturas internacionales",
          text: "Comprueba primero si la foto es apropiada para ese pais o sector.",
        },
      ],
      guidanceTitle: "La foto debe quedarse en segundo plano",
      guidanceText: "Para CV, el mejor resultado suele ser el menos llamativo: rostro claro, fondo neutro y apariencia actual. Si parece una foto de campana publicitaria, probablemente es demasiado.",
      checklist: ["Fondo neutro", "Ropa sin logos grandes", "Expresion tranquila", "Parecido real con tu aspecto actual"],
      linksTitle: 'Adapta la foto a otros canales',
      linksText: 'Puedes usar el mismo set para LinkedIn, bio o revisión de muestras.',
      relatedLinks: localizedRelated.es['ai-headshot-resume'],
      faqTitle: "Preguntas sobre foto de CV",
      faqText: "Criterios rapidos para no sobreproducir una imagen de candidatura.",
      faqs: [
        {
          question: "Siempre debo poner foto en el CV?",
          answer: "No. Depende del pais, sector y tipo de candidatura. Revisa la practica local.",
        },
        {
          question: "Que estilo es mas seguro?",
          answer: "Un retrato frontal, sobrio, con fondo claro y sin retoque excesivo.",
        },
      ],
    },
    fr: {
      title: 'Générateur de photo CV IA',
      description: 'Créez une photo sobre pour CV, candidatures, portfolios et profils professionnels quand le contexte le demande.',
      keywords: ['photo CV IA', 'generateur photo CV IA', 'photo candidature IA', 'portrait CV professionnel'],
      eyebrow: 'Usage CV et candidature',
      h1: 'Générateur de photo CV IA pour candidatures, bios et profils professionnels',
      intro: 'La photo sur un CV dépend du pays, du secteur et du format demandé. En France, elle reste fréquente dans certains contextes, mais elle doit rester sobre et ne pas détourner l attention du parcours. Cette page aide lorsque vous avez besoin d une image pour un CV, un profil Welcome to the Jungle, une bio académique, un portfolio, une candidature internationale ou un annuaire interne. Le but est un portrait clair, actuel et discret, qui soutient le dossier sans le transformer en publicité personnelle.',
      primaryCta: 'Générer une photo CV',
      secondaryCta: 'Voir les exemples',
      casesTitle: 'Quand utiliser une photo type CV',
      casesText: 'Choisissez ce style quand la photo doit rester secondaire par rapport au contenu.',
      cases: [
        { title: 'CV avec photo', text: 'Adapté aux formats ou marchés qui attendent une image.' },
        { title: 'Portfolio et bio', text: 'Donne un visage professionnel sans ton trop promotionnel.' },
        { title: 'Annuaire interne', text: 'Utile pour mobilité interne, pages équipe et profils collaborateurs.' },
      ],
      guidanceTitle: 'Conseils photo CV',
      guidanceText: 'Une photo de CV doit rester plus discrète qu une photo de profil social. Fond neutre, tenue simple, expression calme et cadrage propre suffisent.',
      checklist: ['Expression posée', 'Tenue simple et professionnelle', 'Fond neutre', 'Ressemblance actuelle'],
      linksTitle: 'Décliner la photo ailleurs',
      linksText: 'La même génération peut servir à LinkedIn, bio et comparaison de résultats.',
      relatedLinks: localizedRelated.fr['ai-headshot-resume'],
      faqTitle: 'Questions photo CV',
      faqText: 'Usage, style et adaptation aux candidatures.',
      faqs: [
        { question: 'Faut-il mettre une photo sur tous les CV ?', answer: 'Non. Utilisez-la seulement si le marché, le portail ou le format la demande ou la rend pertinente.' },
        { question: 'Quel style choisir ?', answer: 'Un portrait sobre avec fond propre, visage clair et tenue professionnelle.' },
        { question: 'Puis-je l utiliser sur LinkedIn ?', answer: 'Oui, mais LinkedIn peut accepter une expression un peu plus chaleureuse et un cadrage plus serré.' },
      ],
    },
    de: {
      title: "KI Bewerbungsfoto fuer Lebenslauf und Bewerbungsunterlagen",
      description: "Wie du ein ruhiges KI Bewerbungsfoto fuer Lebenslauf, Bewerbung und Profil waehlst, ohne dass es kuenstlich wirkt.",
      keywords: ['KI Bewerbungsfoto', 'Lebenslauf Foto KI', 'Bewerbungsfoto Generator', 'professionelles Bewerbungsfoto KI'],
      eyebrow: 'Bewerbungsfoto und Lebenslauf',
      h1: "KI Bewerbungsfoto ohne ueberproduzierten Eindruck",
      intro: "In Deutschland, Oesterreich und der Schweiz wird ein Bewerbungsfoto je nach Branche noch erwartet, ist aber nicht ueberall Pflicht. Wenn du eines nutzt, sollte es sachlich, aktuell und unaufdringlich sein. Die Erfahrung im Lebenslauf bleibt wichtiger als das Bild.",
      primaryCta: 'Bewerbungsfoto generieren',
      secondaryCta: 'Beispiele ansehen',
      casesTitle: 'Wann ein Bewerbungsfoto sinnvoll ist',
      casesText: "Pruefe zuerst, ob ein Foto fuer Land, Branche und Stelle sinnvoll ist. Danach waehle die ruhigste passende Version.",
      cases: [
        {
          title: "Klassischer Lebenslauf",
          text: "Neutraler Hintergrund, klare Kleidung und freundlicher Ausdruck reichen meist aus.",
        },
        {
          title: "Online Bewerbung",
          text: "Das Bild sollte auch klein im Bewerbungsportal erkennbar bleiben.",
        },
        {
          title: "Internationale Bewerbung",
          text: "Informiere dich, ob ein Foto ueblich oder unerwuenscht ist.",
        },
      ],
      guidanceTitle: "Zurueckhaltung ist ein Vorteil",
      guidanceText: "Ein gutes Bewerbungsfoto wirkt aktuell und serioes, aber nicht wie ein Werbemotiv. Vermeide starke Retusche, extreme Hintergruende und zu viel Glamour.",
      checklist: ["Neutraler Hintergrund", "Gepflegte, einfache Kleidung", "Ruhiger Gesichtsausdruck", "Aktuelle Wiedererkennbarkeit"],
      linksTitle: 'Für weitere Kanäle anpassen',
      linksText: 'Nutze verwandte Seiten für LinkedIn, Bio und Qualitätsvergleich.',
      relatedLinks: localizedRelated.de['ai-headshot-resume'],
      faqTitle: "Fragen zum Bewerbungsfoto",
      faqText: "Was bei KI Bildern fuer Bewerbungen wichtig ist.",
      faqs: [
        {
          question: "Sollte jeder Lebenslauf ein Foto haben?",
          answer: "Nein. Das haengt von Land, Branche und Arbeitgeber ab.",
        },
        {
          question: "Welcher Stil ist sicher?",
          answer: "Ein ruhiges frontales Portrait mit neutralem Hintergrund und natuerlicher Hautstruktur.",
        },
      ],
    },
    ja: {
      title: "履歴書写真をAIで作成するときの選び方",
      description: "履歴書、職務経歴書、応募書類、社内プロフィールに使いやすい、落ち着いたプロフィール写真をAIで作成するためのガイドです。",
      keywords: ['履歴書 写真 AI', '職務経歴書 写真 AI', '証明写真 AI', '応募写真 AI'],
      eyebrow: '履歴書・応募書類向け',
      h1: "応募書類に使いやすい履歴書写真",
      intro: "履歴書写真は国、業界、応募先によって必要性が変わります。日本の履歴書や一部の応募書類で写真が必要な場合は、派手さよりも本人らしさ、清潔感、落ち着いた印象が重要です。AI写真を使う場合も、過度な演出や強い加工を避け、応募書類の内容を邪魔しない自然なプロフィール写真を選ぶことが大切です。",
      primaryCta: '履歴書写真を生成',
      secondaryCta: '例を見る',
      casesTitle: '履歴書向け写真が必要な場面',
      casesText: "写真付き履歴書が一般的な市場、求人サイト、社内プロフィール、応募書類の補助画像として使いやすい写真を準備できます。",
      cases: [
        {
          title: "履歴書・CV",
          text: "落ち着いた背景と自然な表情で、応募書類に合う控えめな写真を用意できます。",
        },
        {
          title: "求人サイト",
          text: "プロフィール欄や応募ページで読み取りやすい、正面に近い写真を選べます。",
        },
        {
          title: "社内プロフィール",
          text: "異動、社内公募、チーム紹介などにも使いやすい現在の写真を準備できます。",
        },
      ],
      guidanceTitle: "控えめで信頼感のある写真にする",
      guidanceText: "履歴書向け写真では、背景、服装、表情を落ち着かせることが大切です。強い演出よりも、本人確認しやすく清潔感のある写真を選びます。",
      checklist: ["正面に近い顔の向き", "落ち着いた背景", "自然な肌と髪の質感", "応募先に合う服装"],
      linksTitle: 'ほかのプロフィールにも使う',
      linksText: 'LinkedIn、仕事用プロフィール、FAQ、サンプルを確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-resume'],
      faqTitle: "履歴書写真のよくある質問",
      faqText: "応募書類にAI写真を使うときの基本的な考え方。",
      faqs: [
        {
          question: "履歴書に必ず写真は必要ですか？",
          answer: "いいえ。国、業界、応募先によって異なります。写真が不要または推奨されない場合は、応募先のルールに従ってください。",
        },
        {
          question: "どのスタイルが無難ですか？",
          answer: "明るい正面寄りの写真、シンプルな背景、自然な肌の質感、落ち着いた服装の組み合わせが使いやすいです。",
        },
      ],
    },
  },
  'ai-headshot-studio-style': {
    en: {
      title: 'AI Studio Style Headshots Without a Photo Shoot',
      description: 'Generate studio-style AI headshots with polished lighting, clean backgrounds, and professional portrait direction.',
      keywords: ['AI studio headshot', 'studio style AI portrait', 'professional studio headshot AI', 'AI portrait studio'],
      eyebrow: 'Studio-style portrait use case',
      h1: 'AI Studio Style Headshots Without Scheduling a Photo Shoot',
      intro: 'A studio-style headshot is useful when the image needs more polish than a casual profile photo but you do not want the cost, timing, or logistics of a photographer. This page focuses on clean lighting, simple backgrounds, balanced contrast, and a portrait style that feels suitable for executive bios, consulting profiles, speaker pages, press kits, and premium service pages. Use it when your brand needs a composed look, your old headshot has uneven lighting, or your public profile should feel more deliberate.',
      primaryCta: 'Generate studio-style headshots',
      secondaryCta: 'Compare samples',
      casesTitle: 'Studio-style scenarios',
      casesText: 'Choose this direction when visual polish and controlled lighting matter.',
      cases: [
        { title: 'Executive bios', text: 'A composed image works well for leadership pages and press profiles.' },
        { title: 'Consulting and premium services', text: 'Clean studio direction supports trust for high-consideration services.' },
        { title: 'Speaker and media kits', text: 'Use a portrait that feels intentional in event pages and introductions.' },
      ],
      guidanceTitle: 'How to keep it realistic',
      guidanceText: 'Studio style should not mean plastic. Pick simple backgrounds, realistic wardrobe, and lighting that supports your face rather than hiding it.',
      checklist: ['Soft, controlled lighting', 'Simple background with professional tone', 'Wardrobe that matches the service level', 'Natural skin texture and recognizable likeness'],
      linksTitle: 'Compare formal and flexible options',
      linksText: 'Use these pages to decide whether a studio, corporate, or general professional image fits best.',
      relatedLinks: englishRelated['ai-headshot-studio-style'],
      faqTitle: 'Studio-style AI headshot questions',
      faqText: 'How to get polished results without making the portrait look artificial.',
      faqs: [
        { question: 'Is a studio-style AI headshot different from a corporate headshot?', answer: 'Studio-style focuses on polished lighting and controlled backgrounds. Corporate headshots focus more on consistency across a team.' },
        { question: 'Will it look overly retouched?', answer: 'It should not. Use clear source photos and choose realistic styles so skin texture, expression, and likeness remain natural.' },
        { question: 'Where should I use a studio-style headshot?', answer: 'It works well for executive bios, consultant profiles, speaker pages, premium service pages, and press materials.' },
      ],
    },
    es: {
      title: "Retratos estilo estudio con IA para perfiles cuidados",
      description: "Como usar un estilo de estudio con IA cuando necesitas luz pulida, fondo limpio y una imagen mas cuidada.",
      keywords: ['headshot estilo estudio IA', 'retrato estudio IA', 'foto profesional estudio IA', 'portrait studio IA'],
      eyebrow: 'Caso de uso estilo estudio',
      h1: "Retratos estilo estudio con IA sin perder naturalidad",
      intro: "Un estilo de estudio ayuda cuando la foto tiene que verse mas preparada: pagina de ponente, bio profesional, perfil de consultoria o presentacion comercial. Pero estudio no significa piel plastica ni fondo perfecto sin vida; lo importante es que la luz mejore la cara y que el resultado siga pareciendo tuyo.",
      primaryCta: 'Generar estilo estudio',
      secondaryCta: 'Ver ejemplos',
      casesTitle: 'Cuándo elegir estilo estudio',
      casesText: "Elige este enfoque cuando necesites mas control visual que una selfie, pero sin convertir la foto en una produccion exagerada.",
      cases: [
        {
          title: "Ponentes y autores",
          text: "Una luz cuidada da presencia en paginas de eventos o perfiles editoriales.",
        },
        {
          title: "Servicios premium",
          text: "Fondos limpios y ropa sobria ayudan a transmitir confianza.",
        },
        {
          title: "Marca personal",
          text: "Un estudio suave funciona si quieres una imagen reutilizable en varias plataformas.",
        },
      ],
      guidanceTitle: "Pulido no significa falso",
      guidanceText: "Revisa textura de piel, ojos, cabello y contorno de hombros. Si todo parece demasiado perfecto, baja el dramatismo y elige una version mas humana.",
      checklist: ["Luz suave y controlada", "Fondo limpio pero no teatral", "Piel con textura natural", "Rostro reconocible"],
      linksTitle: 'Compara opciones formales y flexibles',
      linksText: 'Decide si necesitas estudio, corporativo o una foto profesional general.',
      relatedLinks: localizedRelated.es['ai-headshot-studio-style'],
      faqTitle: "Preguntas sobre estilo estudio",
      faqText: "Como decidir si el acabado de estudio encaja con tu uso.",
      faqs: [
        {
          question: "Es mejor que un fondo de oficina?",
          answer: "Depende. Estudio transmite control; oficina aporta contexto. Elige segun donde se usara la foto.",
        },
        {
          question: "Debe ser muy formal?",
          answer: "No. Puede ser elegante y cercano a la vez si la ropa y expresion son naturales.",
        },
      ],
    },
    fr: {
      title: 'Portrait style studio IA sans séance photo',
      description: 'Générez des portraits IA style studio avec lumière soignée, fond propre, rendu professionnel et usage LinkedIn ou CV.',
      keywords: ['portrait studio IA', 'headshot studio IA', 'photo professionnelle studio IA', 'portrait IA premium'],
      eyebrow: 'Usage style studio',
      h1: 'Portrait style studio IA sans organiser de séance photo',
      intro: 'Un portrait style studio est utile lorsque l image doit être plus soignée qu une photo de profil classique, sans bloquer une demi-journée de prise de vue. Pour un dirigeant, consultant, avocat, coach, expert B2B ou intervenant événementiel, une lumière propre et un fond maîtrisé donnent une impression plus posée. Cette page aide à obtenir un rendu élégant mais crédible, avec un visage reconnaissable, une texture naturelle et une tenue compatible avec le niveau de service ou de responsabilité.',
      primaryCta: 'Générer un style studio',
      secondaryCta: 'Voir les exemples',
      casesTitle: 'Quand choisir le style studio',
      casesText: 'Utile lorsque la maîtrise visuelle compte plus que l effet spontané.',
      cases: [
        { title: 'Dirigeants et fondateurs', text: 'Un rendu posé pour bios, presse et pages leadership.' },
        { title: 'Services premium', text: 'Adapté au conseil, juridique, finance, coaching et B2B.' },
        { title: 'Conférences et médias', text: 'Une image propre pour programmes, introductions et kits presse.' },
      ],
      guidanceTitle: 'Garder un rendu réaliste',
      guidanceText: 'Le style studio ne doit pas effacer la personne. Préférez des fonds simples, une tenue crédible et une lumière qui valorise le visage sans le lisser excessivement.',
      checklist: ['Lumière douce et contrôlée', 'Fond simple', 'Tenue alignée au contexte', 'Texture naturelle et ressemblance'],
      linksTitle: 'Comparer les options',
      linksText: 'Décidez entre studio, corporate et photo professionnelle polyvalente.',
      relatedLinks: localizedRelated.fr['ai-headshot-studio-style'],
      faqTitle: 'Questions style studio',
      faqText: 'Obtenir un rendu soigné sans effet artificiel.',
      faqs: [
        { question: 'Est-ce différent d un portrait corporate ?', answer: 'Oui. Le style studio vise surtout la lumière et le fond; le corporate vise la cohérence d équipe.' },
        { question: 'Le résultat sera-t-il trop retouché ?', answer: 'Pas si les photos sources sont claires et si vous choisissez un style réaliste.' },
        { question: 'Où utiliser ce portrait ?', answer: 'Sur bios dirigeants, pages conseil, conférences, presse, services premium et présentations.' },
      ],
    },
    de: {
      title: "KI Portrait im Studio-Stil fuer professionelle Auftritte",
      description: "Wann ein Studio-Look sinnvoll ist und wie das Ergebnis hochwertig bleibt, ohne kuenstlich zu wirken.",
      keywords: ['KI Studio Headshot', 'Studio Portrait KI', 'professionelles Studiofoto KI', 'KI Portrait Studio'],
      eyebrow: 'Studio-Stil',
      h1: "Studio-Stil mit KI, aber natuerlich",
      intro: "Ein Studio-Stil passt, wenn ein Profil mehr Ruhe, Lichtkontrolle und Wertigkeit braucht: Speaker-Seite, Autorenprofil, Beratungsangebot oder Premium-Service. Der Look sollte gepflegt sein, aber nicht so glatt, dass die Person fremd wirkt.",
      primaryCta: 'Studio-Headshots generieren',
      secondaryCta: 'Beispiele ansehen',
      casesTitle: 'Wann Studio-Stil passt',
      casesText: "Waehle Studio-Stil, wenn du mehr Kontrolle als bei einer Selfie-Basis brauchst, aber kein kuenstliches Hochglanzbild willst.",
      cases: [
        {
          title: "Speaker und Autoren",
          text: "Gutes Licht gibt Praesenz, ohne vom Inhalt abzulenken.",
        },
        {
          title: "Beratung und Services",
          text: "Ein sauberer Hintergrund wirkt verlaesslich und wiederverwendbar.",
        },
        {
          title: "Personal Brand",
          text: "Ein weicher Studio-Look passt auf Website, Profil und Pressebereich.",
        },
      ],
      guidanceTitle: "Gepflegt statt glatt",
      guidanceText: "Achte auf natuerliche Haut, Augen, Haare und Schultern. Wenn das Bild zu perfekt aussieht, wirkt es schnell weniger vertrauenswuerdig.",
      checklist: ["Weiches kontrolliertes Licht", "Klarer Hintergrund", "Natuerliche Hautstruktur", "Erkennbares Gesicht"],
      linksTitle: 'Formell oder flexibel vergleichen',
      linksText: 'Diese Seiten helfen bei Studio, Corporate und allgemeiner Profilfoto-Wahl.',
      relatedLinks: localizedRelated.de['ai-headshot-studio-style'],
      faqTitle: "Fragen zum Studio-Stil",
      faqText: "Wie du entscheidest, ob ein Studio-Look passt.",
      faqs: [
        {
          question: "Ist Studio besser als Buero-Hintergrund?",
          answer: "Nicht immer. Studio wirkt kontrollierter, Buero gibt Kontext. Der Einsatzzweck entscheidet.",
        },
        {
          question: "Muss es sehr formell sein?",
          answer: "Nein. Ein Studiofoto kann zugleich hochwertig und nahbar sein.",
        },
      ],
    },
    ja: {
      title: "スタジオ風プロフィール写真をAIで作成",
      description: "撮影スタジオなしで、整った光、シンプルな背景、自然な質感のスタジオ風AIプロフィール写真を作るためのガイドです。",
      keywords: ['スタジオ写真 AI', 'AIヘッドショット スタジオ', 'プロフィール写真 スタジオ風', '仕事用写真 AI'],
      eyebrow: 'スタジオ風プロフィール写真',
      h1: "自然に見えるスタジオ風AIプロフィール写真",
      intro: "スタジオ風の写真は、登壇者プロフィール、著者紹介、コンサルティング、役員紹介、個人ブランドなど、少し整った印象が必要な場面に向いています。ただし、整いすぎて本人らしさが消えると信頼感が下がります。光、背景、服装を整えながら、自然な顔立ちと表情を残すことが重要です。",
      primaryCta: 'スタジオ風写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: 'スタジオ風が合う場面',
      casesText: "登壇、著者紹介、コンサルティング、役員プロフィール、サービス紹介など、少しフォーマルに見せたい場面に向いています。",
      cases: [
        {
          title: "登壇者・著者プロフィール",
          text: "イベントページや著者紹介で、落ち着いた存在感を出しやすくなります。",
        },
        {
          title: "コンサルティング・専門職",
          text: "信頼感が重要なサービス紹介やプロフィールで使いやすい見た目になります。",
        },
        {
          title: "個人ブランド",
          text: "Webサイト、SNS、資料で使いやすい、整ったプロフィール写真を準備できます。",
        },
      ],
      guidanceTitle: "整えすぎないことが大切",
      guidanceText: "スタジオ風でも、肌、目、髪、輪郭が自然に見えることが重要です。背景や光を整えつつ、本人とわかる表情を残してください。",
      checklist: ["やわらかい光", "シンプルな背景", "自然な肌の質感", "本人とわかる表情"],
      linksTitle: 'フォーマル度を比較する',
      linksText: '仕事用、企業向け、サンプル、料金を確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-studio-style'],
      faqTitle: "スタジオ風写真のよくある質問",
      faqText: "自然さを保ちながら、整ったプロフィール写真を作るためのヒント。",
      faqs: [
        {
          question: "スタジオ風と企業写真は違いますか？",
          answer: "はい。スタジオ風は光や背景の整い方を重視し、企業写真はチーム全体の統一感を重視します。",
        },
        {
          question: "フォーマルすぎる写真になりますか？",
          answer: "必ずしもそうではありません。服装や表情を調整すれば、きちんと感と親しみやすさを両立できます。",
        },
      ],
    },
  },
  'ai-headshot-professional-photo': {
    en: {
      title: 'AI Professional Photo Maker for Work Profiles',
      description: 'Create a professional AI photo for LinkedIn, resumes, bios, directories, websites, and business profiles.',
      keywords: ['AI professional photo', 'professional photo maker AI', 'AI business photo', 'professional profile photo AI'],
      eyebrow: 'Professional profile photo use case',
      h1: 'AI Professional Photo Maker for Work Profiles, Bios, and Business Pages',
      intro: 'A professional photo is the flexible version of a headshot: not only for LinkedIn, not only for a resume, and not necessarily as formal as a studio portrait. It needs to work across business bios, directories, email signatures, portfolio pages, conference profiles, and internal systems. This page is for people who want one reliable image set that can travel across those contexts. The best result usually looks current, clear, and easy to recognize, with enough polish to feel intentional and enough naturalness to still feel like you.',
      primaryCta: 'Generate professional photos',
      secondaryCta: 'See examples',
      casesTitle: 'Professional photo use cases',
      casesText: 'Use this page when you need a versatile work image rather than a highly narrow style.',
      cases: [
        { title: 'Business bios and websites', text: 'Create a portrait that works beside service descriptions and contact details.' },
        { title: 'Directories and email signatures', text: 'Use a readable image that still works at small sizes.' },
        { title: 'Portfolio and conference profiles', text: 'Choose a polished but human image for public introductions.' },
      ],
      guidanceTitle: 'Choosing a versatile professional photo',
      guidanceText: 'Aim for an image that can handle multiple contexts. Avoid extreme backgrounds, overly casual clothing, and expressions that only fit one platform.',
      checklist: ['Recognizable face and balanced crop', 'Wardrobe that fits several work contexts', 'Background that feels professional but not distracting', 'Expression that feels confident and human'],
      linksTitle: 'Narrow the photo for each channel',
      linksText: 'Use these pages to tune the same source photos for LinkedIn, resume, or studio-style output.',
      relatedLinks: englishRelated['ai-headshot-professional-photo'],
      faqTitle: 'Professional AI photo questions',
      faqText: 'How to create a flexible image for multiple work contexts.',
      faqs: [
        { question: 'How is this different from a LinkedIn headshot?', answer: 'A LinkedIn headshot is tuned for profile discovery. A professional photo is broader and can work on bios, directories, resumes, websites, and signatures.' },
        { question: 'Can I generate several professional looks?', answer: 'Yes. Use credits to generate selected styles, then keep the versions that fit different contexts.' },
        { question: 'What makes a professional photo look credible?', answer: 'Current likeness, clean lighting, simple styling, and an expression that matches the level of trust your role requires.' },
      ],
    },
    es: {
      title: "Foto profesional con IA para perfiles, bios y presencia online",
      description: "Como crear una foto profesional versatil con IA para perfiles publicos, paginas personales, firmas y directorios.",
      keywords: ['foto profesional IA', 'creador foto profesional IA', 'foto de perfil profesional IA', 'foto negocio IA'],
      eyebrow: 'Foto profesional flexible',
      h1: "Foto profesional con IA para usar en mas de un sitio",
      intro: "No todas las fotos profesionales son para LinkedIn o CV. A veces necesitas una imagen que funcione en una bio de autor, una firma de email, una pagina de servicios, una comunidad profesional o un directorio interno. La clave es elegir un resultado flexible, reconocible y facil de reutilizar.",
      primaryCta: 'Generar fotos profesionales',
      secondaryCta: 'Ver ejemplos',
      casesTitle: 'Usos de una foto profesional',
      casesText: "Busca una foto que no dependa de una sola plataforma y que pueda convivir con varios formatos.",
      cases: [
        {
          title: "Bio personal",
          text: "Elige una imagen cercana y clara para que el texto no cargue todo el peso.",
        },
        {
          title: "Directorio o firma",
          text: "Prioriza lectura rapida, fondo simple y rostro bien centrado.",
        },
        {
          title: "Marca profesional",
          text: "Una version versatil ahorra decisiones cuando actualizas varias paginas.",
        },
      ],
      guidanceTitle: "Versatilidad antes que espectacularidad",
      guidanceText: "Una foto profesional util no tiene que ser la mas impresionante. Debe ser reconocible, limpia y compatible con usos pequenos, cuadrados, circulares y paginas completas.",
      checklist: ["Funciona en recorte cuadrado y circular", "No depende de un fondo muy especifico", "Mantiene parecido real", "Puede usarse en varias plataformas"],
      linksTitle: 'Ajusta la foto por canal',
      linksText: 'Usa estas páginas para orientar la imagen a LinkedIn, CV o estilo estudio.',
      relatedLinks: localizedRelated.es['ai-headshot-professional-photo'],
      faqTitle: "Preguntas sobre foto profesional",
      faqText: "Como elegir una imagen reutilizable sin parecer generica.",
      faqs: [
        {
          question: "Debe ser distinta de LinkedIn?",
          answer: "Puede ser la misma si es flexible. Si LinkedIn necesita mas energia, guarda una version mas neutra para bios.",
        },
        {
          question: "Que debo evitar?",
          answer: "Fondos demasiado llamativos, ropa que domine la imagen y retoques que cambien tu cara.",
        },
      ],
    },
    fr: {
      title: 'Créateur de photo professionnelle IA',
      description: 'Créez une photo professionnelle IA pour LinkedIn, CV, bio, site, annuaire et profils business.',
      keywords: ['photo professionnelle IA', 'createur photo professionnelle IA', 'photo profil professionnel IA', 'photo business IA'],
      eyebrow: 'Photo professionnelle polyvalente',
      h1: 'Créateur de photo professionnelle IA pour profils, bios et pages business',
      intro: 'Une photo professionnelle polyvalente n est pas forcément aussi formelle qu un portrait studio ni aussi ciblée qu une photo LinkedIn. Elle doit pouvoir passer d une bio entreprise à une signature e-mail, un annuaire, un portfolio, une page Malt, une conférence ou un CV. Pour les indépendants, consultants, managers et équipes commerciales francophones, l enjeu est d avoir une image claire, actuelle et crédible, assez soignée pour inspirer confiance, mais assez naturelle pour rester reconnaissable.',
      primaryCta: 'Générer des photos professionnelles',
      secondaryCta: 'Voir les exemples',
      casesTitle: 'Usages d une photo professionnelle',
      casesText: 'Choisissez ce format lorsque l image doit rester utile sur plusieurs supports.',
      cases: [
        { title: 'Bio et site business', text: 'Un portrait clair à côté des services, contacts et pages équipe.' },
        { title: 'Signature et annuaire', text: 'Une image lisible même en petit format.' },
        { title: 'Portfolio et événements', text: 'Une présentation publique soignée mais humaine.' },
      ],
      guidanceTitle: 'Choisir une photo polyvalente',
      guidanceText: 'Évitez les fonds trop marqués, les tenues trop casual et les expressions adaptées à une seule plateforme. Cherchez un rendu qui traverse plusieurs contextes.',
      checklist: ['Visage reconnaissable', 'Tenue compatible avec plusieurs usages', 'Fond professionnel discret', 'Expression confiante et naturelle'],
      linksTitle: 'Adapter la photo par canal',
      linksText: 'Ces pages aident à orienter le rendu vers LinkedIn, CV ou studio.',
      relatedLinks: localizedRelated.fr['ai-headshot-professional-photo'],
      faqTitle: 'Questions photo professionnelle IA',
      faqText: 'Créer une image flexible pour plusieurs usages de travail.',
      faqs: [
        { question: 'Quelle différence avec une photo LinkedIn ?', answer: 'LinkedIn vise la découverte de profil. Une photo professionnelle est plus large et peut servir aux bios, sites, signatures, CV et annuaires.' },
        { question: 'Puis-je générer plusieurs looks ?', answer: 'Oui. Générez les styles dont vous avez besoin, puis gardez les versions adaptées à chaque canal.' },
        { question: 'Qu est-ce qui rend la photo crédible ?', answer: 'Une ressemblance actuelle, une lumière propre, une tenue simple et une expression alignée au rôle.' },
      ],
    },
    de: {
      title: "Professionelles KI Foto fuer Profile, Bio und Online-Auftritt",
      description: "Ein vielseitiges KI Portrait fuer Website, Bio, Signatur, Verzeichnis und berufliche Profile auswaehlen.",
      keywords: ['professionelles Foto KI', 'Professional Photo Maker KI', 'Business Foto KI', 'Profilfoto KI beruflich'],
      eyebrow: 'Professionelles Profilfoto',
      h1: "Professionelles KI Foto fuer mehrere Kanaele",
      intro: "Nicht jedes professionelle Foto ist nur fuer LinkedIn oder Bewerbung gedacht. Oft brauchst du ein Bild fuer Autorenbio, Website, E-Mail-Signatur, Branchenverzeichnis oder internes Profil. Dann zaehlt vor allem Vielseitigkeit: klar, wiedererkennbar und nicht an einen einzigen Kontext gebunden.",
      primaryCta: 'Professionelle Fotos generieren',
      secondaryCta: 'Beispiele ansehen',
      casesTitle: 'Einsatzbereiche',
      casesText: "Suche ein Bild, das in verschiedenen Formaten funktioniert und nicht nur auf einer Plattform gut aussieht.",
      cases: [
        {
          title: "Website Bio",
          text: "Ein ruhiges Portrait gibt dem Text ein Gesicht, ohne die Seite zu dominieren.",
        },
        {
          title: "Signatur und Verzeichnis",
          text: "Kleiner Ausschnitt, klare Augen und einfacher Hintergrund sind wichtiger als Drama.",
        },
        {
          title: "Berufliche Sichtbarkeit",
          text: "Ein flexibles Bild spart Arbeit, wenn mehrere Profile aktualisiert werden.",
        },
      ],
      guidanceTitle: "Vielseitigkeit vor Effekt",
      guidanceText: "Das beste professionelle Foto ist oft nicht das spektakulaerste, sondern das am einfachsten wiederverwendbare.",
      checklist: ["Funktioniert quadratisch und rund", "Kein zu spezifischer Hintergrund", "Gute Wiedererkennbarkeit", "Passt zu mehreren Plattformen"],
      linksTitle: 'Für einzelne Kanäle zuschneiden',
      linksText: 'Nutze verwandte Seiten für LinkedIn, Lebenslauf und Studio-Look.',
      relatedLinks: localizedRelated.de['ai-headshot-professional-photo'],
      faqTitle: "Fragen zum professionellen Foto",
      faqText: "Wie du ein Bild auswaehlst, das nicht generisch wirkt.",
      faqs: [
        {
          question: "Soll es anders sein als LinkedIn?",
          answer: "Es kann gleich sein, wenn es flexibel genug ist. Fuer Bios ist oft eine neutralere Variante gut.",
        },
        {
          question: "Was sollte ich vermeiden?",
          answer: "Zu auffaellige Hintergruende, dominierende Kleidung und Retusche, die dein Gesicht veraendert.",
        },
      ],
    },
    ja: {
      title: "仕事用プロフィール写真をAIで作成",
      description: "LinkedIn、履歴書、Webサイト、自己紹介、社内ディレクトリなど複数の場面で使いやすいAI仕事用写真の選び方。",
      keywords: ['仕事用 写真 AI', 'プロフィール写真 AI', 'ビジネス写真 AI', 'プロフェッショナル写真 AI'],
      eyebrow: '仕事用プロフィール写真',
      h1: "複数の仕事場面で使えるAIプロフィール写真",
      intro: "仕事用プロフィール写真は、LinkedInだけでなく、履歴書、Webサイトの自己紹介、メール署名、社内ディレクトリ、イベントページなど複数の場所で使われます。特定の場面に寄りすぎない、自然で再利用しやすい写真を選ぶと、プロフィール更新の手間を減らしながら一貫した印象を作れます。",
      primaryCta: '仕事用写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: '仕事用写真の使い道',
      casesText: "一つの写真を複数のプロフィールで使いたい場合や、用途ごとに少し違う写真を用意したい場合に役立ちます。",
      cases: [
        {
          title: "Webサイトの自己紹介",
          text: "サービス紹介やプロフィール文の横に置いても自然に見える写真を選べます。",
        },
        {
          title: "メール署名・社内ディレクトリ",
          text: "小さな表示でも顔がわかりやすい、すっきりした写真が使いやすいです。",
        },
        {
          title: "ポートフォリオ・イベント",
          text: "公開プロフィールや登壇者紹介でも使える、落ち着いた印象を作れます。",
        },
      ],
      guidanceTitle: "使い回しやすさを優先する",
      guidanceText: "強すぎる背景や流行に寄りすぎた表情は避け、四角形や丸型の切り抜きでも使える写真を選びます。本人らしさと清潔感を両立することが大切です。",
      checklist: ["四角形や丸型の切り抜きでも使える", "背景が特定の場面に寄りすぎない", "本人らしさが残っている", "複数のプロフィールで違和感がない"],
      linksTitle: '用途別に調整する',
      linksText: 'LinkedIn、履歴書、スタジオ風、FAQを確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-professional-photo'],
      faqTitle: "仕事用プロフィール写真の質問",
      faqText: "複数の場面で使える写真を選ぶための考え方。",
      faqs: [
        {
          question: "LinkedIn用と別にするべきですか？",
          answer: "同じ写真でも問題ありません。LinkedInでは少し明るい印象、自己紹介ページでは落ち着いた印象など、用途に合わせて複数候補を残すのもおすすめです。",
        },
        {
          question: "避けた方がよい写真はありますか？",
          answer: "背景が派手すぎる写真、顔が小さすぎる写真、本人らしさが変わるほど加工された写真は避けるのが無難です。",
        },
      ],
    },
  },
}

const zhRelated: Record<UseCasePageSlug, UseCasePageContent['relatedLinks']> = {
  'ai-headshot-linkedin': [
    { href: '/ai-headshot-resume', label: '简历照片指南', description: '为求职材料准备更稳重的职业头像。' },
    { href: '/sample', label: '查看生成示例', description: '比较自拍原图和生成后的职业形象照。' },
    { href: '/pricing', label: '查看点数包', description: '按需要选择一次性点数包。' },
  ],
  'ai-headshot-corporate': [
    { href: '/ai-headshot-linkedin', label: 'LinkedIn 头像', description: '让个人资料和公司页面的头像更一致。' },
    { href: '/ai-headshot-studio-style', label: '影棚风头像', description: '选择更干净、正式的职业照片质感。' },
    { href: '/sample', label: '团队示例', description: '查看不同风格的生成效果。' },
  ],
  'ai-headshot-resume': [
    { href: '/ai-headshot-linkedin', label: 'LinkedIn 头像', description: '为招聘搜索和商务社交准备资料照片。' },
    { href: '/ai-headshot-professional-photo', label: '职业照片', description: '了解更通用的职业头像使用方式。' },
    { href: '/questions', label: '常见问题', description: '生成前确认照片、点数和隐私问题。' },
  ],
  'ai-headshot-studio-style': [
    { href: '/ai-headshot-corporate', label: '企业形象照', description: '为团队页面和公司简介保持统一风格。' },
    { href: '/ai-headshot-professional-photo', label: '职业照片', description: '比较正式和自然的头像方向。' },
    { href: '/sample', label: '影棚风示例', description: '先看光线、背景和服装效果。' },
  ],
  'ai-headshot-professional-photo': [
    { href: '/ai-headshot-linkedin', label: 'LinkedIn 头像', description: '用于资料页、招聘搜索和商务关系。' },
    { href: '/ai-headshot-resume', label: '简历照片', description: '用于简历、求职申请和个人介绍。' },
    { href: '/pricing', label: '查看价格', description: '选择合适的点数包开始生成。' },
  ],
}

const commonZhUseCase = {
  primaryCta: '开始生成',
  secondaryCta: '查看示例',
  casesTitle: '适合这些场景',
  guidanceTitle: '生成建议',
  checklist: [
    '上传近期清晰自拍，脸部完整可见。',
    '避免多人合照、墨镜、口罩和过暗照片。',
    '根据用途选择正式、自然或更商务的风格。',
  ],
  faqTitle: '常见问题',
}

const zhUseCasePages: Record<UseCasePageSlug, UseCasePageContent> = {
  'ai-headshot-linkedin': {
    title: 'AI LinkedIn 职业头像生成器 | Magic-Headshot',
    description: '上传自拍生成自然可信的 LinkedIn 职业头像，适合招聘搜索、商务社交、创始人简介和个人品牌展示。',
    keywords: ['LinkedIn头像', 'AI职业形象照', '职业头像生成'],
    eyebrow: 'LinkedIn 头像',
    h1: '为 LinkedIn 生成自然可信的职业头像',
    intro: '一张清晰、自然、专业的头像能让 LinkedIn 资料更容易被信任。Magic-Headshot 帮你从自拍生成适合招聘、商务沟通和个人品牌的职业头像。',
    ...commonZhUseCase,
    casesText: '适合更新 LinkedIn、公开资料、招聘平台和商务社交头像。',
    cases: [
      { title: '求职和招聘搜索', text: '让资料页头像更清楚、稳重，减少随手自拍带来的不专业感。' },
      { title: '创始人和顾问简介', text: '用于 LinkedIn、个人网站、提案材料和公司介绍。' },
      { title: '商务社交', text: '在公开平台展示更一致、更可信的第一印象。' },
    ],
    guidanceText: '建议选择光线明亮、面部正向、无遮挡的自拍，让 AI 更好保留本人特征。',
    linksTitle: '继续完善职业资料',
    linksText: '这些页面可以帮助你把头像扩展到简历、示例和价格选择。',
    relatedLinks: zhRelated['ai-headshot-linkedin'],
    faqText: '关于 LinkedIn 头像生成和使用的常见问题。',
    faqs: [
      { question: '可以同时用于 LinkedIn 和公司简介吗？', answer: '可以。如果风格不过度夸张，同一张照片通常也适合公司简介、个人网站和商务资料。' },
      { question: '应该选择正式还是自然风格？', answer: '求职和商务沟通建议优先选择自然、清晰、不过度修饰的风格。' },
    ],
  },
  'ai-headshot-corporate': {
    title: 'AI 企业形象照生成器 | Magic-Headshot',
    description: '为团队页面、公司简介、员工资料和远程团队生成统一风格的 AI 企业形象照，让公开资料更专业一致可信。',
    keywords: ['企业形象照', '团队头像', 'AI职业形象照'],
    eyebrow: '企业形象照',
    h1: '为团队和公司页面生成统一职业形象照',
    intro: '远程团队很难统一拍摄时间和场地。Magic-Headshot 可以帮助成员从自拍生成更统一、更适合公司页面的职业头像。',
    ...commonZhUseCase,
    casesText: '适合团队页面、员工资料、销售资料和公司介绍。',
    cases: [
      { title: '团队页面', text: '让不同地点成员的头像保持相近的清晰度、背景和职业感。' },
      { title: '员工资料', text: '用于公司内部系统、公开介绍或商务资料。' },
      { title: '创始团队', text: '快速准备适合官网、投资资料和媒体简介的照片。' },
    ],
    guidanceText: '建议先确定统一风格和背景，再让成员上传清晰自拍生成。',
    linksTitle: '继续规划团队头像',
    linksText: '查看 LinkedIn、影棚风和示例页面，比较适合团队的方向。',
    relatedLinks: zhRelated['ai-headshot-corporate'],
    faqText: '关于企业和团队使用 AI 头像的常见问题。',
    faqs: [
      { question: '不同成员上传的自拍不一样，会影响统一感吗？', answer: '会有影响。建议统一要求光线、角度和脸部清晰度，再选择同一类风格。' },
      { question: '适合远程团队吗？', answer: '适合，尤其是无法集中拍摄但需要快速更新公司页面的团队。' },
    ],
  },
  'ai-headshot-resume': {
    title: 'AI 简历照片生成器 | Magic-Headshot',
    description: '为简历、求职申请、个人介绍和职业资料生成自然稳重的 AI 简历照片，适合需要头像的求职场景使用展示。',
    keywords: ['简历照片', '求职照片', 'AI职业形象照'],
    eyebrow: '简历照片',
    h1: '为简历和求职资料生成职业照片',
    intro: '在需要头像的简历或求职平台上，照片应该清晰、稳重、不过度修饰。Magic-Headshot 帮你从自拍生成更适合求职场景的职业照片。',
    ...commonZhUseCase,
    casesText: '适合简历、申请表、求职网站和个人介绍页。',
    cases: [
      { title: '简历头像', text: '准备更简洁、可信、不会分散注意力的职业照片。' },
      { title: '求职申请', text: '用于招聘平台、申请表和候选人资料。' },
      { title: '个人简介', text: '统一简历、LinkedIn 和个人网站的形象。' },
    ],
    guidanceText: '简历照片建议选择简洁背景、自然表情和适度正式的服装。',
    linksTitle: '扩展到其他资料',
    linksText: '同一组照片也可以用于 LinkedIn、职业资料和常见问题检查。',
    relatedLinks: zhRelated['ai-headshot-resume'],
    faqText: '关于简历照片生成和选择的常见问题。',
    faqs: [
      { question: '所有简历都需要照片吗？', answer: '不一定。是否使用照片取决于地区、行业和平台要求。需要时请选择自然、专业的头像。' },
      { question: '可以用过于精修的照片吗？', answer: '不建议。求职照片更适合真实、清楚、不过度美化的效果。' },
    ],
  },
  'ai-headshot-studio-style': {
    title: 'AI 影棚风职业头像生成器 | Magic-Headshot',
    description: '从自拍生成带有干净光线、简洁背景和专业质感的 AI 影棚风职业头像，适合正式资料和商务展示使用场景。',
    keywords: ['影棚风头像', 'AI职业头像', '职业形象照'],
    eyebrow: '影棚风头像',
    h1: '生成干净自然的影棚风职业头像',
    intro: '影棚风头像适合需要更正式、更统一视觉质感的职业场景。Magic-Headshot 帮你从自拍生成更像专业拍摄的头像。',
    ...commonZhUseCase,
    casesText: '适合公司简介、个人网站、演讲者资料和商务头像。',
    cases: [
      { title: '公司和团队页面', text: '干净背景和稳定光线更适合统一展示。' },
      { title: '个人品牌', text: '用于网站、社交资料、提案和公开介绍。' },
      { title: '正式资料照', text: '比生活照更稳重，但不必显得僵硬。' },
    ],
    guidanceText: '选择脸部清晰、角度正、背景不复杂的自拍，影棚风效果会更稳定。',
    linksTitle: '比较其他职业风格',
    linksText: '查看企业形象照、职业照片和示例图库，选择合适正式程度。',
    relatedLinks: zhRelated['ai-headshot-studio-style'],
    faqText: '关于影棚风 AI 头像的常见问题。',
    faqs: [
      { question: '影棚风和普通职业照有什么区别？', answer: '影棚风更强调光线、背景和正式质感；普通职业照可以更自然、生活化一些。' },
      { question: '会不会太像证件照？', answer: '可以通过风格选择避免过于僵硬，保留自然表情和职业气质。' },
    ],
  },
  'ai-headshot-professional-photo': {
    title: 'AI 职业照片生成器 | Magic-Headshot',
    description: '上传自拍生成可用于 LinkedIn、简历、公司资料、个人网站和商务资料的 AI 职业照片，适合长期资料更新。',
    keywords: ['AI职业照片', '职业头像生成', '商务头像'],
    eyebrow: '职业照片',
    h1: '把自拍生成适合工作场景的职业照片',
    intro: '职业照片不只用于 LinkedIn，也常出现在简历、公司资料、个人网站、提案和团队页面。Magic-Headshot 帮你生成更统一、更可信的头像。',
    ...commonZhUseCase,
    casesText: '适合职业资料、个人品牌、商务沟通和公开介绍。',
    cases: [
      { title: '个人资料页', text: '更新头像，让资料更清楚、更可信。' },
      { title: '商务材料', text: '用于提案、简历、公司简介和签名档。' },
      { title: '内容和社交平台', text: '保持职业感，同时保留自然表情和本人特征。' },
    ],
    guidanceText: '建议根据用途选择正式程度，不同平台可以保留 2-3 个候选结果。',
    linksTitle: '按用途继续选择',
    linksText: '查看 LinkedIn、简历和价格页面，决定最适合你的生成方向。',
    relatedLinks: zhRelated['ai-headshot-professional-photo'],
    faqText: '关于 AI 职业照片的常见问题。',
    faqs: [
      { question: '可以一张照片用于多个平台吗？', answer: '可以。只要风格自然、清晰且符合场景，同一张照片可以用于 LinkedIn、简历和个人网站。' },
      { question: '什么样的原图更适合？', answer: '脸部清楚、光线均匀、无遮挡、近期拍摄的自拍更适合生成职业照片。' },
    ],
  },
}

export function getUseCasePageContent(slug: UseCasePageSlug, locale: Locale) {
  const content = locale === 'zh' ? zhUseCasePages[slug] : useCasePages[slug][locale]
  return {
    ...content,
    keywords: content.keywords.slice(0, 3),
  }
}

export function isUseCasePageSlug(value: string): value is UseCasePageSlug {
  return (USE_CASE_PAGE_SLUGS as readonly string[]).includes(value)
}

export function buildUseCasePageMetadata({
  slug,
  locale,
  keywords,
}: {
  slug: UseCasePageSlug
  locale: Locale
  keywords?: string[]
}): Metadata {
  const content = getUseCasePageContent(slug, locale)
  const path = `/${slug}`
  const siteUrl = appConfig.url.replace(/\/$/, '')

  return {
    title: content.title,
    description: content.description,
    keywords: (keywords ?? content.keywords).slice(0, 3),
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternatesForPath(path),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: localePath(locale, path),
      type: 'website',
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: appConfig.name,
      images: [
        {
          url: `${siteUrl}${useCaseHeroImage}`,
          width: 1200,
          height: 630,
          alt: content.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: [`${siteUrl}${useCaseHeroImage}`],
    },
  }
}
