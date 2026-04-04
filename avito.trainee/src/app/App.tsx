import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './theme/fonts.css'
import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { useState } from 'react'

import { router } from '@/app/router'
import { i18n } from '@/shared/i18n'
import theme from './theme/theme'

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
          },
        },
      }),
  )

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          defaultColorScheme="light"
          theme={theme}
        >
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default App
