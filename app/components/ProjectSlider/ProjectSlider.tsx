'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import './ProjectSlider.css'

const MuxSlidePlayer = dynamic(() => import('./MuxSlidePlayer'), { ssr: false })

export type SlideImage = {
  type: 'image'
  url: string
  alt: string
  width: number
  height: number
}

export type SlideVideo = {
  type: 'video'
  playbackId: string
  alt: string
}

export type Slide = SlideImage | SlideVideo

type Props = {
  title: string
  year?: number | null
  categories: string
  slides: Slide[]
  initialIndex?: number
  returnTo?: string | null
}

export default function ProjectSlider({
  title,
  year,
  categories,
  slides,
  initialIndex = 0,
  returnTo = null,
}: Props) {
  const router = useRouter()
  const [enterFade, setEnterFade] = useState(true)
  const [index, setIndex] = useState(() => {
    if (slides.length === 0) return 0
    const safe = Number.isFinite(initialIndex) ? initialIndex : 0
    return Math.min(Math.max(0, safe), slides.length - 1)
  })
  const total = slides.length
  const current = slides[index]

  const dismissEnterFade = useCallback(() => {
    setEnterFade(false)
  }, [])

  useEffect(() => {
    if (!enterFade) return
    const t = window.setTimeout(dismissEnterFade, 700)
    return () => window.clearTimeout(t)
  }, [enterFade, dismissEnterFade])

  const goNext = useCallback(() => {
    if (total < 2) return
    dismissEnterFade()
    setIndex((i) => (i + 1) % total)
  }, [total, dismissEnterFade])

  const goPrev = useCallback(() => {
    if (total < 2) return
    dismissEnterFade()
    setIndex((i) => (i - 1 + total) % total)
  }, [total, dismissEnterFade])

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
    if (window.history.length > 1) {
      router.back()
      return
    }

    if (returnTo) {
      router.push(returnTo)
      return
    }

    router.push('/')
  }, [router, returnTo])

  return (
    <div className={`project${enterFade ? ' project--enter' : ''}`}>
      <header className="project__meta">
        <div className="project__meta-main">
          <h1 className="project__title">{title}</h1>
          {year ? <span className="project__year">{year}</span> : null}
          {categories ? <span className="project__category">{categories}</span> : null}
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
        {current?.type === 'image' ? (
          <img
            className="project__image"
            src={current.url}
            alt={current.alt}
            width={current.width}
            height={current.height}
            draggable={false}
          />
        ) : null}

        {current?.type === 'video' ? (
          <MuxSlidePlayer key={current.playbackId} playbackId={current.playbackId} title={current.alt} />
        ) : null}

        {!current ? <p className="project__empty">No media in gallery.</p> : null}

        {total > 1 ? (
          <>
            <button
              type="button"
              className="project__nav project__nav--prev"
              onClick={goPrev}
              aria-label="Previous"
            />
            <button
              type="button"
              className="project__nav project__nav--next"
              onClick={goNext}
              aria-label="Next"
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
