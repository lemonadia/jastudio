import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { randomFadeDelays } from '@/app/lib/randomStagger'
import ProjectCardImage from '@/app/components/ProjectList/ProjectCardImage'
import LoopingMuxVideo from '@/app/components/LoopingMuxVideo/LoopingMuxVideo'
import { categoryTitlesForTiles } from '@/sanity/lib/categoriesForTiles'
import { isSanityImageAsset } from '@/sanity/lib/image'
import {
  muxPlaybackIdFromVideo,
  muxThumbnailPreviewClip,
  type ProjectThumbSize,
} from '@/sanity/lib/mux'
import type { ProjectThumbnail } from '@/sanity/lib/projectMedia'
import './ProjectList.css'

export type ProjectListItem = {
  _id: string
  title?: string | null
  slug?: string | null
  year?: number | null
  thumbnail?: ProjectThumbnail | null
  categories?: { title?: string | null; slug?: string | null }[] | null
}

function isVideoThumbnail(thumbnail?: ProjectThumbnail | null): boolean {
  if (thumbnail?.mediaType === 'video') return true
  if (thumbnail?.mediaType === 'image') return false
  return Boolean(muxPlaybackIdFromVideo(thumbnail?.video))
}

export default function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  if (!projects.length) {
    return <p className="project-list__empty">No projects yet. Add them in Sanity Studio.</p>
  }

  const fadeDelays = randomFadeDelays(projects.length)

  return (
    <ul className="project-list">
      {projects.map((project, i) => (
        <li
          key={project._id}
          className={`project-list__item${
            project.thumbnail?.size === 'big' ? ' project-list__item--big' : ''
          }`}
          style={{ '--fade-delay': `${fadeDelays[i] ?? 0}ms` } as CSSProperties}
        >
          <ProjectRow project={project} priority={i < 4} />
        </li>
      ))}
    </ul>
  )
}

function ProjectRow({ project, priority }: { project: ProjectListItem; priority?: boolean }) {
  const size = project.thumbnail?.size ?? 'medium'
  const thumbnail = project.thumbnail
  const alt = project.title || 'Project thumbnail'
  const categoryLabel = categoryTitlesForTiles(project.categories)

  const sizes =
    size === 'big' ? '(max-width: 768px) 44vw, 18vw' : '(max-width: 768px) 32vw, 12vw'

  let thumbContent: ReactNode

  if (isVideoThumbnail(thumbnail)) {
    const playbackId = muxPlaybackIdFromVideo(thumbnail?.video)
    const clip = muxThumbnailPreviewClip(thumbnail)
    thumbContent = playbackId ? (
      <LoopingMuxVideo
        playbackId={playbackId}
        size={size as ProjectThumbSize}
        variant="card"
        priority={priority}
        assetStartTime={clip.assetStartTime}
        assetEndTime={clip.assetEndTime}
      />
    ) : (
      <div className="project-card__thumb-placeholder">No thumbnail</div>
    )
  } else {
    const image = thumbnail?.image
    const hasImage = isSanityImageAsset(image ?? undefined)

    thumbContent = hasImage ? (
      <ProjectCardImage
        image={image}
        alt={(image?.alt as string | undefined) || alt}
        width={image?.width}
        height={image?.height}
        sizes={sizes}
        priority={priority}
      />
    ) : (
      <div className="project-card__thumb-placeholder">No thumbnail</div>
    )
  }

  const thumb = (
    <div className={`project-card__thumb project-card__thumb--${size}`}>{thumbContent}</div>
  )

  return (
    <article className="project-card">
      {project.slug ? (
        <Link href={`/project/${project.slug}`} className="project-card__link">
          {thumb}
        </Link>
      ) : (
        thumb
      )}
      <div className="project-card__meta">
        {project.title ? <h2 className="project-card__title">{project.title}</h2> : null}
        <div className="project-card__meta-inner">
          {project.year ? <span className="project-card__year">{project.year}</span> : null}
          {categoryLabel ? <span className="project-card__category">{categoryLabel}</span> : null}
        </div>
      </div>
    </article>
  )
}
