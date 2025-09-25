'use client'

import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { useState, forwardRef, useRef } from 'react'

// Search icon component
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="m21 21-4.35-4.35"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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
  'flex items-center bg-gray-100 desktop:bg-white rounded-full px-4 py-1.5 transition-colors duration-200 font-medium font-noto text-base h-11 border border-transparent focus:border-gray-600',
  {
    variants: {
      state: {
        default: 'border border-transparent',
        focus: 'border border-gray-600',
        active: 'border border-gray-600',
        unfocus: 'border border-transparent',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export type InputProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  showClearButton?: boolean
  children?: React.ReactNode
  inputRef?: React.RefObject<HTMLInputElement>
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder = '搜尋更多新聞、議題',
      value,
      onChange,
      onClear,
      showClearButton = true,
      className,
      onFocus,
      onBlur,
      inputRef,
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
    const currentState = isFocused
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

    const inputClasses = cn(inputVariants({ state: currentState }), className)

    return (
      <div className={inputClasses} ref={ref}>
        <SearchIcon className="text-gray-600 flex-shrink-0" />
        <input
          type="text"
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none ml-2 flex-shrink-1 max-w-[72%]"
          ref={inputRef ?? innerInputRef}
          {...props}
        />

        {showClearButton && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors p-1/2 rounded-full hover:bg-gray-100 active:bg-gray-200 ml-auto"
            aria-label="Clear input"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    )
  }
)

export default Input
