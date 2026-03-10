import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'
import MuxVideoPlayer from '../MuxVideoPlayer'
import './blocks.css'

interface MuxVideo {
  playbackId?: string | null
  status?: string
}

interface MediaItem {
  image?: SanityImage | null
  video?: MuxVideo | null
}

interface LinkItem {
  label: string
  linkType: 'url' | 'internal'
  url?: string
  slug?: string | null
}

interface TextImageProps {
  title?: string
  text?: string
  smallText?: string
  media?: { image?: SanityImage | null; video?: MuxVideo | null }[]
  imagePosition: 'left' | 'right'
  links?: LinkItem[]
}

export default function TextImage({
  title,
  text,
  smallText,
  media = [],
  imagePosition,
  links = [],
}: TextImageProps) {
  const isLeft = imagePosition === 'left'
  const count = media?.length ?? 0
  const linkList = links ?? []
  const mediaMod =
    count === 1
      ? 'text-image__media--single'
      : count === 2
        ? 'text-image__media--double'
        : 'text-image__media--triple'
  const itemWrapClass =
    count === 1
      ? 'text-image__grid-item'
      : count === 2
        ? 'text-image__grid-item cover-wrap cover-wrap--square'
        : 'text-image__grid-item cover-wrap cover-wrap--454x366'

  return (
    <section className="text-image">
      <div className="text-image__inner container">
        <div className={`text-image__row ${isLeft ? '' : 'text-image__row--reverse'}`}>
          {isLeft ? (
            <>
              <div className={`text-image__media ${mediaMod}`}>
                {media?.map((item, index) => (
                  <div key={index} className={itemWrapClass}>
                    {item?.video?.playbackId && item?.video?.status === 'ready' ? (
                      <MuxVideoPlayer
                        playbackId={item.video.playbackId}
                        objectFit="cover"
                      />
                    ) : item?.image && urlForImage(item.image) ? (
                      <Image
                        src={urlForImage(item.image)!}
                        alt={typeof item.image.alt === 'string' ? item.image.alt : ''}
                        width={600}
                        height={400}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="text-image__body">
                {title && <h2 className="text-image__title">{title}</h2>}
                {text && <p className="text-image__text">{text}</p>}
                {smallText && (
                  <p className="text-image__text text-image__text--small">{smallText}</p>
                )}
                {linkList.length > 0 && (
                  <div className="text-image__links">
                    {linkList.map((link, i) => {
                      const href =
                        link.linkType === 'internal' && link.slug
                          ? `/${link.slug}`
                          : link.url || '#'
                      const isExternal =
                        link.linkType === 'url' && href.startsWith('http')
                      return isExternal ? (
                        <a
                          key={i}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-image__link"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={i}
                          href={href}
                          className="text-image__link"
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-image__body">
                {title && <h2 className="text-image__title">{title}</h2>}
                {text && <p className="text-image__text">{text}</p>}
                {smallText && (
                  <p className="text-image__text text-image__text--small">{smallText}</p>
                )}
                {linkList.length > 0 && (
                  <div className="text-image__links">
                    {linkList.map((link, i) => {
                      const href =
                        link.linkType === 'internal' && link.slug
                          ? `/${link.slug}`
                          : link.url || '#'
                      const isExternal =
                        link.linkType === 'url' && href.startsWith('http')
                      return isExternal ? (
                        <a
                          key={i}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-image__link"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={i}
                          href={href}
                          className="text-image__link"
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className={`text-image__media ${mediaMod}`}>
                {media?.map((item, index) => (
                  <div key={index} className={itemWrapClass}>
                    {item?.video?.playbackId && item?.video?.status === 'ready' ? (
                      <MuxVideoPlayer
                        playbackId={item.video.playbackId}
                        objectFit="cover"
                      />
                    ) : item?.image && urlForImage(item.image) ? (
                      <Image
                        src={urlForImage(item.image)!}
                        alt={typeof item.image.alt === 'string' ? item.image.alt : ''}
                        width={600}
                        height={400}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
