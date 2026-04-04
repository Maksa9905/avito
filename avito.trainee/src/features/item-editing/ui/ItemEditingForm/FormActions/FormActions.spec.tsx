import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EItemCategory } from '@/entities/items'

import { AllProviders } from '@/test/renderWithProviders'

import FormProvider from '../FormProvider/FormProvider'
import FormActions from './FormActions'

import type { UseFormReturnType } from '@mantine/form'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from '@/features/item-editing/model/types'

const mockUseValidity = vi.hoisted(() => vi.fn(() => false))

vi.mock('@/features/item-editing/model/useCommonItemEditingFormValidity', () => ({
  useItemEditingFormValidity: () => mockUseValidity(),
}))

function createContextValue() {
  const common = {
    getValues: vi.fn(() => ({
      title: 'T',
      description: 'D',
      price: 100,
      category: EItemCategory.AUTO,
    })),
    key: (k: string) => k,
  } as unknown as UseFormReturnType<CommonItemsEditingFormValues>

  const autoValues: AutoFormValues = {
    brand: 'VW',
    model: 'Golf',
    yearOfManufacture: 2015,
    transmission: null,
    mileage: 10,
    enginePower: 90,
  }

  const detailedForms = {
    [EItemCategory.AUTO]: {
      getValues: vi.fn(() => autoValues),
    },
    [EItemCategory.REAL_ESTATE]: { getValues: vi.fn() },
    [EItemCategory.ELECTRONICS]: { getValues: vi.fn() },
  } as unknown as {
    [EItemCategory.AUTO]: UseFormReturnType<AutoFormValues>
    [EItemCategory.REAL_ESTATE]: UseFormReturnType<RealEstateFormValues>
    [EItemCategory.ELECTRONICS]: UseFormReturnType<ElecrtonicFormValues>
  }

  return { common, detailedForms }
}

function TestRoot({
  children,
  ctx,
}: {
  children: ReactNode
  ctx: ReturnType<typeof createContextValue>
}) {
  return (
    <AllProviders>
      <FormProvider
        value={{
          common: ctx.common,
          ...ctx.detailedForms,
        }}
      >
        {children}
      </FormProvider>
    </AllProviders>
  )
}

describe('FormActions', () => {
  beforeEach(() => {
    mockUseValidity.mockReturnValue(false)
  })

  it('блокирует «Сохранить», пока форма невалидна', () => {
    mockUseValidity.mockReturnValue(false)
    const ctx = createContextValue()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()

    render(
      <TestRoot ctx={ctx}>
        <FormActions
          onSave={onSave}
          onCancel={onCancel}
        />
      </TestRoot>,
    )

    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeDisabled()
  })

  it('при валидной форме сохраняет объединённые значения common и детальной формы', async () => {
    const user = userEvent.setup()
    mockUseValidity.mockReturnValue(true)
    const ctx = createContextValue()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()

    render(
      <TestRoot ctx={ctx}>
        <FormActions
          onSave={onSave}
          onCancel={onCancel}
        />
      </TestRoot>,
    )

    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith({
      title: 'T',
      description: 'D',
      price: 100,
      category: EItemCategory.AUTO,
      brand: 'VW',
      model: 'Golf',
      yearOfManufacture: 2015,
      transmission: null,
      mileage: 10,
      enginePower: 90,
    })
  })

  it('вызывает onCancel по кнопке «Отменить»', async () => {
    const user = userEvent.setup()
    mockUseValidity.mockReturnValue(true)
    const ctx = createContextValue()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()

    render(
      <TestRoot ctx={ctx}>
        <FormActions
          onSave={onSave}
          onCancel={onCancel}
        />
      </TestRoot>,
    )

    await user.click(screen.getByRole('button', { name: 'Отменить' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
