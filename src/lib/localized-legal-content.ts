import type { Locale } from '@/lib/i18n'

export type LegalPageKey = 'terms' | 'privacy' | 'refund'

type LegalSection = {
  title: string
  body?: string[]
  bullets?: string[]
  ordered?: string[]
}

export type LegalPageContent = {
  title: string
  description: string
  keywords: string[]
  heading: string
  notice: string
  lastUpdated: string
  sections: LegalSection[]
}

type LocalizedLegalContent = Record<Exclude<Locale, 'en'>, Record<LegalPageKey, LegalPageContent>>

const supportEmail = 'support@mail.magic-headshot.com'

export const localizedLegalContent: LocalizedLegalContent = {
  es: {
    terms: {
      title: 'Condiciones de Magic-Headshot para retratos profesionales con IA',
      description:
        'Consulta las condiciones de Magic-Headshot sobre generación de retratos con IA, fotos subidas, pagos, reembolsos, derechos de uso comercial y normas de cuenta.',
      keywords: ['condiciones Magic-Headshot', 'condiciones retratos IA', 'derechos de uso comercial'],
      heading: 'Condiciones de servicio de Magic-Headshot',
      notice:
        'Esta traducción se ofrece para facilitar la lectura. Si existe alguna diferencia con la versión inglesa, prevalece la versión inglesa.',
      lastUpdated: '27 de junio de 2026',
      sections: [
        {
          title: '1. Aceptación de las condiciones',
          body: [
            'Al acceder a Magic-Headshot o utilizar el servicio, aceptas estas Condiciones de servicio. Si no estás de acuerdo, no utilices el servicio.',
          ],
        },
        {
          title: '2. Descripción del servicio',
          body: [
            'Magic-Headshot ofrece generación de retratos profesionales mediante IA. Puedes subir selfies y recibir retratos profesionales generados por IA en varios estilos.',
          ],
        },
        {
          title: '3. Cuentas de usuario',
          body: ['Para utilizar el servicio, debes cumplir estos requisitos:'],
          bullets: [
            'Tener al menos 18 años.',
            'Proporcionar información exacta y completa.',
            'Mantener la seguridad de tu cuenta.',
            'Avisarnos de cualquier uso no autorizado.',
          ],
        },
        {
          title: '4. Uso aceptable',
          body: ['Aceptas no realizar las siguientes acciones:'],
          bullets: [
            'Subir fotos de otras personas sin su consentimiento.',
            'Utilizar el servicio con fines ilegales.',
            'Generar contenido dañino, ofensivo o inapropiado.',
            'Intentar vulnerar nuestros sistemas de IA.',
            'Revender o redistribuir contenido generado.',
          ],
        },
        {
          title: '5. Propiedad intelectual',
          body: [
            'Retratos generados: conservas los derechos sobre los retratos generados con el servicio y puedes utilizarlos con fines personales y comerciales.',
            'Nuestra propiedad intelectual: mantenemos la titularidad de nuestra tecnología, logotipos, marcas y propiedad intelectual preexistente.',
          ],
        },
        {
          title: '6. Pagos',
          bullets: [
            'Los precios se muestran en la moneda seleccionada o predeterminada para tu idioma.',
            'Los pagos se procesan de forma segura mediante PayPal.',
            'Los pagos únicos añaden créditos a tu cuenta.',
            'Las ventas están sujetas a nuestra política de reembolso.',
          ],
        },
        {
          title: '7. Reembolsos',
          body: [
            'Ofrecemos una garantía de satisfacción de 30 días. Si no estás conforme con tus retratos, contáctanos dentro de los 30 días posteriores a la compra.',
          ],
        },
        {
          title: '8. Contacto',
          body: [`Para preguntas sobre estas condiciones, escríbenos a ${supportEmail}.`],
        },
      ],
    },
    privacy: {
      title: 'Política de privacidad de Magic-Headshot para retratos con IA',
      description:
        'Lee cómo Magic-Headshot recopila, usa, almacena y protege datos de cuenta, fotos subidas, retratos generados, metadatos de pago y solicitudes de soporte.',
      keywords: ['privacidad Magic-Headshot', 'privacidad retratos IA', 'privacidad fotos subidas'],
      heading: 'Política de privacidad de Magic-Headshot',
      notice:
        'Esta traducción se ofrece para facilitar la lectura. Si existe alguna diferencia con la versión inglesa, prevalece la versión inglesa.',
      lastUpdated: '27 de junio de 2026',
      sections: [
        {
          title: '1. Información que recopilamos',
          bullets: [
            'Información de cuenta, como nombre, correo electrónico y datos de autenticación.',
            'Fotos que subes y retratos generados por IA a partir de esas fotos.',
            'Historial de generación, estilos seleccionados, uso de créditos y solicitudes de soporte.',
            'Estado de pago, identificadores de pedido y metadatos de proveedores de pago. No almacenamos números completos de tarjeta.',
            'Datos básicos de dispositivo, uso, cookies y analítica para operar y mejorar el servicio.',
          ],
        },
        {
          title: '2. Cómo usamos la información',
          bullets: [
            'Crear y gestionar tu cuenta.',
            'Generar retratos con IA usando las fotos y estilos que selecciones.',
            'Procesar pagos, créditos, reembolsos y confirmaciones de compra.',
            'Enviar correos de servicio, como confirmaciones de pago y avisos de finalización.',
            'Prevenir fraude, abuso, deducciones duplicadas y accesos no autorizados.',
            'Mantener, proteger, diagnosticar y mejorar el servicio.',
          ],
        },
        {
          title: '3. Manejo y almacenamiento de fotos',
          body: [
            'Tus fotos subidas y retratos generados siguen siendo tu contenido. Usamos las fotos subidas únicamente para prestar el servicio de generación que solicitas.',
          ],
          bullets: [
            'Las fotos de entrada pueden almacenarse de forma privada para procesamiento, soporte y prevención de abuso.',
            'Los retratos generados se almacenan para que puedas verlos y descargarlos.',
            'No vendemos tus fotos subidas ni tus retratos generados.',
            'No usamos tus fotos o retratos para entrenar nuestros propios modelos de IA.',
          ],
        },
        {
          title: '4. Proveedores externos',
          bullets: [
            'Supabase para autenticación, base de datos y almacenamiento.',
            'PayPal, Stripe u otros procesadores para pagos y reembolsos.',
            'Resend para correos transaccionales.',
            'Proveedores de hosting, analítica, registros y seguridad.',
          ],
        },
        {
          title: '5. Seguridad y derechos',
          body: [
            'Aplicamos medidas técnicas y organizativas razonables para proteger la información personal. Según tu ubicación, puedes tener derechos de acceso, corrección, eliminación, restricción u obtención de una copia de ciertos datos.',
          ],
        },
        {
          title: '6. Contacto',
          body: [`Para preguntas o solicitudes sobre privacidad, escríbenos a ${supportEmail}.`],
        },
      ],
    },
    refund: {
      title: 'Política de reembolso de Magic-Headshot',
      description:
        'Consulta la elegibilidad de reembolsos de Magic-Headshot, el manejo de créditos no usados, plazos de procesamiento y pasos de soporte.',
      keywords: ['reembolso Magic-Headshot', 'política reembolso IA', 'reembolso créditos no usados'],
      heading: 'Política de reembolso de Magic-Headshot',
      notice:
        'Esta traducción se ofrece para facilitar la lectura. Si existe alguna diferencia con la versión inglesa, prevalece la versión inglesa.',
      lastUpdated: '27 de junio de 2026',
      sections: [
        {
          title: 'Garantía de satisfacción de 30 días',
          body: [
            'Queremos que estés conforme con tus retratos. Puedes solicitar un reembolso dentro de los 30 días posteriores a la compra, sujeto a los requisitos de elegibilidad.',
          ],
        },
        {
          title: 'Cómo solicitar un reembolso',
          body: [`Para solicitar un reembolso, escríbenos a ${supportEmail} e incluye:`],
          ordered: [
            'El correo usado en tu cuenta de Magic-Headshot.',
            'Tu ID de pedido, transacción de PayPal, recibo de Stripe u otra referencia de pago.',
            'El plan comprado y la fecha de compra.',
            'Una breve descripción del problema.',
          ],
        },
        {
          title: 'Elegibilidad',
          bullets: [
            'La solicitud se realiza dentro de los 30 días posteriores a la compra.',
            'La compra no fue ya reembolsada, revertida o disputada.',
            'La solicitud proviene del titular de la cuenta o del pago.',
            'La cuenta no muestra abuso, fraude, uso automatizado excesivo ni violaciones de las condiciones.',
          ],
        },
        {
          title: 'Después del reembolso',
          body: [
            'Si se aprueba un reembolso, los créditos no utilizados de esa compra pueden eliminarse de tu cuenta. También podemos desactivar el acceso a resultados asociados al pago reembolsado cuando corresponda.',
          ],
        },
        {
          title: 'Tiempo de procesamiento',
          body: [
            'Los reembolsos aprobados se envían al método de pago original cuando sea posible. Normalmente tardan 5-10 días hábiles después de la aprobación, aunque tu banco o proveedor de pago puede necesitar más tiempo.',
          ],
        },
      ],
    },
  },
  fr: {
    terms: {
      title: 'Conditions Magic-Headshot pour portraits professionnels avec IA',
      description:
        'Consultez les conditions Magic-Headshot concernant la génération de portraits IA, les photos importées, les paiements, les remboursements, les droits commerciaux et les règles de compte.',
      keywords: ['conditions Magic-Headshot', 'conditions portraits IA', 'droits commerciaux'],
      heading: 'Conditions de service de Magic-Headshot',
      notice:
        'Cette traduction est fournie pour faciliter la lecture. En cas de différence avec la version anglaise, la version anglaise prévaut.',
      lastUpdated: '27 juin 2026',
      sections: [
        {
          title: '1. Acceptation des conditions',
          body: [
            'En accédant à Magic-Headshot ou en utilisant le service, vous acceptez ces conditions. Si vous n’êtes pas d’accord, n’utilisez pas le service.',
          ],
        },
        {
          title: '2. Description du service',
          body: [
            'Magic-Headshot fournit un service de génération de portraits professionnels par IA. Vous pouvez importer des selfies et recevoir des portraits professionnels dans différents styles.',
          ],
        },
        {
          title: '3. Comptes utilisateur',
          body: ['Pour utiliser le service, vous devez :'],
          bullets: [
            'Avoir au moins 18 ans.',
            'Fournir des informations exactes et complètes.',
            'Protéger la sécurité de votre compte.',
            'Nous informer de toute utilisation non autorisée.',
          ],
        },
        {
          title: '4. Utilisation acceptable',
          body: ['Vous acceptez de ne pas :'],
          bullets: [
            'Importer des photos d’autres personnes sans leur consentement.',
            'Utiliser le service à des fins illégales.',
            'Générer du contenu nuisible, offensant ou inapproprié.',
            'Tenter de compromettre nos systèmes IA.',
            'Revendre ou redistribuer le contenu généré.',
          ],
        },
        {
          title: '5. Propriété intellectuelle',
          body: [
            'Portraits générés : vous détenez les droits sur les portraits générés via le service et pouvez les utiliser à des fins personnelles et commerciales.',
            'Notre propriété intellectuelle : nous conservons la propriété de notre technologie, logos, marques et propriété intellectuelle préexistante.',
          ],
        },
        {
          title: '6. Paiements',
          bullets: [
            'Les prix sont affichés dans la devise sélectionnée ou par défaut pour votre langue.',
            'Les paiements sont traités de manière sécurisée via PayPal.',
            'Les paiements uniques ajoutent des crédits à votre compte.',
            'Les ventes sont soumises à notre politique de remboursement.',
          ],
        },
        {
          title: '7. Remboursements',
          body: [
            'Nous proposons une garantie de satisfaction de 30 jours. Si vous n’êtes pas satisfait de vos portraits, contactez-nous dans les 30 jours suivant l’achat.',
          ],
        },
        {
          title: '8. Contact',
          body: [`Pour toute question concernant ces conditions, contactez-nous à ${supportEmail}.`],
        },
      ],
    },
    privacy: {
      title: 'Politique de confidentialité Magic-Headshot pour portraits IA',
      description:
        'Découvrez comment Magic-Headshot collecte, utilise, stocke et protège les données de compte, photos importées, portraits générés, métadonnées de paiement et demandes de support.',
      keywords: ['confidentialité Magic-Headshot', 'confidentialité portraits IA', 'confidentialité photos importées'],
      heading: 'Politique de confidentialité de Magic-Headshot',
      notice:
        'Cette traduction est fournie pour faciliter la lecture. En cas de différence avec la version anglaise, la version anglaise prévaut.',
      lastUpdated: '27 juin 2026',
      sections: [
        {
          title: '1. Informations collectées',
          bullets: [
            'Informations de compte, comme le nom, l’adresse e-mail et les données d’authentification.',
            'Photos importées et portraits IA créés à partir de ces photos.',
            'Historique de génération, styles sélectionnés, utilisation des crédits et demandes de support.',
            'Statut de paiement, identifiants de commande et métadonnées de transaction. Nous ne stockons pas les numéros complets de carte.',
            'Données de base relatives à l’appareil, à l’utilisation, aux cookies et à l’analytique.',
          ],
        },
        {
          title: '2. Utilisation des informations',
          bullets: [
            'Créer et gérer votre compte.',
            'Générer des portraits IA à partir des photos et styles sélectionnés.',
            'Traiter les paiements, crédits, remboursements et confirmations d’achat.',
            'Envoyer des e-mails de service.',
            'Prévenir la fraude, les abus, les déductions en double et les accès non autorisés.',
            'Maintenir, sécuriser, diagnostiquer et améliorer le service.',
          ],
        },
        {
          title: '3. Gestion et stockage des photos',
          body: [
            'Vos photos importées et portraits générés restent votre contenu. Nous utilisons les photos importées uniquement pour fournir le service demandé.',
          ],
          bullets: [
            'Les photos d’entrée peuvent être stockées de manière privée pour le traitement, le support et la prévention des abus.',
            'Les portraits générés sont stockés afin que vous puissiez les consulter et les télécharger.',
            'Nous ne vendons pas vos photos importées ni vos portraits générés.',
            'Nous n’utilisons pas vos photos ou portraits pour entraîner nos propres modèles IA.',
          ],
        },
        {
          title: '4. Prestataires tiers',
          bullets: [
            'Supabase pour l’authentification, la base de données et le stockage.',
            'PayPal, Stripe ou d’autres processeurs pour les paiements et remboursements.',
            'Resend pour l’envoi d’e-mails transactionnels.',
            'Prestataires d’hébergement, d’analytique, de journalisation et de sécurité.',
          ],
        },
        {
          title: '5. Sécurité et droits',
          body: [
            'Nous appliquons des mesures techniques et organisationnelles raisonnables pour protéger les informations personnelles. Selon votre lieu de résidence, vous pouvez disposer de droits d’accès, de correction, de suppression, de limitation ou de portabilité.',
          ],
        },
        {
          title: '6. Contact',
          body: [`Pour toute question ou demande relative à la confidentialité, contactez-nous à ${supportEmail}.`],
        },
      ],
    },
    refund: {
      title: 'Politique de remboursement Magic-Headshot',
      description:
        'Consultez les conditions de remboursement Magic-Headshot, la gestion des crédits inutilisés, les délais de traitement et les étapes de support.',
      keywords: ['remboursement Magic-Headshot', 'politique remboursement IA', 'remboursement crédits inutilisés'],
      heading: 'Politique de remboursement de Magic-Headshot',
      notice:
        'Cette traduction est fournie pour faciliter la lecture. En cas de différence avec la version anglaise, la version anglaise prévaut.',
      lastUpdated: '27 juin 2026',
      sections: [
        {
          title: 'Garantie de satisfaction de 30 jours',
          body: [
            'Nous voulons que vous soyez satisfait de vos portraits. Vous pouvez demander un remboursement dans les 30 jours suivant l’achat, sous réserve des critères d’éligibilité.',
          ],
        },
        {
          title: 'Comment demander un remboursement',
          body: [`Pour demander un remboursement, écrivez-nous à ${supportEmail} avec :`],
          ordered: [
            'L’adresse e-mail utilisée pour votre compte Magic-Headshot.',
            'Votre identifiant de commande, transaction PayPal, reçu Stripe ou autre référence de paiement.',
            'Le plan acheté et la date d’achat.',
            'Une brève description du problème.',
          ],
        },
        {
          title: 'Éligibilité',
          bullets: [
            'La demande est faite dans les 30 jours suivant l’achat.',
            'L’achat n’a pas déjà été remboursé, contesté ou annulé.',
            'La demande provient du titulaire du compte ou du paiement.',
            'Le compte ne montre pas d’abus, fraude, usage automatisé excessif ou violation des conditions.',
          ],
        },
        {
          title: 'Après remboursement',
          body: [
            'Si un remboursement est approuvé, les crédits inutilisés liés à cet achat peuvent être retirés de votre compte. Nous pouvons aussi désactiver l’accès aux résultats associés au paiement remboursé lorsque cela est approprié.',
          ],
        },
        {
          title: 'Délai de traitement',
          body: [
            'Les remboursements approuvés sont envoyés au moyen de paiement initial lorsque cela est possible. Ils prennent généralement 5 à 10 jours ouvrés après approbation, mais votre banque ou prestataire de paiement peut nécessiter plus de temps.',
          ],
        },
      ],
    },
  },
  de: {
    terms: {
      title: 'Magic-Headshot Bedingungen fur KI-Headshots und professionelle Fotos',
      description:
        'Lies die Magic-Headshot Bedingungen zu KI-Headshot-Erstellung, hochgeladenen Fotos, Zahlungen, Erstattungen, kommerziellen Nutzungsrechten und Kontoregeln.',
      keywords: ['Magic-Headshot Bedingungen', 'KI Headshot Bedingungen', 'kommerzielle Nutzungsrechte'],
      heading: 'Magic-Headshot Nutzungsbedingungen',
      notice:
        'Diese Ubersetzung dient der besseren Lesbarkeit. Bei Abweichungen von der englischen Version gilt die englische Version.',
      lastUpdated: '27. Juni 2026',
      sections: [
        {
          title: '1. Annahme der Bedingungen',
          body: [
            'Durch den Zugriff auf Magic-Headshot oder die Nutzung des Dienstes akzeptierst du diese Nutzungsbedingungen. Wenn du nicht einverstanden bist, nutze den Dienst bitte nicht.',
          ],
        },
        {
          title: '2. Beschreibung des Dienstes',
          body: [
            'Magic-Headshot bietet KI-gestutzte professionelle Headshot-Erstellung. Du kannst Selfies hochladen und KI-generierte professionelle Headshots in verschiedenen Stilen erhalten.',
          ],
        },
        {
          title: '3. Nutzerkonten',
          body: ['Zur Nutzung des Dienstes musst du:'],
          bullets: [
            'Mindestens 18 Jahre alt sein.',
            'Richtige und vollstandige Angaben machen.',
            'Die Sicherheit deines Kontos wahren.',
            'Uns uber jede unbefugte Nutzung informieren.',
          ],
        },
        {
          title: '4. Zulassige Nutzung',
          body: ['Du verpflichtest dich, Folgendes nicht zu tun:'],
          bullets: [
            'Fotos anderer Personen ohne deren Zustimmung hochladen.',
            'Den Dienst fur illegale Zwecke nutzen.',
            'Schadliche, beleidigende oder unangemessene Inhalte erzeugen.',
            'Unsere KI-Systeme zu kompromittieren versuchen.',
            'Generierte Inhalte weiterverkaufen oder weiterverbreiten.',
          ],
        },
        {
          title: '5. Geistiges Eigentum',
          body: [
            'Generierte Headshots: Du besitzt die Rechte an den mit dem Dienst erstellten Headshots und kannst sie privat und kommerziell nutzen.',
            'Unser geistiges Eigentum: Wir behalten die Rechte an unserer Technologie, Logos, Marken und bestehendem geistigem Eigentum.',
          ],
        },
        {
          title: '6. Zahlungen',
          bullets: [
            'Preise werden in der ausgewahlten oder fur deine Sprache voreingestellten Wahrung angezeigt.',
            'Zahlungen werden sicher uber PayPal verarbeitet.',
            'Einmalzahlungen fugen deinem Konto Credits hinzu.',
            'Verkaufe unterliegen unserer Erstattungsrichtlinie.',
          ],
        },
        {
          title: '7. Erstattungen',
          body: [
            'Wir bieten eine 30-tagige Zufriedenheitsgarantie. Wenn du mit deinen Headshots nicht zufrieden bist, kontaktiere uns innerhalb von 30 Tagen nach dem Kauf.',
          ],
        },
        {
          title: '8. Kontakt',
          body: [`Bei Fragen zu diesen Bedingungen kontaktiere uns unter ${supportEmail}.`],
        },
      ],
    },
    privacy: {
      title: 'Magic-Headshot Datenschutzrichtlinie fur KI-Headshots',
      description:
        'Erfahre, wie Magic-Headshot Kontodaten, hochgeladene Fotos, generierte KI-Headshots, Zahlungsmetadaten und Supportanfragen erhebt, nutzt, speichert und schutzt.',
      keywords: ['Magic-Headshot Datenschutz', 'KI Headshot Datenschutz', 'Datenschutz hochgeladene Fotos'],
      heading: 'Magic-Headshot Datenschutzrichtlinie',
      notice:
        'Diese Ubersetzung dient der besseren Lesbarkeit. Bei Abweichungen von der englischen Version gilt die englische Version.',
      lastUpdated: '27. Juni 2026',
      sections: [
        {
          title: '1. Informationen, die wir erheben',
          bullets: [
            'Kontoinformationen wie Name, E-Mail-Adresse und Authentifizierungsdaten.',
            'Fotos, die du hochladst, und daraus erstellte KI-Headshots.',
            'Generierungsverlauf, ausgewahlte Stile, Credit-Nutzung und Supportanfragen.',
            'Zahlungsstatus, Bestell-IDs und Transaktionsmetadaten. Wir speichern keine vollstandigen Kartennummern.',
            'Grundlegende Gerate-, Nutzungs-, Cookie- und Analysedaten.',
          ],
        },
        {
          title: '2. Nutzung der Informationen',
          bullets: [
            'Dein Konto erstellen und verwalten.',
            'KI-Headshots aus den von dir ausgewahlten Fotos und Stilen erzeugen.',
            'Zahlungen, Credits, Erstattungen und Kaufbestatigungen verarbeiten.',
            'Service-E-Mails senden.',
            'Betrug, Missbrauch, doppelte Credit-Abzuge und unbefugten Zugriff verhindern.',
            'Den Dienst warten, sichern, beheben und verbessern.',
          ],
        },
        {
          title: '3. Umgang mit Fotos und Speicherung',
          body: [
            'Deine hochgeladenen Fotos und generierten Headshots bleiben deine Inhalte. Wir verwenden hochgeladene Fotos nur zur Bereitstellung des von dir angeforderten Dienstes.',
          ],
          bullets: [
            'Eingabefotos konnen privat fur Verarbeitung, Support und Missbrauchspravention gespeichert werden.',
            'Generierte Headshots werden gespeichert, damit du sie ansehen und herunterladen kannst.',
            'Wir verkaufen deine hochgeladenen Fotos oder generierten Headshots nicht.',
            'Wir verwenden deine Fotos oder Headshots nicht zum Training eigener KI-Modelle.',
          ],
        },
        {
          title: '4. Drittanbieter',
          bullets: [
            'Supabase fur Authentifizierung, Datenbank und Dateispeicherung.',
            'PayPal, Stripe oder andere Zahlungsdienstleister fur Zahlungen und Erstattungen.',
            'Resend fur transaktionale E-Mails.',
            'Hosting-, Analyse-, Logging- und Sicherheitsanbieter.',
          ],
        },
        {
          title: '5. Sicherheit und Rechte',
          body: [
            'Wir verwenden angemessene technische und organisatorische Schutzmassnahmen. Je nach Standort kannst du Rechte auf Auskunft, Berichtigung, Loschung, Einschrankung oder Datenubertragbarkeit haben.',
          ],
        },
        {
          title: '6. Kontakt',
          body: [`Bei Fragen oder Anfragen zum Datenschutz kontaktiere uns unter ${supportEmail}.`],
        },
      ],
    },
    refund: {
      title: 'Magic-Headshot Erstattungsrichtlinie',
      description:
        'Lies die Erstattungsbedingungen von Magic-Headshot, den Umgang mit ungenutzten Credits, Bearbeitungszeiten und Supportschritte.',
      keywords: ['Magic-Headshot Erstattung', 'KI Headshot Erstattungsrichtlinie', 'ungenutzte Credits Erstattung'],
      heading: 'Magic-Headshot Erstattungsrichtlinie',
      notice:
        'Diese Ubersetzung dient der besseren Lesbarkeit. Bei Abweichungen von der englischen Version gilt die englische Version.',
      lastUpdated: '27. Juni 2026',
      sections: [
        {
          title: '30-tagige Zufriedenheitsgarantie',
          body: [
            'Wir mochten, dass du mit deinen KI-Headshots zufrieden bist. Du kannst innerhalb von 30 Tagen nach dem Kauf eine Erstattung beantragen, vorbehaltlich der Berechtigungskriterien.',
          ],
        },
        {
          title: 'So beantragst du eine Erstattung',
          body: [`Sende uns fur eine Erstattung eine E-Mail an ${supportEmail} mit:`],
          ordered: [
            'Der E-Mail-Adresse deines Magic-Headshot Kontos.',
            'Deiner Bestell-ID, PayPal-Transaktions-ID, Stripe-Quittung oder sonstigen Zahlungsreferenz.',
            'Dem gekauften Plan und Kaufdatum.',
            'Einer kurzen Beschreibung des Problems.',
          ],
        },
        {
          title: 'Berechtigung',
          bullets: [
            'Die Anfrage erfolgt innerhalb von 30 Tagen nach dem Kauf.',
            'Der Kauf wurde nicht bereits erstattet, angefochten oder zuruckgebucht.',
            'Die Anfrage stammt vom Konto- oder Zahlungsinhaber.',
            'Das Konto zeigt keinen Missbrauch, Betrug, ubermassige automatisierte Nutzung oder Verstosse.',
          ],
        },
        {
          title: 'Nach der Erstattung',
          body: [
            'Wenn eine Erstattung genehmigt wird, konnen ungenutzte Credits aus diesem Kauf entfernt werden. Wir konnen gegebenenfalls auch den Zugriff auf Ergebnisse deaktivieren, die mit der erstatteten Zahlung verbunden sind.',
          ],
        },
        {
          title: 'Bearbeitungszeit',
          body: [
            'Genehmigte Erstattungen werden nach Moglichkeit an die ursprungliche Zahlungsmethode gesendet. Sie dauern normalerweise 5-10 Werktage nach Genehmigung, wobei Bank oder Zahlungsanbieter mehr Zeit benotigen konnen.',
          ],
        },
      ],
    },
  },
  ja: {
    terms: {
      title: 'Magic-Headshot AIヘッドショット利用規約',
      description:
        'AIヘッドショット生成、アップロード写真、支払い、返金、商用利用権、アカウント規則に関するMagic-Headshotの利用規約です。',
      keywords: ['Magic-Headshot 利用規約', 'AIヘッドショット 規約', '商用利用権'],
      heading: 'Magic-Headshot 利用規約',
      notice:
        'この翻訳は読みやすさのために提供されています。英語版との差異がある場合は、英語版が優先されます。',
      lastUpdated: '2026年6月27日',
      sections: [
        {
          title: '1. 規約への同意',
          body: [
            'Magic-Headshotにアクセスまたは利用することで、本利用規約に同意したものとみなされます。同意しない場合はサービスを利用しないでください。',
          ],
        },
        {
          title: '2. サービス内容',
          body: [
            'Magic-HeadshotはAIによるプロ向けヘッドショット生成サービスです。ユーザーはセルフィーをアップロードし、複数のスタイルでAI生成のプロフィール写真を受け取ることができます。',
          ],
        },
        {
          title: '3. ユーザーアカウント',
          body: ['サービスを利用するには、以下を満たす必要があります。'],
          bullets: [
            '18歳以上であること。',
            '正確かつ完全な情報を提供すること。',
            'アカウントの安全を維持すること。',
            '不正利用に気付いた場合は当社へ通知すること。',
          ],
        },
        {
          title: '4. 許可される利用',
          body: ['以下の行為を行わないことに同意します。'],
          bullets: [
            '本人の同意なく他者の写真をアップロードすること。',
            '違法な目的でサービスを利用すること。',
            '有害、攻撃的、または不適切なコンテンツを生成すること。',
            '当社のAIシステムを侵害しようとすること。',
            '生成コンテンツを再販売または再配布すること。',
          ],
        },
        {
          title: '5. 知的財産',
          body: [
            '生成されたヘッドショット：サービスで作成したAI生成画像の権利はユーザーに帰属し、個人利用および商用利用が可能です。',
            '当社の知的財産：当社はAI技術、ロゴ、商標、および既存の知的財産を保持します。',
          ],
        },
        {
          title: '6. 支払い',
          bullets: [
            '価格は選択された通貨または言語ごとの既定通貨で表示されます。',
            '支払いはPayPalを通じて安全に処理されます。',
            '一回限りの支払いによりアカウントにクレジットが追加されます。',
            '販売は返金ポリシーの対象となります。',
          ],
        },
        {
          title: '7. 返金',
          body: [
            '30日間の満足保証を提供しています。結果に満足できない場合は、購入日から30日以内にお問い合わせください。',
          ],
        },
        {
          title: '8. お問い合わせ',
          body: [`本規約に関する質問は ${supportEmail} までご連絡ください。`],
        },
      ],
    },
    privacy: {
      title: 'Magic-Headshot AIヘッドショット プライバシーポリシー',
      description:
        'Magic-Headshotがアカウントデータ、アップロード写真、生成画像、支払いメタデータ、サポート記録をどのように収集、使用、保存、保護するかを説明します。',
      keywords: ['Magic-Headshot プライバシー', 'AIヘッドショット プライバシー', 'アップロード写真 プライバシー'],
      heading: 'Magic-Headshot プライバシーポリシー',
      notice:
        'この翻訳は読みやすさのために提供されています。英語版との差異がある場合は、英語版が優先されます。',
      lastUpdated: '2026年6月27日',
      sections: [
        {
          title: '1. 収集する情報',
          bullets: [
            '氏名、メールアドレス、認証データなどのアカウント情報。',
            'アップロードされた写真、およびそれらから作成されたAI生成ヘッドショット。',
            '生成履歴、選択スタイル、クレジット利用状況、サポート依頼。',
            '支払い状況、注文ID、決済プロバイダーからの取引メタデータ。完全なカード番号は保存しません。',
            'サービス運営と改善のための基本的なデバイス、利用、Cookie、分析データ。',
          ],
        },
        {
          title: '2. 情報の利用目的',
          bullets: [
            'アカウントの作成と管理。',
            '選択された写真とスタイルからAIヘッドショットを生成すること。',
            '支払い、クレジット、返金、購入確認の処理。',
            '支払い確認や生成完了通知などのサービスメール送信。',
            '不正、悪用、重複クレジット消費、不正アクセスの防止。',
            'サービスの維持、保護、問題解決、改善。',
          ],
        },
        {
          title: '3. 写真の取り扱いと保存',
          body: [
            'アップロード写真と生成されたヘッドショットはユーザーのコンテンツです。当社は、ユーザーが依頼したAIヘッドショットサービスを提供するためにのみアップロード写真を使用します。',
          ],
          bullets: [
            '入力写真は処理、サポート、不正防止のため非公開で保存される場合があります。',
            '生成されたヘッドショットは閲覧とダウンロードのため保存されます。',
            'アップロード写真や生成画像を販売しません。',
            'アップロード写真や生成画像を当社独自のAIモデル訓練に使用しません。',
          ],
        },
        {
          title: '4. 外部サービス提供者',
          bullets: [
            '認証、データベース、ファイル保存のためのSupabase。',
            '支払いと返金のためのPayPal、Stripe、その他決済処理業者。',
            'トランザクションメール配信のためのResend。',
            'ホスティング、分析、ログ、セキュリティ提供者。',
          ],
        },
        {
          title: '5. セキュリティと権利',
          body: [
            '当社は個人情報を保護するため、合理的な技術的および組織的保護措置を講じます。所在地によっては、アクセス、訂正、削除、制限、データコピーの取得などの権利を有する場合があります。',
          ],
        },
        {
          title: '6. お問い合わせ',
          body: [`プライバシーに関する質問や依頼は ${supportEmail} までご連絡ください。`],
        },
      ],
    },
    refund: {
      title: 'Magic-Headshot 返金ポリシー',
      description:
        'Magic-Headshotの返金対象、未使用クレジットの取り扱い、処理時間、サポート手順について説明します。',
      keywords: ['Magic-Headshot 返金', 'AIヘッドショット 返金ポリシー', '未使用クレジット 返金'],
      heading: 'Magic-Headshot 返金ポリシー',
      notice:
        'この翻訳は読みやすさのために提供されています。英語版との差異がある場合は、英語版が優先されます。',
      lastUpdated: '2026年6月27日',
      sections: [
        {
          title: '30日間の満足保証',
          body: [
            'AIヘッドショットに満足していただくことを目指しています。購入日から30日以内であれば、対象条件に従って返金を申請できます。',
          ],
        },
        {
          title: '返金申請方法',
          body: [`返金を希望する場合は、${supportEmail} まで以下を添えてご連絡ください。`],
          ordered: [
            'Magic-Headshotアカウントで使用したメールアドレス。',
            '注文ID、PayPal取引ID、Stripe領収書、またはその他の支払い参照情報。',
            '購入したプランと購入日。',
            '問題の簡単な説明。',
          ],
        },
        {
          title: '返金対象',
          bullets: [
            '購入日から30日以内の申請であること。',
            '購入が既に返金、チャージバック、取消されていないこと。',
            'アカウント所有者または支払い所有者からの申請であること。',
            'アカウントに悪用、不正、過度な自動利用、規約違反がないこと。',
          ],
        },
        {
          title: '返金後の取り扱い',
          body: [
            '返金が承認された場合、その購入に関連する未使用クレジットはアカウントから削除される場合があります。また、該当する生成結果へのアクセスを無効化する場合があります。',
          ],
        },
        {
          title: '処理時間',
          body: [
            '承認された返金は、可能な場合は元の支払い方法へ送信されます。通常は承認後5〜10営業日で処理されますが、銀行や決済プロバイダーにより追加時間がかかる場合があります。',
          ],
        },
      ],
    },
  },
}
