/**
 * Kategorie z tymi slugami są w CMS i w nawigacji filtrów (/[slug]),
 * ale nie pokazujemy ich obok roku na kafelkach (strona główna, /index).
 */
const SLUGS_OMITTED_ON_TILES = new Set(['video'])

export function categoryTitlesForTiles(
  categories: { title?: string | null; slug?: string | null }[] | null | undefined,
): string {
  if (!categories?.length) return ''
  return categories
    .filter((c) => {
      const s = typeof c.slug === 'string' ? c.slug.toLowerCase().trim() : ''
      return !s || !SLUGS_OMITTED_ON_TILES.has(s)
    })
    .map((c) => c.title)
    .filter(Boolean)
    .join(', ')
}
