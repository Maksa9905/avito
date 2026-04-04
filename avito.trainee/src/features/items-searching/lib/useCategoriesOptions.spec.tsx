import { describe, expect, it } from 'vitest'

import { renderHook } from '@testing-library/react'

import { AllProviders } from '@/test/renderWithProviders'

import useCategoriesOptions from './useCategoriesOptions'

describe('useCategoriesOptions', () => {
  it('возвращает все категории с переведёнными label', () => {
    const { result } = renderHook(() => useCategoriesOptions(), {
      wrapper: AllProviders,
    })

    expect(result.current).toHaveLength(3)
    expect(result.current.map((o) => o.value)).toEqual([
      'auto',
      'real_estate',
      'electronics',
    ])
    expect(result.current.map((o) => o.label)).toEqual([
      'Авто',
      'Недвижимость',
      'Электроника',
    ])
  })
})
