import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AVAILABLE_ROLES } from './app/constants'
import axiosInstance from './app/hooks/axiosInstance'
import { AUTH_ENDPOINTS } from './app/hooks/api/endpoints'

const AUTH_COOKIES = [
  'next-auth.session-token',
  'next-auth.csrf-token',
  '__Secure-next-auth.session-token',
]

const createAuthRedirect = (request: NextRequest, destination: string) => {
  const response = NextResponse.redirect(new URL(destination, request.url))
  AUTH_COOKIES.forEach((cookie) => response.cookies.delete(cookie))

  return response
}

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const pathname = request.nextUrl.pathname
    const isAuthPage = pathname.startsWith('/auth')
    const allowedRoles = AVAILABLE_ROLES.map((role) => role.value)

    // 1. If user is not authenticated
    if (!token || !token.role || !allowedRoles.includes(token.role)) {
      if (!isAuthPage) {
        return createAuthRedirect(request, '/auth/signin')
      }

      return NextResponse.next()
    }

    // 2. Check Django API token validity
    try {
      const apiResponse = await axiosInstance.get(AUTH_ENDPOINTS.ping, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })

      if (apiResponse.status === 406) {
        if (!isAuthPage) {
          return createAuthRedirect(request, '/auth/signin')
        }

        return NextResponse.next()
      }
    } catch (err) {
      console.error('API check failed:', err)
      if (!isAuthPage) {
        return createAuthRedirect(request, '/auth/signin')
      }

      return NextResponse.next()
    }

    // 3. Prevent logged-in users from hitting auth pages
    if (isAuthPage || pathname === '/') {
      return NextResponse.redirect(
        new URL('/dashboard/?module=home', request.url)
      )
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    if (!request.nextUrl.pathname.startsWith('/auth')) {
      return createAuthRedirect(request, '/auth/signin')
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/auth/:path*'],
}
