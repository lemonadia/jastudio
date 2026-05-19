import Image from 'next/image'
import type { Image as SanityImageSource } from 'sanity'
import { urlForImage, type ImageUrlOptions } from '@/sanity/lib/image'

type Props = {
  image: SanityImageSource | null | undefined
  alt: string
  width?: number | null
  height?: number | null
  sizes?: string
  priority?: boolean
  urlOptions?: ImageUrlOptions
}

export default function CmsImage({
  image,
  alt,
  width,
  height,
  sizes = '100vw',
  priority,
  urlOptions,
}: Props) {
  const src = urlForImage(image ?? undefined, urlOptions)
  if (!src) return null

  const w = width && width > 0 ? width : 1200
  const h = height && height > 0 ? height : 800

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      style={{ display: 'block' }}
    />
  )
}
