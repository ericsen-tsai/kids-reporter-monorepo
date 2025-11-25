import { cn } from '@kids-reporter/routing-ui'

function Divider({ className }: { className?: string }) {
  return <div className={cn('h-[2px] w-full bg-neutral-200', className)} />
}

export default Divider
