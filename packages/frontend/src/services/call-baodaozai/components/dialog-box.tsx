'use client'

import { Button } from '@kids-reporter/routing-ui'
import { cn } from '@kids-reporter/routing-ui'

const DialogArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="44"
    viewBox="0 0 32 44"
    fill="none"
  >
    <defs>
      <filter id="drop-shadow" x="-50%" y="0%" width="200%" height="150%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="8"
          floodColor="rgba(0,0,0,0.05)"
        />
      </filter>
    </defs>
    <path
      data-figma-bg-blur-radius="16"
      d="M0 2.72773e-05L32 44L32 -1.39876e-06L0 2.72773e-05Z"
      fill="white"
      filter="url(#drop-shadow)"
    />
  </svg>
)

export type DialogBoxProps = {
  content: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  confirmText: string
  cancelText: string
  hideCancelButton?: boolean
}

function DialogBox({
  content,
  isOpen,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  hideCancelButton = false,
}: DialogBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center transition-opacity duration-1000',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        className={cn(
          'relative z-10 flex w-full flex-col items-center justify-center tablet:w-75',
          'transform transition-all duration-300 ease-out',
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0'
        )}
      >
        <div className="rounded-t-[30px] rounded-b-none bg-neutral-white p-6 shadow-baodaozai-card tablet:rounded-b-[30px]">
          <p className="prose-p1-bold text-neutral-900">{content}</p>
          <div className="mt-5 flex items-center justify-center gap-4">
            {!hideCancelButton && (
              <Button
                variant="secondary"
                className="flex-1"
                size={36}
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1"
              size={36}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
        <div
          className={cn(
            'hidden transition-all duration-300 ease-out tablet:block',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          )}
        >
          {DialogArrow}
        </div>
      </div>
    </div>
  )
}

export default DialogBox
