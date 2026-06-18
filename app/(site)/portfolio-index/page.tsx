import Header from '@/app/components/Header/Header'
import IndexList, { type IndexProject } from '@/app/components/IndexList/IndexList'
import { sanityFetch } from '@/sanity/lib/fetch'
import { indexProjectsQuery } from '@/sanity/lib/queries'

export const revalidate = 60

/**
 * Real URL is `/portfolio-index` (stable route segment).
 * Browser URL `/index` is handled by middleware rewrite — see middleware.ts.
 * Avoid naming an app route folder `index`; Next can treat it like `/` and
 * serve `app/page.tsx` instead on some builds (Linux / Vercel).
 */
export default async function IndexPage() {
  let projects: IndexProject[] = []

  try {
    projects = await sanityFetch<IndexProject[]>({ query: indexProjectsQuery })
  } catch {
    /* ignore */
  }

  return (
    <main className="page">
      <Header />
      <IndexList projects={projects} returnTo="/index" />
    </main>
  )
}
