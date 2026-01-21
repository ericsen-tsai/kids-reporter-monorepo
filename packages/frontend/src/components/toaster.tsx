'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group flex justify-center! [--mobile-offset-left:0px]! [--mobile-offset-right:0px]!"
      style={
        {
          '--normal-bg': 'var(--color-neutral-900)',
          '--normal-text': 'var(--color-neutral-white)',
          '--border-radius': '8px',
          '--width': 'fit-content',
        } as React.CSSProperties
      }
      icons={{
        success: null,
      }}
      position="bottom-center"
      toastOptions={{
        className:
          'px-4! prose-p2! text-nowrap py-2! w-fit! mx-auto! max-w-[300px]! desktop:max-w-[440px]! [&>div]:overflow-hidden! [&>div>div]:truncate!',
      }}
      {...props}
    />
  )
}

export { Toaster }
