/** Fully shuffled slots — order in the list does not match visual flow. */
export function randomFadeDelays(count: number, stepMs = 55): number[] {
  const slots = Array.from({ length: count }, (_, i) => i)
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[slots[i], slots[j]] = [slots[j], slots[i]]
  }
  return slots.map((slot) => slot * stepMs)
}

/**
 * Random order inside each group; groups cascade top → bottom.
 * E.g. index: shuffle within a project row, then next project below.
 */
export function topDownRandomGroupFadeDelays(
  groupSizes: number[],
  stepMs = 22,
  groupPauseMs = 36,
): number[] {
  const result: number[] = []
  let base = 0

  for (const size of groupSizes) {
    if (size <= 0) continue
    const band = randomFadeDelays(size, stepMs)
    const bandMax = band.length ? Math.max(...band) : 0
    result.push(...band.map((d) => d + base))
    base += bandMax + groupPauseMs
  }

  return result
}

/** Split a flat count into fixed-size chunks (e.g. ~one flex row on home). */
export function chunkSizes(total: number, chunkSize: number): number[] {
  if (total <= 0 || chunkSize <= 0) return []
  const sizes: number[] = []
  for (let i = 0; i < total; i += chunkSize) {
    sizes.push(Math.min(chunkSize, total - i))
  }
  return sizes
}
