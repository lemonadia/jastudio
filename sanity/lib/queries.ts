import { groq } from "next-sanity"

// Home page (singleton)
export const homePageQuery = groq`*[_type == "homePage"][0]{
  image,
  "video": video.asset->{
    playbackId,
    assetId,
    status
  },
  "videoMobile": videoMobile.asset->{
    playbackId,
    assetId,
    status
  },
  text,
  logo,
  seoTitle,
  seoDescription,
  seoImage
}`

// Page by slug (blocks + SEO)
export const pageQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  seoTitle,
  seoDescription,
  seoImage,
  blocks[]{
    _type,
    _type == "textImage" => {
      title,
      text,
      smallText,
      imagePosition,
      media[]{
        image,
        "video": video.asset->{
          playbackId,
          assetId,
          status
        }
      },
      links[]{
        label,
        linkType,
        url,
        "slug": internalRef->slug.current
      }
    },
    _type == "textBlock" => {
      heading,
      body,
      links[]{
        label,
        linkType,
        url,
        email,
        "slug": internalRef->slug.current,
        "fileUrl": file.asset->url
      },
      alignment
    },
    _type == "gallery" => {
      items[]{
        "imageURL": image.asset->url,
        "alt": image.alt,
        "video": video.asset->{
          playbackId,
          assetId,
          status
        }
      }
    }
  }
}`

export const pagePathsQuery = groq`*[_type == "page" && defined(slug.current)][]{
  "slug": slug.current
}`

// Navigation (singleton)
export const navigationQuery = groq`*[_type == "navigation"][0]{
  leftLinks[]{
    label,
    "slug": page->slug.current,
    "title": page->title
  },
  rightLinks[]{
    label,
    url
  },
  mobileText
}`

// Footer (singleton)
export const footerQuery = groq`*[_type == "footer"][0]{
  links[]{
    label,
    url
  }
}`

// Cookie banner (singleton)
export const cookieBannerQuery = groq`*[_type == "cookieBanner"][0]{
  title,
  body
}`
