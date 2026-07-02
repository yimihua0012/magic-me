import type { Locale } from '@/lib/i18n'

type UploadContent = {
  categories: Record<string, string>
  errors: {
    faceSmall: string
    tooDark: string
    loadFailed: string
    tooLarge: string
  }
  credits: {
    checkingTitle: string
    checkingLabel: string
    readyTitle: string
    readyLabel: string
    emptyTitle: string
    emptyLabel: string
    noPackage: string
    status: string
    expires: string
    dayLeft: string
    daysLeft: string
    description: string
  }
  noCredits: {
    title: string
    text: string
    buy: string
    later: string
  }
  styleLimit: {
    title: string
    text: string
    buy: string
    close: string
  }
  picker: {
    title: string
    intro: string
    creditHint: string
    selected: string
    loading: string
    unavailable: string
    uploadFirst: string
    styles: string
    deducted: string
    selectOne: string
    done: string
  }
  paymentSuccess: {
    label: string
    titleWithCredits: string
    syncingTitle: string
    textWithCredits: string
    syncingText: string
    credits: string
    validity: string
    timerStatus: string
    started: string
    notStarted: string
    start: string
    close: string
    planNameFallback: string
    activeTimer: string
    inactiveTimer: string
    defaultTimer: string
  }
  upload: {
    title: string
    description: string
    note: string
    loadingTitle: string
    loadingText: string
    dropTitle: string
    browse: string
    fileHint: string
    unavailableTitle: string
    unavailableText: string
    buy: string
    tipTitle: string
    tipText: string
    tipWarning: string
    preview: string
    photoCount: string
    emptyPreview: string
    remove: string
  }
  styles: {
    title: string
    loading: string
    total: string
    description: string
    select: string
    uploadFirst: string
    failed: string
    selectedTitle: string
    selectedHint: string
    selected: string
    none: string
    selectedCount: string
    willDeduct: string
    selectToContinue: string
    left: string
  }
  generate: {
    title: string
    description: string
    photos: string
    styles: string
    creditsAfter: string
    buy: string
    generate: string
  }
}

const en: UploadContent = {
  categories: {
    professional: 'Professional',
    photo_tools: 'ID Photo',
    lifestyle: 'Lifestyle',
    artistic: 'Creative',
    seasonal: 'Seasonal',
  },
  errors: {
    faceSmall: 'Face appears too small. Try moving closer or cropping the image.',
    tooDark: 'Image is too dark. Try taking your selfie near a window during daytime.',
    loadFailed: 'Failed to load image',
    tooLarge: 'Image is too large. Use a photo under 10MB.',
  },
  credits: {
    checkingTitle: 'Checking credits...',
    checkingLabel: 'Checking...',
    readyTitle: '{credits} credits ready',
    readyLabel: '{credits} images available',
    emptyTitle: 'No active credits',
    emptyLabel: 'Need credits',
    noPackage: 'No active package',
    status: 'Status',
    expires: 'Expires',
    dayLeft: 'day left',
    daysLeft: 'days left',
    description: 'Upload a photo, choose styles, then generate and deduct by selection.',
  },
  noCredits: {
    title: 'No credits remaining',
    text: "You don't have any active credits. Buy credits to generate your professional headshots.",
    buy: 'Buy Credits',
    later: 'Later',
  },
  styleLimit: {
    title: 'Selection limit reached',
    text: 'You can only select up to {credits} styles with your current credits. Buy more credits to add more styles.',
    buy: 'Buy More Credits',
    close: 'Got it',
  },
  picker: {
    title: 'Select styles',
    intro: 'Select at least 1 style you want to continue.',
    creditHint: 'Each selected style uses 1 credit. You have {credits} credits available.',
    selected: '{count} selected',
    loading: 'Loading styles...',
    unavailable: 'Styles are not available yet. Please refresh or log in again.',
    uploadFirst: 'Upload one photo first. You can preview the styles now, then select after upload.',
    styles: 'styles',
    deducted: '{count} credits will be deducted.',
    selectOne: 'Select at least 1 style to continue.',
    done: 'Done',
  },
  paymentSuccess: {
    label: 'Payment successful',
    titleWithCredits: 'You received {credits} credits',
    syncingTitle: 'Syncing your credits',
    textWithCredits: '{planName} is active: {totalCredits} credits total, {credits} currently available. {timerMessage}',
    syncingText: 'We are syncing your payment result. Credits will appear here automatically. If they do not appear soon, refresh this page.',
    credits: 'Credits received',
    validity: 'Validity',
    timerStatus: 'Timer status',
    started: 'Started',
    notStarted: 'Not started',
    start: 'Start now',
    close: 'Close',
    planNameFallback: 'Credit Plan',
    activeTimer: 'This package is active and expires on {date}.',
    inactiveTimer: '{days} days of validity starts after your first generation.',
    defaultTimer: 'Validity starts after your first generation.',
  },
  upload: {
    title: 'Upload your photos',
    description: 'Upload 1-3 clear selfies of the same person for better likeness.',
    note: 'Works best for profile pics, but other uses may vary.',
    loadingTitle: 'Checking your credits',
    loadingText: 'Your upload area will unlock as soon as your credits are confirmed.',
    dropTitle: 'Drag & drop your selfies here',
    browse: 'or click to browse',
    fileHint: 'JPG, PNG, or WebP. Up to 3 photos, 10MB each.',
    unavailableTitle: 'Generation is unavailable',
    unavailableText: 'Your credits are empty or expired. Please purchase a new package to continue.',
    buy: 'Buy Credits',
    tipTitle: 'Pro Tip',
    tipText: 'Use the same person in every photo with clear lighting and a fully visible face.',
    tipWarning: 'Avoid side angles, sunglasses, masks, or group photos.',
    preview: 'Preview',
    photoCount: '{count}/3 photos',
    emptyPreview: 'Your uploaded photos will appear here.',
    remove: 'Remove',
  },
  styles: {
    title: 'Choose styles',
    loading: '(loading...)',
    total: '({count} total)',
    description: 'Select at least 1 style you want to continue. Each selected style uses 1 credit.',
    select: 'Select styles',
    uploadFirst: 'Upload a photo first to unlock style selection.',
    failed: 'Styles failed to load. Please refresh or log in again.',
    selectedTitle: 'Selected styles',
    selectedHint: 'Remove styles here or use the Select styles button to change them.',
    selected: '{count} selected',
    none: 'No styles selected yet.',
    selectedCount: 'Selected {selected} / {available} styles',
    willDeduct: '{count} credits will be deducted',
    selectToContinue: 'Select at least 1 style to continue',
    left: '{count} selections left with current credits. Buy more credits to add more styles.',
  },
  generate: {
    title: 'Generate',
    description: 'Review your photos and style count, then generate. Credits are deducted only for the styles you selected.',
    photos: 'Photos',
    styles: 'Styles selected',
    creditsAfter: 'Credits after generate',
    buy: 'Buy Credits',
    generate: 'Generate Headshots',
  },
}

export const localizedUploadContent: Record<Locale, UploadContent> = {
  en,
  es: {
    ...en,
    categories: { professional: 'Profesional', photo_tools: 'Foto ID', lifestyle: 'Lifestyle', artistic: 'Creativo', seasonal: 'Temporada' },
    credits: {
      ...en.credits,
      checkingTitle: 'Comprobando créditos...',
      checkingLabel: 'Comprobando...',
      readyTitle: '{credits} créditos listos',
      readyLabel: '{credits} imágenes disponibles',
      emptyTitle: 'Sin créditos activos',
      emptyLabel: 'Necesitas créditos',
      noPackage: 'Sin paquete activo',
      status: 'Estado',
      expires: 'Caduca',
      dayLeft: 'día restante',
      daysLeft: 'días restantes',
      description: 'Sube una foto, elige estilos y genera usando créditos por selección.',
    },
    noCredits: { title: 'No quedan créditos', text: 'No tienes créditos activos. Compra créditos para generar retratos profesionales.', buy: 'Comprar créditos', later: 'Más tarde' },
    styleLimit: { title: 'Límite de selección alcanzado', text: 'Solo puedes elegir hasta {credits} estilos con tus créditos actuales. Compra más créditos para añadir más estilos.', buy: 'Comprar más créditos', close: 'Entendido' },
    picker: { title: 'Seleccionar estilos', intro: 'Elige al menos 1 estilo para continuar.', creditHint: 'Cada estilo seleccionado usa 1 crédito. Tienes {credits} créditos disponibles.', selected: '{count} seleccionados', loading: 'Cargando estilos...', unavailable: 'Los estilos no están disponibles. Actualiza la página o inicia sesión de nuevo.', uploadFirst: 'Sube una foto primero. Puedes previsualizar estilos ahora y seleccionarlos después.', styles: 'estilos', deducted: 'Se descontarán {count} créditos.', selectOne: 'Selecciona al menos 1 estilo para continuar.', done: 'Listo' },
    paymentSuccess: { label: 'Pago correcto', titleWithCredits: 'Recibiste {credits} créditos', syncingTitle: 'Sincronizando tus créditos', textWithCredits: '{planName} está activo: {totalCredits} créditos en total, {credits} disponibles ahora. {timerMessage}', syncingText: 'Estamos sincronizando el resultado del pago. Los créditos aparecerán automáticamente. Si no aparecen pronto, actualiza esta página.', credits: 'Créditos recibidos', validity: 'Validez', timerStatus: 'Estado del contador', started: 'Iniciado', notStarted: 'No iniciado', start: 'Empezar ahora', close: 'Cerrar', planNameFallback: 'Plan de créditos', activeTimer: 'Este paquete está activo y caduca el {date}.', inactiveTimer: '{days} días de validez empiezan tras tu primera generación.', defaultTimer: 'La validez empieza tras tu primera generación.' },
    upload: { title: 'Sube tus fotos', description: 'Sube 1-3 selfies claras de la misma persona para mejorar el parecido.', note: 'Funciona mejor para fotos de perfil; otros usos pueden variar.', loadingTitle: 'Comprobando tus créditos', loadingText: 'El área de subida se desbloqueará cuando se confirmen tus créditos.', dropTitle: 'Arrastra tus selfies aquí', browse: 'o haz clic para buscar', fileHint: 'JPG, PNG o WebP. Hasta 3 fotos, 10MB cada una.', unavailableTitle: 'La generación no está disponible', unavailableText: 'Tus créditos están vacíos o caducados. Compra un nuevo paquete para continuar.', buy: 'Comprar créditos', tipTitle: 'Consejo', tipText: 'Usa la misma persona en todas las fotos, con buena luz y el rostro visible.', tipWarning: 'Evita ángulos laterales, gafas de sol, mascarillas o fotos de grupo.', preview: 'Vista previa', photoCount: '{count}/3 fotos', emptyPreview: 'Tus fotos subidas aparecerán aquí.', remove: 'Eliminar' },
    styles: { title: 'Elige estilos', loading: '(cargando...)', total: '({count} en total)', description: 'Elige al menos 1 estilo para continuar. Cada estilo seleccionado usa 1 crédito.', select: 'Seleccionar estilos', uploadFirst: 'Sube una foto primero para desbloquear la selección.', failed: 'No se pudieron cargar los estilos. Actualiza la página o inicia sesión de nuevo.', selectedTitle: 'Estilos seleccionados', selectedHint: 'Elimina estilos aquí o usa el botón Seleccionar estilos para cambiarlos.', selected: '{count} seleccionados', none: 'Aún no hay estilos seleccionados.', selectedCount: 'Seleccionados {selected} / {available} estilos', willDeduct: 'Se descontarán {count} créditos', selectToContinue: 'Selecciona al menos 1 estilo para continuar', left: 'Quedan {count} selecciones con tus créditos actuales. Compra más créditos para añadir más estilos.' },
    generate: { title: 'Generar', description: 'Revisa tus fotos y estilos seleccionados antes de generar. Solo se descuentan créditos por los estilos elegidos.', photos: 'Fotos', styles: 'Estilos seleccionados', creditsAfter: 'Créditos después de generar', buy: 'Comprar créditos', generate: 'Generar retratos' },
  },
  fr: {
    ...en,
    categories: { professional: 'Professionnel', photo_tools: 'Photo ID', lifestyle: 'Lifestyle', artistic: 'Créatif', seasonal: 'Saisonnier' },
    credits: {
      ...en.credits,
      checkingTitle: 'Vérification des crédits...',
      checkingLabel: 'Vérification...',
      readyTitle: '{credits} crédits prêts',
      readyLabel: '{credits} images disponibles',
      emptyTitle: 'Aucun crédit actif',
      emptyLabel: 'Crédits requis',
      noPackage: 'Aucun pack actif',
      status: 'Statut',
      expires: 'Expire',
      dayLeft: 'jour restant',
      daysLeft: 'jours restants',
      description: 'Importez une photo, choisissez des styles, puis générez avec vos crédits.',
    },
    noCredits: { title: 'Aucun crédit restant', text: 'Vous n’avez aucun crédit actif. Achetez des crédits pour générer vos portraits.', buy: 'Acheter des crédits', later: 'Plus tard' },
    styleLimit: { title: 'Limite de sélection atteinte', text: 'Vous pouvez choisir jusqu’à {credits} styles avec vos crédits actuels. Achetez plus de crédits pour ajouter des styles.', buy: 'Acheter plus de crédits', close: 'Compris' },
    picker: { title: 'Choisir les styles', intro: 'Choisissez au moins 1 style pour continuer.', creditHint: 'Chaque style sélectionné utilise 1 crédit. Vous avez {credits} crédits disponibles.', selected: '{count} sélectionnés', loading: 'Chargement des styles...', unavailable: 'Les styles ne sont pas disponibles. Actualisez ou reconnectez-vous.', uploadFirst: 'Importez d’abord une photo. Vous pouvez prévisualiser les styles maintenant, puis sélectionner après l’import.', styles: 'styles', deducted: '{count} crédits seront déduits.', selectOne: 'Sélectionnez au moins 1 style pour continuer.', done: 'Terminé' },
    paymentSuccess: { label: 'Paiement réussi', titleWithCredits: 'Vous avez reçu {credits} crédits', syncingTitle: 'Synchronisation de vos crédits', textWithCredits: '{planName} est actif : {totalCredits} crédits au total, {credits} disponibles maintenant. {timerMessage}', syncingText: 'Nous synchronisons votre paiement. Les crédits apparaîtront automatiquement. Si ce n’est pas le cas, actualisez la page.', credits: 'Crédits reçus', validity: 'Validité', timerStatus: 'État du compteur', started: 'Démarré', notStarted: 'Non démarré', start: 'Commencer', close: 'Fermer', planNameFallback: 'Pack de crédits', activeTimer: 'Ce pack est actif et expire le {date}.', inactiveTimer: '{days} jours de validité commencent après votre première génération.', defaultTimer: 'La validité commence après votre première génération.' },
    upload: { title: 'Importer vos photos', description: 'Importez 1 à 3 selfies nets de la même personne pour un meilleur résultat.', note: 'Idéal pour les photos de profil ; les autres usages peuvent varier.', loadingTitle: 'Vérification de vos crédits', loadingText: 'La zone d’import sera disponible dès que vos crédits seront confirmés.', dropTitle: 'Glissez vos selfies ici', browse: 'ou cliquez pour parcourir', fileHint: 'JPG, PNG ou WebP. Jusqu’à 3 photos, 10MB chacune.', unavailableTitle: 'La génération est indisponible', unavailableText: 'Vos crédits sont vides ou expirés. Achetez un nouveau pack pour continuer.', buy: 'Acheter des crédits', tipTitle: 'Conseil', tipText: 'Utilisez la même personne sur chaque photo, avec une bonne lumière et le visage visible.', tipWarning: 'Évitez les profils, lunettes de soleil, masques ou photos de groupe.', preview: 'Aperçu', photoCount: '{count}/3 photos', emptyPreview: 'Vos photos importées apparaîtront ici.', remove: 'Retirer' },
    styles: { title: 'Choisir les styles', loading: '(chargement...)', total: '({count} au total)', description: 'Choisissez au moins 1 style pour continuer. Chaque style sélectionné utilise 1 crédit.', select: 'Choisir les styles', uploadFirst: 'Importez une photo pour débloquer la sélection.', failed: 'Les styles n’ont pas pu être chargés. Actualisez ou reconnectez-vous.', selectedTitle: 'Styles sélectionnés', selectedHint: 'Retirez des styles ici ou utilisez le bouton Choisir les styles pour les modifier.', selected: '{count} sélectionnés', none: 'Aucun style sélectionné.', selectedCount: 'Sélectionnés {selected} / {available} styles', willDeduct: '{count} crédits seront déduits', selectToContinue: 'Sélectionnez au moins 1 style pour continuer', left: '{count} sélections restantes avec vos crédits actuels. Achetez plus de crédits pour ajouter des styles.' },
    generate: { title: 'Générer', description: 'Vérifiez vos photos et le nombre de styles avant de générer. Les crédits sont déduits uniquement pour les styles sélectionnés.', photos: 'Photos', styles: 'Styles sélectionnés', creditsAfter: 'Crédits après génération', buy: 'Acheter des crédits', generate: 'Générer les portraits' },
  },
  de: {
    ...en,
    categories: { professional: 'Professionell', photo_tools: 'Passfoto', lifestyle: 'Lifestyle', artistic: 'Kreativ', seasonal: 'Saisonal' },
    credits: {
      ...en.credits,
      checkingTitle: 'Credits werden geprüft...',
      checkingLabel: 'Wird geprüft...',
      readyTitle: '{credits} Credits bereit',
      readyLabel: '{credits} Bilder verfügbar',
      emptyTitle: 'Keine aktiven Credits',
      emptyLabel: 'Credits benötigt',
      noPackage: 'Kein aktives Paket',
      status: 'Status',
      expires: 'Läuft ab',
      dayLeft: 'Tag verbleibend',
      daysLeft: 'Tage verbleibend',
      description: 'Lade ein Foto hoch, wähle Stile und generiere mit deinen Credits.',
    },
    noCredits: { title: 'Keine Credits übrig', text: 'Du hast keine aktiven Credits. Kaufe Credits, um Headshots zu erstellen.', buy: 'Credits kaufen', later: 'Später' },
    styleLimit: { title: 'Auswahllimit erreicht', text: 'Du kannst mit deinen aktuellen Credits bis zu {credits} Stile auswählen. Kaufe mehr Credits, um weitere Stile hinzuzufügen.', buy: 'Mehr Credits kaufen', close: 'Verstanden' },
    picker: { title: 'Stile auswählen', intro: 'Wähle mindestens 1 Stil aus, um fortzufahren.', creditHint: 'Jeder ausgewählte Stil nutzt 1 Credit. Du hast {credits} Credits verfügbar.', selected: '{count} ausgewählt', loading: 'Stile werden geladen...', unavailable: 'Stile sind noch nicht verfügbar. Aktualisiere die Seite oder melde dich erneut an.', uploadFirst: 'Lade zuerst ein Foto hoch. Du kannst die Stile jetzt ansehen und nach dem Upload auswählen.', styles: 'Stile', deducted: '{count} Credits werden abgezogen.', selectOne: 'Wähle mindestens 1 Stil aus, um fortzufahren.', done: 'Fertig' },
    paymentSuccess: { label: 'Zahlung erfolgreich', titleWithCredits: 'Du hast {credits} Credits erhalten', syncingTitle: 'Credits werden synchronisiert', textWithCredits: '{planName} ist aktiv: {totalCredits} Credits insgesamt, {credits} aktuell verfügbar. {timerMessage}', syncingText: 'Wir synchronisieren deine Zahlung. Credits erscheinen automatisch. Falls sie nicht bald erscheinen, lade die Seite neu.', credits: 'Erhaltene Credits', validity: 'Gültigkeit', timerStatus: 'Timer-Status', started: 'Gestartet', notStarted: 'Nicht gestartet', start: 'Jetzt starten', close: 'Schließen', planNameFallback: 'Credit-Paket', activeTimer: 'Dieses Paket ist aktiv und läuft am {date} ab.', inactiveTimer: '{days} Tage Gültigkeit starten nach deiner ersten Generierung.', defaultTimer: 'Die Gültigkeit startet nach deiner ersten Generierung.' },
    upload: { title: 'Fotos hochladen', description: 'Lade 1-3 klare Selfies derselben Person hoch, damit die Ähnlichkeit besser wird.', note: 'Am besten für Profilbilder geeignet; andere Nutzungen können variieren.', loadingTitle: 'Credits werden geprüft', loadingText: 'Der Upload-Bereich wird freigeschaltet, sobald deine Credits bestätigt sind.', dropTitle: 'Selfies hier ablegen', browse: 'oder zum Auswählen klicken', fileHint: 'JPG, PNG oder WebP. Bis zu 3 Fotos, je 10MB.', unavailableTitle: 'Generierung nicht verfügbar', unavailableText: 'Deine Credits sind leer oder abgelaufen. Kaufe ein neues Paket, um fortzufahren.', buy: 'Credits kaufen', tipTitle: 'Tipp', tipText: 'Nutze auf allen Fotos dieselbe Person mit klarem Licht und gut sichtbarem Gesicht.', tipWarning: 'Vermeide Seitenwinkel, Sonnenbrillen, Masken oder Gruppenfotos.', preview: 'Vorschau', photoCount: '{count}/3 Fotos', emptyPreview: 'Deine hochgeladenen Fotos erscheinen hier.', remove: 'Entfernen' },
    styles: { title: 'Stile auswählen', loading: '(lädt...)', total: '({count} gesamt)', description: 'Wähle mindestens 1 Stil aus, um fortzufahren. Jeder ausgewählte Stil nutzt 1 Credit.', select: 'Stile auswählen', uploadFirst: 'Lade zuerst ein Foto hoch, um die Stilauswahl freizuschalten.', failed: 'Stile konnten nicht geladen werden. Aktualisiere die Seite oder melde dich erneut an.', selectedTitle: 'Ausgewählte Stile', selectedHint: 'Entferne Stile hier oder ändere sie über den Button Stile auswählen.', selected: '{count} ausgewählt', none: 'Noch keine Stile ausgewählt.', selectedCount: 'Ausgewählt {selected} / {available} Stile', willDeduct: '{count} Credits werden abgezogen', selectToContinue: 'Wähle mindestens 1 Stil aus, um fortzufahren', left: '{count} Auswahlen mit aktuellen Credits übrig. Kaufe mehr Credits, um weitere Stile hinzuzufügen.' },
    generate: { title: 'Generieren', description: 'Prüfe deine Fotos und die Anzahl der Stile, bevor du generierst. Credits werden nur für ausgewählte Stile abgezogen.', photos: 'Fotos', styles: 'Ausgewählte Stile', creditsAfter: 'Credits nach Generierung', buy: 'Credits kaufen', generate: 'Headshots generieren' },
  },
  ja: {
    ...en,
    categories: { professional: 'プロ向け', photo_tools: '証明写真', lifestyle: 'ライフスタイル', artistic: 'クリエイティブ', seasonal: '季節' },
    credits: {
      ...en.credits,
      checkingTitle: 'クレジットを確認中...',
      checkingLabel: '確認中...',
      readyTitle: '{credits} クレジット利用可能',
      readyLabel: '{credits} 枚分利用可能',
      emptyTitle: '有効なクレジットがありません',
      emptyLabel: 'クレジットが必要です',
      noPackage: '有効なパッケージなし',
      status: '状態',
      expires: '有効期限',
      dayLeft: '日',
      daysLeft: '日',
      description: '写真をアップロードし、スタイルを選んで生成します。選択分だけクレジットを消費します。',
    },
    noCredits: { title: 'クレジットがありません', text: '有効なクレジットがありません。ヘッドショットを作成するにはクレジットを購入してください。', buy: 'クレジットを購入', later: 'あとで' },
    styleLimit: { title: '選択上限に達しました', text: '現在のクレジットでは最大 {credits} スタイルまで選択できます。さらに追加するにはクレジットを購入してください。', buy: 'クレジットを追加購入', close: '了解' },
    picker: { title: 'スタイルを選択', intro: '続行するには少なくとも1つのスタイルを選択してください。', creditHint: '選択したスタイルごとに1クレジットを使用します。現在 {credits} クレジット利用できます。', selected: '{count} 件選択中', loading: 'スタイルを読み込み中...', unavailable: 'スタイルを利用できません。ページを更新するか再ログインしてください。', uploadFirst: '先に写真をアップロードしてください。スタイルのプレビューは今でも確認できます。', styles: 'スタイル', deducted: '{count} クレジットが消費されます。', selectOne: '続行するには少なくとも1つのスタイルを選択してください。', done: '完了' },
    paymentSuccess: { label: '支払いが完了しました', titleWithCredits: '{credits} クレジットを受け取りました', syncingTitle: 'クレジットを同期中', textWithCredits: '{planName} が有効です。合計 {totalCredits} クレジット、現在 {credits} クレジット利用できます。{timerMessage}', syncingText: '支払い結果を同期しています。クレジットは自動で表示されます。しばらくしても表示されない場合はページを更新してください。', credits: '受け取ったクレジット', validity: '有効期間', timerStatus: 'タイマー状態', started: '開始済み', notStarted: '未開始', start: '今すぐ始める', close: '閉じる', planNameFallback: 'クレジットプラン', activeTimer: 'このパッケージは有効で、{date} に期限切れになります。', inactiveTimer: '初回生成後に {days} 日間の有効期間が始まります。', defaultTimer: '有効期間は初回生成後に始まります。' },
    upload: { title: '写真をアップロード', description: '似せやすくするため、同じ人物の鮮明なセルフィーを1〜3枚アップロードしてください。', note: 'プロフィール写真に最適です。その他の用途では結果が異なる場合があります。', loadingTitle: 'クレジットを確認中', loadingText: 'クレジットが確認されるとアップロードエリアが利用できます。', dropTitle: 'セルフィーをここにドラッグ', browse: 'またはクリックして選択', fileHint: 'JPG、PNG、WebP。最大3枚、各10MBまで。', unavailableTitle: '生成を利用できません', unavailableText: 'クレジットがないか期限切れです。続行するには新しいパッケージを購入してください。', buy: 'クレジットを購入', tipTitle: 'ヒント', tipText: 'すべての写真で同じ人物を使い、明るく顔がはっきり見える写真を選んでください。', tipWarning: '横向き、サングラス、マスク、集合写真は避けてください。', preview: 'プレビュー', photoCount: '{count}/3 枚', emptyPreview: 'アップロードした写真がここに表示されます。', remove: '削除' },
    styles: { title: 'スタイルを選択', loading: '(読み込み中...)', total: '(全 {count} 件)', description: '続行するには少なくとも1つのスタイルを選択してください。各スタイルは1クレジットを使用します。', select: 'スタイルを選択', uploadFirst: 'スタイル選択を有効にするには、先に写真をアップロードしてください。', failed: 'スタイルを読み込めませんでした。ページを更新するか再ログインしてください。', selectedTitle: '選択中のスタイル', selectedHint: 'ここで削除するか、スタイル選択ボタンから変更できます。', selected: '{count} 件選択中', none: 'まだスタイルが選択されていません。', selectedCount: '{selected} / {available} スタイル選択中', willDeduct: '{count} クレジットが消費されます', selectToContinue: '続行するには少なくとも1つ選択してください', left: '現在のクレジットであと {count} 件選択できます。さらに追加するにはクレジットを購入してください。' },
    generate: { title: '生成', description: '写真と選択したスタイル数を確認してから生成します。クレジットは選択したスタイル分だけ消費されます。', photos: '写真', styles: '選択したスタイル', creditsAfter: '生成後のクレジット', buy: 'クレジットを購入', generate: 'ヘッドショットを生成' },
  },
}

export function formatUploadText(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}
