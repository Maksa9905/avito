import { beforeEach, describe, expect, it, vi } from 'vitest'

import { screen } from '@testing-library/react'
import { EItemCategory } from '@/entities/items'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import { useGetItemsListQuery } from '../../api/api'
import type { ItemsListItemDto } from '../../api/types'
import ItemsList from './ItemsList'

vi.mock('../../api/api', () => ({
  useGetItemsListQuery: vi.fn(),
}))

const mockUseGetItemsListQuery = vi.mocked(useGetItemsListQuery)

const sampleDtos: ItemsListItemDto[] = [
  {
    id: 1,
    category: EItemCategory.AUTO,
    title: 'Седан Toyota',
    price: 890_000,
    needsRevision: false,
  },
  {
    id: 2,
    category: EItemCategory.ELECTRONICS,
    title: 'Ноутбук',
    price: 75_000,
    needsRevision: true,
  },
]

describe('ItemsList', () => {
  beforeEach(() => {
    mockUseGetItemsListQuery.mockReset()
  })

  it('в состоянии загрузки рендерит 10 скелетонов', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetItemsListQuery>)

    const { container } = renderWithAdsListProviders(<ItemsList />)

    expect(container.querySelectorAll('.mantine-Skeleton-root')).toHaveLength(
      10,
    )
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('при ошибке запроса показывает сообщение и не показывает скелетоны', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetItemsListQuery>)

    const { container } = renderWithAdsListProviders(<ItemsList />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByText('Не удалось загрузить объявления'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Проверьте подключение к интернету и попробуйте обновить страницу.',
      ),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('.mantine-Skeleton-root')).toHaveLength(0)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('после загрузки показывает объявления из ответа API', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: sampleDtos, total: 2 },
      isLoading: false,
    } as ReturnType<typeof useGetItemsListQuery>)

    renderWithAdsListProviders(<ItemsList />)

    expect(
      screen.getByRole('heading', { name: 'Седан Toyota' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ноутбук' })).toBeInTheDocument()
    expect(screen.getByText('890000₽')).toBeInTheDocument()
    expect(screen.getByText('75000₽')).toBeInTheDocument()
    expect(screen.getByText('Авто')).toBeInTheDocument()
    expect(screen.getByText('Электроника')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('при пустом списке показывает состояние «ничего не найдено»', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
    } as any)

    renderWithAdsListProviders(<ItemsList />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Объявлений не найдено')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Попробуйте изменить фильтры или поисковый запрос — подходящие объявления могут появиться позже.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('пробрасывает className во внутренний контейнер', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
    } as any)

    const { container } = renderWithAdsListProviders(
      <ItemsList className="items-list-test-class" />,
    )

    expect(
      container.querySelector('.items-list-test-class'),
    ).toBeInTheDocument()
  })

  it('при viewType=list рендерит столько же карточек', () => {
    mockUseGetItemsListQuery.mockReturnValue({
      data: { items: sampleDtos, total: 2 },
      isLoading: false,
    } as ReturnType<typeof useGetItemsListQuery>)

    renderWithAdsListProviders(<ItemsList />, {
      initialPath: '/ads?viewType=list',
    })

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(
      screen.getByRole('heading', { name: 'Седан Toyota' }),
    ).toBeInTheDocument()
  })

  describe('snapshots', () => {
    it('загрузка (grid по умолчанию)', () => {
      mockUseGetItemsListQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
      } as ReturnType<typeof useGetItemsListQuery>)

      const { container } = renderWithAdsListProviders(<ItemsList />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('данные в режиме grid', () => {
      mockUseGetItemsListQuery.mockReturnValue({
        data: { items: sampleDtos, total: 2 },
        isLoading: false,
      } as ReturnType<typeof useGetItemsListQuery>)

      const { container } = renderWithAdsListProviders(<ItemsList />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('данные в режиме list', () => {
      mockUseGetItemsListQuery.mockReturnValue({
        data: { items: sampleDtos, total: 2 },
        isLoading: false,
      } as ReturnType<typeof useGetItemsListQuery>)

      const { container } = renderWithAdsListProviders(<ItemsList />, {
        initialPath: '/ads?viewType=list',
      })
      expect(container.firstChild).toMatchSnapshot()
    })

    it('пустой список', () => {
      mockUseGetItemsListQuery.mockReturnValue({
        data: { items: [], total: 0 },
        isLoading: false,
      } as any)

      const { container } = renderWithAdsListProviders(<ItemsList />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
