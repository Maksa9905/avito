import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

import { createItemsSearchingHookWrapper } from '@/test/renderWithProviders'

import { useGetItemsListQuery } from '../api/api'
import { useTotalItems } from './useTotalItems'

vi.mock('../api/api', () => ({
  useGetItemsListQuery: vi.fn(),
}))

const mockUseGetItemsListQuery = vi.mocked(useGetItemsListQuery)

describe('useTotalItems', () => {
  beforeEach(() => {
    mockUseGetItemsListQuery.mockReset()
  })

  it('в начале загрузки отдаёт total 0 и isLoading true', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
    } as any)

    const wrapper = createItemsSearchingHookWrapper()
    const { result } = renderHook(() => useTotalItems(), { wrapper })

    expect(result.current).toEqual({ total: 0, isLoading: true })
  })

  it('после ответа API кэширует total и снимает isLoading', async () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 137 },
      isLoading: false,
      isPending: false,
    } as any)

    const wrapper = createItemsSearchingHookWrapper()
    const { result } = renderHook(() => useTotalItems(), { wrapper })

    await waitFor(() => {
      expect(result.current.total).toBe(137)
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('не обновляет кэш, если total в ответе 0 (falsy)', async () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      isPending: false,
    } as any)

    const wrapper = createItemsSearchingHookWrapper()
    const { result } = renderHook(() => useTotalItems(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.total).toBe(0)
  })
})
