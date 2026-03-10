import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlForImage } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'
import type { PortableTextBlock } from '@portabletext/types'
import MuxVideoPlayer from './MuxVideoPlayer'
import './home-page.css'

interface MuxVideo {
  playbackId?: string | null
  status?: string
}

interface HomePageProps {
  image?: SanityImage | null
  video?: MuxVideo | null
  videoMobile?: MuxVideo | null
  text?: PortableTextBlock[]
  logo?: SanityImage | null
}

export default function HomePage({ image, video, videoMobile, text, logo }: HomePageProps) {
  const imageUrl = image && urlForImage(image)
  const hasVideo = video?.playbackId && video?.status === 'ready'
  const hasVideoMobile = videoMobile?.playbackId && videoMobile?.status === 'ready'
  const mobilePlaybackId = hasVideoMobile ? videoMobile!.playbackId! : video?.playbackId

  return (
    <main className="home-page">
      {hasVideo && video.playbackId && (
        <>
          <div className="home-page__bg home-page__bg--video home-page__bg--video-desktop">
            <MuxVideoPlayer
              playbackId={video.playbackId}
              muted
              autoPlay
              loop
              objectFit="cover"
            />
          </div>
          <div className="home-page__bg home-page__bg--video home-page__bg--video-mobile">
            <MuxVideoPlayer
              playbackId={mobilePlaybackId!}
              muted
              autoPlay
              loop
              objectFit="cover"
            />
          </div>
        </>
      )}
      {!hasVideo && imageUrl && (
        <div className="home-page__bg">
          <Image
            src={imageUrl}
            alt={(image!.alt as string) || 'Home page'}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div className="home-page__content">
        {logo && urlForImage(logo, { skipWebp: true }) && (
          <div className="home-page__logo">
            <Image
              src={urlForImage(logo, { skipWebp: true })!}
              alt={logo.alt as string || 'Logo'}
              width={280}
              height={120}
              sizes="140px"
              quality={95}
              priority
            />
          </div>
        )}
        {text && text.length > 0 && (
          <div className="home-page__text">
            <PortableText value={text} />
          </div>
        )}
      </div>
    </main>
  )
}
