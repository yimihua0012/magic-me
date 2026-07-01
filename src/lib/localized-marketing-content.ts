import type { Locale } from '@/lib/i18n'

type NonEnglishLocale = Exclude<Locale, 'en'>

export type LocalizedContactContent = {
  title: string
  description: string
  email: string
  responseTime: string
  chat: string
  chatHours: string
  location: string
  formTitle: string
  name: string
  emailAddress: string
  topic: string
  topicPlaceholder: string
  topics: string[]
  message: string
  submit: string
  sending: string
  sentTitle: string
  sentText: string
  sendAnother: string
}

export type LocalizedQuestionsContent = {
  title: string
  description: string
  commonTitle: string
  ctaTitle: string
  ctaText: string
  cta: string
  questions: { question: string; answer: string }[]
}

export type LocalizedSampleContent = {
  title: string
  description: string
  originalLabel: string
  generatedLabel: string
  ctaTitle: string
  ctaText: string
  cta: string
}

export type LocalizedLandingContent = {
  title: string
  description: string
  badge: string
  heading: string
  subheading: string
  primaryCta: string
  secondaryCta: string
  outcomes: string[]
  proof: { value: string; label: string }[]
  benefitsTitle: string
  benefitsText: string
  benefits: { title: string; text: string }[]
  stepsTitle: string
  stepsText: string
  steps: { title: string; text: string }[]
  faqTitle: string
  faqText: string
  faqs: { question: string; answer: string }[]
  bottomTitle: string
  bottomText: string
}

const sharedQuestions: Record<NonEnglishLocale, LocalizedQuestionsContent['questions']> = {
  es: [
    {
      question: '¿Necesito una suscripción?',
      answer: 'No. Compras un paquete de créditos una vez y usas los créditos para generar los estilos que elijas.',
    },
    {
      question: '¿Qué fotos debo subir?',
      answer: 'Sube selfies recientes, bien iluminadas y con el rostro visible. Evita gafas de sol, mascarillas y fotos de grupo.',
    },
    {
      question: '¿Puedo usar los retratos comercialmente?',
      answer: 'Sí. Los planes permiten usar los resultados en LinkedIn, CV, perfiles de empresa, sitios web y material profesional.',
    },
  ],
  fr: [
    {
      question: 'Ai-je besoin d’un abonnement ?',
      answer: 'Non. Vous achetez un pack de crédits une seule fois et utilisez ces crédits pour générer les styles choisis.',
    },
    {
      question: 'Quelles photos dois-je importer ?',
      answer: 'Importez des selfies récents, bien éclairés, avec le visage visible. Évitez lunettes de soleil, masques et photos de groupe.',
    },
    {
      question: 'Puis-je utiliser les portraits commercialement ?',
      answer: 'Oui. Les plans couvrent LinkedIn, CV, profils d’entreprise, sites web et supports professionnels.',
    },
  ],
  de: [
    {
      question: 'Brauche ich ein Abonnement?',
      answer: 'Nein. Du kaufst einmalig ein Credit-Paket und nutzt die Credits fur die ausgewahlten Stile.',
    },
    {
      question: 'Welche Fotos sollte ich hochladen?',
      answer: 'Lade aktuelle Selfies mit gutem Licht und klar sichtbarem Gesicht hoch. Vermeide Sonnenbrillen, Masken und Gruppenfotos.',
    },
    {
      question: 'Darf ich die Headshots kommerziell nutzen?',
      answer: 'Ja. Die Ergebnisse konnen fur LinkedIn, Lebenslauf, Unternehmensprofile, Websites und berufliche Materialien genutzt werden.',
    },
  ],
  ja: [
    {
      question: 'サブスクリプションは必要ですか？',
      answer: 'いいえ。クレジットパックを一度購入し、選択したスタイルの生成にクレジットを使います。',
    },
    {
      question: 'どんな写真をアップロードすればよいですか？',
      answer: '明るく、顔がはっきり見える最近のセルフィーをアップロードしてください。サングラス、マスク、集合写真は避けてください。',
    },
    {
      question: '商用利用できますか？',
      answer: 'はい。LinkedIn、履歴書、会社プロフィール、Webサイト、業務用プロフィールに利用できます。',
    },
  ],
}

export const localizedContactContent: Record<NonEnglishLocale, LocalizedContactContent> = {
  es: {
    title: 'Contacta con el soporte de Magic-Headshot',
    description: '¿Tienes preguntas sobre retratos IA, pagos, reembolsos o tu cuenta? Escríbenos y te responderemos lo antes posible.',
    email: 'Email',
    responseTime: 'Respondemos normalmente en 24 horas',
    chat: 'Chat',
    chatHours: 'Disponible de lunes a viernes',
    location: 'Ubicación',
    formTitle: 'Envíanos un mensaje',
    name: 'Nombre',
    emailAddress: 'Correo electrónico',
    topic: 'Tema',
    topicPlaceholder: 'Selecciona un tema',
    topics: ['Consulta general', 'Soporte técnico', 'Facturación y pagos', 'Reembolso', 'Comentarios'],
    message: 'Mensaje',
    submit: 'Enviar mensaje',
    sending: 'Enviando...',
    sentTitle: 'Mensaje enviado',
    sentText: 'Gracias por contactarnos. Te responderemos pronto.',
    sendAnother: 'Enviar otro mensaje',
  },
  fr: {
    title: 'Contacter le support Magic-Headshot',
    description: 'Des questions sur les portraits IA, les paiements, les remboursements ou votre compte ? Écrivez-nous.',
    email: 'E-mail',
    responseTime: 'Réponse habituelle sous 24 heures',
    chat: 'Chat',
    chatHours: 'Disponible du lundi au vendredi',
    location: 'Lieu',
    formTitle: 'Envoyez-nous un message',
    name: 'Nom',
    emailAddress: 'Adresse e-mail',
    topic: 'Sujet',
    topicPlaceholder: 'Choisir un sujet',
    topics: ['Question générale', 'Support technique', 'Facturation et paiements', 'Remboursement', 'Retour'],
    message: 'Message',
    submit: 'Envoyer le message',
    sending: 'Envoi...',
    sentTitle: 'Message envoyé',
    sentText: 'Merci de nous avoir contactés. Nous vous répondrons bientôt.',
    sendAnother: 'Envoyer un autre message',
  },
  de: {
    title: 'Magic-Headshot Support kontaktieren',
    description: 'Fragen zu KI-Headshots, Zahlungen, Erstattungen oder deinem Konto? Schreib uns.',
    email: 'E-Mail',
    responseTime: 'Antwort normalerweise innerhalb von 24 Stunden',
    chat: 'Chat',
    chatHours: 'Montag bis Freitag verfugbar',
    location: 'Standort',
    formTitle: 'Sende uns eine Nachricht',
    name: 'Name',
    emailAddress: 'E-Mail-Adresse',
    topic: 'Thema',
    topicPlaceholder: 'Thema auswahlen',
    topics: ['Allgemeine Frage', 'Technischer Support', 'Abrechnung und Zahlung', 'Erstattung', 'Feedback'],
    message: 'Nachricht',
    submit: 'Nachricht senden',
    sending: 'Wird gesendet...',
    sentTitle: 'Nachricht gesendet',
    sentText: 'Danke fur deine Nachricht. Wir melden uns bald.',
    sendAnother: 'Weitere Nachricht senden',
  },
  ja: {
    title: 'Magic-Headshot サポートへのお問い合わせ',
    description: 'AIヘッドショット、支払い、返金、アカウントについて質問がある場合はお問い合わせください。',
    email: 'メール',
    responseTime: '通常24時間以内に返信します',
    chat: 'チャット',
    chatHours: '月曜日から金曜日まで対応',
    location: '所在地',
    formTitle: 'メッセージを送信',
    name: '名前',
    emailAddress: 'メールアドレス',
    topic: 'トピック',
    topicPlaceholder: 'トピックを選択',
    topics: ['一般的な質問', '技術サポート', '請求と支払い', '返金', 'フィードバック'],
    message: 'メッセージ',
    submit: '送信',
    sending: '送信中...',
    sentTitle: '送信しました',
    sentText: 'お問い合わせありがとうございます。できるだけ早く返信します。',
    sendAnother: '別のメッセージを送る',
  },
}

export const localizedQuestionsContent: Record<NonEnglishLocale, LocalizedQuestionsContent> = {
  es: {
    title: 'Preguntas sobre retratos IA',
    description: 'Respuestas rápidas sobre créditos, selfies, calidad, pagos y uso profesional.',
    commonTitle: 'Preguntas frecuentes',
    ctaTitle: '¿Quieres ver ejemplos reales?',
    ctaText: 'Compara fotos originales con retratos generados antes de elegir un plan.',
    cta: 'Ver muestras',
    questions: sharedQuestions.es,
  },
  fr: {
    title: 'Questions sur les portraits IA',
    description: 'Réponses rapides sur les crédits, selfies, qualité, paiements et usage professionnel.',
    commonTitle: 'Questions fréquentes',
    ctaTitle: 'Voir des exemples réels ?',
    ctaText: 'Comparez des photos originales avec des portraits générés avant de choisir un plan.',
    cta: 'Voir les exemples',
    questions: sharedQuestions.fr,
  },
  de: {
    title: 'Fragen zu KI-Headshots',
    description: 'Kurze Antworten zu Credits, Selfies, Qualitat, Zahlungen und beruflicher Nutzung.',
    commonTitle: 'Haufige Fragen',
    ctaTitle: 'Mochtest du Beispiele sehen?',
    ctaText: 'Vergleiche Originalfotos mit generierten Headshots, bevor du einen Plan wahlst.',
    cta: 'Beispiele ansehen',
    questions: sharedQuestions.de,
  },
  ja: {
    title: 'AIヘッドショットに関する質問',
    description: 'クレジット、セルフィー、品質、支払い、ビジネス利用についてのよくある質問です。',
    commonTitle: 'よくある質問',
    ctaTitle: '実際のサンプルを見ますか？',
    ctaText: 'プランを選ぶ前に、元写真と生成されたヘッドショットを比較できます。',
    cta: 'サンプルを見る',
    questions: sharedQuestions.ja,
  },
}

export const localizedSampleContent: Record<NonEnglishLocale, LocalizedSampleContent> = {
  es: {
    title: 'Muestras de retratos IA antes y después',
    description: 'Compara fotos originales con retratos profesionales generados para LinkedIn, CV y perfiles de negocio.',
    originalLabel: 'foto original del usuario',
    generatedLabel: 'retrato profesional generado',
    ctaTitle: 'Elige la dirección visual adecuada',
    ctaText: 'Usa las muestras para decidir qué estilo se adapta mejor a tu perfil.',
    cta: 'Ver precios',
  },
  fr: {
    title: 'Exemples de portraits IA avant/après',
    description: 'Comparez des photos originales avec des portraits professionnels générés pour LinkedIn, CV et profils business.',
    originalLabel: 'photo originale fournie',
    generatedLabel: 'portrait professionnel généré',
    ctaTitle: 'Choisissez la bonne direction visuelle',
    ctaText: 'Utilisez les exemples pour décider quel style convient le mieux à votre profil.',
    cta: 'Voir les prix',
  },
  de: {
    title: 'KI-Headshot Beispiele vorher und nachher',
    description: 'Vergleiche Originalfotos mit professionellen Headshots fur LinkedIn, Lebenslauf und Business-Profile.',
    originalLabel: 'Originalfoto des Nutzers',
    generatedLabel: 'generierter professioneller Headshot',
    ctaTitle: 'Wahle die passende visuelle Richtung',
    ctaText: 'Nutze die Beispiele, um den passenden Stil fur dein Profil zu finden.',
    cta: 'Preise ansehen',
  },
  ja: {
    title: 'AIヘッドショットのビフォーアフター',
    description: '元写真と、LinkedIn・履歴書・ビジネスプロフィール向けに生成されたヘッドショットを比較できます。',
    originalLabel: 'ユーザー提供の元写真',
    generatedLabel: '生成されたプロ向けヘッドショット',
    ctaTitle: '自分に合う見た目を選ぶ',
    ctaText: 'サンプルを見ながら、プロフィールに合うスタイルを選べます。',
    cta: '料金を見る',
  },
}

export const localizedLandingContent: Record<NonEnglishLocale, LocalizedLandingContent> = {
  es: {
    title: 'Retratos IA profesionales en minutos',
    description: 'Convierte selfies en retratos realistas para LinkedIn, CV y perfiles de negocio.',
    badge: 'Retratos IA para LinkedIn, CV y equipos',
    heading: 'Retratos profesionales sin reservar fotógrafo',
    subheading: 'Sube selfies, elige estilos profesionales y genera retratos realistas listos para tu perfil.',
    primaryCta: 'Ver planes',
    secondaryCta: 'Subir selfies',
    outcomes: ['LinkedIn', 'CV', 'Bio profesional', 'Equipos remotos'],
    proof: [{ value: '3-5 min', label: 'tiempo típico' }, { value: '1024px', label: 'descargas listas' }, { value: 'Sin suscripción', label: 'pago único' }],
    benefitsTitle: 'Una imagen más creíble donde te descubren primero',
    benefitsText: 'Mejora LinkedIn, candidaturas, bios y páginas de equipo sin estudio fotográfico.',
    benefits: [{ title: 'Parecido realista', text: 'El flujo está pensado para retratos profesionales, no avatares aleatorios.' }, { title: 'Uso profesional', text: 'Ideal para LinkedIn, CV, perfiles de empresa y marca personal.' }, { title: 'Rápido', text: 'Diseñado para actualizar tu perfil hoy.' }],
    stepsTitle: 'De selfie a retrato profesional en tres pasos',
    stepsText: 'Sube fotos claras, elige estilos y descarga resultados.',
    steps: [{ title: 'Sube selfies claros', text: 'Usa fotos recientes con buena iluminación.' }, { title: 'Elige estilos', text: 'Selecciona looks profesionales según tus créditos.' }, { title: 'Descarga resultados', text: 'Usa tus retratos en perfiles públicos.' }],
    faqTitle: 'Preguntas antes de empezar',
    faqText: 'Créditos, fotos y uso profesional.',
    faqs: sharedQuestions.es,
    bottomTitle: '¿Listo para mejorar tu perfil?',
    bottomText: 'Compra créditos una vez y genera retratos profesionales cuando los necesites.',
  },
  fr: {
    title: 'Portraits IA professionnels en quelques minutes',
    description: 'Transformez des selfies en portraits réalistes pour LinkedIn, CV et profils business.',
    badge: 'Portraits IA pour LinkedIn, CV et équipes',
    heading: 'Portraits professionnels sans réserver de photographe',
    subheading: 'Importez des selfies, choisissez des styles professionnels et générez des portraits réalistes.',
    primaryCta: 'Voir les plans',
    secondaryCta: 'Importer des selfies',
    outcomes: ['LinkedIn', 'CV', 'Bio professionnelle', 'Équipes à distance'],
    proof: [{ value: '3-5 min', label: 'temps typique' }, { value: '1024px', label: 'téléchargements prêts' }, { value: 'Sans abonnement', label: 'paiement unique' }],
    benefitsTitle: 'Une image plus crédible là où l’on vous découvre',
    benefitsText: 'Améliorez LinkedIn, candidatures, bios et pages d’équipe sans studio photo.',
    benefits: [{ title: 'Ressemblance réaliste', text: 'Le flux est pensé pour des portraits professionnels.' }, { title: 'Usage business', text: 'Pour LinkedIn, CV, profils d’entreprise et marque personnelle.' }, { title: 'Rapide', text: 'Conçu pour mettre votre profil à jour aujourd’hui.' }],
    stepsTitle: 'Du selfie au portrait professionnel en trois étapes',
    stepsText: 'Importez des photos claires, choisissez des styles et téléchargez les résultats.',
    steps: [{ title: 'Importez des selfies clairs', text: 'Utilisez des photos récentes bien éclairées.' }, { title: 'Choisissez les styles', text: 'Sélectionnez les looks selon vos crédits.' }, { title: 'Téléchargez les résultats', text: 'Utilisez vos portraits sur vos profils.' }],
    faqTitle: 'Questions avant de commencer',
    faqText: 'Crédits, photos et usage professionnel.',
    faqs: sharedQuestions.fr,
    bottomTitle: 'Prêt à améliorer votre profil ?',
    bottomText: 'Achetez des crédits une fois et générez des portraits professionnels selon vos besoins.',
  },
  de: {
    title: 'Professionelle KI-Headshots in Minuten',
    description: 'Verwandle Selfies in realistische Headshots fur LinkedIn, Lebenslauf und Business-Profile.',
    badge: 'KI-Headshots fur LinkedIn, Lebenslauf und Teams',
    heading: 'Professionelle Headshots ohne Fototermin',
    subheading: 'Lade Selfies hoch, wahle professionelle Stile und erstelle realistische Headshots.',
    primaryCta: 'Plane ansehen',
    secondaryCta: 'Selfies hochladen',
    outcomes: ['LinkedIn', 'Lebenslauf', 'Business-Bio', 'Remote-Teams'],
    proof: [{ value: '3-5 Min.', label: 'typische Dauer' }, { value: '1024px', label: 'profilfertige Downloads' }, { value: 'Kein Abo', label: 'Einmalzahlung' }],
    benefitsTitle: 'Ein glaubwurdigeres Bild dort, wo man dich zuerst sieht',
    benefitsText: 'Verbessere LinkedIn, Bewerbungen, Bios und Teamseiten ohne Fotostudio.',
    benefits: [{ title: 'Realistische Ahnlichkeit', text: 'Der Ablauf ist fur professionelle Portraits gedacht.' }, { title: 'Business-Fokus', text: 'Fur LinkedIn, Lebenslauf, Unternehmensprofile und Personal Branding.' }, { title: 'Schnell', text: 'Fur Profilupdates noch heute.' }],
    stepsTitle: 'In drei Schritten vom Selfie zum Headshot',
    stepsText: 'Lade klare Fotos hoch, wahle Stile und lade Ergebnisse herunter.',
    steps: [{ title: 'Klare Selfies hochladen', text: 'Nutze aktuelle Fotos mit gutem Licht.' }, { title: 'Stile wahlen', text: 'Wahle professionelle Looks passend zu deinen Credits.' }, { title: 'Ergebnisse herunterladen', text: 'Nutze deine Headshots auf Profilen.' }],
    faqTitle: 'Fragen vor dem Start',
    faqText: 'Credits, Fotos und berufliche Nutzung.',
    faqs: sharedQuestions.de,
    bottomTitle: 'Bereit fur ein besseres Profil?',
    bottomText: 'Kaufe Credits einmalig und generiere professionelle Headshots nach Bedarf.',
  },
  ja: {
    title: 'プロ向けAIヘッドショットを数分で作成',
    description: 'セルフィーからLinkedIn、履歴書、ビジネスプロフィール向けのリアルな写真を生成します。',
    badge: 'LinkedIn・履歴書・チーム向けAIヘッドショット',
    heading: '写真スタジオを予約せずにプロ向けヘッドショットを作成',
    subheading: 'セルフィーをアップロードし、プロ向けスタイルを選んで、プロフィール用の写真を生成できます。',
    primaryCta: 'プランを見る',
    secondaryCta: 'セルフィーをアップロード',
    outcomes: ['LinkedIn', '履歴書', 'プロフィール', 'リモートチーム'],
    proof: [{ value: '3-5分', label: '一般的な生成時間' }, { value: '1024px', label: 'ダウンロード画像' }, { value: 'サブスクなし', label: '一回払い' }],
    benefitsTitle: '最初に見られるプロフィール写真をより信頼感のあるものに',
    benefitsText: 'LinkedIn、応募書類、プロフィール、チームページを手軽に改善できます。',
    benefits: [{ title: '自然な本人らしさ', text: 'ランダムなアバターではなく、プロ向けポートレートに合わせた流れです。' }, { title: 'ビジネス用途向け', text: 'LinkedIn、履歴書、会社プロフィール、個人ブランドに使えます。' }, { title: 'すばやく更新', text: '今日プロフィール写真を改善したい人向けです。' }],
    stepsTitle: 'セルフィーからプロ向け写真まで3ステップ',
    stepsText: '明るい写真をアップロードし、スタイルを選んで、結果をダウンロードします。',
    steps: [{ title: '明るいセルフィーをアップロード', text: '顔がはっきり見える最近の写真を使います。' }, { title: 'スタイルを選択', text: 'クレジットに合わせてプロ向けの見た目を選びます。' }, { title: '結果をダウンロード', text: '公開プロフィールに使える写真を保存します。' }],
    faqTitle: '始める前の質問',
    faqText: 'クレジット、写真、ビジネス利用について。',
    faqs: sharedQuestions.ja,
    bottomTitle: 'プロフィール写真を改善しますか？',
    bottomText: 'クレジットを一度購入し、必要なときにプロ向け写真を生成できます。',
  },
}
