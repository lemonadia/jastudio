'use client'

import { useCallback, useState } from 'react'

type Props = {
  value: string
  className?: string
  children: React.ReactNode
}

export default function CopyText({ value, className = '', children }: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* ignore */
    }
  }, [value])

  return (
    <button
      type="button"
      className={`info__copy${className ? ` ${className}` : ''}`}
      onClick={handleClick}
    >
      {copied ? <span className="info__copied">Copied</span> : children}
    </button>
  )
}
