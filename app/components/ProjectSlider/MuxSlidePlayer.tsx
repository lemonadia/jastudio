'use client'

import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'
import { useCallback, useEffect, useRef, useState } from 'react'
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

export default function MuxSlidePlayer({ playbackId, title }: Props) {
  const playerRef = useRef<MuxPlayerElement>(null)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    setMuted(true)
    setProgress(0)
    setDuration(0)
    setCurrentTime(0)
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

  if (!playbackId) return null

  return (
    <div className="project__video">
      <MuxPlayer
        ref={playerRef}
        key={playbackId}
        className="project__mux-player"
        playbackId={playbackId}
        title={title}
        streamType="on-demand"
        autoPlay="muted"
        muted={muted}
        playsInline
        preload="auto"
        accentColor="#000000"
        nohotkeys
      />

      <div className="project__video-controls">
        <button
          type="button"
          className="project__video-mute"
          onClick={(e) => {
            e.stopPropagation()
            toggleMute()
          }}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          aria-pressed={!muted}
        >
          {muted ? <IconMuted /> : <IconUnmuted />}
        </button>

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
      </div>
    </div>
  )
}

function IconMuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 5.5h2L7 3v8L4 8.5H2V5.5z" stroke="currentColor" strokeWidth="1" />
      <path d="M9.5 5l3 2-3 2M9.5 9l3-2-3-2" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function IconUnmuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 5.5h2L7 3v8L4 8.5H2V5.5z" stroke="currentColor" strokeWidth="1" />
      <path d="M9 4.5c1.2.9 2 2.2 2 3.5s-.8 2.6-2 3.5M10.5 6.5c.6.5 1 1.2 1 2s-.4 1.5-1 2" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
