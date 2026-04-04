import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { EItemCategory } from '@/entities/items'

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}))

vi.mock('@/shared/api', () => ({
  ApiController: {
    send: mockSend,
  },
}))

import { useGetItemByIdQuery, useUpdateItemMutation } from './api'

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
  }
}

describe('useGetItemByIdQuery', () => {
  it('не вызывает API при отсутствии itemId', () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    renderHook(() => useGetItemByIdQuery(undefined), {
      wrapper: createWrapper(client),
    })

    expect(mockSend).not.toHaveBeenCalled()
  })

  it('запрашивает GET /items/:id для числового id', async () => {
    mockSend.mockResolvedValueOnce({
      id: 7,
      title: 'x',
      price: 1,
      category: EItemCategory.AUTO,
      params: {},
      createdAt: '',
      updatedAt: '',
      needsRevision: false,
    })

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(() => useGetItemByIdQuery(7), {
      wrapper: createWrapper(client),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockSend).toHaveBeenCalledWith({
      method: 'GET',
      url: '/items/7',
    })
  })
})

describe('useUpdateItemMutation', () => {
  it('отправляет PUT и инвалидирует кэш списка и карточки', async () => {
    mockSend.mockResolvedValueOnce({ success: true })

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateItemMutation(), {
      wrapper: createWrapper(client),
    })

    await result.current.mutateAsync({
      itemId: 3,
      body: {
        category: EItemCategory.AUTO,
        title: 't',
        price: 1,
        params: { brand: 'b', model: 'm' },
      },
    })

    expect(mockSend).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/items/3',
      data: expect.objectContaining({
        category: EItemCategory.AUTO,
        title: 't',
      }),
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['items', 'detail', 3],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['items', 'list'],
    })
  })
})
