import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlForImage } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'
import type { PortableTextBlock } from '@portabletext/types'
import './home-page.css'

interface HomePageProps {
  image?: SanityImage | null
  text?: PortableTextBlock[]
  logo?: SanityImage | null
}

export default function HomePage({ image, text, logo }: HomePageProps) {
  const imageUrl = image && urlForImage(image)

  return (
    <main className="home-page">
      {imageUrl && (
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
        {logo && urlForImage(logo) && (
          <div className="home-page__logo">
            <Image
              src={urlForImage(logo)!}
              alt={logo.alt as string || 'Logo'}
              width={280}
              height={120}
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
