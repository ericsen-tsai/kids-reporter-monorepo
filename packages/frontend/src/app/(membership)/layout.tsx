import { Header } from '@kids-reporter/routing-ui'

import AuthHeaderLoggedInSetter from '@/components/auth-header-logged-in-setter'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <AuthHeaderLoggedInSetter />
      <div className="flex w-full grow">{children}</div>
    </>
  )
}
