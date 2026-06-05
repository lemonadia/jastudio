import './Info.css'

export type InfoData = {
  body?: string | null
  contactHeading?: string | null
  contactText?: string | null
  instagramHeading?: string | null
  instagramName?: string | null
  instagramLink?: string | null
  downloadHeading?: string | null
  downloadUrl?: string | null
}

function normalizeInstagramHandle(raw: string): string {
  return raw.trim().replace(/^@+/, '')
}

/** Visible label: prefer name field; else derive @user from a profile URL. */
function instagramDisplayLabel(
  instagramName?: string | null,
  instagramLink?: string | null,
): string | null {
  const name = instagramName?.trim()
  if (name) return name.startsWith('@') ? name : `@${name}`

  const link = instagramLink?.trim()
  if (!link) return null
  try {
    const u = new URL(link)
    if (!u.hostname.replace(/^www\./, '').includes('instagram.com')) return link
    const seg = u.pathname.replace(/\/$/, '').split('/').filter(Boolean)[0]
    if (seg && !['p', 'reel', 'reels', 'stories', 'explore'].includes(seg.toLowerCase())) {
      return `@${seg}`
    }
  } catch {
    /* ignore */
  }
  return link
}

/** What gets copied: explicit URL, or canonical profile URL from name. */
function instagramCopyValue(
  instagramName?: string | null,
  instagramLink?: string | null,
): string | null {
  const link = instagramLink?.trim()
  if (link) return link
  const handle = instagramName ? normalizeInstagramHandle(instagramName) : ''
  if (handle) return `https://www.instagram.com/${handle}/`
  return null
}

export default function Info({ info }: { info: InfoData | null }) {
  if (!info) {
    return (
      <div className="container info">
        <p className="info__empty">Add content in Sanity Studio → Info.</p>
      </div>
    )
  }

  const {
    body,
    contactHeading,
    contactText,
    instagramHeading,
    instagramName,
    instagramLink,
    downloadHeading,
    downloadUrl,
  } = info

  return (
    <div className="container info">
      {body ? <p className="info__body">{body}</p> : null}

      {contactHeading || contactText ? (
        <section className="info__section">
          {contactHeading ? <h2 className="info__heading">{contactHeading}</h2> : null}
          {contactText ? (
            <a href={`mailto:${contactText.trim()}`} className="info__link info__text">
              {contactText}
            </a>
          ) : null}
        </section>
      ) : null}

      {instagramHeading || instagramName || instagramLink ? (
        <section className="info__section">
          {instagramHeading ? <h2 className="info__heading">{instagramHeading}</h2> : null}
          {(() => {
            const label = instagramDisplayLabel(instagramName, instagramLink)
            const href = instagramCopyValue(instagramName, instagramLink)
            if (!label || !href) return null
            return (
              <a
                href={href}
                className="info__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            )
          })()}
        </section>
      ) : null}

      {downloadHeading || downloadUrl ? (
        <section className="info__section">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              className="info__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {downloadHeading?.trim() || 'Download'}
            </a>
          ) : downloadHeading ? (
            <p className="info__heading">{downloadHeading}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
