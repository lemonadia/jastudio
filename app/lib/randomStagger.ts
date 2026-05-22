export function randomFadeDelays(count: number, stepMs = 55): number[] {
  const slots = Array.from({ length: count }, (_, i) => i)
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[slots[i], slots[j]] = [slots[j], slots[i]]
  }
  return slots.map((slot) => slot * stepMs)
}
