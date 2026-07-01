import type { Locale } from '@/lib/i18n'

type LocalizedLayoutContent = {
  nav: {
    features: string
    pricing: string
    testimonials: string
    dashboard: string
    logout: string
    signIn: string
    generate: string
    language: string
    openMenu: string
    closeMenu: string
  }
  footer: {
    tagline: string
    product: string
    features: string
    pricing: string
    generate: string
    resources: string
    questions: string
    samples: string
    blog: string
    legal: string
    contact: string
    privacy: string
    terms: string
    refund: string
    copyright: string
  }
}

export const localizedLayoutContent: Record<Locale, LocalizedLayoutContent> = {
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      dashboard: 'Dashboard',
      logout: 'Logout',
      signIn: 'Sign In',
      generate: 'Generate Headshots',
      language: 'Language',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    footer: {
      tagline: 'Professional AI headshots in minutes. Perfect for LinkedIn, social media, and personal branding.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      generate: 'Generate Now',
      resources: 'Resources',
      questions: 'Questions',
      samples: 'Samples',
      blog: 'Blog',
      legal: 'Legal',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Refund Policy',
      copyright: 'All rights reserved.',
    },
  },
  es: {
    nav: {
      features: 'Funciones',
      pricing: 'Precios',
      testimonials: 'Opiniones',
      dashboard: 'Panel',
      logout: 'Cerrar sesion',
      signIn: 'Iniciar sesion',
      generate: 'Crear retratos',
      language: 'Idioma',
      openMenu: 'Abrir menu',
      closeMenu: 'Cerrar menu',
    },
    footer: {
      tagline: 'Retratos profesionales con IA en minutos. Ideales para LinkedIn, redes sociales y marca personal.',
      product: 'Producto',
      features: 'Funciones',
      pricing: 'Precios',
      generate: 'Crear ahora',
      resources: 'Recursos',
      questions: 'Preguntas',
      samples: 'Ejemplos',
      blog: 'Blog',
      legal: 'Legal',
      contact: 'Contacto',
      privacy: 'Politica de privacidad',
      terms: 'Terminos del servicio',
      refund: 'Politica de reembolso',
      copyright: 'Todos los derechos reservados.',
    },
  },
  fr: {
    nav: {
      features: 'Fonctionnalites',
      pricing: 'Tarifs',
      testimonials: 'Avis',
      dashboard: 'Tableau de bord',
      logout: 'Se deconnecter',
      signIn: 'Connexion',
      generate: 'Creer des portraits',
      language: 'Langue',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    footer: {
      tagline: 'Des portraits professionnels par IA en quelques minutes. Parfaits pour LinkedIn, les reseaux sociaux et votre marque personnelle.',
      product: 'Produit',
      features: 'Fonctionnalites',
      pricing: 'Tarifs',
      generate: 'Creer maintenant',
      resources: 'Ressources',
      questions: 'Questions',
      samples: 'Exemples',
      blog: 'Blog',
      legal: 'Legal',
      contact: 'Contact',
      privacy: 'Politique de confidentialite',
      terms: 'Conditions d utilisation',
      refund: 'Politique de remboursement',
      copyright: 'Tous droits reserves.',
    },
  },
  de: {
    nav: {
      features: 'Funktionen',
      pricing: 'Preise',
      testimonials: 'Bewertungen',
      dashboard: 'Dashboard',
      logout: 'Abmelden',
      signIn: 'Anmelden',
      generate: 'Portrats erstellen',
      language: 'Sprache',
      openMenu: 'Menu offnen',
      closeMenu: 'Menu schliessen',
    },
    footer: {
      tagline: 'Professionelle KI-Portrats in wenigen Minuten. Ideal fur LinkedIn, soziale Medien und Personal Branding.',
      product: 'Produkt',
      features: 'Funktionen',
      pricing: 'Preise',
      generate: 'Jetzt erstellen',
      resources: 'Ressourcen',
      questions: 'Fragen',
      samples: 'Beispiele',
      blog: 'Blog',
      legal: 'Rechtliches',
      contact: 'Kontakt',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      refund: 'Ruckerstattungsrichtlinie',
      copyright: 'Alle Rechte vorbehalten.',
    },
  },
  ja: {
    nav: {
      features: '機能',
      pricing: '料金',
      testimonials: 'レビュー',
      dashboard: 'ダッシュボード',
      logout: 'ログアウト',
      signIn: 'ログイン',
      generate: '写真を作成',
      language: '言語',
      openMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
    },
    footer: {
      tagline: '数分でプロ品質のAI証明写真を作成。LinkedIn、SNS、個人ブランディングに最適です。',
      product: 'プロダクト',
      features: '機能',
      pricing: '料金',
      generate: '今すぐ作成',
      resources: 'リソース',
      questions: 'よくある質問',
      samples: 'サンプル',
      blog: 'ブログ',
      legal: '法務',
      contact: 'お問い合わせ',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      refund: '返金ポリシー',
      copyright: 'All rights reserved.',
    },
  },
}
