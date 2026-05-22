'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { Image as SanityImageSource } from 'sanity'
import { urlForImage } from '@/sanity/lib/image'

type Props = {
  image: SanityImageSource
  alt: string
  width?: number | null
  height?: number | null
  sizes?: string
  priority?: boolean
}

export default function ProjectCardImage({
  image,
  alt,
  width,
  height,
  sizes = '100vw',
  priority,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const handled = useRef(false)

  const src = urlForImage(image)
  if (!src) return null

  const w = width && width > 0 ? width : 1200
  const h = height && height > 0 ? height : 800

  const markLoaded = () => {
    if (handled.current) return
    handled.current = true
    setLoaded(true)
  }

  return (
    <Image
      ref={(node) => {
        if (node?.complete) markLoaded()
      }}
      className={loaded ? 'project-card__media--loaded' : undefined}
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      style={{ display: 'block' }}
      onLoad={markLoaded}
    />
  )
}
