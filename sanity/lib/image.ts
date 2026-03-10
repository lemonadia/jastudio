import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (
  source: Image | undefined,
  options?: { skipWebp?: boolean }
) => {
  if (!source?.asset) return undefined
  const builder = imageBuilder?.image(source).fit('max')
  return (options?.skipWebp ? builder : builder?.format('webp'))?.url()
}
