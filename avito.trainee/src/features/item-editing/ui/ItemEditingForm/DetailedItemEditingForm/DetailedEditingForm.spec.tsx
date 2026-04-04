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
import DetailedEditingForm from './DetailedEditingForm'

function DetailedHarness({
  category = EItemCategory.AUTO,
  isLoading,
}: {
  category?: EItemCategory | null
  isLoading?: boolean
}) {
  const common = useForm<CommonItemsEditingFormValues>({
    initialValues: {
      title: 't',
      description: 'd',
      price: 100,
      category,
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
      <DetailedEditingForm isLoading={isLoading} />
    </FormProvider>
  )
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AllProviders>{children}</AllProviders>
)

describe('DetailedEditingForm', () => {
  it('показывает заголовок секции и поля выбранной категории', () => {
    render(
      <DetailedHarness category={EItemCategory.AUTO} />,
      { wrapper },
    )

    expect(screen.getByRole('heading', { name: 'Характеристики' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Марка' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Модель' })).toBeInTheDocument()
  })

  it('без категории не показывает детальные поля', () => {
    render(
      <DetailedHarness category={null} />,
      { wrapper },
    )

    expect(screen.getByRole('heading', { name: 'Характеристики' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Марка' })).not.toBeInTheDocument()
  })

  it('в состоянии загрузки показывает скелетоны вместо полей', () => {
    const { container } = render(
      <DetailedHarness
        category={EItemCategory.AUTO}
        isLoading
      />,
      { wrapper },
    )

    const skeletons = container.querySelectorAll('.mantine-Skeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
    expect(screen.queryByRole('textbox', { name: 'Марка' })).not.toBeInTheDocument()
  })
})
