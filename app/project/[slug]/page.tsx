import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectSlider, { type SlideImage } from '@/app/components/ProjectSlider/ProjectSlider'
import { sanityFetch } from '@/sanity/lib/fetch'
import { projectBySlugQuery, projectSlugsQuery } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { collectProjectImages, type ProjectImage } from '@/sanity/lib/projectImages'
import { urlForImage } from '@/sanity/lib/image'

type GalleryImage = ProjectImage

type ProjectDoc = {
  title?: string | null
  slug?: string | null
  year?: number | null
  categories?: { title?: string | null }[] | null
  thumbnail?: {
    image?: GalleryImage | null
  } | null
  gallery?: GalleryImage[] | null
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

function buildSlides(gallery: GalleryImage[] | null | undefined, title: string): SlideImage[] {
  if (!gallery?.length) return []

  return gallery
    .map((img, i) => {
      const url = urlForImage(img, { height: 1600, quality: 82 })
      if (!url) return null
      const w = img.width && img.width > 0 ? img.width : 1200
      const h = img.height && img.height > 0 ? img.height : 800
      return {
        url,
        alt: (img.alt as string | undefined) || `${title} — ${i + 1}`,
        width: w,
        height: h,
      }
    })
    .filter((s): s is SlideImage => Boolean(s))
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ i?: string }>
}) {
  const { slug } = await params
  const { i } = await searchParams
  const parsed = i ? Number.parseInt(i, 10) : 0
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

  const images = buildSlides(
    collectProjectImages(doc.thumbnail, doc.gallery),
    doc.title,
  )
  const initialIndex =
    Number.isFinite(parsed) && parsed >= 0 ? Math.min(parsed, images.length - 1) : 0

  return (
    <ProjectSlider
      title={doc.title}
      year={doc.year}
      categories={categories ?? ''}
      images={images}
      initialIndex={initialIndex}
    />
  )
}
