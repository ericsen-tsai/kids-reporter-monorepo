import { cn } from '@kids-reporter/routing-ui'

type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex h-5 w-10 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-100 ease-in-out',
        checked
          ? 'bg-red-400 hover:bg-red-500'
          : 'bg-neutral-600 hover:bg-neutral-700'
      )}
      role="switch"
      aria-checked={checked}
      aria-label={label ?? 'Switch'}
    >
      <span
        className={cn(
          'h-4 w-4 rounded-full bg-white shadow-[0px_0px_24px_0px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export default Switch
