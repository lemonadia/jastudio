import { sanityFetch } from '@/sanity/lib/fetch'
import { allProjectsQuery, categoriesQuery } from '@/sanity/lib/queries'
import CategoryList, { type CategoryItem } from '@/app/components/CategoryList/CategoryList'
import Header from '@/app/components/Header/Header'
import ProjectList, { type ProjectListItem } from '@/app/components/ProjectList/ProjectList'

export const revalidate = 60

export default async function Home() {
  let categoriesRaw: { slug?: string | null; title?: string | null }[] = []
  let projects: ProjectListItem[] = []

  try {
    categoriesRaw = await sanityFetch<typeof categoriesRaw>({ query: categoriesQuery })
  } catch {
    /* ignore */
  }

  try {
    projects = await sanityFetch<ProjectListItem[]>({ query: allProjectsQuery })
  } catch {
    /* ignore */
  }

  const categories: CategoryItem[] = categoriesRaw
    .filter((c): c is CategoryItem => Boolean(c.slug && c.title))
    .map((c) => ({ slug: c.slug as string, title: c.title as string }))

  return (
    <main className="page">
      <Header />

      <div className="home">
        <section className="page__categories">
          <CategoryList categories={categories} activeSlug={null} />
        </section>

        <section className="page__projects">
          <ProjectList projects={projects} returnTo="/" />
        </section>
      </div>

    </main>
  )
}
