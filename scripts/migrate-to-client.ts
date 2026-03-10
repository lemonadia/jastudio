/**
 * Migrate content from old project (nok9of5b) to client project (jdi6zc8z)
 *
 * Run: npx tsx scripts/migrate-to-client.ts
 *
 * Requires: SANITY_API_WRITE_TOKEN for the CLIENT project (jdi6zc8z)
 * Create it in: manage.sanity.io → project jdi6zc8z → API → Tokens
 */

import { createClient } from 'next-sanity'

const OLD_PROJECT = 'nok9of5b'
const CLIENT_PROJECT = 'jdi6zc8z'
const DATASET = 'production'

async function migrate() {
  const writeToken = process.env.SANITY_API_WRITE_TOKEN
  if (!writeToken) {
    console.error('Missing SANITY_API_WRITE_TOKEN')
    console.error('Create it: manage.sanity.io → project jdi6zc8z → API → Tokens')
    process.exit(1)
  }

  const readClient = createClient({
    projectId: OLD_PROJECT,
    dataset: DATASET,
    apiVersion: '2024-01-22',
    useCdn: true,
  })

  const writeClient = createClient({
    projectId: CLIENT_PROJECT,
    dataset: DATASET,
    apiVersion: '2024-01-22',
    useCdn: false,
    token: writeToken,
  })

  console.log('Fetching documents from old project...')
  const docs = await readClient.fetch('*[!(_id in path("_.**"))]')
  console.log(`Found ${docs.length} documents`)

  if (docs.length === 0) {
    console.log('No documents to migrate')
    return
  }

  const transaction = writeClient.transaction()
  for (const doc of docs) {
    const { _id, _type, _rev, ...rest } = doc
    transaction.createOrReplace({ _id, _type, ...rest })
  }

  console.log('Pushing to client project...')
  await transaction.commit()
  console.log('Done!')
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
