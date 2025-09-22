import Header from '@/components/header'
import TopDetector from '@/components/top-detector'
import { HeaderProvider } from '@/components/header/header-context'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <Header />
      <TopDetector />
      <div className="flex grow">{children}</div>
    </HeaderProvider>
  )
}
