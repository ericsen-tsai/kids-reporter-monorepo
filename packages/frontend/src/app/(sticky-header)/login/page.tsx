import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LoginComponent } from '@/components/login'
import { GENERAL_DESCRIPTION, IS_LOGIN_ENABLED } from '@/constants'

export const metadata: Metadata = {
  title: '關於少年報導者 - 少年報導者 The Reporter for Kids',
  description: GENERAL_DESCRIPTION,
}

export default async function Login() {
  if (!IS_LOGIN_ENABLED) {
    notFound()
  }

  return (
    <main className="my-24 flex flex-col items-center justify-center">
      <LoginComponent />
    </main>
  )
}
