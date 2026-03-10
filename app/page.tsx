import { sanityFetch } from '@/sanity/lib/fetch'
import { homePageQuery } from '@/sanity/lib/queries'
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
  text?: PortableTextBlock[]
  logo?: SanityImage | null
} | null

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
      text={home.text}
      logo={home.logo}
    />
  )
}
