import type { Image as SanityImageSource } from 'sanity'

export type ProjectImage = SanityImageSource & {
  alt?: string | null
  width?: number | null
  height?: number | null
}

function assetKey(image: ProjectImage | null | undefined): string | null {
  const asset = image?.asset
  if (!asset || typeof asset !== 'object') return null
  if ('_ref' in asset && typeof asset._ref === 'string' && asset._ref) return asset._ref
  if ('_id' in asset && typeof asset._id === 'string' && asset._id) return asset._id
  return null
}

export function collectProjectImages(
  thumbnail?: { image?: ProjectImage | null } | null,
  gallery?: ProjectImage[] | null,
): ProjectImage[] {
  const images: ProjectImage[] = []
  const seen = new Set<string>()

  const thumb = thumbnail?.image
  const thumbKey = assetKey(thumb)
  if (thumb && thumbKey) {
    seen.add(thumbKey)
    images.push(thumb)
  }

  for (const image of gallery ?? []) {
    const key = assetKey(image)
    if (!key || seen.has(key)) continue
    seen.add(key)
    images.push(image)
  }

  return images
}
