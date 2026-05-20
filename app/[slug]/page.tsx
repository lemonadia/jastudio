import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/fetch'
import {
  categoriesQuery,
  categoryBySlugQuery,
  projectsByCategorySlugQuery,
} from '@/sanity/lib/queries'
import CategoryList, { type CategoryItem } from '@/app/components/CategoryList/CategoryList'
import FadeIn from '@/app/components/FadeIn/FadeIn'
import Header from '@/app/components/Header/Header'
import ProjectList, { type ProjectListItem } from '@/app/components/ProjectList/ProjectList'

export const revalidate = 60

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [category, categoriesRaw, projects] = await Promise.all([
    sanityFetch<{ title?: string | null } | null>({
      query: categoryBySlugQuery,
      params: { slug },
    }).catch(() => null),
    sanityFetch<{ slug?: string | null; title?: string | null }[]>({
      query: categoriesQuery,
    }).catch(() => []),
    sanityFetch<ProjectListItem[]>({
      query: projectsByCategorySlugQuery,
      params: { slug },
    }).catch(() => []),
  ])

  if (!category) {
    notFound()
  }

  const categories: CategoryItem[] = categoriesRaw
    .filter((c): c is CategoryItem => Boolean(c.slug && c.title))
    .map((c) => ({ slug: c.slug as string, title: c.title as string }))

  return (
    <main className="page">
      <Header />

      <div className="home">
        <section className="page__categories">
          <CategoryList categories={categories} activeSlug={slug} />
        </section>

        <section className="page__projects">
          <FadeIn>
            <ProjectList projects={projects} />
          </FadeIn>
        </section>
      </div>

    </main>
  )
}
