import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

function assetRef(source: Image | undefined): string | null {
  const asset = source?.asset
  if (!asset || typeof asset !== 'object') return null
  if ('_ref' in asset && typeof asset._ref === 'string' && asset._ref) return asset._ref
  if ('_id' in asset && typeof asset._id === 'string' && asset._id) return asset._id
  return null
}

export function isSanityImageAsset(source: Image | undefined): boolean {
  const ref = assetRef(source)
  return Boolean(ref?.startsWith('image-'))
}

export type ImageUrlOptions = {
  width?: number
  height?: number
  quality?: number
}

export const urlForImage = (source: Image | undefined, options?: ImageUrlOptions) => {
  if (!isSanityImageAsset(source)) return undefined

  let builder = imageBuilder
    .image(source!)
    .fit('max')
    .auto('format')
    .quality(options?.quality ?? 80)

  if (options?.width) builder = builder.width(options.width)
  if (options?.height) builder = builder.height(options.height)

  return builder.url()
}
