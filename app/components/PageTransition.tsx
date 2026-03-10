'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    document.body.classList.toggle('page--home', isHome)
    return () => document.body.classList.remove('page--home')
  }, [isHome])

  // Studio: stable key so navigating within /studio/* doesn't remount (no reload)
  const key = pathname.startsWith('/studio') ? 'studio' : pathname
  return (
    <div key={key} className="page-transition">
      {children}
    </div>
  )
}
