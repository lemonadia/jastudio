import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

function hasAssetRef(source: Image | undefined): boolean {
  const asset = source?.asset
  if (!asset || typeof asset !== 'object') return false
  if ('_ref' in asset && typeof asset._ref === 'string') return asset._ref.length > 0
  if ('_id' in asset && typeof asset._id === 'string') return asset._id.length > 0
  return false
}

export type ImageUrlOptions = {
  width?: number
  height?: number
  quality?: number
}

export const urlForImage = (source: Image | undefined, options?: ImageUrlOptions) => {
  if (!hasAssetRef(source)) return undefined

  let builder = imageBuilder
    .image(source!)
    .fit('max')
    .auto('format')
    .quality(options?.quality ?? 80)

  if (options?.width) builder = builder.width(options.width)
  if (options?.height) builder = builder.height(options.height)

  return builder.url()
}
