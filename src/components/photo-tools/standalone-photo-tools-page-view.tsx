'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BackgroundColorTool from '@/components/photo-tools/background-color-tool'
import IdPhotoCropPrintTool from '@/components/photo-tools/id-photo-crop-print-tool'
import PhotoToolsAiWorkflowCard from '@/components/photo-tools/photo-tools-ai-workflow-card'
import PrintLayoutBuilderTool from '@/components/photo-tools/print-layout-builder-tool'
import ResizeImageKbTool from '@/components/photo-tools/resize-image-kb-tool'
import RemoveBackgroundTool from '@/components/photo-tools/remove-background-tool'
import { photoToolPages, type PhotoToolActiveId, type PhotoToolPageContent } from '@/lib/photo-tool-page-content'
import { BriefcaseBusiness, FileText, ImagePlus, Layers3, Palette, SlidersHorizontal, UserRoundCheck } from 'lucide-react'

type ToolId = PhotoToolActiveId

interface StandalonePhotoToolsPageViewProps {
  initialTool?: ToolId
  seoContent?: PhotoToolPageContent
}

export default function StandalonePhotoToolsPageView({
  initialTool = 'id-photo-crop',
  seoContent,
}: StandalonePhotoToolsPageViewProps) {
  const [activeTool, setActiveTool] = useState<ToolId>(initialTool)
  const pageTitle = seoContent?.h1 || 'Free Online Photo Tools'
  const pageDescription = seoContent?.description || 'Remove backgrounds, crop ID photos, resize images to a target KB, and build printable photo layouts.'
  const showAiWorkflowCard = activeTool !== 'remove-background'
  const activeToolContent =
    activeTool === 'resize-image'
      ? <ResizeImageKbTool />
      : activeTool === 'resize-kb'
        ? (
          <ResizeImageKbTool
            title="Resize Image to KB"
            description="Resize and compress a JPG, PNG, or WebP image to a target file size in KB for online forms, school portals, job applications, and profile uploads. Processing happens locally in your browser."
            actionLabel="Resize image to KB"
            targetKbOnly
          />
        )
      : activeTool === 'remove-background'
        ? <RemoveBackgroundTool />
      : activeTool === 'background-color'
        ? <BackgroundColorTool />
      : activeTool === 'print-layout'
        ? <PrintLayoutBuilderTool />
        : (
          <IdPhotoCropPrintTool
            sourceDescription="Upload a local JPG, PNG, or WebP image, choose an ID photo size, adjust the crop, and download the cropped JPG."
            uploadLabel="Upload Local Image"
            emptyText="Upload a local image to start cropping."
          />
        )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-2 text-sm font-semibold text-blue-600">Free Photo Tools</div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{pageTitle}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              {pageDescription}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Photo tools">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Photo tools
                </div>
                <nav className="space-y-1">
                  <ToolNavItem
                    icon={ImagePlus}
                    label="Free ID photo tool"
                    href="/free-id-photo-tool"
                  />
                  <ToolNavItem
                    icon={FileText}
                    label="ID photo crop"
                    active={activeTool === 'id-photo-crop'}
                    href={photoToolPages[0].path}
                    onClick={() => setActiveTool('id-photo-crop')}
                  />
                  <ToolNavItem
                    icon={SlidersHorizontal}
                    label="Resize image"
                    active={activeTool === 'resize-image'}
                    href={photoToolPages[1].path}
                    onClick={() => setActiveTool('resize-image')}
                  />
                  <ToolNavItem
                    icon={SlidersHorizontal}
                    label="Resize image to KB"
                    active={activeTool === 'resize-kb'}
                    href={photoToolPages[2].path}
                    onClick={() => setActiveTool('resize-kb')}
                  />
                  <ToolNavItem
                    icon={ImagePlus}
                    label="Remove background"
                    active={activeTool === 'remove-background'}
                    href={photoToolPages[3].path}
                    onClick={() => setActiveTool('remove-background')}
                  />
                  <ToolNavItem
                    icon={Palette}
                    label="Background color tool"
                    active={activeTool === 'background-color'}
                    href={photoToolPages[4].path}
                    onClick={() => setActiveTool('background-color')}
                  />
                  <ToolNavItem
                    icon={Layers3}
                    label="Print layout builder"
                    active={activeTool === 'print-layout'}
                    href={photoToolPages[5].path}
                    onClick={() => setActiveTool('print-layout')}
                  />
                  <ToolNavItem icon={BriefcaseBusiness} label="Professional outfit photo" badge="TBD" />
                  <ToolNavItem icon={UserRoundCheck} label="Professional image photo" badge="TBD" />
                </nav>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                Need the original combined ID photo crop, background, and print sheet workflow?{' '}
                <Link href="/free-id-photo-tool" className="font-semibold text-blue-600 hover:underline">
                  Open Free ID Photo Tool
                </Link>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="space-y-6">
                {activeToolContent}
                {showAiWorkflowCard && <PhotoToolsAiWorkflowCard />}
              </div>
            </div>
          </div>

          {seoContent && (
            <section className="mt-10" aria-label={`${seoContent.h1} FAQ`}>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-bold text-slate-900">FAQ</h2>
                <div className="mt-4 grid gap-4">
                  {seoContent.faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ToolNavItem({
  icon: Icon,
  label,
  active = false,
  badge,
  href,
  onClick,
}: {
  icon: typeof FileText
  label: string
  active?: boolean
  badge?: string
  href?: string
  onClick?: () => void
}) {
  const className = `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors ${
    active
      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
      : onClick || href
        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        : 'cursor-not-allowed text-slate-500 opacity-75'
  }`
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 flex-none" />
        <span className="truncate">{label}</span>
      </span>
      {badge && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
          {badge}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-current={active ? 'page' : undefined} onClick={onClick} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      disabled={!onClick}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  )
}
