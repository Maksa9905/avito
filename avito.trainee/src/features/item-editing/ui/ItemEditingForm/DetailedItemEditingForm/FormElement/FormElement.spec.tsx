import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { EItemCategory } from '@/entities/items'

import { ItemEditingFormElement } from '@/features/item-editing/model/types'

import { AllProviders } from '@/test/renderWithProviders'

import FormElement from './FormElement'

import type { GetInputPropsReturnType } from '@mantine/form'

const baseInputProps = {
  value: '',
  onChange: () => {},
} as unknown as GetInputPropsReturnType

const wrapper = ({ children }: { children: ReactNode }) => (
  <AllProviders>{children}</AllProviders>
)

describe('FormElement', () => {
  it('в режиме загрузки показывает скелетоны вместо поля ввода', () => {
    const { container } = render(
      <FormElement
        isLoading
        category={undefined}
        fieldName={undefined}
        config={undefined}
        inputProps={undefined}
        label={undefined}
      />,
      { wrapper },
    )

    expect(container.querySelectorAll('.mantine-Skeleton-root').length).toBe(2)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('TEXT: рендерит поле с подписью', () => {
    render(
      <FormElement
        category={EItemCategory.AUTO}
        fieldName="brand"
        label="Марка"
        inputProps={baseInputProps}
        config={{
          title: 'brand',
          type: ItemEditingFormElement.TEXT,
          initialValue: '',
          validate: () => null,
        }}
      />,
      { wrapper },
    )

    expect(screen.getByRole('textbox', { name: 'Марка' })).toBeInTheDocument()
  })

  it('NUMBER: рендерит числовое поле', () => {
    render(
      <FormElement
        category={EItemCategory.AUTO}
        fieldName="mileage"
        label="Пробег"
        inputProps={baseInputProps}
        config={{
          title: 'mileage',
          type: ItemEditingFormElement.NUMBER,
          initialValue: null,
          validate: () => null,
          allowDecimal: true,
          allowNegative: false,
        }}
      />,
      { wrapper },
    )

    expect(screen.getByRole('textbox', { name: 'Пробег' })).toBeInTheDocument()
  })

  it('SELECT: подставляет переведённые подписи опций', () => {
    render(
      <FormElement
        category={EItemCategory.AUTO}
        fieldName="transmission"
        label="Коробка передач"
        inputProps={baseInputProps}
        config={{
          title: 'transmission',
          type: ItemEditingFormElement.SELECT,
          initialValue: null,
          validate: () => null,
          options: [
            { value: 'automatic', label: 'automatic' },
            { value: 'manual', label: 'manual' },
          ],
        }}
      />,
      { wrapper },
    )

    expect(
      screen.getByRole('combobox', { name: 'Коробка передач' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Автомат')).toBeInTheDocument()
    expect(screen.getByText('Механика')).toBeInTheDocument()
  })

  it('без config (не loading) ничего не рендерит', () => {
    render(
      <FormElement
        category={EItemCategory.AUTO}
        fieldName="x"
        label="L"
        inputProps={baseInputProps}
        config={undefined as never}
      />,
      { wrapper },
    )

    expect(screen.queryByLabelText('L')).not.toBeInTheDocument()
  })
})
