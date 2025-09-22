import { StickyHeader } from '@/components/header'
import TopDetector from '@/components/top-detector'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StickyHeader />
      <TopDetector />
      <div className="flex grow mt-16">{children}</div>
    </>
  )
}
