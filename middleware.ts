import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// const AUTH_COOKIES = [
//   'next-auth.session-token',
//   '__Secure-next-auth.session-token',
// ]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/auth')

  if (!token && (request.nextUrl.pathname === '/' || !isAuthPage)) {
    // Redirect to login if not authenticated and accessing root or non-auth pages
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // // Check if any auth cookie exists
  // const hasAuthCookie = AUTH_COOKIES.some((cookie) =>
  //   request.cookies.has(cookie)
  // )

  // // 1. If not authenticated
  // if (!hasAuthCookie) {
  //   if (!isAuthPage) {
  //     return NextResponse.redirect(new URL('/auth/signin', request.url))
  //   }

  //   return NextResponse.next()
  // }

  // 2. Prevent logged-in users from visiting /auth/*
  if (isAuthPage || pathname === '/') {
    return NextResponse.redirect(
      new URL('/dashboard/?module=home', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/auth/:path*'],
}
