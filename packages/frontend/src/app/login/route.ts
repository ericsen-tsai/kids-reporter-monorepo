// WARNING:
//
// THIS FILE IS ONLY FOR DEVELOPMENT.
// After login implementation is done, this route `/login` should be DELETED.

import { NextResponse } from 'next/server'

import envVars from '@/environment-variables'

export async function GET() {
  const redirectUrl = new URL('/', process.env.NEXT_PUBLIC_BASE_URL)

  const response = NextResponse.redirect(redirectUrl, {
    status: 302,
  })

  // Set cookie
  response.cookies.set('id_token', envVars.mockIdToken, {
    httpOnly: true,
    domain:
      process.env.NODE_ENV === 'production' ? '.twreporter.org' : 'localhost',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  })

  return response
}
