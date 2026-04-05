import { beforeEach, describe, expect, it, vi } from 'vitest'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  EAutoTransmission,
  EItemCategory,
} from '@/entities/items'
import type { AutoItemDetailDto } from '@/features/item-editing/api/types'
import { renderWithProviders } from '@/test/renderWithProviders'

import AdViewPageHeader from './AdViewPageHeader'

const navigateMock = vi.hoisted(() => vi.fn())

const testItem: AutoItemDetailDto = {
  id: 7,
  title: 'Тестовое авто',
  description: 'Описание',
  price: 999000,
  createdAt: '2024-03-10T14:00:00.000Z',
  updatedAt: '2024-03-11T09:30:00.000Z',
  needsRevision: false,
  category: EItemCategory.AUTO,
  params: {
    brand: 'VW',
    model: 'Golf',
    yearOfManufacture: 2020,
    transmission: EAutoTransmission.MANUAL,
    mileage: 50000,
    enginePower: 150,
  },
}

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: '7' }),
  }
})

const useGetItemByIdQueryMock = vi.hoisted(() => vi.fn())

vi.mock('@/features/item-editing', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/item-editing')>()
  return {
    ...actual,
    useGetItemByIdQuery: useGetItemByIdQueryMock,
  }
})

describe('AdViewPageHeader', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    useGetItemByIdQueryMock.mockReturnValue({ data: testItem })
  })

  it('показывает заголовок, цену и метки дат', () => {
    renderWithProviders(<AdViewPageHeader />)

    expect(
      screen.getByRole('heading', { level: 1, name: testItem.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('999000₽')).toBeInTheDocument()
    expect(screen.getByText(/Опубликовано/)).toBeInTheDocument()
    expect(screen.getByText(/Отредактировано/)).toBeInTheDocument()
  })

  it('по клику «Редактировать» переходит на форму редактирования', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdViewPageHeader />)

    await user.click(screen.getByRole('button', { name: /Редактировать/ }))

    expect(navigateMock).toHaveBeenCalledWith('/ads/7/edit')
  })

  it('по клику «Вернуться к списку» вызывает navigate(-1)', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdViewPageHeader />)

    await user.click(screen.getByRole('button', { name: /Вернуться к списку/ }))

    expect(navigateMock).toHaveBeenCalledWith(-1)
  })
})
