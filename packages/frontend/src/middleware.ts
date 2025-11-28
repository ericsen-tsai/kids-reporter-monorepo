import { NextRequest, NextResponse } from 'next/server'

import { ACCESS_TOKEN_ENDPOINT, STATUS_CODES } from '@/constants'
import { ID_TOKEN_COOKIE_NAME } from '@/services/auth/constants'

import { PROTECTED_ROUTES } from './constants/route'
import envVars from './environment-variables'
import { AXIOS_TIMEOUT } from './utils'

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

async function validateIdToken(request: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get('cookie') || ''

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AXIOS_TIMEOUT)

    const response = await fetch(ACCESS_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

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
    return NextResponse.redirect(
      `${origin}${basePath}${envVars.loginUrl}?destination=${encodeURIComponent(request.url)}`
    )
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
