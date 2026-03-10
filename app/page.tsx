import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { homePageQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import HomePage from './components/HomePage'
import type { Image as SanityImage } from 'sanity'
import type { PortableTextBlock } from '@portabletext/types'
import './components/fallback.css'

type MuxVideo = {
  playbackId?: string | null
  status?: string
}

type HomePageData = {
  image?: SanityImage | null
  video?: MuxVideo | null
  videoMobile?: MuxVideo | null
  text?: PortableTextBlock[]
  logo?: SanityImage | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoImage?: SanityImage | null
} | null

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch<HomePageData>({ query: homePageQuery })
  if (!home) return {}
  const title = home.seoTitle || undefined
  const description = home.seoDescription || undefined
  const imageUrl = home.seoImage ? urlForImage(home.seoImage) : undefined
  return {
    title,
    description,
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: (home.seoImage?.alt as string | undefined) ?? undefined }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? undefined,
      description: description ?? undefined,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function Home() {
  const home = await sanityFetch<HomePageData>({ query: homePageQuery })

  const hasMedia =
    home?.image || (home?.video?.playbackId && home?.video?.status === 'ready')

  if (!hasMedia) {
    return (
      <main className="fallback">
        <div className="fallback__inner">
          <h1 className="fallback__title">No home page</h1>
          <p className="fallback__text">
            Create a &quot;Home Page&quot; in Sanity Studio and add an image or video.
          </p>
        </div>
      </main>
    )
  }

  return (
    <HomePage
      image={home.image}
      video={home.video}
      videoMobile={home.videoMobile}
      text={home.text}
      logo={home.logo}
    />
  )
}
