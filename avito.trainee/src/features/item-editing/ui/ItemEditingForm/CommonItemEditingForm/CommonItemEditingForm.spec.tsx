import { useForm } from '@mantine/form'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { EItemCategory } from '@/entities/items'

import { getFormInitialValues } from '@/features/item-editing/lib/utils'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from '@/features/item-editing/model/types'

import { AllProviders } from '@/test/renderWithProviders'

import FormProvider from '../FormProvider/FormProvider'
import CommonItemEditingForm from './CommonItemEditingForm'

function CommonHarness() {
  const common = useForm<CommonItemsEditingFormValues>({
    initialValues: {
      title: '',
      description: '',
      price: null,
      category: null,
    },
  })

  const autoForm = useForm<AutoFormValues>({
    initialValues: getFormInitialValues(EItemCategory.AUTO) as AutoFormValues,
  })
  const realEstateForm = useForm<RealEstateFormValues>({
    initialValues: getFormInitialValues(
      EItemCategory.REAL_ESTATE,
    ) as RealEstateFormValues,
  })
  const electronicsForm = useForm<ElecrtonicFormValues>({
    initialValues: getFormInitialValues(
      EItemCategory.ELECTRONICS,
    ) as ElecrtonicFormValues,
  })

  return (
    <FormProvider
      value={{
        common,
        [EItemCategory.AUTO]: autoForm,
        [EItemCategory.REAL_ESTATE]: realEstateForm,
        [EItemCategory.ELECTRONICS]: electronicsForm,
      }}
    >
      <CommonItemEditingForm />
    </FormProvider>
  )
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AllProviders>{children}</AllProviders>
)

describe('CommonItemEditingForm', () => {
  it('показывает поля категории, названия и цены', () => {
    render(
      <CommonHarness />,
      { wrapper },
    )

    expect(screen.getByRole('textbox', { name: 'Название' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Цена' })).toBeInTheDocument()
    expect(screen.getByText('Категория')).toBeInTheDocument()
  })
})
