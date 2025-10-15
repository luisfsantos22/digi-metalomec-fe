import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIES = [
  'next-auth.session-token', // NextAuth session
  '__Secure-next-auth.session-token',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/auth')

  // Check if NextAuth session cookie exists
  const hasAuthCookie = AUTH_COOKIES.some((cookie) =>
    request.cookies.has(cookie)
  )

  // 1. If not authenticated, redirect to signin (except if already on auth page)
  if (!hasAuthCookie) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    return NextResponse.next()
  }

  // 2. Prevent logged-in users from visiting /auth/* or root path
  if (isAuthPage || pathname === '/') {
    return NextResponse.redirect(
      new URL('/dashboard/?module=home', request.url)
    )
  }

  // 3. Allow access to protected routes
  // Token validation and refresh is handled by axiosInstance interceptors
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/auth/:path*'],
}
