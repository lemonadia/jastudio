import type { Metadata } from 'next'
import type { Image } from 'sanity'
import { urlForImage } from '@/sanity/lib/image'

export type SeoData = {
  title?: string | null
  description?: string | null
  image?: Image | null
} | null | undefined

type Fallback = {
  title?: string | null
  description?: string | null
  image?: Image | null
}

export function metadataFromSeo(seo: SeoData, fallback: Fallback = {}): Metadata {
  const title = seo?.title?.trim() || fallback.title?.trim() || undefined
  const description = seo?.description?.trim() || fallback.description?.trim() || undefined
  const imageUrl =
    urlForImage(seo?.image ?? undefined, { width: 1200, height: 630, quality: 85 }) ||
    urlForImage(fallback.image ?? undefined, { width: 1200, height: 630, quality: 85 })

  if (!title && !description && !imageUrl) return {}

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}
