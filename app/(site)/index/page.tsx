import Header from '@/app/components/Header/Header'
import IndexList, { type IndexProject } from '@/app/components/IndexList/IndexList'
import { sanityFetch } from '@/sanity/lib/fetch'
import { indexProjectsQuery } from '@/sanity/lib/queries'

export const revalidate = 60

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
      <IndexList projects={projects} />
    </main>
  )
}
