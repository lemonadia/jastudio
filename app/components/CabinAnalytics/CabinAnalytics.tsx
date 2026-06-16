'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

export default function CabinAnalytics() {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) return null

  return (
    <Script
      src="https://scripts.withcabin.com/hello.js"
      strategy="afterInteractive"
    />
  )
}
