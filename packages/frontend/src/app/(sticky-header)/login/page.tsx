import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { GENERAL_DESCRIPTION, IS_LOGIN_ENABLED } from '@/constants'

export const metadata: Metadata = {
  title: '關於少年報導者 - 少年報導者 The Reporter for Kids',
  description: GENERAL_DESCRIPTION,
}

export default async function Login() {
  if (!IS_LOGIN_ENABLED) {
    notFound()
  }

  // Redirect to the API route handler that sets the cookie and redirects
  redirect('/api/login_test')
}
