'use client'

import { useRef, useState } from 'react'

type Props = {
  src: string
  alt: string
  eager?: boolean
}

export default function IndexThumb({ src, alt, eager }: Props) {
  const [loaded, setLoaded] = useState(false)
  const handled = useRef(false)

  const markLoaded = () => {
    if (handled.current) return
    handled.current = true
    setLoaded(true)
  }

  return (
    <img
      ref={(node) => {
        if (node?.complete) markLoaded()
      }}
      className={`index-row__image${loaded ? ' index-row__image--loaded' : ''}`}
      src={src}
      alt={alt}
      draggable={false}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={markLoaded}
    />
  )
}
