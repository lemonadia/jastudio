'use client'

import { usePathname } from 'next/navigation'
import './FadeIn.css'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function FadeIn({ children, className = '' }: Props) {
  const pathname = usePathname()

  return (
    <div key={pathname} className={['fade-in', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
