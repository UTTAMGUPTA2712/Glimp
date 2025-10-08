import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Protect /app/* and /profile routes
  if (pathname.startsWith('/app') || pathname === '/profile') {
    // Allow /app/start with code and state query params (OAuth callback)
    if (pathname === '/app/start' && searchParams.has('code') && searchParams.has('state')) {
      return NextResponse.next()
    }

    // Check for authentication (in real app, verify JWT/session)
    const hasAuth = request.cookies.get('supabase-auth-token') // Mock auth check

    if (!hasAuth && pathname !== '/app/start') {
      // Preserve nonce in redirect
      const nonce = searchParams.get('nonce')
      const loginUrl = new URL('/login', request.url)
      if (nonce) {
        loginUrl.searchParams.set('nonce', nonce)
      }
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/profile', '/dashboard']
}