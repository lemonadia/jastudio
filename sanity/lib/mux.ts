export type ProjectThumbSize = 'big' | 'medium' | 'small'

/** Domyślna długość pętli na liście projektów (pełne wideo jest na /project/…). */
export const DEFAULT_THUMB_PREVIEW_DURATION = 6

export type ThumbnailPreviewClip = {
  assetStartTime: number
  assetEndTime: number
}

export function muxThumbnailPreviewClip(
  thumbnail?: {
    previewStart?: number | null
    previewDuration?: number | null
  } | null,
): ThumbnailPreviewClip {
  const start =
    typeof thumbnail?.previewStart === 'number' && thumbnail.previewStart >= 0
      ? thumbnail.previewStart
      : 0
  const duration =
    typeof thumbnail?.previewDuration === 'number' && thumbnail.previewDuration > 0
      ? thumbnail.previewDuration
      : DEFAULT_THUMB_PREVIEW_DURATION

  return {
    assetStartTime: start,
    assetEndTime: start + duration,
  }
}

/** Wymiary jak w CSS (4/5 big & medium, 1/1 small) — Mux przycina kadr pod cover. */
const THUMB_CROP: Record<ProjectThumbSize, { width: number; height: number }> = {
  big: { width: 520, height: 650 },
  medium: { width: 352, height: 440 },
  small: { width: 352, height: 352 },
}

export function muxThumbnailUrl(
  playbackId: string,
  options?: {
    size?: ProjectThumbSize
    width?: number
    height?: number
    time?: number
  },
): string {
  const time = options?.time ?? 0
  const dims = options?.size
    ? THUMB_CROP[options.size]
    : {
        width: options?.width ?? 640,
        height: options?.height ?? Math.round((options?.width ?? 640) * 1.25),
      }

  const params = new URLSearchParams({
    width: String(dims.width),
    height: String(dims.height),
    fit_mode: 'crop',
    time: String(time),
  })

  return `https://image.mux.com/${playbackId}/thumbnail.jpg?${params}`
}

export function muxMp4Url(playbackId: string, rendition: 'low' | 'medium' = 'low'): string {
  return `https://stream.mux.com/${playbackId}/${rendition}.mp4`
}

export function muxPlaybackIdFromVideo(
  video?: {
    playbackId?: string | null
    asset?: { playbackId?: string | null } | null
  } | null,
): string | null {
  const id = video?.playbackId ?? video?.asset?.playbackId
  return typeof id === 'string' && id.length > 0 ? id : null
}

export function muxThumbTimeFromVideo(
  video?: {
    asset?: { thumbTime?: number | null } | null
  } | null,
): number {
  const t = video?.asset?.thumbTime
  return typeof t === 'number' && Number.isFinite(t) ? t : 0
}
