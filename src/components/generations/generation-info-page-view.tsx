'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { supabase } from '@/lib/supabase/client'
import { AlertCircle, ArrowLeft, Camera, CheckCircle2, Download, Grid3X3, Loader2 } from 'lucide-react'

const Modal = dynamic(() => import('@/components/ui/modal'), {
  ssr: false,
})

interface Generation {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  style_count: number
  created_at: string
  output_photos?: string[]
  metadata?: {
    styleIds?: string[]
  }
}

interface HeadshotStyle {
  id: string
  name: string
}

type GenerationInfoContent = {
  backDashboard: string
  title: string
  subtitle: string
  fallbackSubtitle: string
  createNew: string
  loading: string
  notFound: string
  loadFailed: string
  noImages: string
  noImagesText: string
  selectAll: string
  deselectAll: string
  selected: string
  downloadSelected: string
  selectImage: string
  deselectImage: string
  downloadImage: string
  download: string
  select: string
  deselect: string
  styleFallback: string
}

const infoContent: Record<Locale, GenerationInfoContent> = {
  en: {
    backDashboard: 'Back to Dashboard',
    title: 'Headshot Details',
    subtitle: '{count} images generated on {date}',
    fallbackSubtitle: 'Review and download your generated images.',
    createNew: 'Create New Generation',
    loading: 'Loading generation...',
    notFound: 'Generation not found',
    loadFailed: 'Failed to load this generation',
    noImages: 'No images available',
    noImagesText: 'This generation has not produced images yet.',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selected: '{count} selected',
    downloadSelected: 'Download Selected ({count})',
    selectImage: 'Select image',
    deselectImage: 'Deselect image',
    downloadImage: 'Download image',
    download: 'Download',
    select: 'Select',
    deselect: 'Deselect',
    styleFallback: 'Style {index}',
  },
  es: {
    backDashboard: 'Volver al panel',
    title: 'Detalles del retrato',
    subtitle: '{count} imagenes generadas el {date}',
    fallbackSubtitle: 'Revisa y descarga tus imagenes generadas.',
    createNew: 'Crear nueva generacion',
    loading: 'Cargando generacion...',
    notFound: 'Generacion no encontrada',
    loadFailed: 'No se pudo cargar esta generacion',
    noImages: 'No hay imagenes disponibles',
    noImagesText: 'Esta generacion aun no ha producido imagenes.',
    selectAll: 'Seleccionar todo',
    deselectAll: 'Deseleccionar todo',
    selected: '{count} seleccionadas',
    downloadSelected: 'Descargar seleccionadas ({count})',
    selectImage: 'Seleccionar imagen',
    deselectImage: 'Deseleccionar imagen',
    downloadImage: 'Descargar imagen',
    download: 'Descargar',
    select: 'Seleccionar',
    deselect: 'Deseleccionar',
    styleFallback: 'Estilo {index}',
  },
  fr: {
    backDashboard: 'Retour au tableau de bord',
    title: 'Details du portrait',
    subtitle: '{count} images generees le {date}',
    fallbackSubtitle: 'Consultez et telechargez vos images generees.',
    createNew: 'Creer une nouvelle generation',
    loading: 'Chargement de la generation...',
    notFound: 'Generation introuvable',
    loadFailed: 'Impossible de charger cette generation',
    noImages: 'Aucune image disponible',
    noImagesText: 'Cette generation n a pas encore produit d images.',
    selectAll: 'Tout selectionner',
    deselectAll: 'Tout deselectionner',
    selected: '{count} selectionnees',
    downloadSelected: 'Telecharger la selection ({count})',
    selectImage: 'Selectionner l image',
    deselectImage: 'Deselectionner l image',
    downloadImage: 'Telecharger l image',
    download: 'Telecharger',
    select: 'Selectionner',
    deselect: 'Deselectionner',
    styleFallback: 'Style {index}',
  },
  de: {
    backDashboard: 'Zurueck zum Dashboard',
    title: 'Headshot-Details',
    subtitle: '{count} Bilder erstellt am {date}',
    fallbackSubtitle: 'Pruefe und lade deine generierten Bilder herunter.',
    createNew: 'Neue Generierung erstellen',
    loading: 'Generierung wird geladen...',
    notFound: 'Generierung nicht gefunden',
    loadFailed: 'Diese Generierung konnte nicht geladen werden',
    noImages: 'Keine Bilder verfuegbar',
    noImagesText: 'Diese Generierung hat noch keine Bilder erzeugt.',
    selectAll: 'Alle auswaehlen',
    deselectAll: 'Alle abwaehlen',
    selected: '{count} ausgewaehlt',
    downloadSelected: 'Auswahl herunterladen ({count})',
    selectImage: 'Bild auswaehlen',
    deselectImage: 'Bild abwaehlen',
    downloadImage: 'Bild herunterladen',
    download: 'Herunterladen',
    select: 'Auswaehlen',
    deselect: 'Abwaehlen',
    styleFallback: 'Stil {index}',
  },
  ja: {
    backDashboard: 'ダッシュボードへ戻る',
    title: 'ヘッドショット詳細',
    subtitle: '{date} に生成された {count} 枚の画像',
    fallbackSubtitle: '生成された画像を確認してダウンロードできます。',
    createNew: '新しく作成',
    loading: '生成結果を読み込み中...',
    notFound: '生成結果が見つかりません',
    loadFailed: 'この生成結果を読み込めませんでした',
    noImages: '画像がありません',
    noImagesText: 'この生成ではまだ画像が作成されていません。',
    selectAll: 'すべて選択',
    deselectAll: 'すべて解除',
    selected: '{count} 件選択中',
    downloadSelected: '選択分をダウンロード ({count})',
    selectImage: '画像を選択',
    deselectImage: '画像の選択を解除',
    downloadImage: '画像をダウンロード',
    download: 'ダウンロード',
    select: '選択',
    deselect: '解除',
    styleFallback: 'スタイル {index}',
  },
}

function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template)
}

interface GenerationInfoPageViewProps {
  locale?: Locale
}

export default function GenerationInfoPageView({ locale = 'en' }: GenerationInfoPageViewProps) {
  const params = useParams()
  const router = useRouter()
  const generationId = typeof params.id === 'string' ? params.id : ''
  const content = infoContent[locale]
  const dashboardHref = localePath(locale, '/dashboard')
  const uploadHref = localePath(locale, '/upload')
  const generationHref = localePath(locale, `/generations/${generationId}`)
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [styles, setStyles] = useState<HeadshotStyle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadGeneration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          router.push(loginPathForReturn(generationHref, dashboardHref))
          return
        }

        const [generationRes, stylesRes] = await Promise.all([
          fetch(`/api/generations/${generationId}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`/api/styles?locale=${locale}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ])

        if (generationRes.status === 404) {
          setError(content.notFound)
          return
        }

        if (!generationRes.ok) {
          setError(content.loadFailed)
          return
        }

        const generationData = await generationRes.json()
        setGeneration(generationData.generation)

        if (stylesRes.ok) {
          const stylesData = await stylesRes.json()
          setStyles(Array.isArray(stylesData.styles) ? stylesData.styles : [])
        }
      } catch {
        setError(content.loadFailed)
      } finally {
        setIsLoading(false)
      }
    }

    void loadGeneration()
  }, [content.loadFailed, content.notFound, dashboardHref, generationHref, generationId, locale, router])

  const photos = generation?.output_photos || []
  const selectedStyleIds = Array.isArray(generation?.metadata?.styleIds) ? generation.metadata.styleIds : []

  const styleNameForIndex = (index: number) => {
    const styleId = selectedStyleIds[index]
    return styles.find((style) => style.id === styleId)?.name || fill(content.styleFallback, { index: index + 1 })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDownload = async (index: number) => {
    const photo = photos[index]
    if (!photo) return
    const styleName = styleNameForIndex(index)
    const link = document.createElement('a')
    const filename = `headshot-${styleName.toLowerCase().replace(/\s+/g, '-')}.jpg`

    try {
      const response = await fetch(photo)
      if (!response.ok) throw new Error('Failed to fetch original image')
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      link.href = photo
      link.download = filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.click()
    }
  }

  const handleDownloadSelected = () => {
    selectedPhotos.forEach((index) => {
      setTimeout(() => handleDownload(index), index * 200)
    })
  }

  const togglePhotoSelection = (index: number) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelectedPhotos((prev) => (
      prev.size === photos.length ? new Set() : new Set(Array.from({ length: photos.length }, (_, index) => index))
    ))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href={dashboardHref} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4" />
                {content.backDashboard}
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
              <p className="mt-1 text-slate-600">
                {generation ? fill(content.subtitle, { count: photos.length, date: formatDate(generation.created_at) }) : content.fallbackSubtitle}
              </p>
            </div>
            <Link href={uploadHref}>
              <Button>{content.createNew}</Button>
            </Link>
          </div>

          {isLoading ? (
            <Card className="p-12 text-center">
              <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary-600" />
              <p className="text-slate-600">{content.loading}</p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-slate-900">{error}</h2>
              <Link href={dashboardHref}>
                <Button variant="secondary">{content.backDashboard}</Button>
              </Link>
            </Card>
          ) : photos.length === 0 ? (
            <Card className="p-12 text-center">
              <Camera className="mx-auto mb-4 h-10 w-10 text-slate-400" />
              <h2 className="mb-2 text-xl font-semibold text-slate-900">{content.noImages}</h2>
              <p className="mb-6 text-slate-600">{content.noImagesText}</p>
              <Link href={dashboardHref}>
                <Button variant="secondary">{content.backDashboard}</Button>
              </Link>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="secondary" size="sm" onClick={toggleSelectAll}>
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    {selectedPhotos.size === photos.length ? content.deselectAll : content.selectAll}
                  </Button>
                  <span className="text-sm text-slate-500">{fill(content.selected, { count: selectedPhotos.size })}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selectedPhotos.size === 0}
                  onClick={handleDownloadSelected}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {fill(content.downloadSelected, { count: selectedPhotos.size })}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo}-${index}`}
                    className="group relative cursor-pointer"
                    onClick={() => setLightboxPhoto(index)}
                  >
                    <div className={`aspect-square overflow-hidden rounded-xl bg-slate-200 ring-offset-2 transition ${selectedPhotos.has(index) ? 'ring-2 ring-primary-500' : ''}`}>
                      <img
                        src={photo}
                        alt={styleNameForIndex(index)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-sm font-medium text-white">{styleNameForIndex(index)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePhotoSelection(index)
                      }}
                      className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                        selectedPhotos.has(index)
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-white bg-white/80 text-transparent hover:bg-white hover:text-slate-700'
                      }`}
                      aria-label={selectedPhotos.has(index) ? content.deselectImage : content.selectImage}
                    >
                      {selectedPhotos.has(index) && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(index)
                      }}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                      aria-label={content.downloadImage}
                    >
                      <Download className="h-4 w-4 text-slate-700" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Modal
        isOpen={lightboxPhoto !== null}
        onClose={() => setLightboxPhoto(null)}
        className="max-w-2xl"
      >
        {lightboxPhoto !== null && photos[lightboxPhoto] && (
          <div>
            <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-slate-200">
              <img
                src={photos[lightboxPhoto]}
                alt={styleNameForIndex(lightboxPhoto)}
                className="h-full w-full object-contain"
              />
            </div>
            <h3 className="mb-4 font-semibold text-slate-900">{styleNameForIndex(lightboxPhoto)}</h3>
            <Button className="w-full" onClick={() => handleDownload(lightboxPhoto)}>
              <Download className="mr-2 h-4 w-4" />
              {content.download}
            </Button>
            <Button
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => togglePhotoSelection(lightboxPhoto)}
            >
              {selectedPhotos.has(lightboxPhoto) ? content.deselect : content.select}
            </Button>
          </div>
        )}
      </Modal>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}
