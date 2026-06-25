import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryList, { type CategoryItem } from '@/app/components/CategoryList/CategoryList'
import FadeIn from '@/app/components/FadeIn/FadeIn'
import Header from '@/app/components/Header/Header'
import ProjectList, { type ProjectListItem } from '@/app/components/ProjectList/ProjectList'
import TextPage from '@/app/components/TextPage/TextPage'
import { metadataFromSeo, type SeoData } from '@/app/lib/metadata'
import { sanityFetch } from '@/sanity/lib/fetch'
import {
  categoriesQuery,
  categoryBySlugQuery,
  projectsByCategorySlugQuery,
  textPageBySlugQuery,
} from '@/sanity/lib/queries'

export const revalidate = 60

type CategoryDoc = {
  title?: string | null
  seo?: SeoData
} | null

type TextPageDoc = {
  title?: string | null
  body?: string | null
  seo?: SeoData
} | null

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const [category, textPage] = await Promise.all([
      sanityFetch<CategoryDoc>({ query: categoryBySlugQuery, params: { slug } }),
      sanityFetch<TextPageDoc>({ query: textPageBySlugQuery, params: { slug } }),
    ])

    if (category?.title) {
      return metadataFromSeo(category.seo, { title: category.title })
    }

    if (textPage?.title) {
      return metadataFromSeo(textPage.seo, {
        title: textPage.title,
        description: textPage.body,
      })
    }
  } catch {
    /* ignore */
  }

  return {}
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [category, textPage, categoriesRaw, projects] = await Promise.all([
    sanityFetch<CategoryDoc & { _id?: string }>({
      query: categoryBySlugQuery,
      params: { slug },
    }).catch(() => null),
    sanityFetch<TextPageDoc>({
      query: textPageBySlugQuery,
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

  if (category?._id) {
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
              <ProjectList projects={projects} returnTo={`/${slug}`} />
            </FadeIn>
          </section>
        </div>
      </main>
    )
  }

  if (textPage?.title) {
    return (
      <main className="page">
        <Header />
        <FadeIn>
          <TextPage page={textPage} />
        </FadeIn>
      </main>
    )
  }

  notFound()
}
