import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { OllamaController } from '@/shared/api'

import { useGenerateDescription, useGenerateRecommendedPrice } from './api'

const mockChat = vi.fn()

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('useGenerateDescription', () => {
  beforeEach(() => {
    mockChat.mockResolvedValue('{"description":"Готово"}')
    vi.spyOn(OllamaController, 'createChat').mockReturnValue({
      chat: mockChat,
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('вызывает chat с params и возвращает распарсенный description', async () => {
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })

    const { result } = renderHook(() => useGenerateDescription(), {
      wrapper: createWrapper(client),
    })

    await result.current.mutateAsync({
      language: 'ru',
      params: { title: 'Телефон' },
    })

    expect(mockChat).toHaveBeenCalledTimes(1)
    const userPrompt = mockChat.mock.calls[0][0]
    expect(userPrompt.getContent()).toContain('Телефон')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual({ description: 'Готово' })
  })
})

describe('useGenerateRecommendedPrice', () => {
  beforeEach(() => {
    mockChat.mockResolvedValue(
      '{"marketOverview":"обзор","recommendedPrice":99}',
    )
    vi.spyOn(OllamaController, 'createChat').mockReturnValue({
      chat: mockChat,
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('вызывает chat и возвращает marketOverview и recommendedPrice', async () => {
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })

    const { result } = renderHook(() => useGenerateRecommendedPrice(), {
      wrapper: createWrapper(client),
    })

    await result.current.mutateAsync({
      language: 'ru',
      params: { price: 100 },
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual({
      marketOverview: 'обзор',
      recommendedPrice: 99,
    })
  })
})
