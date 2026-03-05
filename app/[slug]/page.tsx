import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { pageQuery, pagePathsQuery } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'
import BlockRenderer from '../components/Blocks/BlockRenderer'
import { notFound } from 'next/navigation'

type PageData = {
  title?: string
  seoTitle?: string
  seoDescription?: string
  seoImage?: SanityImage | null
  blocks?: unknown[]
}

export const revalidate = 60

export async function generateStaticParams() {
  const pages = await client.fetch(pagePathsQuery)
  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const raw = await sanityFetch<PageData | null>({
    query: pageQuery,
    params: { slug },
  })
  if (!raw) return {}

  const page = raw as PageData
  const title = page.seoTitle || page.title
  const description = page.seoDescription || undefined
  const imageUrl = page.seoImage ? urlForImage(page.seoImage) : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description: description || undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: page.seoImage?.alt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await sanityFetch<PageData | null>({
    query: pageQuery,
    params: { slug },
  })

  if (!page) {
    notFound()
  }

  return (
    <main className={slug === 'about-us' ? 'page-about-us' : undefined}>
      {page.blocks && <BlockRenderer blocks={page.blocks} />}
    </main>
  )
}
