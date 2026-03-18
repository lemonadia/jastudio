'use client'

import { useEffect, useMemo, useState } from 'react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import './cookieBanner.css'

type Consent = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

export type CookieBannerData = {
  title?: string | null
  body?: PortableTextBlock[] | null
} | null

const COOKIE_NAME = 'kc_cookie_consent'

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift() ?? null
  return null
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${oneYear}; Path=/; SameSite=Lax`
}

function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null
  try {
    const decoded = decodeURIComponent(raw)
    const json = JSON.parse(decoded) as Partial<Consent>
    if (json && typeof json === 'object') {
      return {
        necessary: true,
        analytics: !!json.analytics,
        marketing: !!json.marketing,
      }
    }
    return null
  } catch {
    return null
  }
}

export default function CookieBanner({ data }: { data: CookieBannerData }) {
  const labels = useMemo(() => {
    return {
      title: data?.title ?? 'Cookie preferences',
      manage: 'Learn more and manage',
      acceptAll: 'Accept',
      reject: 'Reject non-essential cookies',
      save: 'Save',
      necessary: 'Necessary',
      analytics: 'Analytics',
      marketing: 'Marketing',
    }
  }, [data?.title])

  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [consent, setConsent] = useState<Consent>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const existing = parseConsent(getCookie(COOKIE_NAME))
    if (existing) {
      setConsent(existing)
      setVisible(false)
      return
    }
    setVisible(true)
  }, [])

  if (!data) return null
  if (!visible) return null

  const acceptAll = () => {
    const next: Consent = { necessary: true, analytics: true, marketing: true }
    setConsent(next)
    setCookie(COOKIE_NAME, JSON.stringify(next))
    setVisible(false)
  }

  const rejectNonEssential = () => {
    const next: Consent = { necessary: true, analytics: false, marketing: false }
    setConsent(next)
    setCookie(COOKIE_NAME, JSON.stringify(next))
    setVisible(false)
  }

  const save = () => {
    setCookie(COOKIE_NAME, JSON.stringify(consent))
    setVisible(false)
  }

  return (
    <section className="cookie-banner" role="dialog" aria-label="Cookie banner">
      <div className="cookie-banner__inner">
        <h2 className="cookie-banner__title">{labels.title}</h2>

        <div className="cookie-banner__text">
          {data?.body?.length ? (
            <span className="cookie-banner__body">
              <PortableText value={data.body} />
            </span>
          ) : null}
          <button
            type="button"
            className="cookie-banner__manage"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {labels.manage}
          </button>
        </div>

        {open ? (
          <div className="cookie-banner__prefs" aria-label="Cookie preferences">
            <label className="cookie-banner__pref">
              <input type="checkbox" checked disabled />
              <span>{labels.necessary}</span>
            </label>
            <label className="cookie-banner__pref">
              <input
                type="checkbox"
                checked={consent.analytics}
                onChange={(e) =>
                  setConsent((c) => ({ ...c, analytics: e.target.checked, necessary: true }))
                }
              />
              <span>{labels.analytics}</span>
            </label>
            <label className="cookie-banner__pref">
              <input
                type="checkbox"
                checked={consent.marketing}
                onChange={(e) =>
                  setConsent((c) => ({ ...c, marketing: e.target.checked, necessary: true }))
                }
              />
              <span>{labels.marketing}</span>
            </label>

            <button type="button" className="cookie-banner__save" onClick={save}>
              {labels.save}
            </button>
          </div>
        ) : null}

        <div className="cookie-banner__actions">
          <button type="button" className="cookie-banner__accept" onClick={acceptAll}>
            {labels.acceptAll}
          </button>
          <button type="button" className="cookie-banner__reject" onClick={rejectNonEssential}>
            {labels.reject}
          </button>
        </div>
      </div>
    </section>
  )
}

