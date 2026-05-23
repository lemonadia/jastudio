'use client'

import { usePathname } from 'next/navigation'
import './Footer.css'

export default function Footer() {
  const pathname = usePathname()
  const year = new Date().getFullYear()

  if (pathname?.startsWith('/project/')) {
    return null
  }

  return (
    <footer className="footer">
      <span className="footer__copy">© Jonathan Arundel Studio {year}</span>
      <a
        href="https://ok-deploy.live"
        className="footer__credit"
        target="_blank"
        rel="noopener noreferrer"
      >
        site by ok deploy
      </a>
    </footer>
  )
}
