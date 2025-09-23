import Header from '@/components/header'
import TopDetector from '@/components/top-detector'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <TopDetector />
      <div className="flex grow">{children}</div>
    </>
  )
}
