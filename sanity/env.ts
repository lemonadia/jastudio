export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-22'

/** Domyślnie `production`; nadpisz w `.env` jeśli używasz innego datasetu. */
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'

/**
 * Placeholder `xxxxxxxx` pozwala zbudować projekt bez wpisanego ID — zastąp
 * wartością z panelu Sanity przed publikacją.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || 'xxxxxxxx'

export const useCdn = false
