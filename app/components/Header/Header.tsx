import Link from 'next/link'
import './Header.css'

const navItems = [
  { label: 'Info', href: '/info' },
  { label: 'Index', href: '/index' },
] as const

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="header__logo">
        Jonathan Arundel Studio
      </Link>

        <nav className="header__nav" aria-label="Main">
        <ul className="header__nav-list">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="header__nav-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
