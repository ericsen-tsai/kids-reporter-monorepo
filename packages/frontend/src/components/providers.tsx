'use client'

import { HeaderProvider } from '@kids-reporter/routing-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { getQueryClient } from '@/api-utils/react-query/get-query-client'
import { POPULAR_KEYWORDS } from '@/constants'
import { AuthProvider } from '@/services/auth/auth-provider'

import StyledComponentsRegistry from './registry'

function Providers({ children }: { children: React.ReactNode }) {
  // TODO: get keywords from backend
  const keywords = POPULAR_KEYWORDS

  const queryClient = getQueryClient()

  return (
    <StyledComponentsRegistry>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HeaderProvider keywords={keywords}>{children}</HeaderProvider>
        </AuthProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          position="left"
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </StyledComponentsRegistry>
  )
}

export default Providers
