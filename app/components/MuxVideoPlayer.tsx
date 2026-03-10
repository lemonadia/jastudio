'use client'

import MuxPlayer from '@mux/mux-player-react'

interface MuxVideoPlayerProps {
  playbackId: string | null | undefined
  className?: string
  style?: React.CSSProperties
  poster?: string
  muted?: boolean
  autoPlay?: boolean
  loop?: boolean
  objectFit?: 'contain' | 'cover' | 'fill'
}

export default function MuxVideoPlayer({
  playbackId,
  className,
  style,
  poster,
  muted = true,
  autoPlay = true,
  loop = true,
  objectFit = 'cover',
}: MuxVideoPlayerProps) {
  if (!playbackId) return null

  const envKey = process.env.NEXT_PUBLIC_MUX_DATA_ENV_KEY

  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      {...(envKey ? { envKey } : {})}
      muted={muted}
      autoPlay={autoPlay}
      loop={loop}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ['--controls' as string]: 'none',
        ['--media-object-fit' as string]: 'cover',
        ['--media-object-position' as string]: 'center',
        ...style,
      }}
      poster={poster}
    />
  )
}
