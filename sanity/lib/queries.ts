import { groq } from 'next-sanity'

export const settingsQuery = groq`*[_type == "settings"][0]{ siteTitle }`

export const infoQuery = groq`*[_type == "info"][0]{
  body,
  contactHeading,
  contactText,
  instagramHeading,
  instagramName,
  instagramLink,
  downloadHeading,
  "downloadUrl": downloadFile.asset->url,
  "downloadFilename": downloadFile.asset->originalFilename
}`

export const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`

export const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current
}`

export const allProjectsQuery = groq`*[_type == "project"] | order(orderRank asc, year desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  thumbnail {
    size,
    image {
      alt,
      hotspot,
      crop,
      asset,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`

export const projectsByCategorySlugQuery = groq`*[_type == "project" && $slug in categories[]->slug.current] | order(orderRank asc, year desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  thumbnail {
    size,
    image {
      alt,
      hotspot,
      crop,
      asset,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`

export const indexProjectsQuery = groq`*[_type == "project"] | order(orderRank asc, year desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  thumbnail {
    image {
      alt,
      hotspot,
      crop,
      asset,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  gallery[]{
    alt,
    hotspot,
    crop,
    asset,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
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
    image {
      alt,
      hotspot,
      crop,
      asset,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  gallery[]{
    alt,
    hotspot,
    crop,
    asset,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`
