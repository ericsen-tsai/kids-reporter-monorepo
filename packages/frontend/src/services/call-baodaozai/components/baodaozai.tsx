'use client'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import DialogBox from './dialog-box'
import { useCallBaodaozaiContext } from '../context'
import { cn } from '@kids-reporter/routing-ui'
import { useMediaQuery } from '@kids-reporter/routing-ui'

function Baodaozai() {
  const {
    dialogWithActionProps,
    baodaozaiProps,
    renderBaodaozai,
    onDialogPropsChange,
  } = useCallBaodaozaiContext()

  const { confirmAction, cancelAction, ...dialogProps } = dialogWithActionProps
  const { setIsActive, setAction, isActive } = baodaozaiProps

  const resetBaodaozai = useCallback(() => {
    setAction('none')
    setIsActive(false)
    onDialogPropsChange({ isOpen: false })
  }, [setAction, setIsActive, onDialogPropsChange])

  const handleConfirm = useCallback(() => {
    confirmAction()
    resetBaodaozai()
  }, [confirmAction, resetBaodaozai])

  const handleCancel = useCallback(() => {
    cancelAction()
    resetBaodaozai()
  }, [cancelAction, resetBaodaozai])

  const handleOpenDialog = useCallback(() => {
    onDialogPropsChange({ isOpen: true })
    // TODO: make default action configurable
    setIsActive(true)
    setAction('speak')
  }, [onDialogPropsChange, setIsActive, setAction])

  const refDialogBoxContainerRef = useRef<HTMLDivElement>(null)
  const [dialogBoxHeight, setDialogBoxHeight] = useState(0)

  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    const container = refDialogBoxContainerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        setDialogBoxHeight(height)
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const baodaozaiBottom = useMemo(() => {
    if (!isActive) return '0px'
    if (isMobile && dialogProps.isOpen) {
      return `calc(${dialogBoxHeight}px - 30px)`
    }
    return isTablet ? '24px' : '32px'
  }, [isActive, isMobile, dialogProps.isOpen, isTablet, dialogBoxHeight])

  return (
    <div className="fixed right-0 bottom-0 z-1000 w-full tablet:right-0 tablet:bottom-0">
      <div
        className="absolute -right-0 -bottom-0 z-[11] w-full tablet:right-6 tablet:bottom-21 tablet:z-1 tablet:w-auto tablet:translate-x-0 desktop:right-8"
        ref={refDialogBoxContainerRef}
      >
        <DialogBox
          {...dialogProps}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
      <button
        className={cn(
          'absolute right-0 z-12 transition-all duration-1000 tablet:right-0',
          !dialogProps.isOpen && 'cursor-pointer',
          isActive && 'right-6 tablet:right-6 desktop:right-8',
          dialogProps.isOpen && 'right-9 z-10'
        )}
        onClick={dialogProps.isOpen ? undefined : handleOpenDialog}
        style={{
          bottom: baodaozaiBottom,
        }}
      >
        {renderBaodaozai}
      </button>
    </div>
  )
}

export default Baodaozai
