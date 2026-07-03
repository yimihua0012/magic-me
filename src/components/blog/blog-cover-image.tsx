import Image from 'next/image'

type BlogCoverImageProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes: string
}

export default function BlogCoverImage({ src, alt, className, priority = false, sizes }: BlogCoverImageProps) {
  if (/^https?:\/\//i.test(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
    />
  )
}
