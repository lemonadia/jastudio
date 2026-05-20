'use client'

import dynamic from 'next/dynamic'
import type { ProjectThumbSize } from '@/sanity/lib/mux'
import './LoopingMuxVideo.css'

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

type Props = {
  playbackId: string
  size?: ProjectThumbSize
  variant?: 'card' | 'index'
  className?: string
  priority?: boolean
  /** Krótszy fragment (Mux instant clip) — tylko miniatury na liście */
  assetStartTime?: number
  assetEndTime?: number
}

export default function LoopingMuxVideo({
  playbackId,
  variant = 'card',
  className = '',
  assetStartTime,
  assetEndTime,
}: Props) {
  if (!playbackId) return null

  const clip =
    typeof assetStartTime === 'number' &&
    typeof assetEndTime === 'number' &&
    assetEndTime > assetStartTime

  return (
    <MuxPlayer
      className={`ui-mux-loop ui-mux-loop--${variant}${className ? ` ${className}` : ''}`}
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay="muted"
      muted
      loop
      playsInline
      thumbnailTime={clip ? assetStartTime : 0}
      assetStartTime={clip ? assetStartTime : undefined}
      assetEndTime={clip ? assetEndTime : undefined}
      preload="auto"
      nohotkeys
      aria-hidden
    />
  )
}
