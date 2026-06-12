import Link from 'next/link'
import type { CSSProperties } from 'react'
import { randomFadeDelays } from '@/app/lib/randomStagger'
import LoopingMuxVideo from '@/app/components/LoopingMuxVideo/LoopingMuxVideo'
import { categoryTitlesForTiles } from '@/sanity/lib/categoriesForTiles'
import { urlForImage } from '@/sanity/lib/image'
import {
  collectProjectMedia,
  type GalleryItem,
  type ProjectMediaItem,
  type ProjectThumbnail,
} from '@/sanity/lib/projectMedia'
import IndexThumb from './IndexThumb'
import './IndexList.css'

export type IndexProject = {
  _id: string
  title?: string | null
  slug?: string | null
  year?: number | null
  thumbnail?: ProjectThumbnail | null
  gallery?: GalleryItem[] | null
  categories?: { title?: string | null; slug?: string | null }[] | null
}

const FIRST_ROW_IMAGE_COUNT = 9

function renderMedia(
  item: ProjectMediaItem,
  j: number,
  project: IndexProject,
  projectHref: string | null,
  fadeDelayMs: number,
  eager = false,
) {
  const alt =
    item.kind === 'image'
      ? (item.image.alt as string | undefined) || project.title || `Project image ${j + 1}`
      : item.alt || project.title || `Project video ${j + 1}`

  const thumb =
    item.kind === 'video' ? (
      <span className="index-row__video-wrap">
        <LoopingMuxVideo playbackId={item.playbackId} variant="index" priority={eager} />
      </span>
    ) : (
      (() => {
        const url = urlForImage(item.image, { height: 480, quality: 88 })
        if (!url) return null
        return <IndexThumb src={url} alt={alt} eager={eager} />
      })()
    )

  if (!thumb) return null

  const fadeStyle = { '--fade-delay': `${fadeDelayMs}ms` } as CSSProperties

  return projectHref ? (
    <Link
      key={`${project._id}-${j}`}
      href={`${projectHref}?i=${j}`}
      className="index-row__link"
      style={fadeStyle}
    >
      {thumb}
    </Link>
  ) : (
    <div key={`${project._id}-${j}`} className="index-row__link" style={fadeStyle}>
      {thumb}
    </div>
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

  const mediaCount = projects.reduce(
    (n, p) => n + collectProjectMedia(p.thumbnail, p.gallery).length,
    0,
  )
  const fadeDelays = randomFadeDelays(mediaCount, 28)
  let fadeSlot = 0

  return (
    <ul className="index-list">
      {projects.map((project, i) => {
        const media = collectProjectMedia(project.thumbnail, project.gallery)
        const hasMoreThanNine = media.length > FIRST_ROW_IMAGE_COUNT
        const firstRowMedia = hasMoreThanNine
          ? media.slice(0, FIRST_ROW_IMAGE_COUNT)
          : media
        const moreMedia = hasMoreThanNine ? media.slice(FIRST_ROW_IMAGE_COUNT) : []
        const indexNumber = String(i + 1).padStart(2, '0')
        const categoryLabel = categoryTitlesForTiles(project.categories)
        const projectHref = project.slug ? `/project/${project.slug}` : null
        const meta = renderMeta(project, projectHref, categoryLabel ?? '')
        const projectFadeDelays = media.map((_, j) => fadeDelays[fadeSlot + j] ?? 0)
        fadeSlot += media.length

        const renderWithDelay = (item: ProjectMediaItem, j: number, eager: boolean) =>
          renderMedia(item, j, project, projectHref, projectFadeDelays[j] ?? 0, eager)

        return (
          <li key={project._id} className="index-list__item">
            <article className="index-row">
              <span className="index-row__index" aria-hidden="true">
                <span className="index-row__index-open">[</span>
                <span className="index-row__index-num">{indexNumber}</span>
                <span className="index-row__index-close">]</span>
              </span>

              <div className="index-row__desktop">
                {hasMoreThanNine ? (
                  <div className="index-desktop-split">
                    <div className="index-desktop-split__nine">
                      {firstRowMedia.map((item, j) =>
                        renderWithDelay(item, j, i === 0 && j < 6),
                      )}
                    </div>
                    {meta}
                    <div className="index-desktop-split__more">
                      {moreMedia.map((item, j) =>
                        renderWithDelay(item, j + FIRST_ROW_IMAGE_COUNT, false),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="index-desktop-inline">
                    {media.map((item, j) => renderWithDelay(item, j, i === 0 && j < 6))}
                    {meta}
                  </div>
                )}
              </div>

              <div className="index-row__mobile">
                <div className="index-mobile-gallery">
                  {media.map((item, j) => renderWithDelay(item, j, i === 0 && j < 6))}
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
