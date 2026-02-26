import { sanityFetch } from '@/sanity/lib/fetch'
import { homePageQuery } from '@/sanity/lib/queries'
import HomePage from './components/HomePage'
import './components/fallback.css'

export default async function Home() {
  const home = await sanityFetch({ query: homePageQuery })

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
