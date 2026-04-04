import { describe, expect, it } from 'vitest'

import { renderHook } from '@testing-library/react'

import { AllProviders } from '@/test/renderWithProviders'

import {
  EItemsSortColumn,
  EItemsSortDirection,
  type TSortingOption,
} from '../model/types'
import {
  selectSortingOptionTitle,
  useSortingOptions,
} from './useSortingOptions'

describe('useSortingOptions', () => {
  it('возвращает 4 варианта сортировки с переводами', () => {
    const { result } = renderHook(() => useSortingOptions(), {
      wrapper: AllProviders,
    })

    expect(result.current).toHaveLength(4)
    expect(result.current.map((o) => o.value)).toEqual([
      EItemsSortColumn.TITLE,
      EItemsSortColumn.CREATED_AT,
      EItemsSortColumn.TITLE,
      EItemsSortColumn.CREATED_AT,
    ])
    expect(result.current.map((o) => o.direction)).toEqual([
      EItemsSortDirection.ASC,
      EItemsSortDirection.ASC,
      EItemsSortDirection.DESC,
      EItemsSortDirection.DESC,
    ])
  })
})

describe('selectSortingOptionTitle', () => {
  it('возвращает title опции', () => {
    const option: TSortingOption = {
      title: 'Произвольный заголовок',
      value: EItemsSortColumn.TITLE,
      direction: EItemsSortDirection.ASC,
    }

    expect(selectSortingOptionTitle(option)).toBe('Произвольный заголовок')
  })
})
