import Link from 'next/link'
import type { CSSProperties } from 'react'
import { topDownRandomGroupFadeDelays } from '@/app/lib/randomStagger'
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

function chunkMedia<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function projectHrefFor(
  slug: string,
  options?: { returnTo?: string; imageIndex?: number },
): string {
  const params = new URLSearchParams()
  if (options?.returnTo) params.set('from', options.returnTo)
  if (options?.imageIndex !== undefined) params.set('i', String(options.imageIndex))
  const qs = params.toString()
  return `/project/${slug}${qs ? `?${qs}` : ''}`
}

function renderMedia(
  item: ProjectMediaItem,
  j: number,
  project: IndexProject,
  projectHref: string | null,
  returnTo: string | undefined,
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
      href={projectHrefFor(project.slug as string, { returnTo, imageIndex: j })}
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

export default function IndexList({
  projects,
  returnTo,
}: {
  projects: IndexProject[]
  returnTo?: string
}) {
  if (!projects.length) {
    return <p className="index-list__empty">No projects yet. Add them in Sanity Studio.</p>
  }

  const groupSizes = projects.map(
    (p) => collectProjectMedia(p.thumbnail, p.gallery).length,
  )
  const fadeDelays = topDownRandomGroupFadeDelays(groupSizes, 36, 65)
  let fadeSlot = 0

  return (
    <ul className="index-list">
      {projects.map((project, i) => {
        const media = collectProjectMedia(project.thumbnail, project.gallery)
        const imageRows = chunkMedia(media, FIRST_ROW_IMAGE_COUNT)
        const hasMultipleRows = imageRows.length > 1
        const indexNumber = String(i + 1).padStart(2, '0')
        const categoryLabel = categoryTitlesForTiles(project.categories)
        const projectHref = project.slug
          ? projectHrefFor(project.slug, { returnTo })
          : null
        const meta = renderMeta(project, projectHref, categoryLabel ?? '')
        const projectFadeDelays = media.map((_, j) => fadeDelays[fadeSlot + j] ?? 0)
        fadeSlot += media.length

        const renderWithDelay = (item: ProjectMediaItem, j: number, eager: boolean) =>
          renderMedia(item, j, project, projectHref, returnTo, projectFadeDelays[j] ?? 0, eager)

        return (
          <li key={project._id} className="index-list__item">
            <article className="index-row">
              <span className="index-row__index" aria-hidden="true">
                <span className="index-row__index-open">[</span>
                <span className="index-row__index-num">{indexNumber}</span>
                <span className="index-row__index-close">]</span>
              </span>

              <div className="index-row__desktop">
                {hasMultipleRows ? (
                  <div className="index-desktop-split">
                    <div className="index-desktop-split__nine">
                      {imageRows[0].map((item, j) =>
                        renderWithDelay(item, j, i === 0 && j < 6),
                      )}
                    </div>
                    {meta}
                    {imageRows.slice(1).map((row, rowIndex) => (
                      <div key={rowIndex} className="index-desktop-split__more">
                        {row.map((item, j) => {
                          const globalIndex = (rowIndex + 1) * FIRST_ROW_IMAGE_COUNT + j
                          return renderWithDelay(item, globalIndex, false)
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="index-desktop-inline">
                    {media.map((item, j) => renderWithDelay(item, j, i === 0 && j < 6))}
                    {meta}
                  </div>
                )}
              </div>

              <div className="index-row__mobile">
                {imageRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="index-mobile-gallery">
                    {row.map((item, j) => {
                      const globalIndex = rowIndex * FIRST_ROW_IMAGE_COUNT + j
                      return renderWithDelay(item, globalIndex, i === 0 && globalIndex < 6)
                    })}
                  </div>
                ))}
                {meta}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
