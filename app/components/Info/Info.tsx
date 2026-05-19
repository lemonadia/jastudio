import CopyText from './CopyText'
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
  downloadFilename?: string | null
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
    downloadFilename,
  } = info

  return (
    <div className="container info">
      {body ? <p className="info__body">{body}</p> : null}

      {contactHeading || contactText ? (
        <section className="info__section">
          {contactHeading ? <h2 className="info__heading">{contactHeading}</h2> : null}
          {contactText ? (
            <CopyText value={contactText} className="info__text">
              {contactText}
            </CopyText>
          ) : null}
        </section>
      ) : null}

      {instagramHeading || instagramName || instagramLink ? (
        <section className="info__section">
          {instagramHeading ? <h2 className="info__heading">{instagramHeading}</h2> : null}
          {(() => {
            const label = instagramDisplayLabel(instagramName, instagramLink)
            const copyValue = instagramCopyValue(instagramName, instagramLink)
            if (!label || !copyValue) return null
            return (
              <CopyText value={copyValue} className="info__link">
                {label}
              </CopyText>
            )
          })()}
        </section>
      ) : null}

      {downloadHeading || downloadUrl ? (
        <section className="info__section">
          {downloadHeading ? <h2 className="info__heading">{downloadHeading}</h2> : null}
          {downloadUrl ? (
            <a href={downloadUrl} className="info__link" download={downloadFilename ?? true}>
              {downloadFilename ?? 'Download'}
            </a>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
