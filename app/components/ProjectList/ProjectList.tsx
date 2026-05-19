import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Image as SanityImageSource } from 'sanity'
import CmsImage from '@/app/components/CmsImage/CmsImage'
import './ProjectList.css'

export type ProjectListItem = {
  _id: string
  title?: string | null
  slug?: string | null
  year?: number | null
  thumbnail?: {
    size?: 'big' | 'medium' | 'small' | null
    image?: (SanityImageSource & { width?: number | null; height?: number | null }) | null
  } | null
  categories?: { title?: string | null; slug?: string | null }[] | null
}

export default function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  if (!projects.length) {
    return <p className="project-list__empty">No projects yet. Add them in Sanity Studio.</p>
  }

  return (
    <ul className="project-list">
      {projects.map((project, i) => (
        <li
          key={project._id}
          className={`project-list__item${
            project.thumbnail?.size === 'big' ? ' project-list__item--big' : ''
          }`}
          style={{ '--stagger': i } as CSSProperties}
        >
          <ProjectRow project={project} priority={i < 4} />
        </li>
      ))}
    </ul>
  )
}

function ProjectRow({ project, priority }: { project: ProjectListItem; priority?: boolean }) {
  const size = project.thumbnail?.size ?? 'medium'
  const image = project.thumbnail?.image
  const alt = (image?.alt as string | undefined) || project.title || 'Project thumbnail'
  const hasImage = Boolean(
    image?.asset &&
      typeof image.asset === 'object' &&
      (('_ref' in image.asset && image.asset._ref) ||
        ('_id' in image.asset && (image.asset as { _id?: string })._id)),
  )
  const categoryLabel = project.categories
    ?.map((c) => c.title)
    .filter(Boolean)
    .join(', ')

  const thumb = (
    <div className={`project-card__thumb project-card__thumb--${size}`}>
      {hasImage ? (
        <CmsImage
          image={image}
          alt={alt}
          width={image?.width}
          height={image?.height}
          sizes={
            size === 'big'
              ? '(max-width: 768px) 44vw, 18vw'
              : '(max-width: 768px) 32vw, 12vw'
          }
          priority={priority}
        />
      ) : (
        <div className="project-card__thumb-placeholder">No thumbnail</div>
      )}
    </div>
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
