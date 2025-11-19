import { NextRequest, NextResponse } from 'next/server'

import { ACCESS_TOKEN_ENDPOINT, STATUS_CODES } from '@/constants'
import { ID_TOKEN_COOKIE_NAME } from '@/services/auth/constants'

import { PROTECTED_ROUTES } from './constants/route'

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

async function validateIdToken(request: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get('cookie') || ''

    const response = await fetch(ACCESS_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
    })

    return (
      response.status !== STATUS_CODES.BAD_REQUEST &&
      response.status !== STATUS_CODES.UNAUTHORIZED
    )
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, basePath, origin } = request.nextUrl

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  const idToken = request.cookies.get(ID_TOKEN_COOKIE_NAME)?.value

  if (!idToken) {
    return NextResponse.redirect(`${origin}${basePath}`)
  }

  const isValid = await validateIdToken(request)
  if (!isValid) {
    return NextResponse.redirect(`${origin}${basePath}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/member/:path*',
    '/account/:path*',
    '/myreading/:path*',
    '/custom/:path*',
    '/email-subscription/:path*',
  ],
}
