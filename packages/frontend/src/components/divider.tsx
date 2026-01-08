import { cn } from '@kids-reporter/routing-ui'

type DividerProps = {
  className?: string
  direction?: 'horizontal' | 'vertical'
}

function Divider({ className, direction = 'horizontal' }: DividerProps) {
  if (direction === 'horizontal') {
    return <div className={cn('h-[2px] w-full bg-neutral-200', className)} />
  }

  return <div className={cn('h-full w-[2px] bg-neutral-200', className)} />
}

export default Divider
