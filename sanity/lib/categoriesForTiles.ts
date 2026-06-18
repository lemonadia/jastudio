export function categoryTitlesForTiles(
  categories: { title?: string | null; slug?: string | null }[] | null | undefined,
): string {
  if (!categories?.length) return ''
  return categories
    .map((c) => c.title)
    .filter(Boolean)
    .join(', ')
}
