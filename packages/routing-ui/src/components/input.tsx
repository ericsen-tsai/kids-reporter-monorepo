'use client'

import { cva } from 'class-variance-authority'
import { forwardRef, useRef, useState } from 'react'

import { SearchIconSmall } from '../icons'
import { cn } from '../utils/cn'

// Close icon component
const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="currentColor" />
    <path
      d="M7 7l6 6M13 7l-6 6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const inputVariants = cva(
  // Base styles
  'px-4 py-1.5 h-11 relative flex items-center border border-transparent bg-neutral-100 prose-p1 transition-colors duration-200 hover:border-neutral-600 desktop:bg-neutral-white!',
  {
    variants: {
      state: {
        default: 'border-transparent',
        hover: 'border-neutral-600',
        focus: 'border-neutral-600',
        active: 'border-neutral-600',
        unfocus: 'border-transparent',
        error: 'border-semantic-danger hover:border-semantic-danger',
      },
      mode: {
        default: 'rounded-[12px] border-neutral-400',
        search: 'rounded-full',
      },
    },
    compoundVariants: [
      {
        state: 'error',
        mode: 'default',
        className: 'border-semantic-danger',
      },
    ],
    defaultVariants: {
      state: 'default',
      mode: 'default',
    },
  }
)

export type InputProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  children?: React.ReactNode
  inputRef?: React.RefObject<HTMLInputElement>
  error?: boolean
  errorMessage?: string
  mode?: 'default' | 'search'
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder = '搜尋更多新聞、議題',
      value,
      onChange,
      onClear,
      className,
      onFocus,
      onBlur,
      inputRef,
      error,
      errorMessage,
      mode = 'default',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const innerInputRef = useRef<HTMLInputElement>(null)
    const currentValue = value !== undefined ? value : internalValue
    const hasValue = currentValue.length > 0

    // Determine current state
    const currentState = error
      ? 'error'
      : isFocused
        ? 'focus'
        : hasValue
          ? isActive
            ? 'active'
            : 'unfocus'
          : 'default'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (onChange) {
        onChange(newValue)
      } else {
        setInternalValue(newValue)
      }
      setIsActive(true)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e)
      }
      setIsFocused(true)
      setIsActive(true)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e)
      }
      setIsFocused(false)
      setIsActive(false)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (onChange) {
        onChange('')
      } else {
        setInternalValue('')
      }
      if (onClear) {
        onClear()
      }

      const currentRef = inputRef ?? innerInputRef
      currentRef.current?.focus()
    }

    const inputClasses = cn(
      inputVariants({ state: currentState, mode }),
      className
    )

    const isSearchMode = mode === 'search'

    return (
      <div className="gap-2 flex flex-col">
        <div className={inputClasses} ref={ref}>
          <div className="text-neutral-600">
            {isSearchMode && <SearchIconSmall />}
          </div>
          <input
            type="text"
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              'flex-1 flex-shrink-1 bg-transparent text-neutral-900 placeholder:prose-p1 placeholder:text-neutral-400 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400',
              isSearchMode && 'ml-2 max-w-[72%]'
            )}
            aria-describedby={
              errorMessage ? `${props.id ?? 'input'}-error` : undefined
            }
            ref={inputRef ?? innerInputRef}
            {...props}
          />
          {errorMessage && (
            <p
              className="-bottom-5 left-0 absolute prose-p3 text-semantic-danger"
              id={`${props.id ?? 'input'}-error`}
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          {isSearchMode && hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1/2 ml-auto flex-shrink-0 cursor-pointer rounded-full text-neutral-400 transition-colors hover:text-neutral-600 active:bg-neutral-200"
              aria-label="Clear input"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>
    )
  }
)

export default Input
