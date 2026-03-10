import { sanityFetch } from '@/sanity/lib/fetch'
import { homePageQuery } from '@/sanity/lib/queries'
import HomePage from './components/HomePage'
import type { Image as SanityImage } from 'sanity'
import type { PortableTextBlock } from '@portabletext/types'
import './components/fallback.css'

type HomePageData = {
  image?: SanityImage | null
  text?: PortableTextBlock[]
  logo?: SanityImage | null
} | null

export default async function Home() {
  const home = await sanityFetch<HomePageData>({ query: homePageQuery })

  if (!home?.image) {
    return (
      <main className="fallback">
        <div className="fallback__inner">
          <h1 className="fallback__title">No home page</h1>
          <p className="fallback__text">
            Create a &quot;Home Page&quot; in Sanity Studio and add an image.
          </p>
        </div>
      </main>
    )
  }

  return (
    <HomePage
      image={home.image}
      text={home.text}
      logo={home.logo}
    />
  )
}
