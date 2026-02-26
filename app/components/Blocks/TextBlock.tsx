import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import './blocks.css'

interface LinkItem {
  label: string
  linkType: 'url' | 'internal' | 'email' | 'file'
  url?: string
  email?: string
  slug?: string | null
  fileUrl?: string
}

interface TextBlockProps {
  heading?: string
  body?: PortableTextBlock[]
  links?: LinkItem[]
  alignment?: 'center' | 'right'
}

export default function TextBlock({
  heading,
  body,
  links,
  alignment = 'center',
}: TextBlockProps) {
  const alignmentMod = alignment ? `text-block--${alignment}` : 'text-block--center'
  return (
    <section className={`text-block ${alignmentMod}`}>
      <div className="text-block__inner container">
        {heading && <h2 className="text-block__heading">{heading}</h2>}
        {body && body.length > 0 && (
          <div className="text-block__body">
            <PortableText value={body} />
          </div>
        )}
        {links && links.length > 0 && (
          <div className="text-block__links">
            {links.map((link, index) => {
              const href =
                link.linkType === 'file' && link.fileUrl
                  ? link.fileUrl
                  : link.linkType === 'email' && link.email
                    ? `mailto:${link.email}`
                    : link.linkType === 'internal' && link.slug
                      ? `/${link.slug}`
                      : link.url || '#'
              const isExternal = link.linkType === 'file' || (link.linkType === 'url' && href.startsWith('http'))
              if (link.linkType === 'internal' && link.slug) {
                return (
                  <Link
                    key={index}
                    href={`/${link.slug}`}
                    className="text-block__link"
                  >
                    {link.label}
                  </Link>
                )
              }
              return (
                <a
                  key={index}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-block__link"
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
