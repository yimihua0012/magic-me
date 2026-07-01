import type { Locale } from '@/lib/i18n'

type DashboardContent = {
  title: string
  subtitle: string
  newGeneration: string
  creditStatus: string
  creditsReady: string
  noActiveCredits: string
  creditDescription: string
  status: string
  imagesAvailable: string
  needCredits: string
  expires: string
  noActivePackage: string
  dayLeft: string
  daysLeft: string
  generationDisabled: string
  noHeadshotsTitle: string
  noHeadshotsText: string
  generateFirst: string
  processing: string
  completed: string
  failed: string
  styles: string
  viewAll: string
  viewDetails: string
  deleteConfirm: string
  deleteFailed: string
  createNew: string
}

const en: DashboardContent = {
  title: 'Your Headshots',
  subtitle: 'Manage and download your AI-generated headshots',
  newGeneration: 'New Generation',
  creditStatus: 'Credit status',
  creditsReady: '{credits} credits ready',
  noActiveCredits: 'No active credits',
  creditDescription: 'Upload a photo, choose styles, then generate and deduct by selection.',
  status: 'Status',
  imagesAvailable: '{credits} images available',
  needCredits: 'Need credits',
  expires: 'Expires',
  noActivePackage: 'No active package',
  dayLeft: 'day left',
  daysLeft: 'days left',
  generationDisabled: 'Generation is disabled until credits are restored.',
  noHeadshotsTitle: 'No headshots yet',
  noHeadshotsText: 'Upload a selfie and let our AI create professional headshots for you in just 3 minutes.',
  generateFirst: 'Generate Your First Headshots',
  processing: 'Processing...',
  completed: 'Completed',
  failed: 'Failed',
  styles: 'styles',
  viewAll: 'View all headshots',
  viewDetails: 'View Details',
  deleteConfirm: 'Are you sure you want to delete this generation?',
  deleteFailed: 'Failed to delete this generation. Please try again.',
  createNew: 'Create New Generation',
}

export const localizedDashboardContent: Record<Locale, DashboardContent> = {
  en,
  es: {
    ...en,
    title: 'Tus retratos',
    subtitle: 'Gestiona y descarga tus retratos generados con IA',
    newGeneration: 'Nueva generacion',
    creditStatus: 'Estado de creditos',
    creditsReady: '{credits} creditos listos',
    noActiveCredits: 'Sin creditos activos',
    status: 'Estado',
    imagesAvailable: '{credits} imagenes disponibles',
    needCredits: 'Necesitas creditos',
    expires: 'Caduca',
    noActivePackage: 'Sin paquete activo',
    generationDisabled: 'La generacion esta desactivada hasta recuperar creditos.',
    noHeadshotsTitle: 'Aun no hay retratos',
    noHeadshotsText: 'Sube una selfie y deja que la IA cree retratos profesionales en unos minutos.',
    generateFirst: 'Generar tus primeros retratos',
    processing: 'Procesando...',
    completed: 'Completado',
    failed: 'Fallido',
    viewAll: 'Ver todos los retratos',
    viewDetails: 'Ver detalles',
    deleteConfirm: '¿Seguro que quieres eliminar esta generación?',
    deleteFailed: 'No se pudo eliminar esta generación. Inténtalo de nuevo.',
    createNew: 'Crear nueva generacion',
  },
  fr: {
    ...en,
    title: 'Vos portraits',
    subtitle: 'Gerez et telechargez vos portraits generes par IA',
    newGeneration: 'Nouvelle generation',
    creditStatus: 'Statut des credits',
    creditsReady: '{credits} credits prets',
    noActiveCredits: 'Aucun credit actif',
    status: 'Statut',
    imagesAvailable: '{credits} images disponibles',
    needCredits: 'Credits requis',
    expires: 'Expire',
    noActivePackage: 'Aucun pack actif',
    generationDisabled: 'La generation est desactivee tant que les credits ne sont pas disponibles.',
    noHeadshotsTitle: 'Aucun portrait pour le moment',
    noHeadshotsText: 'Importez un selfie et laissez notre IA creer vos portraits professionnels en quelques minutes.',
    generateFirst: 'Generer vos premiers portraits',
    processing: 'Traitement...',
    completed: 'Termine',
    failed: 'Echec',
    viewAll: 'Voir tous les portraits',
    viewDetails: 'Voir les details',
    deleteConfirm: 'Voulez-vous vraiment supprimer cette génération ?',
    deleteFailed: 'Impossible de supprimer cette génération. Veuillez réessayer.',
    createNew: 'Creer une nouvelle generation',
  },
  de: {
    ...en,
    title: 'Deine Headshots',
    subtitle: 'Verwalte und lade deine KI-Headshots herunter',
    newGeneration: 'Neue Generierung',
    creditStatus: 'Credit-Status',
    creditsReady: '{credits} Credits bereit',
    noActiveCredits: 'Keine aktiven Credits',
    status: 'Status',
    imagesAvailable: '{credits} Bilder verfuegbar',
    needCredits: 'Credits benoetigt',
    expires: 'Laeuft ab',
    noActivePackage: 'Kein aktives Paket',
    generationDisabled: 'Generierung ist deaktiviert, bis Credits verfuegbar sind.',
    noHeadshotsTitle: 'Noch keine Headshots',
    noHeadshotsText: 'Lade ein Selfie hoch und erstelle in wenigen Minuten professionelle KI-Headshots.',
    generateFirst: 'Erste Headshots erstellen',
    processing: 'Wird verarbeitet...',
    completed: 'Abgeschlossen',
    failed: 'Fehlgeschlagen',
    viewAll: 'Alle Headshots ansehen',
    viewDetails: 'Details ansehen',
    deleteConfirm: 'Möchtest du diese Generierung wirklich löschen?',
    deleteFailed: 'Diese Generierung konnte nicht gelöscht werden. Bitte versuche es erneut.',
    createNew: 'Neue Generierung erstellen',
  },
  ja: {
    ...en,
    title: 'ヘッドショット',
    subtitle: 'AIで作成したヘッドショットを管理・ダウンロード',
    newGeneration: '新しく作成',
    creditStatus: 'クレジット状態',
    creditsReady: '{credits} クレジット利用可能',
    noActiveCredits: '有効なクレジットがありません',
    creditDescription: '写真をアップロードし、スタイルを選んで生成します。選択分だけクレジットを消費します。',
    status: '状態',
    imagesAvailable: '{credits} 枚分利用可能',
    needCredits: 'クレジットが必要です',
    expires: '有効期限',
    noActivePackage: '有効なパッケージなし',
    dayLeft: '日',
    daysLeft: '日',
    generationDisabled: 'クレジットが利用可能になるまで生成はできません。',
    noHeadshotsTitle: 'まだヘッドショットがありません',
    noHeadshotsText: 'セルフィーをアップロードすると、数分でプロ向けヘッドショットを作成できます。',
    generateFirst: '最初のヘッドショットを作成',
    processing: '処理中...',
    completed: '完了',
    failed: '失敗',
    styles: 'スタイル',
    viewAll: 'すべてのヘッドショットを見る',
    viewDetails: '詳細を見る',
    deleteConfirm: 'この生成結果を削除しますか？',
    deleteFailed: '削除できませんでした。もう一度お試しください。',
    createNew: '新しく作成',
  },
}

export function formatDashboardText(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}
