'use client'

import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'
import { useCallback, useEffect, useRef, useState } from 'react'
import { muxGalleryPosterUrl } from '@/sanity/lib/mux'
import './MuxSlidePlayer.css'

type Props = {
  playbackId: string
  title: string
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const CONTROLS_HIDE_MS = 2800

export default function MuxSlidePlayer({ playbackId, title }: Props) {
  const playerRef = useRef<MuxPlayerElement>(null)
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  /** Po metadanych trzymaj aspect wideo — wcześniej rozmiar daje poster (jak zdjęcie w slajderze). */
  const [videoDims, setVideoDims] = useState<{ w: number; h: number } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [coarseTouch, setCoarseTouch] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)')
    const update = () => setCoarseTouch(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const scheduleHideControls = useCallback(() => {
    if (coarseTouch) return
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false)
      hideControlsTimeoutRef.current = null
    }, CONTROLS_HIDE_MS)
  }, [coarseTouch])

  const revealControls = useCallback(() => {
    if (coarseTouch) return
    setControlsVisible(true)
    scheduleHideControls()
  }, [scheduleHideControls, coarseTouch])

  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setMuted(true)
    setProgress(0)
    setDuration(0)
    setCurrentTime(0)
    setVideoDims(null)
    setIsPlaying(false)
  }, [playbackId])

  useEffect(() => {
    const el = playerRef.current
    if (!el) return

    const syncTime = () => {
      const d = el.duration
      const t = el.currentTime
      if (Number.isFinite(d) && d > 0) {
        setDuration(d)
        setCurrentTime(t)
        setProgress(t / d)
      }
    }

    el.addEventListener('timeupdate', syncTime)
    el.addEventListener('loadedmetadata', syncTime)
    el.addEventListener('durationchange', syncTime)

    return () => {
      el.removeEventListener('timeupdate', syncTime)
      el.removeEventListener('loadedmetadata', syncTime)
      el.removeEventListener('durationchange', syncTime)
    }
  }, [playbackId])

  const toggleMute = useCallback(() => {
    const el = playerRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }, [])

  const seekToRatio = useCallback(
    (ratio: number) => {
      const el = playerRef.current
      if (!el || !duration) return
      const next = Math.min(1, Math.max(0, ratio)) * duration
      el.currentTime = next
      setCurrentTime(next)
      setProgress(next / duration)
    },
    [duration],
  )

  const onProgressPointer = useCallback(
    (clientX: number, target: HTMLDivElement) => {
      const rect = target.getBoundingClientRect()
      if (rect.width <= 0) return
      seekToRatio((clientX - rect.left) / rect.width)
    },
    [seekToRatio],
  )

  const readVideoDims = useCallback((el: MuxPlayerElement) => {
    if (el.videoWidth > 0 && el.videoHeight > 0) {
      return { w: el.videoWidth, h: el.videoHeight }
    }
    const media = el.media
    if (media && media.videoWidth > 0 && media.videoHeight > 0) {
      return { w: media.videoWidth, h: media.videoHeight }
    }
    return null
  }, [])

  const ensurePlaying = useCallback(() => {
    const el = playerRef.current
    if (!el) return
    if (el.muted !== muted) el.muted = muted
    void el.play().catch(() => {})
  }, [muted])

  const syncFromPlayer = useCallback(
    (el: MuxPlayerElement) => {
      const d = el.duration
      const t = el.currentTime
      if (Number.isFinite(d) && d > 0) {
        setDuration(d)
        setCurrentTime(t)
        setProgress(t / d)
      }
      const dims = readVideoDims(el)
      if (dims) setVideoDims(dims)
    },
    [readVideoDims],
  )

  const onMuxLoadedMetadata = useCallback(
    (e: Event) => {
      const el = e.currentTarget as MuxPlayerElement
      syncFromPlayer(el)
      ensurePlaying()
    },
    [ensurePlaying, syncFromPlayer],
  )

  const onMuxPlaying = useCallback(
    (e: Event) => {
      const el = e.currentTarget as MuxPlayerElement
      setIsPlaying(true)
      syncFromPlayer(el)
    },
    [syncFromPlayer],
  )

  useEffect(() => {
    if (!coarseTouch) return
    ensurePlaying()
    const retry = window.setInterval(ensurePlaying, 600)
    const stop = window.setTimeout(() => window.clearInterval(retry), 8000)
    return () => {
      window.clearInterval(retry)
      window.clearTimeout(stop)
    }
  }, [coarseTouch, playbackId, ensurePlaying])

  useEffect(() => {
    if (!videoDims && !isPlaying) return
    ensurePlaying()
  }, [videoDims, isPlaying, playbackId, ensurePlaying])

  const hideControlsOnLeave = useCallback(() => {
    if (coarseTouch) return
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
      hideControlsTimeoutRef.current = null
    }
    setControlsVisible(false)
  }, [coarseTouch])

  if (!playbackId) return null

  const playerInFlow = coarseTouch || Boolean(videoDims)
  const showLayoutPoster = !coarseTouch && !videoDims

  return (
    <div
      className={`project__video${coarseTouch ? ' project__video--touch' : controlsVisible ? ' project__video--controls-visible' : ''}`}
    >
      <div
        className="project__video-frame"
        {...(coarseTouch
          ? {
              onPointerDown: (e) => {
                if ((e.target as HTMLElement).closest('.project__video-controls')) return
                ensurePlaying()
              },
            }
          : {
              onPointerMove: revealControls,
              onPointerEnter: revealControls,
              onPointerDown: revealControls,
              onPointerLeave: hideControlsOnLeave,
            })}
      >
        <MuxPlayer
          ref={playerRef}
          key={playbackId}
          className={`project__mux-player${playerInFlow ? ' project__mux-player--in-flow' : ' project__mux-player--preload'}`}
          playbackId={playbackId}
          title={title}
          poster={coarseTouch ? undefined : muxGalleryPosterUrl(playbackId)}
          streamType="on-demand"
          autoPlay="muted"
          muted={muted}
          loop
          playsInline
          preload="auto"
          accentColor="#000000"
          nohotkeys
          onLoadedMetadata={onMuxLoadedMetadata}
          onCanPlay={ensurePlaying}
          onPlaying={onMuxPlaying}
        />

        {showLayoutPoster ? (
          <img
            className="project__video-poster"
            src={muxGalleryPosterUrl(playbackId)}
            alt=""
            decoding="async"
            draggable={false}
            aria-hidden
          />
        ) : null}
      </div>

      <div className="project__video-controls">
        <div className="project__video-controls-inner">
        <div
          className="project__video-progress"
          role="slider"
          aria-label="Playback position"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          tabIndex={0}
          onClick={(e) => onProgressPointer(e.clientX, e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') seekToRatio(progress - 0.05)
            if (e.key === 'ArrowRight') seekToRatio(progress + 0.05)
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            revealControls()
            if (e.button !== 0) return
            const track = e.currentTarget
            onProgressPointer(e.clientX, track)

            const onMove = (ev: PointerEvent) => onProgressPointer(ev.clientX, track)
            const onUp = () => {
              window.removeEventListener('pointermove', onMove)
              window.removeEventListener('pointerup', onUp)
            }
            window.addEventListener('pointermove', onMove)
            window.addEventListener('pointerup', onUp)
          }}
        >
          <div className="project__video-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>

        <button
          type="button"
          className="project__video-mute"
          onClick={(e) => {
            e.stopPropagation()
            toggleMute()
            revealControls()
          }}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          aria-pressed={!muted}
        >
          {muted ? <IconMuted /> : <IconUnmuted />}
        </button>
        </div>
      </div>
    </div>
  )
}

function IconMuted() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" aria-hidden>
      <path d="M8 12.8008L3.2002 9.60059H0V3.2002H3.2002L8 0V12.8008Z" fill="currentColor" />
      <path d="M10 3.90039L15 8.90039" stroke="currentColor" />
      <path d="M10 8.90039L15 3.90039" stroke="currentColor" />
    </svg>
  )
}

function IconUnmuted() {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" aria-hidden>
      <path d="M8 12.8008L3.2002 9.60059H0V3.2002H3.2002L8 0V12.8008Z" fill="currentColor" />
      <path d="M11 3.40039V9.40039" stroke="currentColor" />
      <path d="M14 2.40039V10.4004" stroke="currentColor" />
    </svg>
  )
}
