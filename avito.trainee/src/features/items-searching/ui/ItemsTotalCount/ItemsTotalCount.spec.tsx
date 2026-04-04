import { beforeEach, describe, expect, it, vi } from 'vitest'

import { screen } from '@testing-library/react'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import { useGetItemsListQuery } from '../../api/api'
import ItemsTotalCount from './ItemsTotalCount'

vi.mock('../../api/api', () => ({
  useGetItemsListQuery: vi.fn(),
}))

const mockUseGetItemsListQuery = vi.mocked(useGetItemsListQuery)

describe('ItemsTotalCount', () => {
  beforeEach(() => {
    mockUseGetItemsListQuery.mockReset()
  })

  it('показывает текст загрузки, пока запрос в процессе', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
    } as any)

    renderWithAdsListProviders(<ItemsTotalCount />)

    expect(
      screen.getByText('Считаем число объявлений...'),
    ).toBeInTheDocument()
  })

  it('показывает количество объявлений после ответа API', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 42 },
      isLoading: false,
      isPending: false,
    } as any)

    renderWithAdsListProviders(<ItemsTotalCount />)

    expect(screen.getByText('42 объявления')).toBeInTheDocument()
  })

  it('использует форму one для 1 объявления', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 1 },
      isLoading: false,
      isPending: false,
    } as any)

    renderWithAdsListProviders(<ItemsTotalCount />)

    expect(screen.getByText('1 объявление')).toBeInTheDocument()
  })
})
