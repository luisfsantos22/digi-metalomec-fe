import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const allowedRoles = ['Gestor', 'Administrador', 'Mecânico']

  if (!token && (request.nextUrl.pathname === '/' || !isAuthPage)) {
    // Redirect to login if not authenticated and accessing root or non-auth pages
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  if (token) {
    try {
      const userRole = token.role
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }
    } catch (error) {
      console.error('Token verification failed:', error)

      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (request.nextUrl.pathname === '/' || isAuthPage) {
      // Redirect to dashboard if authenticated and accessing root or auth pages
      return NextResponse.redirect(
        new URL('/workshop-module/repair', request.url)
      )
    }
  }

  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
    '/workshop-module/:path*',
  ],
}
