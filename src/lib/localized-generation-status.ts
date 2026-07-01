import type { Locale } from '@/lib/i18n'

type StatusKey =
  | 'initializing'
  | 'invalidId'
  | 'noPhotos'
  | 'preparing'
  | 'failedStart'
  | 'taskNotFound'
  | 'failedCheck'
  | 'complete'
  | 'failed'
  | 'rendering'
  | 'finalizing'
  | 'polishing'
  | 'renderingSelected'
  | 'matching'
  | 'analyzing'
  | 'ready'

const localizedStatus: Record<Locale, Record<StatusKey, string>> = {
  en: {
    initializing: 'Initializing...',
    invalidId: 'Invalid generation ID',
    noPhotos: 'No photos uploaded',
    preparing: 'Preparing your reference photos...',
    failedStart: 'Failed to start generation',
    taskNotFound: 'Task not found, please restart',
    failedCheck: 'Failed to check task status',
    complete: 'Generation complete. Review your results.',
    failed: 'Generation failed. Please try again.',
    rendering: 'Rendering your portrait styles...',
    finalizing: 'Finalizing detail and preparing your results...',
    polishing: 'Polishing lighting, expression, and portrait detail...',
    renderingSelected: 'Rendering your selected portrait styles...',
    matching: 'Matching your reference photos to each style...',
    analyzing: 'Analyzing your reference photos...',
    ready: 'Your headshots are ready!',
  },
  es: {
    initializing: 'Inicializando...',
    invalidId: 'ID de generacion no valido',
    noPhotos: 'No se subieron fotos',
    preparing: 'Preparando tus fotos de referencia...',
    failedStart: 'No se pudo iniciar la generacion',
    taskNotFound: 'Tarea no encontrada, reinicia el proceso',
    failedCheck: 'No se pudo comprobar el estado',
    complete: 'Generacion completada. Revisa tus resultados.',
    failed: 'La generacion fallo. Intentalo de nuevo.',
    rendering: 'Renderizando tus estilos de retrato...',
    finalizing: 'Finalizando detalles y preparando resultados...',
    polishing: 'Mejorando luz, expresion y detalle del retrato...',
    renderingSelected: 'Renderizando los estilos seleccionados...',
    matching: 'Adaptando tus fotos de referencia a cada estilo...',
    analyzing: 'Analizando tus fotos de referencia...',
    ready: 'Tus retratos estan listos',
  },
  fr: {
    initializing: 'Initialisation...',
    invalidId: 'ID de generation invalide',
    noPhotos: 'Aucune photo importee',
    preparing: 'Preparation de vos photos de reference...',
    failedStart: 'Impossible de demarrer la generation',
    taskNotFound: 'Tache introuvable, veuillez recommencer',
    failedCheck: 'Impossible de verifier le statut',
    complete: 'Generation terminee. Consultez vos resultats.',
    failed: 'La generation a echoue. Veuillez reessayer.',
    rendering: 'Rendu de vos styles de portrait...',
    finalizing: 'Finalisation des details et preparation des resultats...',
    polishing: 'Amelioration de la lumiere, de l expression et des details...',
    renderingSelected: 'Rendu des styles selectionnes...',
    matching: 'Adaptation de vos photos de reference a chaque style...',
    analyzing: 'Analyse de vos photos de reference...',
    ready: 'Vos portraits sont prets',
  },
  de: {
    initializing: 'Initialisierung...',
    invalidId: 'Ungueltige Generierungs-ID',
    noPhotos: 'Keine Fotos hochgeladen',
    preparing: 'Referenzfotos werden vorbereitet...',
    failedStart: 'Generierung konnte nicht gestartet werden',
    taskNotFound: 'Aufgabe nicht gefunden, bitte neu starten',
    failedCheck: 'Status konnte nicht geprueft werden',
    complete: 'Generierung abgeschlossen. Pruefe deine Ergebnisse.',
    failed: 'Generierung fehlgeschlagen. Bitte erneut versuchen.',
    rendering: 'Deine Portraet-Stile werden gerendert...',
    finalizing: 'Details werden finalisiert und Ergebnisse vorbereitet...',
    polishing: 'Licht, Ausdruck und Details werden verfeinert...',
    renderingSelected: 'Ausgewaehlte Portraet-Stile werden gerendert...',
    matching: 'Referenzfotos werden jedem Stil zugeordnet...',
    analyzing: 'Referenzfotos werden analysiert...',
    ready: 'Deine Headshots sind bereit',
  },
  ja: {
    initializing: '初期化中...',
    invalidId: '生成IDが無効です',
    noPhotos: '写真がアップロードされていません',
    preparing: '参照写真を準備中...',
    failedStart: '生成を開始できませんでした',
    taskNotFound: 'タスクが見つかりません。最初からやり直してください',
    failedCheck: '生成状態を確認できませんでした',
    complete: '生成が完了しました。結果を確認してください。',
    failed: '生成に失敗しました。もう一度お試しください。',
    rendering: 'ポートレートスタイルを生成中...',
    finalizing: '細部を仕上げ、結果を準備中...',
    polishing: '光、表情、ポートレートの細部を調整中...',
    renderingSelected: '選択したスタイルを生成中...',
    matching: '参照写真を各スタイルに合わせています...',
    analyzing: '参照写真を解析中...',
    ready: 'ヘッドショットが完成しました',
  },
}

const sourceToKey: Array<[RegExp, StatusKey]> = [
  [/^Initializing/i, 'initializing'],
  [/Invalid generation ID/i, 'invalidId'],
  [/No photos uploaded/i, 'noPhotos'],
  [/Preparing your reference photos/i, 'preparing'],
  [/Failed to start generation/i, 'failedStart'],
  [/Task not found/i, 'taskNotFound'],
  [/Failed to check task status/i, 'failedCheck'],
  [/Generation complete/i, 'complete'],
  [/Generation failed/i, 'failed'],
  [/Rendering your portrait styles/i, 'rendering'],
  [/Finalizing detail/i, 'finalizing'],
  [/Polishing lighting/i, 'polishing'],
  [/Rendering your selected portrait styles/i, 'renderingSelected'],
  [/Matching your reference photos/i, 'matching'],
  [/Analyzing your reference photos/i, 'analyzing'],
  [/Your headshots are ready/i, 'ready'],
]

export function generationStatusText(key: StatusKey, locale: Locale) {
  return localizedStatus[locale][key]
}

export function localizeGenerationStatus(step: string | null | undefined, locale: Locale) {
  if (!step) {
    return localizedStatus[locale].rendering
  }

  const match = sourceToKey.find(([pattern]) => pattern.test(step))
  return match ? localizedStatus[locale][match[1]] : step
}
