import { NextResponse } from 'next/server'

import { ID_TOKEN_COOKIE_NAME } from '@/services/auth/constants'

export async function POST() {
  const response = NextResponse.json(
    {
      status: 'success',
      message: 'Logged out successfully',
    },
    { status: 200 }
  )

  response.cookies.set(ID_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
    path: '/',
    domain:
      process.env.NODE_ENV === 'production' ? '.twreporter.org' : undefined,
  })

  return response
}
