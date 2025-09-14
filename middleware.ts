import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin role
      if (req.nextauth.token?.role !== 'ADMIN') {
        // Redirect to home page with error message for non-admin users
        const url = new URL('/', req.url)
        url.searchParams.set('error', 'access_denied')
        return NextResponse.redirect(url)
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for admins
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        // For other protected routes, just check if user is authenticated
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    // Add other protected routes here if needed
  ]
}