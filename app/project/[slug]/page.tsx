import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectSlider, { type Slide } from '@/app/components/ProjectSlider/ProjectSlider'
import { sanityFetch } from '@/sanity/lib/fetch'
import { projectBySlugQuery, projectSlugsQuery } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import {
  collectProjectMedia,
  type GalleryItem,
  type ProjectThumbnail,
} from '@/sanity/lib/projectMedia'
import { urlForImage } from '@/sanity/lib/image'

type ProjectDoc = {
  title?: string | null
  slug?: string | null
  year?: number | null
  categories?: { title?: string | null }[] | null
  thumbnail?: ProjectThumbnail | null
  gallery?: GalleryItem[] | null
} | null

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const rows = await client.fetch<{ slug: string }[]>(projectSlugsQuery)
    return (rows || []).map((r) => ({ slug: r.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const doc = await sanityFetch<ProjectDoc>({
      query: projectBySlugQuery,
      params: { slug },
    })
    if (!doc?.title) return {}
    return { title: doc.title }
  } catch {
    return {}
  }
}

function buildSlides(items: ReturnType<typeof collectProjectMedia>, title: string): Slide[] {
  return items
    .map((item, i) => {
      if (item.kind === 'video') {
        return {
          type: 'video' as const,
          playbackId: item.playbackId,
          alt: item.alt || `${title} — video ${i + 1}`,
        }
      }

      const url = urlForImage(item.image, { height: 1600, quality: 82 })
      if (!url) return null

      const w = item.image.width && item.image.width > 0 ? item.image.width : 1200
      const h = item.image.height && item.image.height > 0 ? item.image.height : 800

      return {
        type: 'image' as const,
        url,
        alt: (item.image.alt as string | undefined) || `${title} — ${i + 1}`,
        width: w,
        height: h,
      }
    })
    .filter((s): s is Slide => Boolean(s))
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ i?: string; from?: string }>
}) {
  const { slug } = await params
  const { i, from } = await searchParams
  const parsed = i ? Number.parseInt(i, 10) : 0
  const returnTo =
    from && from.startsWith('/') && !from.startsWith('//') ? from.split('#')[0] : null

  const doc = await sanityFetch<ProjectDoc>({
    query: projectBySlugQuery,
    params: { slug },
  })

  if (!doc?.title || !doc.slug) {
    notFound()
  }

  const categories = doc.categories
    ?.map((c) => c.title)
    .filter(Boolean)
    .join(', ')

  const slides = buildSlides(collectProjectMedia(doc.thumbnail, doc.gallery), doc.title)
  const initialIndex =
    Number.isFinite(parsed) && parsed >= 0 ? Math.min(parsed, slides.length - 1) : 0

  return (
    <ProjectSlider
      title={doc.title}
      year={doc.year}
      categories={categories ?? ''}
      slides={slides}
      initialIndex={initialIndex}
      returnTo={returnTo}
    />
  )
}
