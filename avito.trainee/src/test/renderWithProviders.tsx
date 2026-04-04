import '@mantine/core/styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { render, type RenderOptions } from '@testing-library/react'
import type { ComponentType, ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import theme from '@/app/theme/theme'
import { i18n } from '@/shared/i18n'

export function AllProviders({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider
        defaultColorScheme="light"
        theme={theme}
      >
        {children}
      </MantineProvider>
    </I18nextProvider>
  )
}

export function createItemsSearchingHookWrapper(
  initialPath = '/ads',
): ComponentType<{ children: ReactNode }> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function ItemsSearchingHookWrapper({
    children,
  }: {
    children: ReactNode
  }) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <QueryClientProvider client={queryClient}>
            <AllProviders>{children}</AllProviders>
          </QueryClientProvider>
        </QueryParamProvider>
      </MemoryRouter>
    )
  }
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export function renderWithAdsListProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialPath?: string },
) {
  const { initialPath = '/ads', ...renderOptions } = options ?? {}
  const Wrapper = createItemsSearchingHookWrapper(initialPath)
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
