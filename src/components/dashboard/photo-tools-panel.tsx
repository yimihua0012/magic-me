'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import PhotoToolsWorkbench, { type PhotoToolSource } from '@/components/photo-tools/photo-tools-workbench'
import { Image as ImageIcon, Sparkles } from 'lucide-react'
import { PHOTO_TOOL_STYLE_IDS, isPhotoToolStyleId } from '@/lib/photo-tool-styles'
import { localePath, type Locale } from '@/lib/i18n'

type GenerationRecord = {
  id: string
  status: string
  created_at: string
  output_photos?: string[]
  metadata?: {
    styleIds?: unknown
    photoToolOutputs?: unknown
  } | null
}

type SourcePhoto = PhotoToolSource & {
  generationId: string
  createdAt: string
  styleId: string
  variant: 'white' | 'transparent'
}

interface PhotoToolsPanelProps {
  accessToken: string
  locale?: Locale
}

const photoToolStyleLabels: Record<string, Record<Locale, string>> = {
  print_professional_transparent: {
    en: 'Professional ID Photo(White)',
    es: 'Foto ID profesional(fondo blanco)',
    fr: 'Photo ID professionnelle(fond blanc)',
    de: 'Professionelles ID-Foto(weisser Hintergrund)',
    zh: '专业证件照（白底）',
    ja: 'プロ向け証明写真(白)',
  },
  print_professional_blue_png: {
    en: 'Professional ID Photo(Blue)',
    es: 'Foto ID profesional(fondo azul)',
    fr: 'Photo ID professionnelle(fond bleu)',
    de: 'Professionelles ID-Foto(blauer Hintergrund)',
    zh: '专业证件照（蓝底）',
    ja: 'プロ向け証明写真(青)',
  },
  print_professional_red_png: {
    en: 'Professional ID Photo(Red)',
    es: 'Foto ID profesional(fondo rojo)',
    fr: 'Photo ID professionnelle(fond rouge)',
    de: 'Professionelles ID-Foto(roter Hintergrund)',
    zh: '专业证件照（红底）',
    ja: 'プロ向け証明写真(赤)',
  },
  print_child_id_transparent: {
    en: 'Child ID Photo(White)',
    es: 'Foto ID infantil(fondo blanco)',
    fr: 'Photo ID enfant(fond blanc)',
    de: 'Kinder-ID-Foto(weisser Hintergrund)',
    zh: '儿童证件照（白底）',
    ja: '子ども証明写真(白)',
  },
  print_child_id_blue_png: {
    en: 'Child ID Photo(Blue)',
    es: 'Foto ID infantil(fondo azul)',
    fr: 'Photo ID enfant(fond bleu)',
    de: 'Kinder-ID-Foto(blauer Hintergrund)',
    zh: '儿童证件照（蓝底）',
    ja: '子ども証明写真(青)',
  },
  print_child_id_red_png: {
    en: 'Child ID Photo(Red)',
    es: 'Foto ID infantil(fondo rojo)',
    fr: 'Photo ID enfant(fond rouge)',
    de: 'Kinder-ID-Foto(roter Hintergrund)',
    zh: '儿童证件照（红底）',
    ja: '子ども証明写真(赤)',
  },
  print_student_id_transparent: {
    en: 'Student ID Photo(White)',
    es: 'Foto ID estudiante(fondo blanco)',
    fr: 'Photo ID etudiant(fond blanc)',
    de: 'Studenten-ID-Foto(weisser Hintergrund)',
    zh: '学生证件照（白底）',
    ja: '学生証明写真(白)',
  },
  print_student_id_blue_png: {
    en: 'Student ID Photo(Blue)',
    es: 'Foto ID estudiante(fondo azul)',
    fr: 'Photo ID etudiant(fond bleu)',
    de: 'Studenten-ID-Foto(blauer Hintergrund)',
    zh: '学生证件照（蓝底）',
    ja: '学生証明写真(青)',
  },
  print_student_id_red_png: {
    en: 'Student ID Photo(Red)',
    es: 'Foto ID estudiante(fondo rojo)',
    fr: 'Photo ID etudiant(fond rouge)',
    de: 'Studenten-ID-Foto(roter Hintergrund)',
    zh: '学生证件照（红底）',
    ja: '学生証明写真(赤)',
  },
}

const panelText: Record<Locale, {
  sourceDescription: string
  uploadLabel: string
  generate: string
  loading: string
  emptyPrefix: string
  emptySuffix: string
  generatePhotoTools: string
  png: string
  legacy: string
}> = {
  en: {
    sourceDescription: 'Choose a generated ID photo portrait, transparent PNG portrait, or upload a local image, then export ID-sized copies.',
    uploadLabel: 'Upload Local Image',
    generate: 'Generate ID Photo And PNG',
    loading: 'Loading generated photos...',
    emptyPrefix: 'No Photo Tools portraits yet. Generate one of these styles first:',
    emptySuffix: '.',
    generatePhotoTools: 'Generate Photo Tools Portrait',
    png: 'PNG',
    legacy: 'Legacy',
  },
  es: {
    sourceDescription: 'Elige una foto ID generada, un PNG transparente o sube una imagen local para exportar copias en tamanos de documento.',
    uploadLabel: 'Subir imagen local',
    generate: 'Crear foto ID y PNG',
    loading: 'Cargando fotos generadas...',
    emptyPrefix: 'Aun no hay fotos de Photo Tools. Primero genera uno de estos estilos:',
    emptySuffix: '.',
    generatePhotoTools: 'Crear foto para herramientas',
    png: 'PNG',
    legacy: 'Anterior',
  },
  fr: {
    sourceDescription: 'Choisissez une photo ID generee, un PNG transparent ou importez une image locale pour exporter des formats de photo d identite.',
    uploadLabel: 'Importer une image locale',
    generate: 'Creer une photo ID et PNG',
    loading: 'Chargement des photos generees...',
    emptyPrefix: 'Aucune photo Photo Tools pour le moment. Generez d abord un de ces styles :',
    emptySuffix: '.',
    generatePhotoTools: 'Creer une photo pour les outils',
    png: 'PNG',
    legacy: 'Ancien',
  },
  de: {
    sourceDescription: 'Waehle ein generiertes ID-Foto, ein transparentes PNG oder lade ein lokales Bild hoch, um Ausweisfoto-Groessen zu exportieren.',
    uploadLabel: 'Lokales Bild hochladen',
    generate: 'Passfoto und PNG erstellen',
    loading: 'Generierte Fotos werden geladen...',
    emptyPrefix: 'Noch keine Photo-Tools-Bilder vorhanden. Erstelle zuerst einen dieser Stile:',
    emptySuffix: '.',
    generatePhotoTools: 'Photo-Tools-Bild erstellen',
    png: 'PNG',
    legacy: 'Alt',
  },
  zh: {
    sourceDescription: '选择已生成的证件照、透明 PNG，或上传本地图片，再导出常用证件照尺寸。',
    uploadLabel: '上传本地图片',
    generate: '生成证件照和 PNG',
    loading: '正在加载已生成照片...',
    emptyPrefix: '还没有 Photo Tools 可用照片，请先生成这些样式：',
    emptySuffix: '。',
    generatePhotoTools: '生成 Photo Tools 照片',
    png: 'PNG',
    legacy: '旧版',
  },
  ja: {
    sourceDescription: '生成済みの証明写真、透明PNG、またはローカル画像を選び、証明写真サイズで書き出せます。',
    uploadLabel: 'ローカル画像をアップロード',
    generate: '証明写真とPNGを作成',
    loading: '生成済み写真を読み込み中...',
    emptyPrefix: 'Photo Tools 用の写真はまだありません。まず次のスタイルを生成してください:',
    emptySuffix: '。',
    generatePhotoTools: 'Photo Tools 用写真を作成',
    png: 'PNG',
    legacy: '旧形式',
  },
}

export default function PhotoToolsPanel({ accessToken, locale = 'en' }: PhotoToolsPanelProps) {
  const [sourcePhotos, setSourcePhotos] = useState<SourcePhoto[]>([])
  const [isLoadingGenerations, setIsLoadingGenerations] = useState(false)
  const [error, setError] = useState('')
  const uploadHref = localePath(locale, '/upload')
  const text = panelText[locale]

  const loadGenerations = useCallback(async () => {
    if (!accessToken) return

    setIsLoadingGenerations(true)
    setError('')

    try {
      const response = await fetch('/api/generations?limit=50', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to load generated photos.')
      }

      setSourcePhotos(((data.generations || []) as GenerationRecord[]).flatMap((generation) => sourcePhotosFromGeneration(generation, locale)))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load generated photos.')
    } finally {
      setIsLoadingGenerations(false)
    }
  }, [accessToken, locale])

  useEffect(() => {
    void loadGenerations()
  }, [loadGenerations])

  return (
    <div>
      <PhotoToolsWorkbench
        locale={locale}
        sources={sourcePhotos}
        allowUpload
        sourceDescription={text.sourceDescription}
        uploadLabel={text.uploadLabel}
        sourceActions={(
          <Link href={uploadHref} className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              {text.generate}
            </Button>
          </Link>
        )}
        onRefresh={() => void loadGenerations()}
        isRefreshing={isLoadingGenerations}
        emptyState={(
          <div className="space-y-4">
            <p>
              {error || (isLoadingGenerations
                ? text.loading
                : `${text.emptyPrefix} ${PHOTO_TOOL_STYLE_IDS.map((id) => photoToolStyleLabel(id, locale)).join(', ')}${text.emptySuffix}`)}
            </p>
            {!isLoadingGenerations && (
              <Link href={uploadHref}>
                <Button>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {text.generatePhotoTools}
                </Button>
              </Link>
            )}
          </div>
        )}
      />
    </div>
  )
}

function sourcePhotosFromGeneration(generation: GenerationRecord, locale: Locale): SourcePhoto[] {
  const text = panelText[locale]
  const structuredOutputs = parsePhotoToolOutputs(generation.metadata?.photoToolOutputs)
  if (structuredOutputs.length > 0) {
    return structuredOutputs.flatMap((record) => {
      if (!isPhotoToolStyleId(record.styleId)) return []

      const sources: SourcePhoto[] = [{
        id: `${generation.id}-${record.styleId}-white-${record.whiteBackgroundUrl}`,
        url: record.whiteBackgroundUrl,
        generationId: generation.id,
        createdAt: generation.created_at,
        styleId: record.styleId,
        variant: 'white',
        label: photoToolStyleLabel(record.styleId, locale),
        caption: new Date(generation.created_at).toLocaleDateString(),
        mimeType: 'image/jpeg',
      }]

      if (record.transparentPngUrl) {
        sources.push({
          id: `${generation.id}-${record.styleId}-transparent-${record.transparentPngUrl}`,
          url: record.transparentPngUrl,
          generationId: generation.id,
          createdAt: generation.created_at,
          styleId: record.styleId,
          variant: 'transparent',
          label: `${photoToolStyleLabel(record.styleId, locale)} - ${text.png}`,
          caption: new Date(generation.created_at).toLocaleDateString(),
          mimeType: 'image/png',
        })
      }

      return sources
    })
  }

  const styleIds = Array.isArray(generation.metadata?.styleIds)
    ? generation.metadata.styleIds.filter((styleId): styleId is string => typeof styleId === 'string')
    : []

  const photos: SourcePhoto[] = []
  ;(generation.output_photos || []).forEach((url, index) => {
    const styleId = styleIds[index]
    if (!styleId || !isPhotoToolStyleId(styleId)) return

    photos.push({
      id: `${generation.id}-${styleId}-${url}`,
      url,
      generationId: generation.id,
      createdAt: generation.created_at,
      styleId,
      variant: 'white',
      label: `${photoToolStyleLabel(styleId, locale)} - ${text.legacy}`,
      caption: new Date(generation.created_at).toLocaleDateString(),
      mimeType: undefined,
    })
  })

  return photos
}

function parsePhotoToolOutputs(value: unknown): Array<{
  styleId: string
  whiteBackgroundUrl: string
  transparentPngUrl?: string
}> {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const record = item as {
      styleId?: unknown
      whiteBackgroundUrl?: unknown
      transparentPngUrl?: unknown
    }

    if (typeof record.styleId !== 'string' || typeof record.whiteBackgroundUrl !== 'string') {
      return []
    }

    return [{
      styleId: record.styleId,
      whiteBackgroundUrl: record.whiteBackgroundUrl,
      transparentPngUrl: typeof record.transparentPngUrl === 'string' ? record.transparentPngUrl : undefined,
    }]
  })
}

function photoToolStyleLabel(styleId: string, locale: Locale) {
  return photoToolStyleLabels[styleId]?.[locale] || photoToolStyleLabels[styleId]?.en || styleId
}
