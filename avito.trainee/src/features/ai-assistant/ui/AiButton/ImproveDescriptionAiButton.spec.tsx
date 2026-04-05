import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AllProviders } from '@/test/renderWithProviders'

import ImproveDescriptionAiButton from './ImproveDescriptionAiButton'

const useGenerateDescriptionMock = vi.hoisted(() =>
  vi.fn(() => ({
    mutate: vi.fn(),
    data: undefined as { description: string } | undefined,
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
)

vi.mock('@/features/ai-assistant/api/api', () => ({
  useGenerateDescription: () => useGenerateDescriptionMock(),
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

describe('ImproveDescriptionAiButton', () => {
  const onApply = vi.fn()
  const onGetValues = vi.fn(() => ({ title: 'x' }))

  beforeEach(() => {
    vi.clearAllMocks()
    useGenerateDescriptionMock.mockReturnValue({
      mutate: vi.fn(),
      data: undefined,
      isPending: false,
      isSuccess: false,
      isError: false,
    })
  })

  it('показывает подпись промпта и по клику вызывает mutate с языком и params', async () => {
    const user = userEvent.setup()
    const mutate = vi.fn()
    useGenerateDescriptionMock.mockReturnValue({
      mutate,
      data: undefined,
      isPending: false,
      isSuccess: false,
      isError: false,
    })

    render(
      <TestRoot>
        <ImproveDescriptionAiButton
          onApply={onApply}
          onGetValues={onGetValues}
        />
      </TestRoot>,
    )

    expect(
      screen.getByRole('button', { name: 'Улучшить описание' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Улучшить описание' }))

    expect(onGetValues).toHaveBeenCalled()
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'ru',
        params: { title: 'x' },
      }),
    )
  })

  it('по «Применить» в меню передаёт description в onApply', async () => {
    const user = userEvent.setup()
    const mutate = vi.fn()
    useGenerateDescriptionMock.mockReturnValue({
      mutate,
      data: { description: 'Новое описание' },
      isPending: false,
      isSuccess: true,
      isError: false,
    })

    render(
      <TestRoot>
        <ImproveDescriptionAiButton
          onApply={onApply}
          onGetValues={onGetValues}
        />
      </TestRoot>,
    )

    await user.click(screen.getByRole('button', { name: 'Применить' }))
    expect(onApply).toHaveBeenCalledWith('Новое описание')
  })
})
