import Header from '@/components/header'
import TopDetector from '@/components/top-detector'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <TopDetector />
      <div className="flex grow pt-(--header-main-bar-height) desktop:pt-[calc(var(--header-bottom-navigation-height)+var(--header-main-bar-height))]">
        {children}
      </div>
    </>
  )
}
