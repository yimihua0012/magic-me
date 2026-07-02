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

const photoToolStyleLabels: Record<string, string> = {
  print_professional_transparent: 'Professional Print',
  print_child_id_transparent: 'Child ID',
  print_student_id_transparent: 'Student ID',
}

export default function PhotoToolsPanel({ accessToken, locale = 'en' }: PhotoToolsPanelProps) {
  const [sourcePhotos, setSourcePhotos] = useState<SourcePhoto[]>([])
  const [isLoadingGenerations, setIsLoadingGenerations] = useState(false)
  const [error, setError] = useState('')
  const uploadHref = localePath(locale, '/upload')

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

      setSourcePhotos(((data.generations || []) as GenerationRecord[]).flatMap(sourcePhotosFromGeneration))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load generated photos.')
    } finally {
      setIsLoadingGenerations(false)
    }
  }, [accessToken])

  useEffect(() => {
    void loadGenerations()
  }, [loadGenerations])

  return (
    <div>
      <PhotoToolsWorkbench
        locale={locale}
        sources={sourcePhotos}
        allowUpload
        sourceDescription="Choose a generated white-background portrait, transparent PNG portrait, or upload a local image, then export ID-sized copies."
        uploadLabel="Upload Local Image"
        sourceActions={(
          <Link href={uploadHref} className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Transparent PNG Portrait
            </Button>
          </Link>
        )}
        onRefresh={() => void loadGenerations()}
        isRefreshing={isLoadingGenerations}
        emptyState={(
          <div className="space-y-4">
            <p>
              {error || (isLoadingGenerations
                ? 'Loading generated photos...'
                : `No Photo Tools portraits yet. Generate one of these styles first: ${PHOTO_TOOL_STYLE_IDS.map((id) => photoToolStyleLabels[id]).join(', ')}.`)}
            </p>
            {!isLoadingGenerations && (
              <Link href={uploadHref}>
                <Button>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate Photo Tools Portrait
                </Button>
              </Link>
            )}
          </div>
        )}
      />
    </div>
  )
}

function sourcePhotosFromGeneration(generation: GenerationRecord): SourcePhoto[] {
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
        label: `${photoToolStyleLabels[record.styleId] || record.styleId} - White`,
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
          label: `${photoToolStyleLabels[record.styleId] || record.styleId} - PNG`,
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
      label: `${photoToolStyleLabels[styleId] || styleId} - Legacy`,
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
