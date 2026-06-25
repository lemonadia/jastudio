import type { Metadata } from 'next'
import FadeIn from '@/app/components/FadeIn/FadeIn'
import Info, { type InfoData } from '@/app/components/Info/Info'
import Header from '@/app/components/Header/Header'
import { metadataFromSeo, type SeoData } from '@/app/lib/metadata'
import { sanityFetch } from '@/sanity/lib/fetch'
import { infoQuery } from '@/sanity/lib/queries'

export const revalidate = 60

type InfoDoc = InfoData & { seo?: SeoData }

export async function generateMetadata(): Promise<Metadata> {
  try {
    const info = await sanityFetch<InfoDoc | null>({ query: infoQuery })
    return metadataFromSeo(info?.seo, {
      title: 'Info',
      description: info?.body ?? undefined,
    })
  } catch {
    return { title: 'Info' }
  }
}

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
      <FadeIn>
        <Info info={info} />
      </FadeIn>
    </main>
  )
}
