import { cn } from '@kids-reporter/routing-ui'

function IndicatorDots({
  current = 1,
  total = 4,
}: {
  current?: number
  total?: number
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-2 w-2 rounded-full transition-colors',
            index + 1 === current ? 'bg-red-400' : 'bg-neutral-300'
          )}
        />
      ))}
    </div>
  )
}

export default IndicatorDots
