import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * `/index` cannot live in an `app/.../index/` folder — Next.js merges that
 * segment with the root route, so production often serves `app/page.tsx`
 * instead of the gallery index. We keep the public URL `/index` via rewrite.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/portfolio-index' || pathname === '/portfolio-index/') {
    return NextResponse.redirect(new URL('/index', request.url))
  }
  if (pathname === '/index' || pathname === '/index/') {
    return NextResponse.rewrite(new URL('/portfolio-index', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/index', '/index/', '/portfolio-index', '/portfolio-index/'],
}
