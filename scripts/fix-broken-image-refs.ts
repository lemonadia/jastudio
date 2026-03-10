/**
 * Fix broken image references that cause endless "Loading" in Sanity Studio.
 * Refs pointing to non-existent assets (e.g. from old project after migration) hang forever.
 * Run: npx tsx scripts/fix-broken-image-refs.ts
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

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jdi6zc8z'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
    process.exit(1)
  }

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2024-01-22',
    useCdn: false,
    token,
  })

  console.log('Fetching documents...')
  const docs = await client.fetch<
    Array<{ _id: string; _type: string; [key: string]: unknown }>
  >('*[!(_id in path("_.**"))]')

  const allRefs = new Set<string>()
  const refToDocPaths = new Map<string, Array<{ docId: string; path: string[] }>>()

  function collectRefs(
    obj: unknown,
    docId: string,
    path: string[] = []
  ): void {
    if (!obj) return
    if (typeof obj === 'object' && obj !== null && '_ref' in obj) {
      const ref = (obj as { _ref: string })._ref
      if (ref?.startsWith('image-')) {
        allRefs.add(ref)
        const entry = refToDocPaths.get(ref) || []
        entry.push({ docId, path: [...path] })
        refToDocPaths.set(ref, entry)
      }
      return
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) =>
        collectRefs(item, docId, [...path, String(i)])
      )
      return
    }
    if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        collectRefs(v, docId, [...path, k])
      }
    }
  }

  for (const doc of docs) {
    collectRefs(doc, doc._id)
  }

  if (allRefs.size === 0) {
    console.log('No image references found.')
    return
  }

  console.log(`Checking ${allRefs.size} image refs...`)
  const existingAssets = await client.fetch<string[]>(
    `*[_type == "sanity.imageAsset" && _id in $refs]._id`,
    { refs: Array.from(allRefs) }
  )
  const existingSet = new Set(existingAssets)
  const brokenRefs = Array.from(allRefs).filter((r) => !existingSet.has(r))

  if (brokenRefs.length === 0) {
    console.log('All image refs are valid.')
    return
  }

  console.log(`Found ${brokenRefs.length} broken refs:`, brokenRefs)

  const tx = client.transaction()
  const docsToPatch = new Set<string>()

  for (const ref of brokenRefs) {
    const entries = refToDocPaths.get(ref) || []
    for (const { docId, path } of entries) {
      docsToPatch.add(docId)
    }
  }

  for (const docId of docsToPatch) {
    const doc = docs.find((d) => d._id === docId)
    if (!doc) continue

    const cleaned = removeBrokenRefs(doc, brokenRefs)
    if (JSON.stringify(doc) !== JSON.stringify(cleaned)) {
      const { _id, _type, _rev, ...rest } = cleaned as typeof doc
      tx.createOrReplace({ _id, _type, ...rest })
      console.log(`  Patched ${docId}`)
    }
  }

  await tx.commit()
  console.log('Done! Refresh Sanity Studio.')
}

function removeBrokenRefs(
  obj: unknown,
  brokenRefs: string[]
): unknown {
  if (!obj) return obj
  if (typeof obj === 'object' && obj !== null && '_ref' in obj) {
    const ref = (obj as { _ref: string })._ref
    if (brokenRefs.includes(ref)) return undefined
    return obj
  }
  if (Array.isArray(obj)) {
    const filtered = obj
      .map((item) => removeBrokenRefs(item, brokenRefs))
      .filter((v) => v !== undefined)
    return filtered
  }
  if (typeof obj === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      const cleaned = removeBrokenRefs(v, brokenRefs)
      if (cleaned !== undefined) out[k] = cleaned
    }
    return out
  }
  return obj
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
