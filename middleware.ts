import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AVAILABLE_ROLES } from './app/constants'

// Auth cookie names that need to be cleared on session reset
const AUTH_COOKIES = [
  'next-auth.session-token',
  'next-auth.csrf-token',
  '__Secure-next-auth.session-token',
]

/**
 * Creates a redirect response with cleared auth cookies
 * @param request - The incoming request
 * @param destination - The URL to redirect to
 */
const createAuthRedirect = (request: NextRequest, destination: string) => {
  const response = NextResponse.redirect(new URL(destination, request.url))

  // Clear all auth cookies
  AUTH_COOKIES.forEach((cookie) => response.cookies.delete(cookie))

  return response
}

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const allowedRoles = AVAILABLE_ROLES.map((role) => role.value)

    // Case 1: User is not authenticated
    if (!token) {
      // Allow access to auth pages
      if (isAuthPage) {
        return NextResponse.next()
      }

      // Redirect to login for non-auth pages
      return createAuthRedirect(request, '/auth/signin')
    }

    // Case 2: User is authenticated
    // Verify token and role
    const userRole = token.role
    if (!allowedRoles.includes(userRole)) {
      // Redirect to login - invalid role
      return createAuthRedirect(request, '/auth/signin')
    }

    // Don't allow authenticated users to access auth pages
    if (isAuthPage || request.nextUrl.pathname === '/') {
      return NextResponse.redirect(
        new URL('/dashboard/?module=home', request.url)
      )
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)

    return createAuthRedirect(request, '/auth/signin')
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/auth/:path*'],
}
