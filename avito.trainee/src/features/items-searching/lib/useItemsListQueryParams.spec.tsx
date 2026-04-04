import { describe, expect, it } from 'vitest'

import { act, renderHook } from '@testing-library/react'

import { EItemCategory } from '@/entities/items'
import { createItemsSearchingHookWrapper } from '@/test/renderWithProviders'

import { EItemViewType } from '../model/types'
import { useItemsListQueryParams } from './useItemsListQueryParams'

describe('useItemsListQueryParams', () => {
  it('при смене фильтров (без page/viewType/expandedFilters) сбрасывает page на 1', () => {
    const wrapper = createItemsSearchingHookWrapper('/ads?page=5')
    const { result } = renderHook(() => useItemsListQueryParams(), { wrapper })

    expect(result.current.query.page).toBe(5)

    act(() => {
      result.current.setQuery({ q: 'диван' })
    })

    expect(result.current.query.q).toBe('диван')
    expect(result.current.query.page).toBe(1)
  })

  it('при setQuery только с page не подмешивает сброс страницы из других полей', () => {
    const wrapper = createItemsSearchingHookWrapper('/ads?page=1')
    const { result } = renderHook(() => useItemsListQueryParams(), { wrapper })

    act(() => {
      result.current.setQuery({ page: 7 })
    })

    expect(result.current.query.page).toBe(7)
  })

  it('при setQuery с viewType не сбрасывает номер страницы', () => {
    const wrapper = createItemsSearchingHookWrapper('/ads?page=4')
    const { result } = renderHook(() => useItemsListQueryParams(), { wrapper })

    act(() => {
      result.current.setQuery({ viewType: EItemViewType.LIST })
    })

    expect(result.current.query.page).toBe(4)
    expect(result.current.query.viewType).toBe(EItemViewType.LIST)
  })

  it('при setQuery с expandedFilters не сбрасывает страницу', () => {
    const wrapper = createItemsSearchingHookWrapper('/ads?page=3')
    const { result } = renderHook(() => useItemsListQueryParams(), { wrapper })

    act(() => {
      result.current.setQuery({ expandedFilters: true })
    })

    expect(result.current.query.page).toBe(3)
    expect(result.current.query.expandedFilters).toBe(true)
  })

  it('при смене categories сбрасывает page на 1', () => {
    const wrapper = createItemsSearchingHookWrapper('/ads?page=2')
    const { result } = renderHook(() => useItemsListQueryParams(), { wrapper })

    act(() => {
      result.current.setQuery({
        categories: [EItemCategory.AUTO, EItemCategory.ELECTRONICS],
      })
    })

    expect(result.current.query.categories).toEqual([
      EItemCategory.AUTO,
      EItemCategory.ELECTRONICS,
    ])
    expect(result.current.query.page).toBe(1)
  })
})
