import type { Locale } from '@/lib/i18n'

export type LocalizedPricingContent = {
  title: string
  description: string
  mostPopular: string
  perPurchase: string
  headshots: string
  validityTemplate: string
  choosePlanTemplate: string
  checkoutUnavailable: string
  validityRule: string
  highlights: {
    resolution: string
    downloads: string
    commercial: string
    priority: string
    emailSupport: string
    dedicatedSupport: string
  }
  faqTitle: string
  faq: { question: string; answer: string }[]
}

export const localizedPricingContent: Record<Exclude<Locale, 'en'>, LocalizedPricingContent> = {
  es: {
    title: 'Precios del generador de retratos IA',
    description:
      'Compra créditos una vez y genera retratos profesionales realistas para LinkedIn, CV y perfiles de negocio.',
    mostPopular: 'Más popular',
    perPurchase: 'pago único',
    headshots: 'retratos',
    validityTemplate: '{days} días de validez',
    choosePlanTemplate: 'Elegir {planName}',
    checkoutUnavailable: 'Pago no disponible para esta moneda todavía',
    validityRule: 'La validez empieza con tu primera generación, no en la fecha de compra.',
    highlights: {
      resolution: 'Resolución 1024x1024',
      downloads: 'Descargas ilimitadas',
      commercial: 'Uso comercial incluido',
      priority: 'Procesamiento prioritario',
      emailSupport: 'Soporte por email',
      dedicatedSupport: 'Soporte dedicado',
    },
    faqTitle: 'Preguntas rápidas sobre precios',
    faq: [
      {
        question: '¿Es una suscripción?',
        answer: 'No. Es un pago único para añadir créditos a tu cuenta.',
      },
      {
        question: '¿Cuándo empieza la validez?',
        answer: 'La validez empieza con tu primera generación, no en la fecha de compra.',
      },
    ],
  },
  fr: {
    title: 'Tarifs du générateur de portraits IA',
    description:
      'Achetez des crédits une seule fois et générez des portraits professionnels réalistes pour LinkedIn, CV et profils business.',
    mostPopular: 'Le plus populaire',
    perPurchase: 'paiement unique',
    headshots: 'portraits',
    validityTemplate: '{days} jours de validité',
    choosePlanTemplate: 'Choisir {planName}',
    checkoutUnavailable: 'Paiement indisponible pour cette devise pour le moment',
    validityRule: 'La validité commence à la première génération, pas à la date d’achat.',
    highlights: {
      resolution: 'Résolution 1024x1024',
      downloads: 'Téléchargements illimités',
      commercial: 'Usage commercial inclus',
      priority: 'Traitement prioritaire',
      emailSupport: 'Support par e-mail',
      dedicatedSupport: 'Support dédié',
    },
    faqTitle: 'Questions rapides sur les tarifs',
    faq: [
      {
        question: 'Est-ce un abonnement ?',
        answer: 'Non. Il s’agit d’un paiement unique pour ajouter des crédits à votre compte.',
      },
      {
        question: 'Quand commence la validité ?',
        answer: 'La validité commence lors de votre première génération, pas à la date d’achat.',
      },
    ],
  },
  de: {
    title: 'Preise fur den KI-Headshot-Generator',
    description:
      'Kaufe Credits einmalig und erstelle realistische professionelle Headshots fur LinkedIn, Lebenslauf und Business-Profile.',
    mostPopular: 'Am beliebtesten',
    perPurchase: 'Einmalzahlung',
    headshots: 'Headshots',
    validityTemplate: '{days} Tage gultig',
    choosePlanTemplate: '{planName} wahlen',
    checkoutUnavailable: 'Zahlung fur diese Wahrung ist noch nicht verfugbar',
    validityRule: 'Die Gültigkeit beginnt mit der ersten Generierung, nicht mit dem Kaufdatum.',
    highlights: {
      resolution: 'Auflosung 1024x1024',
      downloads: 'Unbegrenzte Downloads',
      commercial: 'Kommerzielle Nutzung inklusive',
      priority: 'Priorisierte Verarbeitung',
      emailSupport: 'E-Mail-Support',
      dedicatedSupport: 'Dedizierter Support',
    },
    faqTitle: 'Kurze Fragen zu den Preisen',
    faq: [
      {
        question: 'Ist das ein Abonnement?',
        answer: 'Nein. Es ist eine Einmalzahlung, mit der Credits zu deinem Konto hinzugefugt werden.',
      },
      {
        question: 'Wann beginnt die Gultigkeit?',
        answer: 'Die Gultigkeit beginnt mit deiner ersten Generierung, nicht mit dem Kaufdatum.',
      },
    ],
  },
  ja: {
    title: 'AIヘッドショット生成の料金',
    description:
      '一度クレジットを購入して、LinkedIn、履歴書、ビジネスプロフィール向けのリアルなプロ写真を生成できます。',
    mostPopular: '人気',
    perPurchase: '一回払い',
    headshots: '枚のヘッドショット',
    validityTemplate: '{days}日間有効',
    choosePlanTemplate: '{planName}を選択',
    checkoutUnavailable: 'この通貨での支払いはまだ利用できません',
    validityRule: '有効期間は購入日ではなく、初回生成時に開始します。',
    highlights: {
      resolution: '1024x1024 解像度',
      downloads: '無制限ダウンロード',
      commercial: '商用利用可能',
      priority: '優先処理',
      emailSupport: 'メールサポート',
      dedicatedSupport: '専用サポート',
    },
    faqTitle: '料金に関するよくある質問',
    faq: [
      {
        question: 'サブスクリプションですか？',
        answer: 'いいえ。一回払いでアカウントにクレジットを追加します。',
      },
      {
        question: '有効期限はいつ始まりますか？',
        answer: '購入日ではなく、最初の生成を開始した時点から有効期間が始まります。',
      },
    ],
  },
}
