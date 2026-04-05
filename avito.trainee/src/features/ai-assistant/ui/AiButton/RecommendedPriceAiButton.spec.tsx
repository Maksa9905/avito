import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AllProviders } from '@/test/renderWithProviders'

import RecommendedPriceAiButton from './RecommendedPriceAiButton'

const useGenerateRecommendedPriceMock = vi.hoisted(() =>
  vi.fn(() => ({
    mutate: vi.fn(),
    data: undefined as
      | { marketOverview: string; recommendedPrice: number }
      | undefined,
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
)

vi.mock('@/features/ai-assistant/api/api', () => ({
  useGenerateRecommendedPrice: () => useGenerateRecommendedPriceMock(),
}))

function TestRoot({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return (
    <QueryClientProvider client={client}>
      <AllProviders>{children}</AllProviders>
    </QueryClientProvider>
  )
}

describe('RecommendedPriceAiButton', () => {
  const onGetValues = vi.fn(() => ({ price: 100 }))

  beforeEach(() => {
    vi.clearAllMocks()
    useGenerateRecommendedPriceMock.mockReturnValue({
      mutate: vi.fn(),
      data: undefined,
      isPending: false,
      isSuccess: false,
      isError: false,
    })
  })

  it('по клику вызывает mutate с языком и params', async () => {
    const user = userEvent.setup()
    const mutate = vi.fn()
    useGenerateRecommendedPriceMock.mockReturnValue({
      mutate,
      data: undefined,
      isPending: false,
      isSuccess: false,
      isError: false,
    })

    render(
      <TestRoot>
        <RecommendedPriceAiButton onGetValues={onGetValues} />
      </TestRoot>,
    )

    await user.click(
      screen.getByRole('button', { name: 'Узнать рыночную цену' }),
    )

    expect(onGetValues).toHaveBeenCalled()
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'ru',
        params: { price: 100 },
      }),
    )
  })

  it('по «Применить» вызывает onApply со строкой цены', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    useGenerateRecommendedPriceMock.mockReturnValue({
      mutate: vi.fn(),
      data: { marketOverview: 'обзор', recommendedPrice: 15000 },
      isPending: false,
      isSuccess: true,
      isError: false,
    })

    render(
      <TestRoot>
        <RecommendedPriceAiButton
          onApply={onApply}
          onGetValues={onGetValues}
        />
      </TestRoot>,
    )

    await user.click(screen.getByRole('button', { name: 'Применить' }))
    expect(onApply).toHaveBeenCalledWith('15000')
  })
})
