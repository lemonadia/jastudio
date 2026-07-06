import type { Metadata } from 'next'
import CabinAnalytics from '@/app/components/CabinAnalytics/CabinAnalytics'
import Footer from '@/app/components/Footer/Footer'
import { metadataFromSeo, type SeoData } from '@/app/lib/metadata'
import { sanityFetch } from '@/sanity/lib/fetch'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import './globals.css'

const DEFAULT_TITLE = 'Jonathan Arundel Studio'
const DEFAULT_DESCRIPTION = 'Photography portfolio'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await sanityFetch<{ seo?: SeoData } | null>({ query: siteSettingsQuery })
    return {
      metadataBase: new URL('https://www.jonathanarundel.studio'),
      ...metadataFromSeo(site?.seo, {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
      }),
    }
  } catch {
    return {
      metadataBase: new URL('https://www.jonathanarundel.studio'),
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CabinAnalytics />
        {children}
        <Footer />
      </body>
    </html>
  )
}
