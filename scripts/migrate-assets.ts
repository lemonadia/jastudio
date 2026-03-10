/**
 * Migrate image assets from old project to client project.
 * Downloads from nok9of5b CDN, uploads to jdi6zc8z.
 * Run: npx tsx scripts/migrate-assets.ts
 */

import { createClient } from 'next-sanity'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  })
}

const OLD_PROJECT = 'nok9of5b'
const CLIENT_PROJECT = 'jdi6zc8z'
const DATASET = 'production'

function extractAssetRefs(obj: unknown, refs: Set<string> = new Set()): Set<string> {
  if (!obj) return refs
  if (typeof obj === 'object' && obj !== null && '_ref' in obj) {
    const ref = (obj as { _ref: string })._ref
    if (ref?.startsWith('image-')) refs.add(ref)
    return refs
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => extractAssetRefs(item, refs))
    return refs
  }
  if (typeof obj === 'object') {
    Object.values(obj).forEach((v) => extractAssetRefs(v, refs))
  }
  return refs
}

async function migrateAssets() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
    process.exit(1)
  }

  const readClient = createClient({
    projectId: CLIENT_PROJECT,
    dataset: DATASET,
    apiVersion: '2024-01-22',
    useCdn: false,
    token,
  })

  const writeClient = createClient({
    projectId: CLIENT_PROJECT,
    dataset: DATASET,
    apiVersion: '2024-01-22',
    useCdn: false,
    token,
  })

  console.log('Fetching documents from client project...')
  const docs = await readClient.fetch('*[!(_id in path("_.**"))]')
  const refs = new Set<string>()
  docs.forEach((doc: unknown) => extractAssetRefs(doc, refs))
  console.log(`Found ${refs.size} image references`)

  if (refs.size === 0) {
    console.log('No images to migrate')
    return
  }

  const refMap = new Map<string, string>()

  const createImageUrlBuilder = (await import('@sanity/image-url')).default
  const builder = createImageUrlBuilder({ projectId: OLD_PROJECT, dataset: DATASET })

  for (const ref of refs) {
    try {
      const url = builder.image({ _ref: ref }).url()
      const res = await fetch(url!)
      if (!res.ok) {
        console.warn(`Skip ${ref}: ${res.status}`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      const ext = url?.includes('.webp') ? 'webp' : 'jpg'
      const uploaded = await writeClient.assets.upload('image', buf, {
        filename: `${ref}.${ext}`,
      })
      refMap.set(ref, uploaded._id)
      console.log(`Uploaded ${ref} -> ${uploaded._id}`)
    } catch (err) {
      console.error(`Failed ${ref}:`, err)
    }
  }

  console.log(`Migrated ${refMap.size} assets. Updating document references...`)

  function replaceRefs(obj: unknown): unknown {
    if (!obj) return obj
    if (typeof obj === 'object' && obj !== null && '_ref' in obj) {
      const ref = (obj as { _ref: string })._ref
      const newRef = refMap.get(ref)
      if (newRef) return { ...obj, _ref: newRef }
      return obj
    }
    if (Array.isArray(obj)) return obj.map(replaceRefs)
    if (typeof obj === 'object') {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(obj)) {
        out[k] = replaceRefs(v)
      }
      return out
    }
    return obj
  }

  const tx = writeClient.transaction()
  for (const doc of docs) {
    const updated = replaceRefs(doc) as typeof doc
    if (JSON.stringify(doc) !== JSON.stringify(updated)) {
      const { _id, _type, _rev, ...rest } = updated
      tx.createOrReplace({ _id, _type, ...rest })
    }
  }
  await tx.commit()
  console.log('Done!')
}

migrateAssets().catch((err) => {
  console.error(err)
  process.exit(1)
})
