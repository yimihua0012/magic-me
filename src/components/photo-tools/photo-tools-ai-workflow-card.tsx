'use client'

import Link from 'next/link'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { localePath, type Locale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import { Camera, Sparkles } from 'lucide-react'

const aiWorkflowContent: Record<Locale, {
  title: string
  description: string
  action: string
}> = {
  en: {
    title: 'Need a stronger AI result?',
    description: 'Local photo tools are useful for quick edits. If the crop, background, or final style still needs a more polished result, continue with the AI photo workflow.',
    action: 'Open AI photo workflow',
  },
  es: {
    title: 'Necesitas un resultado con IA?',
    description: 'Las herramientas locales sirven para ajustes rapidos. Si el recorte, el fondo o el estilo final necesitan un acabado mas cuidado, continua con el flujo de foto con IA.',
    action: 'Abrir flujo con IA',
  },
  fr: {
    title: 'Besoin d un rendu IA plus abouti?',
    description: 'Les outils locaux sont pratiques pour les retouches rapides. Si le recadrage, le fond ou le style final doivent etre plus soignes, passez au flux photo IA.',
    action: 'Ouvrir le flux photo IA',
  },
  de: {
    title: 'Brauchst du ein staerkeres KI-Ergebnis?',
    description: 'Die lokalen Fototools eignen sich fuer schnelle Anpassungen. Wenn Zuschnitt, Hintergrund oder finaler Stil noch professioneller wirken sollen, nutze den KI-Fotoworkflow.',
    action: 'KI-Fotoworkflow oeffnen',
  },
  ja: {
    title: 'AIでさらに整えますか？',
    description: 'ローカル写真ツールは素早い調整に便利です。切り抜き、背景、仕上がりの雰囲気をさらに整えたい場合は、AI写真ワークフローに進めます。',
    action: 'AI写真ワークフローを開く',
  },
}

interface PhotoToolsAiWorkflowCardProps {
  locale?: Locale
  source?: string
}

export default function PhotoToolsAiWorkflowCard({
  locale = 'en',
  source = 'photo_tools_remove_background',
}: PhotoToolsAiWorkflowCardProps) {
  const content = aiWorkflowContent[locale]
  const uploadHref = withSource(localePath(locale, '/upload'), source)

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
        <Camera className="h-4 w-4" />
        {content.title}
      </div>
      <p className="text-sm leading-6 text-slate-600">
        {content.description}
      </p>
      <Link href={uploadHref} className="mt-5 block">
        <Button className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {content.action}
        </Button>
      </Link>
    </Card>
  )
}
