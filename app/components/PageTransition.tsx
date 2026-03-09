'use client'

import { usePathname } from 'next/navigation'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Studio: stable key so navigating within /studio/* doesn't remount (no reload)
  const key = pathname.startsWith('/studio') ? 'studio' : pathname
  return (
    <div key={key} className="page-transition">
      {children}
    </div>
  )
}
