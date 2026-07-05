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

const localizedRelated: Record<Exclude<Locale, 'en'>, Record<UseCasePageSlug, UseCasePageContent['relatedLinks']>> = {
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

export const useCasePages: Record<UseCasePageSlug, Record<Locale, UseCasePageContent>> = {
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
      title: "LinkedIn??AI????????????",
      description: "???????????????????????????LinkedIn???AI????????????",
      keywords: ['LinkedIn 写真 AI', 'AIヘッドショット LinkedIn', 'プロフィール写真 AI', '仕事用写真 AI'],
      eyebrow: 'LinkedInプロフィール向け',
      h1: "LinkedIn??????AI????????",
      intro: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????",
      primaryCta: 'LinkedIn写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: 'LinkedInで使いやすい場面',
      casesText: "??????????????????????????????????????",
      cases: [
        {
          title: "?????",
          text: "???????????????????????????",
        },
        {
          title: "?????????",
          text: "???????????????????????????",
        },
        {
          title: "?????????",
          text: "??????????????????????????????",
        },
      ],
      guidanceTitle: "????????",
      guidanceText: "????????????????????????????????????????????????????????????",
      checklist: ["????????????", "???????", "??????????", "?????"],
      linksTitle: 'ほかの用途も準備する',
      linksText: '履歴書、社員紹介、サンプル確認に進めます。',
      relatedLinks: localizedRelated.ja['ai-headshot-linkedin'],
      faqTitle: "LinkedIn?????????",
      faqText: "AI?????????????????????????",
      faqs: [
        {
          question: "???????????????????",
          answer: "?????????????????????????????????????????????",
        },
        {
          question: "???????????????",
          answer: "????????????????LinkedIn?????????????????????",
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
      title: "???????AI???????????",
      description: "?????????????????????????????????AI???????",
      keywords: ['企業写真 AI', '社員紹介 写真 AI', 'AIヘッドショット 企業', 'ビジネス写真 AI'],
      eyebrow: '企業・チーム向け',
      h1: "???????AI???????",
      intro: "????????????????????????????????????????????????????????????????????AI????????????????????????????????????????????????",
      primaryCta: '企業向け写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: '企業で使いやすい場面',
      casesText: "???????????????????????????????????????",
      cases: [
        {
          title: "???????",
          text: "??????????????????????????",
        },
        {
          title: "????????",
          text: "????????????????????????",
        },
        {
          title: "???????",
          text: "?????????????????????????",
        },
      ],
      guidanceTitle: "?????????",
      guidanceText: "??????????????????????????????????????????????????????????????????",
      checklist: ["????????", "?????????????", "????????", "?????????????"],
      linksTitle: '企業写真セットを広げる',
      linksText: 'LinkedIn、スタジオ風、サンプル、料金を確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-corporate'],
      faqTitle: "???????????",
      faqText: "????AI???????????????",
      faqs: [
        {
          question: "???????????????",
          answer: "?????????????????????????????????",
        },
        {
          question: "??????????????",
          answer: "???????????????????????????????",
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
      description: "Wie du ein ruhiges KI Bewerbungsfoto waehlst, das zur Bewerbung passt und nicht kuenstlich wirkt.",
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
      title: "?????AI??????",
      description: "??????????????????AI????????????????????????",
      keywords: ['履歴書 写真 AI', '職務経歴書 写真 AI', '証明写真 AI', '応募写真 AI'],
      eyebrow: '履歴書・応募書類向け',
      h1: "?????????AI??",
      intro: "????????????????????????????????????????AI????????????????????????????????????????????????????????????",
      primaryCta: '履歴書写真を生成',
      secondaryCta: '例を見る',
      casesTitle: '履歴書向け写真が必要な場面',
      casesText: "?????????????????????????????????????",
      cases: [
        {
          title: "???",
          text: "??????????????????????????",
        },
        {
          title: "?????",
          text: "????????????????????????",
        },
        {
          title: "???????",
          text: "?????????????????????????",
        },
      ],
      guidanceTitle: "????????",
      guidanceText: "????????????????????????????????????????????????????????????",
      checklist: ["???????", "??????????", "?????", "????????"],
      linksTitle: 'ほかのプロフィールにも使う',
      linksText: 'LinkedIn、仕事用プロフィール、FAQ、サンプルを確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-resume'],
      faqTitle: "????????????",
      faqText: "?????AI???????????????",
      faqs: [
        {
          question: "???????????",
          answer: "??????????????????????????????????????",
        },
        {
          question: "?????????",
          answer: "?????????????????????????????",
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
      description: 'Générez des portraits IA style studio avec lumière soignée, fond propre et rendu professionnel.',
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
      title: "?????AI??????????",
      description: "????????????????????????????????AI???????",
      keywords: ['スタジオ写真 AI', 'AIヘッドショット スタジオ', 'プロフィール写真 スタジオ風', '仕事用写真 AI'],
      eyebrow: 'スタジオ風プロフィール写真',
      h1: "???????????AI??",
      intro: "?????????????????????????????????????????????????????????????????AI??????????????????????????????",
      primaryCta: 'スタジオ風写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: 'スタジオ風が合う場面',
      casesText: "??????????????????????????????????????????",
      cases: [
        {
          title: "????????",
          text: "????????????????????????",
        },
        {
          title: "??????",
          text: "?????????????????",
        },
        {
          title: "??????",
          text: "?????????????????????????",
        },
      ],
      guidanceTitle: "???????????",
      guidanceText: "???????????????????????????????????????????????????????????",
      checklist: ["??????", "??????????", "??????????", "??????"],
      linksTitle: 'フォーマル度を比較する',
      linksText: '仕事用、企業向け、サンプル、料金を確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-studio-style'],
      faqTitle: "??????????????",
      faqText: "????????????????????????",
      faqs: [
        {
          question: "??????????????",
          answer: "?????????????????????????????????????????",
        },
        {
          question: "???????????????",
          answer: "????????????????????????????????????",
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
      title: "????????????AI?????",
      description: "?????Web?????????????????????????AI???????",
      keywords: ['仕事用 写真 AI', 'プロフィール写真 AI', 'ビジネス写真 AI', 'プロフェッショナル写真 AI'],
      eyebrow: '仕事用プロフィール写真',
      h1: "???????????AI????????",
      intro: "????????LinkedIn??????????????????????????????????????????????????????????????????????????????????????????????????????",
      primaryCta: '仕事用写真を生成',
      secondaryCta: 'サンプルを見る',
      casesTitle: '仕事用写真の使い道',
      casesText: "????????????????????????????????????????",
      cases: [
        {
          title: "???????",
          text: "???????????????????????????",
        },
        {
          title: "????????",
          text: "??????????????????????",
        },
        {
          title: "???????",
          text: "??????????????????????????",
        },
      ],
      guidanceTitle: "??????????",
      guidanceText: "??????????????????????????????????????????????????????????????????",
      checklist: ["??????????", "??????????", "????????", "?????????"],
      linksTitle: '用途別に調整する',
      linksText: 'LinkedIn、履歴書、スタジオ風、FAQを確認できます。',
      relatedLinks: localizedRelated.ja['ai-headshot-professional-photo'],
      faqTitle: "????????????",
      faqText: "?????????????????????",
      faqs: [
        {
          question: "LinkedIn???????????",
          answer: "????????????????????????????????????????",
        },
        {
          question: "???????????",
          answer: "?????????????????????????????",
        },
      ],
    },
  },
}

export function getUseCasePageContent(slug: UseCasePageSlug, locale: Locale) {
  return useCasePages[slug][locale]
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
    keywords: keywords ?? content.keywords,
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
