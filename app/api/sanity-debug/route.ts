import { NextResponse } from 'next/server'

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  try {
    const query = encodeURIComponent('*[_type=="homePage"][0]{_id,image}')
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-22/data/query/${dataset}?query=${query}`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    const countQuery = encodeURIComponent('count(*[_type=="homePage"])')
    const countRes = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-22/data/query/${dataset}?query=${countQuery}`,
      { cache: 'no-store' }
    )
    const countData = await countRes.json()
    return NextResponse.json({
      projectId,
      dataset,
      homePage: data?.result,
      homePageCount: countData?.result,
      ok: res.ok,
      status: res.status,
    })
  } catch (err) {
    return NextResponse.json({
      projectId,
      dataset,
      error: String(err),
    }, { status: 500 })
  }
}
