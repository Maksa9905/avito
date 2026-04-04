import { beforeEach, describe, expect, it, vi } from 'vitest'

import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import { useGetItemsListQuery } from '../../api/api'
import { ITEMS_LIST_QUERY_LIMIT } from '../../lib/constants'
import ItemsListPagination from './ItemsListPagination'

vi.mock('../../api/api', () => ({
  useGetItemsListQuery: vi.fn(),
}))

const mockUseGetItemsListQuery = vi.mocked(useGetItemsListQuery)

describe('ItemsListPagination', () => {
  beforeEach(() => {
    mockUseGetItemsListQuery.mockReset()
  })

  it('строит число страниц из total и лимита', () => {
    const total = 3 * ITEMS_LIST_QUERY_LIMIT - 2
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total },
      isLoading: false,
      isPending: false,
    } as any)

    renderWithAdsListProviders(<ItemsListPagination />)

    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('при total=0 после загрузки пагинацию не показывает', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      isPending: false,
    } as any)

    const { container } = renderWithAdsListProviders(<ItemsListPagination />)

    expect(
      container.querySelector('.mantine-Pagination-root'),
    ).not.toBeInTheDocument()
  })

  it('отражает текущую страницу из query', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 50 },
      isLoading: false,
      isPending: false,
    } as any)

    renderWithAdsListProviders(<ItemsListPagination />, {
      initialPath: '/ads?page=2',
    })

    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('по клику переключает страницу', async () => {
    const user = userEvent.setup()
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 50 },
      isLoading: false,
      isPending: false,
    } as any)

    renderWithAdsListProviders(<ItemsListPagination />, {
      initialPath: '/ads?page=1',
    })

    await user.click(screen.getByRole('button', { name: '3' }))

    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('пробрасывает className', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 10 },
      isLoading: false,
      isPending: false,
    } as any)

    const { container } = renderWithAdsListProviders(
      <ItemsListPagination className="pagination-extra" />,
    )

    expect(container.querySelector('.pagination-extra')).toBeInTheDocument()
  })
})
