import Info, { type InfoData } from '@/app/components/Info/Info'
import Header from '@/app/components/Header/Header'
import { sanityFetch } from '@/sanity/lib/fetch'
import { infoQuery } from '@/sanity/lib/queries'

export const revalidate = 60

export default async function InfoPage() {
  let info: InfoData | null = null

  try {
    info = await sanityFetch<InfoData | null>({ query: infoQuery })
  } catch {
    /* ignore */
  }

  return (
    <main className="page">
      <Header />
      <Info info={info} />
    </main>
  )
}
