/** @jsxRuntime classic */
/** @jsx jsx */

import { Head } from '@keystone-6/core/admin-ui/router'
import { Box, Center, jsx, useTheme } from '@keystone-ui/core'
import { ReactNode } from 'react'

type SinglePageContainerProps = {
  children: ReactNode
  title?: string
}

export const SinglePageContainer = ({
  children,
  title,
}: SinglePageContainerProps) => {
  const { colors, shadow } = useTheme()
  return (
    <div>
      <Head>
        <title>{title || 'Keystone'}</title>
      </Head>
      <Center
        style={{
          minWidth: '100vw',
          minHeight: '100vh',
          backgroundColor: colors.backgroundMuted,
        }}
        rounding="medium"
      >
        <Box
          style={{
            background: colors.background,
            width: 600,
            boxShadow: shadow.s100,
          }}
          margin="medium"
          padding="xlarge"
          rounding="medium"
        >
          {children}
        </Box>
      </Center>
    </div>
  )
}
