'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Sparkles, ZoomIn } from 'lucide-react'
import Modal from '@/components/ui/modal'

interface HeroHeadshot {
  src: string
  alt: string
}

interface HeroHeadshotGalleryProps {
  images: HeroHeadshot[]
  badgeText?: string
  previewTitle?: string
  viewLabel?: string
}

export default function HeroHeadshotGallery({
  images,
  badgeText = 'Try 56 AI headshot styles',
  previewTitle = 'Headshot preview',
  viewLabel = 'View larger',
}: HeroHeadshotGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const previewImage = previewIndex === null ? null : images[previewIndex]

  return (
    <>
      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setPreviewIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 text-left shadow-xl ring-1 ring-white/70 transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`${viewLabel} ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 160px, 30vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-sm transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <ZoomIn className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>

        <div className="absolute -bottom-10 -right-2 flex items-center gap-2 rounded-xl bg-white p-2 shadow-lg sm:-bottom-14 sm:-right-4 sm:p-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-100 sm:h-8 sm:w-8">
            <Sparkles className="h-4 w-4 text-accent-600" />
          </div>
          <span className="max-w-[190px] text-xs font-medium leading-tight text-slate-700 sm:text-sm">
            {badgeText}
          </span>
        </div>
      </div>

      <Modal
        isOpen={previewImage !== null}
        onClose={() => setPreviewIndex(null)}
        title={previewTitle}
        className="max-w-2xl"
      >
        {previewImage && (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={previewImage.src}
              alt={previewImage.alt}
              fill
              sizes="(min-width: 640px) 640px, 92vw"
              className="object-cover"
            />
          </div>
        )}
      </Modal>
    </>
  )
}
