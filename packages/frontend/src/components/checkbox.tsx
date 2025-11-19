type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  value: string
}

function Checkbox({ checked, onChange, label, value }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        value={value}
        name="questionCount"
        checked={checked}
        onChange={() => onChange(!checked)}
        className="hidden"
      />
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-[2px] border-2 transition-colors ${
          checked
            ? 'border-red-400 bg-red-400'
            : 'border-neutral-700 bg-transparent'
        }`}
      >
        {checked && (
          <svg
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3.5L3.5 6L9 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="prose-p1 text-neutral-700">{label}</span>
    </label>
  )
}

export default Checkbox
