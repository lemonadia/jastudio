import Link from 'next/link'
import './CategoryList.css'

export type CategoryItem = { slug: string; title: string }

function CategoryLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`category-list__link${active ? ' category-list__link--active' : ''}`}
    >
      <span className="category-list__bracket" aria-hidden="true">
        <span className="category-list__bracket-open">[</span>
        <span className="category-list__bracket-dot" />
        <span className="category-list__bracket-close">]</span>
      </span>
      {label}
    </Link>
  )
}

export default function CategoryList({
  categories,
  activeSlug,
}: {
  categories: CategoryItem[]
  activeSlug: string | null
}) {
  return (
    <div className="container">
      <nav className="category-list" aria-label="Categories">
        <ul className="category-list__items">
          <li>
            <CategoryLink href="/" label="All" active={activeSlug === null} />
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryLink
                href={`/${c.slug}`}
                label={c.title}
                active={activeSlug === c.slug}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
