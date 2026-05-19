import Link from 'next/link'
import type { CSSProperties } from 'react'
import { collectProjectImages, type ProjectImage } from '@/sanity/lib/projectImages'
import { urlForImage } from '@/sanity/lib/image'
import IndexThumb from './IndexThumb'
import './IndexList.css'

type IndexImage = ProjectImage

export type IndexProject = {
  _id: string
  title?: string | null
  slug?: string | null
  year?: number | null
  thumbnail?: {
    image?: IndexImage | null
  } | null
  gallery?: IndexImage[] | null
  categories?: { title?: string | null }[] | null
}

const FIRST_ROW_IMAGE_COUNT = 9

function renderImage(
  image: IndexImage,
  j: number,
  project: IndexProject,
  projectHref: string | null,
  eager = false,
) {
  const alt =
    (image.alt as string | undefined) || project.title || `Project image ${j + 1}`
  const url = urlForImage(image, { height: 480, quality: 88 })
  if (!url) return null

  const thumb = <IndexThumb src={url} alt={alt} eager={eager} />

  return projectHref ? (
    <Link
      key={`${project._id}-${j}`}
      href={`${projectHref}?i=${j}`}
      className="index-row__link"
    >
      {thumb}
    </Link>
  ) : (
    <div key={`${project._id}-${j}`}>{thumb}</div>
  )
}

function renderMeta(
  project: IndexProject,
  projectHref: string | null,
  categoryLabel: string,
) {
  return (
    <div className="index-row__meta">
      {project.title ? (
        projectHref ? (
          <Link href={projectHref} className="index-row__title">
            {project.title}
          </Link>
        ) : (
          <h2 className="index-row__title">{project.title}</h2>
        )
      ) : null}
      <div className="index-row__meta-row">
        {project.year ? <span>{project.year}</span> : null}
        {categoryLabel ? <span>{categoryLabel}</span> : null}
      </div>
    </div>
  )
}

export default function IndexList({ projects }: { projects: IndexProject[] }) {
  if (!projects.length) {
    return <p className="index-list__empty">No projects yet. Add them in Sanity Studio.</p>
  }

  return (
    <ul className="index-list">
      {projects.map((project, i) => {
        const images = collectProjectImages(project.thumbnail, project.gallery)
        const hasMoreThanNine = images.length > FIRST_ROW_IMAGE_COUNT
        const firstRowImages = hasMoreThanNine
          ? images.slice(0, FIRST_ROW_IMAGE_COUNT)
          : images
        const moreImages = hasMoreThanNine ? images.slice(FIRST_ROW_IMAGE_COUNT) : []
        const indexNumber = String(i + 1).padStart(2, '0')
        const categoryLabel = project.categories
          ?.map((c) => c.title)
          .filter(Boolean)
          .join(', ')
        const projectHref = project.slug ? `/project/${project.slug}` : null
        const meta = renderMeta(project, projectHref, categoryLabel ?? '')

        return (
          <li
            key={project._id}
            className="index-list__item"
            style={{ '--stagger': i } as CSSProperties}
          >
            <article className="index-row">
              <span className="index-row__index" aria-hidden="true">
                <span className="index-row__index-open">[</span>
                <span className="index-row__index-num">{indexNumber}</span>
                <span className="index-row__index-close">]</span>
              </span>

              {/* Desktop ≥1281px — osobny markup, limit 9 w pierwszym rzędzie */}
              <div className="index-row__desktop">
                {hasMoreThanNine ? (
                  <div className="index-desktop-split">
                    <div className="index-desktop-split__nine">
                      {firstRowImages.map((image, j) =>
                        renderImage(image, j, project, projectHref, i === 0 && j < 6),
                      )}
                    </div>
                    {meta}
                    <div className="index-desktop-split__more">
                      {moreImages.map((image, j) =>
                        renderImage(image, j + FIRST_ROW_IMAGE_COUNT, project, projectHref),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="index-desktop-inline">
                    {images.map((image, j) =>
                      renderImage(image, j, project, projectHref, i === 0 && j < 6),
                    )}
                    {meta}
                  </div>
                )}
              </div>

              {/* ≤1280px — osobny markup, zawsze to samo: wszystkie zdjęcia, potem meta */}
              <div className="index-row__mobile">
                <div className="index-mobile-gallery">
                  {images.map((image, j) =>
                    renderImage(image, j, project, projectHref, i === 0 && j < 6),
                  )}
                </div>
                {meta}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
