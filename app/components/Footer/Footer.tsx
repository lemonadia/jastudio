 'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './footer.css'

type FooterLink = {
  label?: string | null
  url?: string | null
}

interface FooterProps {
  links?: FooterLink[] | null
}

export default function Footer({ links }: FooterProps) {
  const pathname = usePathname()

  // Brak footera na homepage
  if (pathname === '/') return null

  if (!links || links.length === 0) return null

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__logo">
          <img
            src="/footer-logo.svg"
            alt=""
            className="footer__logo-img"
            aria-hidden="true"
          />
        </div>
        <div className="footer__copy">© The King’s Cow {new Date().getFullYear()}</div>
        <nav className="footer__nav" aria-label="Footer">
          {links.map((item, index) =>
            item?.url && item.label ? (
              <Link
                key={`${item.url}-${index}`}
                href={item.url}
                className="footer__link"
                target={item.url.startsWith('http') ? '_blank' : undefined}
                rel={item.url.startsWith('http') ? 'noreferrer' : undefined}
              >
                {item.label}
              </Link>
            ) : null,
          )}
        </nav>
      </div>
    </footer>
  )
}

