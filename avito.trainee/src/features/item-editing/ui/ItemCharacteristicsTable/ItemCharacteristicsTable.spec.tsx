import { describe, expect, it } from 'vitest'

import { screen } from '@testing-library/react'

import {
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
} from '@/entities/items'
import { renderWithProviders } from '@/test/renderWithProviders'

import type { ElectronicsItemDetailDto } from '../../api/types'
import ItemCharacteristicsTable from './ItemCharacteristicsTable'

const validElectronicsItem = (): ElectronicsItemDetailDto => ({
  id: 2,
  title: 'Ноутбук',
  price: 80000,
  createdAt: '2021-05-01T12:00:00.000Z',
  updatedAt: '2021-05-02T12:00:00.000Z',
  needsRevision: false,
  category: EItemCategory.ELECTRONICS,
  params: {
    type: EElectronicsType.LAPTOP,
    brand: 'Lenovo',
    model: 'ThinkPad',
    condition: EElectronicsCondition.NEW,
    color: 'серый',
  },
})

describe('ItemCharacteristicsTable', () => {
  it('не рендерит таблицу, если нет валидных характеристик', () => {
    const item = validElectronicsItem()
    item.params = {}

    const { container } = renderWithProviders(
      <ItemCharacteristicsTable item={item} />,
    )

    expect(
      screen.queryByRole('heading', { name: 'Характеристики' }),
    ).not.toBeInTheDocument()
    expect(container.querySelector('table')).toBeNull()
  })

  it('рендерит заголовок и строки таблицы для валидных params', () => {
    renderWithProviders(
      <ItemCharacteristicsTable item={validElectronicsItem()} />,
    )

    expect(
      screen.getByRole('heading', { name: 'Характеристики' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Бренд')).toBeInTheDocument()
    expect(screen.getByText('Lenovo')).toBeInTheDocument()
    expect(screen.getByText('Ноутбук')).toBeInTheDocument()
  })
})
