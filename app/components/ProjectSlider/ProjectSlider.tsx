'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import './ProjectSlider.css'

export type SlideImage = {
  url: string
  alt: string
  width: number
  height: number
}

type Props = {
  title: string
  year?: number | null
  categories: string
  images: SlideImage[]
  initialIndex?: number
}

export default function ProjectSlider({
  title,
  year,
  categories,
  images,
  initialIndex = 0,
}: Props) {
  const router = useRouter()
  const [index, setIndex] = useState(() => {
    if (images.length === 0) return 0
    const safe = Number.isFinite(initialIndex) ? initialIndex : 0
    return Math.min(Math.max(0, safe), images.length - 1)
  })
  const total = images.length
  const current = images[index]

  const goNext = useCallback(() => {
    if (total < 2) return
    setIndex((i) => (i + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    if (total < 2) return
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (total < 2 || e.touches.length !== 1) return
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY }
    },
    [total],
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (total < 2) return
      const start = touchStartRef.current
      touchStartRef.current = null
      if (!start || e.changedTouches.length !== 1) return

      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      const minTravel = 40
      if (absDx < minTravel || absDx < absDy * 1.1) return

      if (dx < 0) goNext()
      else goPrev()
    },
    [total, goNext, goPrev],
  )

  const onTouchCancel = useCallback(() => {
    touchStartRef.current = null
  }, [])

  const handleBack = useCallback(() => {
    const ref = document.referrer
    let fromSameSite = false

    if (ref) {
      try {
        fromSameSite = new URL(ref).origin === window.location.origin
      } catch {
        /* ignore */
      }
    }

    if (fromSameSite || window.history.length > 2) {
      router.back()
      return
    }

    router.push('/')
  }, [router])

  return (
    <div className="project">
      <header className="project__meta">
        <div className="project__meta-main">
          <h1 className="project__title">{title}</h1>
          <div className="project__meta-row">
            {year ? <span className="project__year">{year}</span> : null}
            {categories ? <span className="project__category">{categories}</span> : null}
          </div>
        </div>

        <button type="button" className="project__back" onClick={handleBack}>
          Back
        </button>
      </header>

      <div
        className="project__stage"
        tabIndex={total > 1 ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') goPrev()
          if (e.key === 'ArrowRight') goNext()
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        {current ? (
          <img
            className="project__image"
            src={current.url}
            alt={current.alt}
            width={current.width}
            height={current.height}
            draggable={false}
          />
        ) : (
          <p className="project__empty">No images in gallery.</p>
        )}

        {total > 1 ? (
          <>
            <button
              type="button"
              className="project__nav project__nav--prev"
              onClick={goPrev}
              aria-label="Previous image"
            />
            <button
              type="button"
              className="project__nav project__nav--next"
              onClick={goNext}
              aria-label="Next image"
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
