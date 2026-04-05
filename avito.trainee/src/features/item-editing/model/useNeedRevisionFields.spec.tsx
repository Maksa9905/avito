import { describe, expect, it } from 'vitest'

import { renderHook } from '@testing-library/react'

import {
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
} from '@/entities/items'
import { AllProviders } from '@/test/renderWithProviders'

import type { ElectronicsItemDetailDto } from '../api/types'
import { useNeedRevisionFields } from './useNeedRevisionFields'

const baseElectronicsItem = (): ElectronicsItemDetailDto => ({
  id: 1,
  title: 'Телефон',
  price: 5000,
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z',
  needsRevision: true,
  category: EItemCategory.ELECTRONICS,
  params: {
    type: EElectronicsType.PHONE,
    brand: 'Samsung',
    model: 'S21',
    condition: EElectronicsCondition.USED,
    color: 'чёрный',
  },
})

describe('useNeedRevisionFields', () => {
  it('для undefined возвращает пустой массив', () => {
    const { result } = renderHook(() => useNeedRevisionFields(undefined), {
      wrapper: AllProviders,
    })
    expect(result.current).toEqual([])
  })

  it('если все характеристики валидны, возвращает пустой массив', () => {
    const { result } = renderHook(
      () => useNeedRevisionFields(baseElectronicsItem()),
      { wrapper: AllProviders },
    )
    expect(result.current).toEqual([])
  })

  it('возвращает переведённые названия невалидных полей', () => {
    const item = baseElectronicsItem()
    item.params = {
      ...item.params,
      brand: '',
      color: '',
    }

    const { result } = renderHook(() => useNeedRevisionFields(item), {
      wrapper: AllProviders,
    })

    expect(result.current).toEqual(expect.arrayContaining(['Бренд', 'Цвет']))
    expect(result.current).toHaveLength(2)
  })
})
