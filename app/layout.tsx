import type { Metadata } from 'next'
import CabinAnalytics from '@/app/components/CabinAnalytics/CabinAnalytics'
import Footer from '@/app/components/Footer/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jonathan Arundel Studio',
  description: 'Photography portfolio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CabinAnalytics />
        {children}
        <Footer />
      </body>
    </html>
  )
}
