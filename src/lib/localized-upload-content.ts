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
  guest: {
    badge: string
    title: string
    text: string
    register: string
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
    photo_tools: 'ID Photo And PNG',
    student_kids: 'Student & Kids',
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
  guest: {
    badge: 'Free trial',
    title: 'Try it free',
    text: 'Sign up for free and get {credits} free headshots. No credit card required.',
    register: 'Sign up for free headshots',
  },
  styleLimit: {
    title: 'Selection limit reached',
    text: 'You can only select up to {credits} styles with your current credits. Buy more credits to add more styles.',
    buy: 'Buy More Credits',
    close: 'Got it',
  },
  picker: {
    title: 'Select a look',
    intro: 'Each style is a look template: your face stays yours, while the outfit, background, and lighting change.',
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
    title: 'Choose a look',
    loading: '(loading...)',
    total: '({count} total)',
    description: 'Pick a look you want to try. Your face stays the same; only the outfit, background, and lighting change. Each selected style uses 1 credit.',
    select: 'Select a look',
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
  zh: {
    ...en,
    categories: { professional: '职业形象', photo_tools: '证件照和 PNG', student_kids: '学生和儿童' },
    errors: {
      faceSmall: '脸部看起来太小。请靠近一些拍摄，或先裁剪图片。',
      tooDark: '图片太暗。建议白天靠近窗户重新拍摄。',
      loadFailed: '图片加载失败',
      tooLarge: '图片太大，请使用 10MB 以下照片。',
    },
    credits: {
      ...en.credits,
      checkingTitle: '正在检查点数...',
      checkingLabel: '检查中...',
      readyTitle: '{credits} 个点数可用',
      readyLabel: '{credits} 张图片可生成',
      emptyTitle: '暂无可用点数',
      emptyLabel: '需要点数',
      noPackage: '暂无有效点数包',
      status: '状态',
      expires: '到期',
      dayLeft: '天剩余',
      daysLeft: '天剩余',
      description: '上传照片、选择风格，然后按选择扣除点数生成。',
    },
    noCredits: { title: '点数不足', text: '你当前没有可用点数。购买点数后即可生成职业形象照。', buy: '购买点数', later: '稍后再说' },
    guest: { badge: '免费试用', title: '免费体验', text: '免费注册即可获得 {credits} 张免费头像，无需绑定银行卡。', register: '注册领取免费头像' },
    styleLimit: { title: '已达到选择上限', text: '当前点数最多可选择 {credits} 个风格。购买更多点数后可以添加更多风格。', buy: '购买更多点数', close: '知道了' },
    picker: {
      title: '选择造型',
      intro: '每个造型是一套模板：你的脸保持不变，只更换服装、背景和光线。',
      creditHint: '每个选择的造型使用 1 个点数。你当前有 {credits} 个点数可用。',
      selected: '已选择 {count} 个',
      loading: '正在加载造型...',
      unavailable: '造型暂不可用，请刷新页面或重新登录。',
      uploadFirst: '请先上传一张照片。你可以先预览造型，上传后再选择。',
      styles: '个造型',
      deducted: '将扣除 {count} 个点数。',
      selectOne: '请至少选择 1 个造型继续。',
      done: '完成',
    },
    paymentSuccess: {
      ...en.paymentSuccess,
      label: '付款成功',
      titleWithCredits: '你已获得 {credits} 个点数',
      syncingTitle: '正在同步点数',
      textWithCredits: '{planName} 已生效：共 {totalCredits} 个点数，当前可用 {credits} 个。{timerMessage}',
      syncingText: '正在同步付款结果。点数会自动显示在这里，如果稍后仍未显示，请刷新页面。',
      credits: '获得点数',
      validity: '有效期',
      timerStatus: '计时状态',
      started: '已开始',
      notStarted: '未开始',
      start: '立即开始',
      close: '关闭',
      planNameFallback: '点数包',
      activeTimer: '这个点数包已生效，将于 {date} 到期。',
      inactiveTimer: '有效期 {days} 天，将从第一次生成后开始计算。',
      defaultTimer: '有效期从第一次生成后开始计算。',
    },
    upload: {
      ...en.upload,
      title: '上传照片',
      description: '上传同一个人的 1-3 张清晰自拍，有助于保持本人相似度。',
      note: '最适合职业头像和资料照片，其他用途效果可能不同。',
      loadingTitle: '正在检查点数',
      loadingText: '确认点数后即可上传照片。',
      dropTitle: '把自拍拖到这里',
      browse: '或点击选择文件',
      fileHint: '支持 JPG、PNG 或 WebP，最多 3 张，每张 10MB 以内。',
      unavailableTitle: '暂不能生成',
      unavailableText: '你的点数为空或已过期，请购买新的点数包后继续。',
      buy: '购买点数',
      tipTitle: '小建议',
      tipText: '每张照片使用同一个人，保持光线清楚、脸部完整可见。',
      tipWarning: '避免侧脸角度、墨镜、口罩或多人合照。',
      preview: '预览',
      photoCount: '{count}/3 张照片',
      emptyPreview: '上传的照片会显示在这里。',
      remove: '移除',
    },
    styles: {
      ...en.styles,
      title: '选择造型',
      loading: '（加载中...）',
      total: '（共 {count} 个）',
      description: '选择一个想尝试的造型。你的脸保持不变，只更换服装、背景和光线。每个造型使用 1 个点数。',
      select: '选择造型',
      uploadFirst: '请先上传照片后再选择风格。',
      failed: '风格加载失败，请刷新页面或重新登录。',
      selectedTitle: '已选风格',
      selectedHint: '可以在这里移除风格，或点击选择风格按钮重新调整。',
      selected: '已选择 {count} 个',
      none: '还没有选择风格。',
      selectedCount: '已选 {selected} / 可选 {available}',
      willDeduct: '将扣除 {count} 个点数',
      selectToContinue: '请至少选择 1 个风格继续',
      left: '当前点数还可选择 {count} 个风格。购买更多点数可添加更多风格。',
    },
    generate: {
      title: '生成',
      description: '确认照片和风格数量后开始生成。只会按你选择的风格扣除点数。',
      photos: '照片',
      styles: '已选风格',
      creditsAfter: '生成后剩余点数',
      buy: '购买点数',
      generate: '生成职业头像',
    },
  },
  es: {
    ...en,
    categories: { professional: 'Profesional', photo_tools: 'Foto ID y PNG', student_kids: 'Estudiante y Ninos' },
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
    picker: { title: 'Seleccionar estilos', intro: 'Cada estilo es una plantilla de aspecto: tu rostro se mantiene igual, solo cambian la ropa, el fondo y la luz.', creditHint: 'Cada estilo seleccionado usa 1 crédito. Tienes {credits} créditos disponibles.', selected: '{count} seleccionados', loading: 'Cargando estilos...', unavailable: 'Los estilos no están disponibles. Actualiza la página o inicia sesión de nuevo.', uploadFirst: 'Sube una foto primero. Puedes previsualizar estilos ahora y seleccionarlos después.', styles: 'estilos', deducted: 'Se descontarán {count} créditos.', selectOne: 'Selecciona al menos 1 estilo para continuar.', done: 'Listo' },
    paymentSuccess: { label: 'Pago correcto', titleWithCredits: 'Recibiste {credits} créditos', syncingTitle: 'Sincronizando tus créditos', textWithCredits: '{planName} está activo: {totalCredits} créditos en total, {credits} disponibles ahora. {timerMessage}', syncingText: 'Estamos sincronizando el resultado del pago. Los créditos aparecerán automáticamente. Si no aparecen pronto, actualiza esta página.', credits: 'Créditos recibidos', validity: 'Validez', timerStatus: 'Estado del contador', started: 'Iniciado', notStarted: 'No iniciado', start: 'Empezar ahora', close: 'Cerrar', planNameFallback: 'Plan de créditos', activeTimer: 'Este paquete está activo y caduca el {date}.', inactiveTimer: '{days} días de validez empiezan tras tu primera generación.', defaultTimer: 'La validez empieza tras tu primera generación.' },
    upload: { title: 'Sube tus fotos', description: 'Sube 1-3 selfies claras de la misma persona para mejorar el parecido.', note: 'Funciona mejor para fotos de perfil; otros usos pueden variar.', loadingTitle: 'Comprobando tus créditos', loadingText: 'El área de subida se desbloqueará cuando se confirmen tus créditos.', dropTitle: 'Arrastra tus selfies aquí', browse: 'o haz clic para buscar', fileHint: 'JPG, PNG o WebP. Hasta 3 fotos, 10MB cada una.', unavailableTitle: 'La generación no está disponible', unavailableText: 'Tus créditos están vacíos o caducados. Compra un nuevo paquete para continuar.', buy: 'Comprar créditos', tipTitle: 'Consejo', tipText: 'Usa la misma persona en todas las fotos, con buena luz y el rostro visible.', tipWarning: 'Evita ángulos laterales, gafas de sol, mascarillas o fotos de grupo.', preview: 'Vista previa', photoCount: '{count}/3 fotos', emptyPreview: 'Tus fotos subidas aparecerán aquí.', remove: 'Eliminar' },
    styles: { title: 'Elige estilos', loading: '(cargando...)', total: '({count} en total)', description: 'Elige el aspecto que quieres probar. Tu rostro se mantiene igual; solo cambian la ropa, el fondo y la luz. Cada estilo usa 1 crédito.', select: 'Seleccionar estilos', uploadFirst: 'Sube una foto primero para desbloquear la selección.', failed: 'No se pudieron cargar los estilos. Actualiza la página o inicia sesión de nuevo.', selectedTitle: 'Estilos seleccionados', selectedHint: 'Elimina estilos aquí o usa el botón Seleccionar estilos para cambiarlos.', selected: '{count} seleccionados', none: 'Aún no hay estilos seleccionados.', selectedCount: 'Seleccionados {selected} / {available} estilos', willDeduct: 'Se descontarán {count} créditos', selectToContinue: 'Selecciona al menos 1 estilo para continuar', left: 'Quedan {count} selecciones con tus créditos actuales. Compra más créditos para añadir más estilos.' },
    generate: { title: 'Generar', description: 'Revisa tus fotos y estilos seleccionados antes de generar. Solo se descuentan créditos por los estilos elegidos.', photos: 'Fotos', styles: 'Estilos seleccionados', creditsAfter: 'Créditos después de generar', buy: 'Comprar créditos', generate: 'Generar retratos' },
  },
  fr: {
    ...en,
    categories: { professional: 'Professionnel', photo_tools: 'Photo ID et PNG', student_kids: 'Etudiant et Enfants' },
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
    picker: { title: 'Choisir les styles', intro: 'Chaque style est un modèle de look : votre visage reste le même, seuls les vêtements, le fond et la lumière changent.', creditHint: 'Chaque style sélectionné utilise 1 crédit. Vous avez {credits} crédits disponibles.', selected: '{count} sélectionnés', loading: 'Chargement des styles...', unavailable: 'Les styles ne sont pas disponibles. Actualisez ou reconnectez-vous.', uploadFirst: 'Importez d’abord une photo. Vous pouvez prévisualiser les styles maintenant, puis sélectionner après l’import.', styles: 'styles', deducted: '{count} crédits seront déduits.', selectOne: 'Sélectionnez au moins 1 style pour continuer.', done: 'Terminé' },
    paymentSuccess: { label: 'Paiement réussi', titleWithCredits: 'Vous avez reçu {credits} crédits', syncingTitle: 'Synchronisation de vos crédits', textWithCredits: '{planName} est actif : {totalCredits} crédits au total, {credits} disponibles maintenant. {timerMessage}', syncingText: 'Nous synchronisons votre paiement. Les crédits apparaîtront automatiquement. Si ce n’est pas le cas, actualisez la page.', credits: 'Crédits reçus', validity: 'Validité', timerStatus: 'État du compteur', started: 'Démarré', notStarted: 'Non démarré', start: 'Commencer', close: 'Fermer', planNameFallback: 'Pack de crédits', activeTimer: 'Ce pack est actif et expire le {date}.', inactiveTimer: '{days} jours de validité commencent après votre première génération.', defaultTimer: 'La validité commence après votre première génération.' },
    upload: { title: 'Importer vos photos', description: 'Importez 1 à 3 selfies nets de la même personne pour un meilleur résultat.', note: 'Idéal pour les photos de profil ; les autres usages peuvent varier.', loadingTitle: 'Vérification de vos crédits', loadingText: 'La zone d’import sera disponible dès que vos crédits seront confirmés.', dropTitle: 'Glissez vos selfies ici', browse: 'ou cliquez pour parcourir', fileHint: 'JPG, PNG ou WebP. Jusqu’à 3 photos, 10MB chacune.', unavailableTitle: 'La génération est indisponible', unavailableText: 'Vos crédits sont vides ou expirés. Achetez un nouveau pack pour continuer.', buy: 'Acheter des crédits', tipTitle: 'Conseil', tipText: 'Utilisez la même personne sur chaque photo, avec une bonne lumière et le visage visible.', tipWarning: 'Évitez les profils, lunettes de soleil, masques ou photos de groupe.', preview: 'Aperçu', photoCount: '{count}/3 photos', emptyPreview: 'Vos photos importées apparaîtront ici.', remove: 'Retirer' },
    styles: { title: 'Choisir les styles', loading: '(chargement...)', total: '({count} au total)', description: 'Choisissez le look que vous voulez essayer. Votre visage reste le même ; seuls les vêtements, le fond et la lumière changent. Chaque style utilise 1 crédit.', select: 'Choisir les styles', uploadFirst: 'Importez une photo pour débloquer la sélection.', failed: 'Les styles n’ont pas pu être chargés. Actualisez ou reconnectez-vous.', selectedTitle: 'Styles sélectionnés', selectedHint: 'Retirez des styles ici ou utilisez le bouton Choisir les styles pour les modifier.', selected: '{count} sélectionnés', none: 'Aucun style sélectionné.', selectedCount: 'Sélectionnés {selected} / {available} styles', willDeduct: '{count} crédits seront déduits', selectToContinue: 'Sélectionnez au moins 1 style pour continuer', left: '{count} sélections restantes avec vos crédits actuels. Achetez plus de crédits pour ajouter des styles.' },
    generate: { title: 'Générer', description: 'Vérifiez vos photos et le nombre de styles avant de générer. Les crédits sont déduits uniquement pour les styles sélectionnés.', photos: 'Photos', styles: 'Styles sélectionnés', creditsAfter: 'Crédits après génération', buy: 'Acheter des crédits', generate: 'Générer les portraits' },
  },
  de: {
    ...en,
    categories: { professional: 'Professionell', photo_tools: 'Passfoto und PNG', student_kids: 'Studenten und Kinder' },
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
    picker: { title: 'Stile auswählen', intro: 'Jeder Stil ist eine Look-Vorlage: Dein Gesicht bleibt dasselbe, nur Kleidung, Hintergrund und Licht ändern sich.', creditHint: 'Jeder ausgewählte Stil nutzt 1 Credit. Du hast {credits} Credits verfügbar.', selected: '{count} ausgewählt', loading: 'Stile werden geladen...', unavailable: 'Stile sind noch nicht verfügbar. Aktualisiere die Seite oder melde dich erneut an.', uploadFirst: 'Lade zuerst ein Foto hoch. Du kannst die Stile jetzt ansehen und nach dem Upload auswählen.', styles: 'Stile', deducted: '{count} Credits werden abgezogen.', selectOne: 'Wähle mindestens 1 Stil aus, um fortzufahren.', done: 'Fertig' },
    paymentSuccess: { label: 'Zahlung erfolgreich', titleWithCredits: 'Du hast {credits} Credits erhalten', syncingTitle: 'Credits werden synchronisiert', textWithCredits: '{planName} ist aktiv: {totalCredits} Credits insgesamt, {credits} aktuell verfügbar. {timerMessage}', syncingText: 'Wir synchronisieren deine Zahlung. Credits erscheinen automatisch. Falls sie nicht bald erscheinen, lade die Seite neu.', credits: 'Erhaltene Credits', validity: 'Gültigkeit', timerStatus: 'Timer-Status', started: 'Gestartet', notStarted: 'Nicht gestartet', start: 'Jetzt starten', close: 'Schließen', planNameFallback: 'Credit-Paket', activeTimer: 'Dieses Paket ist aktiv und läuft am {date} ab.', inactiveTimer: '{days} Tage Gültigkeit starten nach deiner ersten Generierung.', defaultTimer: 'Die Gültigkeit startet nach deiner ersten Generierung.' },
    upload: { title: 'Fotos hochladen', description: 'Lade 1-3 klare Selfies derselben Person hoch, damit die Ähnlichkeit besser wird.', note: 'Am besten für Profilbilder geeignet; andere Nutzungen können variieren.', loadingTitle: 'Credits werden geprüft', loadingText: 'Der Upload-Bereich wird freigeschaltet, sobald deine Credits bestätigt sind.', dropTitle: 'Selfies hier ablegen', browse: 'oder zum Auswählen klicken', fileHint: 'JPG, PNG oder WebP. Bis zu 3 Fotos, je 10MB.', unavailableTitle: 'Generierung nicht verfügbar', unavailableText: 'Deine Credits sind leer oder abgelaufen. Kaufe ein neues Paket, um fortzufahren.', buy: 'Credits kaufen', tipTitle: 'Tipp', tipText: 'Nutze auf allen Fotos dieselbe Person mit klarem Licht und gut sichtbarem Gesicht.', tipWarning: 'Vermeide Seitenwinkel, Sonnenbrillen, Masken oder Gruppenfotos.', preview: 'Vorschau', photoCount: '{count}/3 Fotos', emptyPreview: 'Deine hochgeladenen Fotos erscheinen hier.', remove: 'Entfernen' },
    styles: { title: 'Stile auswählen', loading: '(lädt...)', total: '({count} gesamt)', description: 'Wähle einen Look zum Ausprobieren. Dein Gesicht bleibt dasselbe; nur Kleidung, Hintergrund und Licht ändern sich. Jeder Stil nutzt 1 Credit.', select: 'Stile auswählen', uploadFirst: 'Lade zuerst ein Foto hoch, um die Stilauswahl freizuschalten.', failed: 'Stile konnten nicht geladen werden. Aktualisiere die Seite oder melde dich erneut an.', selectedTitle: 'Ausgewählte Stile', selectedHint: 'Entferne Stile hier oder ändere sie über den Button Stile auswählen.', selected: '{count} ausgewählt', none: 'Noch keine Stile ausgewählt.', selectedCount: 'Ausgewählt {selected} / {available} Stile', willDeduct: '{count} Credits werden abgezogen', selectToContinue: 'Wähle mindestens 1 Stil aus, um fortzufahren', left: '{count} Auswahlen mit aktuellen Credits übrig. Kaufe mehr Credits, um weitere Stile hinzuzufügen.' },
    generate: { title: 'Generieren', description: 'Prüfe deine Fotos und die Anzahl der Stile, bevor du generierst. Credits werden nur für ausgewählte Stile abgezogen.', photos: 'Fotos', styles: 'Ausgewählte Stile', creditsAfter: 'Credits nach Generierung', buy: 'Credits kaufen', generate: 'Headshots generieren' },
  },
  ja: {
    ...en,
    categories: { professional: 'プロ向け', photo_tools: '証明写真とPNG', student_kids: '学生・子供' },
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
    picker: { title: 'スタイルを選択', intro: '各スタイルはルックのテンプレートです。あなたの顔はそのまま、服装・背景・照明だけが変わります。', creditHint: '選択したスタイルごとに1クレジットを使用します。現在 {credits} クレジット利用できます。', selected: '{count} 件選択中', loading: 'スタイルを読み込み中...', unavailable: 'スタイルを利用できません。ページを更新するか再ログインしてください。', uploadFirst: '先に写真をアップロードしてください。スタイルのプレビューは今でも確認できます。', styles: 'スタイル', deducted: '{count} クレジットが消費されます。', selectOne: '続行するには少なくとも1つのスタイルを選択してください。', done: '完了' },
    paymentSuccess: { label: '支払いが完了しました', titleWithCredits: '{credits} クレジットを受け取りました', syncingTitle: 'クレジットを同期中', textWithCredits: '{planName} が有効です。合計 {totalCredits} クレジット、現在 {credits} クレジット利用できます。{timerMessage}', syncingText: '支払い結果を同期しています。クレジットは自動で表示されます。しばらくしても表示されない場合はページを更新してください。', credits: '受け取ったクレジット', validity: '有効期間', timerStatus: 'タイマー状態', started: '開始済み', notStarted: '未開始', start: '今すぐ始める', close: '閉じる', planNameFallback: 'クレジットプラン', activeTimer: 'このパッケージは有効で、{date} に期限切れになります。', inactiveTimer: '初回生成後に {days} 日間の有効期間が始まります。', defaultTimer: '有効期間は初回生成後に始まります。' },
    upload: { title: '写真をアップロード', description: '似せやすくするため、同じ人物の鮮明なセルフィーを1〜3枚アップロードしてください。', note: 'プロフィール写真に最適です。その他の用途では結果が異なる場合があります。', loadingTitle: 'クレジットを確認中', loadingText: 'クレジットが確認されるとアップロードエリアが利用できます。', dropTitle: 'セルフィーをここにドラッグ', browse: 'またはクリックして選択', fileHint: 'JPG、PNG、WebP。最大3枚、各10MBまで。', unavailableTitle: '生成を利用できません', unavailableText: 'クレジットがないか期限切れです。続行するには新しいパッケージを購入してください。', buy: 'クレジットを購入', tipTitle: 'ヒント', tipText: 'すべての写真で同じ人物を使い、明るく顔がはっきり見える写真を選んでください。', tipWarning: '横向き、サングラス、マスク、集合写真は避けてください。', preview: 'プレビュー', photoCount: '{count}/3 枚', emptyPreview: 'アップロードした写真がここに表示されます。', remove: '削除' },
    styles: { title: 'スタイルを選択', loading: '(読み込み中...)', total: '(全 {count} 件)', description: '試したいルックを選んでください。あなたの顔はそのまま、服装・背景・照明だけが変わります。各スタイルは1クレジットを使用します。', select: 'スタイルを選択', uploadFirst: 'スタイル選択を有効にするには、先に写真をアップロードしてください。', failed: 'スタイルを読み込めませんでした。ページを更新するか再ログインしてください。', selectedTitle: '選択中のスタイル', selectedHint: 'ここで削除するか、スタイル選択ボタンから変更できます。', selected: '{count} 件選択中', none: 'まだスタイルが選択されていません。', selectedCount: '{selected} / {available} スタイル選択中', willDeduct: '{count} クレジットが消費されます', selectToContinue: '続行するには少なくとも1つ選択してください', left: '現在のクレジットであと {count} 件選択できます。さらに追加するにはクレジットを購入してください。' },
    generate: { title: '生成', description: '写真と選択したスタイル数を確認してから生成します。クレジットは選択したスタイル分だけ消費されます。', photos: '写真', styles: '選択したスタイル', creditsAfter: '生成後のクレジット', buy: 'クレジットを購入', generate: 'ヘッドショットを生成' },
  },
}

export function formatUploadText(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

Object.assign(localizedUploadContent, {
  es: {
    ...localizedUploadContent.es,
    credits: {
      ...localizedUploadContent.es.credits,
      readyTitle: 'Tus creditos estan listos',
      readyLabel: 'Puedes subir selfies, elegir estilos y generar retratos para perfil profesional, marca personal o redes.',
      emptyTitle: 'Aun no tienes creditos activos',
      emptyLabel: 'Compra un paquete cuando quieras generar nuevas versiones desde tus fotos.',
      description: 'Cada estilo seleccionado usa creditos al generar. Revisa las fotos antes de continuar para evitar resultados con poca luz o encuadres dificiles.',
    },
    picker: {
      ...localizedUploadContent.es.picker,
      title: 'Elige el tipo de retrato que quieres probar',
      intro: 'Selecciona estilos segun el uso real: LinkedIn, CV, perfil de empresa, redes personales o una foto para documento.',
      creditHint: 'Los creditos se descuentan cuando empiezas la generacion, no al explorar estilos.',
      uploadFirst: 'Sube primero una foto clara para ver que estilos encajan mejor.',
    },
    upload: {
      ...localizedUploadContent.es.upload,
      title: 'Sube selfies claras para crear tus retratos IA',
      description: 'Usa fotos recientes con buena luz frontal, rostro visible y una expresion natural. Cuanto mas limpia sea la foto base, mejor se conserva el parecido.',
      note: 'No hace falta una sesion de estudio; evita gafas oscuras, filtros fuertes, capturas borrosas y fondos que tapen el contorno de la cara.',
      tipTitle: 'Consejo antes de generar',
      tipText: 'Sube varias fotos con angulos parecidos y expresiones normales. Para usos profesionales, prioriza una imagen sobria; para perfiles creativos, prueba tambien estilos mas visuales.',
      tipWarning: 'Si la foto esta muy oscura, pixelada o con el rostro pequeno, el resultado puede perder naturalidad.',
    },
    styles: {
      ...localizedUploadContent.es.styles,
      title: 'Estilos disponibles',
      description: 'Combina retratos profesionales y herramientas de foto para documentos. Elige pocos estilos bien pensados si buscas resultados consistentes.',
      selectedHint: 'Revisa que los estilos elegidos coincidan con el uso final: trabajo, redes, web personal o proyecto creativo.',
      selectToContinue: 'Selecciona al menos un estilo para continuar.',
    },
    generate: {
      ...localizedUploadContent.es.generate,
      title: 'Generar retratos',
      description: 'Confirma tus fotos y estilos antes de empezar. La generacion crea variantes para que puedas comparar parecido, luz, fondo y presencia visual.',
    },
  },
  de: {
    ...localizedUploadContent.de,
    credits: {
      ...localizedUploadContent.de.credits,
      readyTitle: 'Deine Credits sind bereit',
      readyLabel: 'Du kannst Selfies hochladen, Styles waehlen und Portrats fuer Jobprofile, Personal Branding oder Social Media erstellen.',
      emptyTitle: 'Noch keine aktiven Credits',
      emptyLabel: 'Kaufe ein Paket, wenn du neue Varianten aus deinen Fotos erzeugen moechtest.',
      description: 'Credits werden beim Generieren verwendet. Pruefe deine Fotos vorher, damit schlechtes Licht oder unklare Ausschnitte die Ergebnisse nicht bremsen.',
    },
    picker: {
      ...localizedUploadContent.de.picker,
      title: 'Waehle den passenden Portratstil',
      intro: 'Entscheide nach echtem Einsatz: LinkedIn, Bewerbung, Firmenprofil, persoenliche Social-Profile oder ein Dokumentfoto.',
      creditHint: 'Credits werden erst beim Start der Generierung abgezogen, nicht beim Durchsehen der Styles.',
      uploadFirst: 'Lade zuerst ein klares Foto hoch, damit du passende Styles besser einschaetzen kannst.',
    },
    upload: {
      ...localizedUploadContent.de.upload,
      title: 'Klare Selfies fur KI-Portrats hochladen',
      description: 'Nutze aktuelle Fotos mit gutem Licht, sichtbarem Gesicht und natuerlichem Ausdruck. Je sauberer das Ausgangsbild, desto besser bleibt die Aehnlichkeit erhalten.',
      note: 'Ein Studiofoto ist nicht noetig. Vermeide Sonnenbrillen, starke Filter, unscharfe Screenshots und Hintergruende, die Gesicht oder Haare verdecken.',
      tipTitle: 'Vor dem Generieren',
      tipText: 'Lade mehrere Fotos mit aehnlichem Winkel und normalem Ausdruck hoch. Fuer berufliche Zwecke wirkt ein ruhiger Look besser; fuer kreative Profile kannst du auffaelligere Styles testen.',
      tipWarning: 'Wenn das Gesicht zu klein, dunkel oder verpixelt ist, kann das Ergebnis weniger natuerlich wirken.',
    },
    styles: {
      ...localizedUploadContent.de.styles,
      title: 'Verfuegbare Styles',
      description: 'Kombiniere Business-Looks und Fotowerkzeuge fuer Dokumente. Weniger, aber gezieltere Styles liefern meist klarere Ergebnisse.',
      selectedHint: 'Pruefe, ob die gewaehlten Styles zum Ziel passen: Jobprofil, Social Media, Website oder kreatives Projekt.',
      selectToContinue: 'Waehle mindestens einen Style, um fortzufahren.',
    },
    generate: {
      ...localizedUploadContent.de.generate,
      title: 'Portrats generieren',
      description: 'Bestaetige Fotos und Styles vor dem Start. Die Generierung erstellt Varianten, damit du Aehnlichkeit, Licht, Hintergrund und Wirkung vergleichen kannst.',
    },
  },
  ja: {
    ...localizedUploadContent.ja,
    credits: {
      ...localizedUploadContent.ja.credits,
      readyTitle: 'クレジットを利用できます',
      readyLabel: '自撮り写真をアップロードし、用途に合うスタイルを選んで、仕事用やSNS用のAIポートレートを作成できます。',
      emptyTitle: '有効なクレジットがありません',
      emptyLabel: '新しい写真を生成したいときに、必要なプランを購入してください。',
      description: 'クレジットは生成開始時に使用されます。暗い写真や顔が小さい写真は仕上がりに影響するため、先に確認してください。',
    },
    picker: {
      ...localizedUploadContent.ja.picker,
      title: '作りたいポートレートの方向を選ぶ',
      intro: 'LinkedIn、履歴書、会社プロフィール、証明写真など、実際の使い道に合わせて選べます。',
      creditHint: 'スタイルを見ているだけではクレジットは減りません。生成を開始すると使用されます。',
      uploadFirst: 'まず顔がはっきり見える写真をアップロードすると、合うスタイルを選びやすくなります。',
    },
    upload: {
      ...localizedUploadContent.ja.upload,
      title: 'AIポートレート用の写真をアップロード',
      description: '最近撮った写真、正面に近い明るい光、自然な表情、顔が見える構図を選んでください。元写真がきれいなほど、本人らしさが残りやすくなります。',
      note: 'スタジオ写真でなくても大丈夫です。濃いフィルター、サングラス、ぼけたスクリーンショット、顔の輪郭が隠れる背景は避けてください。',
      tipTitle: '生成前のポイント',
      tipText: '角度や表情が近い写真を複数枚用意すると安定します。仕事用なら落ち着いた印象、SNSや創作向けなら少し印象的なスタイルも試せます。',
      tipWarning: '顔が小さい、暗い、画質が荒い写真では、自然さや似ている感じが弱くなることがあります。',
    },
    styles: {
      ...localizedUploadContent.ja.styles,
      title: '選べるスタイル',
      description: 'ビジネス向けと証明写真ツールのスタイルを選べます。目的が明確なほど、比較しやすい結果になります。',
      selectedHint: '仕事用プロフィール、SNS、個人サイト、創作プロジェクトなど、公開先に合うスタイルか確認してください。',
      selectToContinue: '続行するには少なくとも1つのスタイルを選んでください。',
    },
    generate: {
      ...localizedUploadContent.ja.generate,
      title: 'ポートレートを生成',
      description: '開始前に写真とスタイルを確認してください。生成後は、似ている感じ、光、背景、全体の印象を比較できます。',
    },
  },
} satisfies Partial<Record<Exclude<Locale, 'en' | 'fr'>, UploadContent>>)
