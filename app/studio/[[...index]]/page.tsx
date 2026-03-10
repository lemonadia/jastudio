'use client'

import dynamic from 'next/dynamic'
import config from '../../../sanity.config'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}>
        Loading Studio…
      </div>
    ),
  }
)

export default function StudioPage() {
  return <NextStudio config={config} />
}
