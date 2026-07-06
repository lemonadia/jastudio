import { groq } from 'next-sanity'

const projectThumbnailFields = groq`
  size,
  mediaType,
  previewStart,
  previewDuration,
  image {
    alt,
    hotspot,
    crop,
    asset,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  video {
    ...,
    "playbackId": asset->playbackId,
    asset-> {
      playbackId,
      assetId,
      filename,
      thumbTime
    }
  }
`

const projectGalleryFields = groq`
  _type,
  _key,
  alt,
  hotspot,
  crop,
  asset,
  "width": select(_type in ["image", "galleryImage"] => asset->metadata.dimensions.width),
  "height": select(_type in ["image", "galleryImage"] => asset->metadata.dimensions.height),
  "playbackId": select(_type in ["mux.video", "galleryVideo"] => asset->playbackId),
  "videoAssetId": select(_type in ["mux.video", "galleryVideo"] => asset->assetId)
`

const seoFields = groq`
  seo {
    title,
    description,
    image {
      asset,
      hotspot,
      crop
    }
  }
`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  ${seoFields}
}`

export const infoQuery = groq`*[_type == "info"][0]{
  body,
  contactHeading,
  contactText,
  instagramHeading,
  instagramName,
  instagramLink,
  downloadHeading,
  "downloadUrl": downloadLink,
  ${seoFields}
}`

export const textPageBySlugQuery = groq`*[_type == "textPage" && slug.current == $slug][0]{
  title,
  body,
  "slug": slug.current,
  ${seoFields}
}`

export const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`

export const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  ${seoFields}
}`

export const allProjectsQuery = groq`*[_type == "project"] | order(orderRank asc, year desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  thumbnail {
    ${projectThumbnailFields}
  },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`

export const projectsByCategorySlugQuery = groq`*[_type == "project" && $slug in categories[]->slug.current] | order(orderRank asc, year desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  thumbnail {
    ${projectThumbnailFields}
  },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`

export const indexProjectsQuery = groq`*[_type == "project"] | order(orderRank asc, year desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  thumbnail {
    ${projectThumbnailFields}
  },
  gallery[]{
    ${projectGalleryFields}
  },
  "categories": categories[]->{ title, "slug": slug.current }
}`

export const projectSlugsQuery = groq`*[_type == "project" && defined(slug.current)][]{
  "slug": slug.current
}`

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  year,
  categories[]->{ title, "slug": slug.current },
  thumbnail {
    ${projectThumbnailFields}
  },
  gallery[]{
    ${projectGalleryFields}
  },
  ${seoFields}
}`
