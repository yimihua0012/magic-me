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
      'Compra créditos una vez y genera retratos profesionales realistas para LinkedIn, CV y perfiles de negocio. Compara qué incluye cada paquete antes de subir fotos y elige según la cantidad de estilos que necesitas.',
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
      'Achetez des crédits une seule fois et générez des portraits professionnels réalistes pour LinkedIn, CV et profils business. Comparez les packs avant d’importer vos photos et choisissez selon le nombre de styles voulus.',
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
      'Kaufe Credits einmalig und erstelle realistische professionelle Headshots fur LinkedIn, Lebenslauf und Business-Profile. Vergleiche die Pakete vor dem Upload und wahle nach der Anzahl der gewunschten Stile.',
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
      '一度クレジットを購入して、LinkedIn、履歴書、ビジネスプロフィール向けのリアルなプロ写真を生成できます。写真をアップロードする前に各プランの内容を比較し、必要なスタイル数に合わせて選べます。',
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

Object.assign(localizedPricingContent, {
  es: {
    title: 'Precios del generador de retratos con IA',
    description:
      'Compra créditos una vez y genera retratos profesionales para LinkedIn, CV y perfiles de negocio. Elige el paquete según la cantidad de estilos que quieres probar.',
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
      { question: '¿Es una suscripción?', answer: 'No. Es un pago único que añade créditos a tu cuenta.' },
      { question: '¿Cuándo empieza la validez?', answer: 'La validez empieza con tu primera generación, no en la fecha de compra.' },
    ],
  },
  fr: {
    title: 'Tarifs du générateur de portraits IA',
    description:
      'Achetez des crédits une seule fois et générez des portraits professionnels pour LinkedIn, CV et profils business. Choisissez le pack selon le nombre de styles à tester.',
    mostPopular: 'Le plus populaire',
    perPurchase: 'paiement unique',
    headshots: 'portraits',
    validityTemplate: '{days} jours de validité',
    choosePlanTemplate: 'Choisir {planName}',
    checkoutUnavailable: 'Paiement indisponible pour cette devise pour le moment',
    validityRule: 'La validité commence à la première génération, pas à la date d achat.',
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
      { question: 'Est-ce un abonnement ?', answer: 'Non. Il s agit d un paiement unique qui ajoute des crédits à votre compte.' },
      { question: 'Quand commence la validité ?', answer: 'La validité commence lors de votre première génération, pas à la date d achat.' },
    ],
  },
  de: {
    title: 'Preise für den KI-Headshot-Generator',
    description:
      'Kaufe Credits einmalig und erstelle professionelle Headshots für LinkedIn, Lebenslauf und Business-Profile. Wähle das Paket nach der Anzahl der Stile, die du testen möchtest.',
    mostPopular: 'Am beliebtesten',
    perPurchase: 'Einmalzahlung',
    headshots: 'Headshots',
    validityTemplate: '{days} Tage gültig',
    choosePlanTemplate: '{planName} wählen',
    checkoutUnavailable: 'Zahlung für diese Währung ist noch nicht verfügbar',
    validityRule: 'Die Gültigkeit beginnt mit der ersten Generierung, nicht mit dem Kaufdatum.',
    highlights: {
      resolution: 'Auflösung 1024x1024',
      downloads: 'Unbegrenzte Downloads',
      commercial: 'Kommerzielle Nutzung inklusive',
      priority: 'Priorisierte Verarbeitung',
      emailSupport: 'E-Mail-Support',
      dedicatedSupport: 'Dedizierter Support',
    },
    faqTitle: 'Kurze Fragen zu den Preisen',
    faq: [
      { question: 'Ist das ein Abonnement?', answer: 'Nein. Es ist eine Einmalzahlung, mit der Credits zu deinem Konto hinzugefügt werden.' },
      { question: 'Wann beginnt die Gültigkeit?', answer: 'Die Gültigkeit beginnt mit deiner ersten Generierung, nicht mit dem Kaufdatum.' },
    ],
  },
  ja: {
    title: 'AIヘッドショット生成の料金',
    description:
      'クレジットを一度購入し、LinkedIn、履歴書、会社プロフィール向けの仕事用写真を生成できます。試したいスタイル数に合わせてプランを選べます。',
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
    faqTitle: '料金についてのよくある質問',
    faq: [
      { question: 'サブスクリプションですか？', answer: 'いいえ。一回払いでアカウントにクレジットを追加します。' },
      { question: '有効期間はいつ始まりますか？', answer: '購入日ではなく、最初の生成を開始した時点から有効期間が始まります。' },
    ],
  },
} satisfies Record<Exclude<Locale, 'en'>, LocalizedPricingContent>)

Object.assign(localizedPricingContent, {
  es: {
    ...localizedPricingContent.es,
    title: 'Precios claros para crear retratos IA profesionales',
    description:
      'Compara paquetes de creditos para fotos profesionales con IA: LinkedIn, CV, web personal, perfiles creativos y equipos.',
    validityRule: 'Los creditos se mantienen activos durante el periodo indicado en cada paquete para que puedas probar estilos, revisar resultados y descargar las mejores versiones.',
    highlights: {
      ...localizedPricingContent.es.highlights,
      resolution: 'Descargas listas para perfil, web y documentos digitales',
      downloads: 'Puedes guardar tus resultados favoritos y comparar variantes',
      commercial: 'Uso comercial incluido para marca personal y perfiles de trabajo',
      priority: 'Procesamiento priorizado en los paquetes superiores',
      emailSupport: 'Soporte por email para compras y generacion',
      dedicatedSupport: 'Ayuda mas directa para equipos o volumen alto',
    },
    faqTitle: 'Preguntas frecuentes sobre precios y creditos',
    faq: [
      {
        question: 'Que paquete conviene si solo necesito una foto profesional?',
        answer:
          'Para una actualizacion puntual de LinkedIn, CV o perfil de empresa, suele bastar un paquete pequeno. Si quieres comparar fondos, ropa y estilos, un paquete mayor deja mas margen para elegir.',
      },
      {
        question: 'Puedo usar las fotos generadas en mi web o redes profesionales?',
        answer:
          'Si, los paquetes estan pensados para perfiles profesionales, marca personal, paginas de equipo y redes sociales. Revisa siempre que el resultado final represente bien tu imagen antes de publicarlo.',
      },
    ],
  },
  de: {
    ...localizedPricingContent.de,
    title: 'Preise fur professionelle KI-Portrats ohne Abo-Druck',
    description:
      'Vergleiche Credit-Pakete fuer professionelle KI Fotos: LinkedIn, Bewerbung, Teamseite, Portfolio und kreative Profile.',
    validityRule: 'Credits bleiben im angegebenen Zeitraum aktiv, damit du Styles testen, Ergebnisse vergleichen und die besten Bilder in Ruhe herunterladen kannst.',
    highlights: {
      ...localizedPricingContent.de.highlights,
      resolution: 'Downloads fur Profile, Websites und digitale Unterlagen',
      downloads: 'Mehrere Varianten speichern und direkt vergleichen',
      commercial: 'Kommerzielle Nutzung fur Personal Branding und Arbeitsprofile',
      priority: 'Schnellere Verarbeitung bei groesseren Paketen',
      emailSupport: 'E-Mail-Support fur Zahlung und Erstellung',
      dedicatedSupport: 'Direktere Unterstuetzung fur Teams und groessere Mengen',
    },
    faqTitle: 'Fragen zu Preisen, Credits und Nutzung',
    faq: [
      {
        question: 'Welches Paket reicht fur ein einzelnes professionelles Profilbild?',
        answer:
          'Fuer eine einfache Aktualisierung von LinkedIn, Bewerbung oder Firmenprofil reicht oft ein kleines Paket. Wenn du mehrere Outfits, Hintergruende oder Looks vergleichen willst, ist mehr Spielraum sinnvoll.',
      },
      {
        question: 'Darf ich die erstellten Bilder beruflich verwenden?',
        answer:
          'Ja, die Pakete sind fur berufliche Profile, persoenliche Marken, Teamseiten und Social Media gedacht. Pruefe das finale Bild vor der Veroeffentlichung, damit Ausdruck und Stil zu dir passen.',
      },
    ],
  },
  ja: {
    ...localizedPricingContent.ja,
    title: 'AIプロフィール写真の料金とクレジット',
    description:
      'LinkedIn、履歴書、会社プロフィール、SNS、ポートフォリオ用に必要な枚数に合わせて選べる料金ページです。購入前にクレジット数、有効期間、ダウンロード用途を確認できます。',
    validityRule: 'クレジットは各プランに表示された期間内で利用できます。複数のスタイルを試し、仕上がりを比較してから必要な画像を保存できます。',
    highlights: {
      ...localizedPricingContent.ja.highlights,
      resolution: 'プロフィール、Web、デジタル書類に使いやすい高解像度',
      downloads: '気に入った仕上がりを保存し、候補を比較しやすい',
      commercial: '個人ブランディングや仕事用プロフィールでの利用に対応',
      priority: '上位プランでは生成待ち時間を短縮しやすい',
      emailSupport: '購入や生成に関するメールサポート',
      dedicatedSupport: 'チーム利用や枚数が多い場合の相談にも対応',
    },
    faqTitle: '料金とクレジットのよくある質問',
    faq: [
      {
        question: 'プロフィール写真を1枚だけ更新したい場合はどのプランがよいですか？',
        answer:
          'LinkedIn、履歴書、社内プロフィールの更新だけなら小さめのプランで始めやすいです。背景や服装、雰囲気を比較したい場合は、余裕のあるプランの方が選びやすくなります。',
      },
      {
        question: '生成した写真は仕事用プロフィールやWebサイトで使えますか？',
        answer:
          'はい、仕事用プロフィール、個人ブランド、チーム紹介、SNSでの利用を想定しています。公開前に、表情や雰囲気が自分らしく見えるか確認してください。',
      },
    ],
  },
} satisfies Partial<Record<Exclude<Locale, 'en' | 'fr'>, LocalizedPricingContent>>)
