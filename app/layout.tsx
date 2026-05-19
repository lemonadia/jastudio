import type { Metadata } from 'next'
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
        {children}
        <Footer />
      </body>
    </html>
  )
}
