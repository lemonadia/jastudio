import type { Image as SanityImageSource } from 'sanity'
import { isSanityImageAsset } from './image'
import { muxPlaybackIdFromVideo } from './mux'

const GALLERY_VIDEO_TYPES = new Set(['mux.video', 'galleryVideo'])
const GALLERY_IMAGE_TYPES = new Set(['image', 'galleryImage'])

export type ProjectImage = SanityImageSource & {
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type MuxVideoValue = {
  _type?: 'mux.video'
  playbackId?: string | null
  asset?: {
    playbackId?: string | null
    assetId?: string | null
    filename?: string | null
  } | null
}

export type ProjectThumbnail = {
  size?: 'big' | 'medium' | 'small' | null
  mediaType?: 'image' | 'video' | null
  image?: ProjectImage | null
  video?: MuxVideoValue | null
  /** Sekundy — tylko podgląd na liście projektów */
  previewStart?: number | null
  previewDuration?: number | null
}

export type GalleryItem =
  | (ProjectImage & { _type?: 'image'; _key?: string; playbackId?: null })
  | (MuxVideoValue & { _key?: string; playbackId?: string | null })

export type ProjectMediaItem =
  | {
      kind: 'image'
      key: string
      image: ProjectImage
    }
  | {
      kind: 'video'
      key: string
      playbackId: string
      alt?: string
    }

function imageAssetKey(image: ProjectImage | null | undefined): string | null {
  if (!isSanityImageAsset(image ?? undefined)) return null
  const asset = image?.asset
  if (!asset || typeof asset !== 'object') return null
  if ('_ref' in asset && typeof asset._ref === 'string' && asset._ref) return asset._ref
  if ('_id' in asset && typeof asset._id === 'string' && asset._id) return asset._id
  return null
}

function isGalleryVideoEntry(entry: GalleryItem): boolean {
  const type = entry._type
  if (type && GALLERY_VIDEO_TYPES.has(type)) return true
  if (type && GALLERY_IMAGE_TYPES.has(type)) return false

  const playbackId =
    muxPlaybackIdFromVideo(entry as MuxVideoValue) ??
    (typeof (entry as MuxVideoValue).playbackId === 'string'
      ? (entry as MuxVideoValue).playbackId
      : null)
  if (playbackId) return true

  const asset = (entry as ProjectImage).asset
  if (!asset || typeof asset !== 'object') return false
  const ref =
    '_ref' in asset && typeof asset._ref === 'string'
      ? asset._ref
      : '_id' in asset && typeof asset._id === 'string'
        ? asset._id
        : null
  return Boolean(ref && !ref.startsWith('image-'))
}

function isThumbnailVideo(thumbnail?: ProjectThumbnail | null): boolean {
  if (thumbnail?.mediaType === 'video') return true
  if (thumbnail?.mediaType === 'image') return false
  return Boolean(muxPlaybackIdFromVideo(thumbnail?.video))
}

export function collectProjectMedia(
  thumbnail?: ProjectThumbnail | null,
  gallery?: GalleryItem[] | null,
): ProjectMediaItem[] {
  const items: ProjectMediaItem[] = []
  const seenImages = new Set<string>()
  const seenVideos = new Set<string>()

  if (thumbnail) {
    if (isThumbnailVideo(thumbnail)) {
      const playbackId = muxPlaybackIdFromVideo(thumbnail.video)
      if (playbackId && !seenVideos.has(playbackId)) {
        seenVideos.add(playbackId)
        items.push({
          kind: 'video',
          key: 'thumb-video',
          playbackId,
          alt: 'Project video',
        })
      }
    } else {
      const image = thumbnail.image
      const key = imageAssetKey(image)
      if (image && key && !seenImages.has(key)) {
        seenImages.add(key)
        items.push({ kind: 'image', key: 'thumb-image', image })
      }
    }
  }

  for (const entry of gallery ?? []) {
    const entryKey = entry._key ?? ''

    if (isGalleryVideoEntry(entry)) {
      const videoEntry = entry as MuxVideoValue
      const playbackId =
        muxPlaybackIdFromVideo(videoEntry) ??
        (typeof videoEntry.playbackId === 'string' ? videoEntry.playbackId : null)
      if (!playbackId || seenVideos.has(playbackId)) continue
      seenVideos.add(playbackId)
      items.push({
        kind: 'video',
        key: entryKey || `video-${playbackId}`,
        playbackId,
        alt: 'Project video',
      })
      continue
    }

    const image = entry as ProjectImage
    const key = imageAssetKey(image)
    if (!key || seenImages.has(key)) continue
    seenImages.add(key)
    items.push({
      kind: 'image',
      key: entryKey || `image-${key}`,
      image,
    })
  }

  return items
}
