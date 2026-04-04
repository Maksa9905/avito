import { useForm } from '@mantine/form'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeAll, describe, expect, it } from 'vitest'

import { EItemCategory } from '@/entities/items'

import { getFormInitialValues } from '@/features/item-editing/lib/utils'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from '@/features/item-editing/model/types'

import { AllProviders } from '@/test/renderWithProviders'

import FormProvider from '../../FormProvider/FormProvider'
import DescriptionTextField from './DescriptionTextField'

function DescriptionHarness({
  initialDescription = '',
  children,
}: {
  initialDescription?: string
  children: ReactNode
}) {
  const common = useForm<CommonItemsEditingFormValues>({
    initialValues: {
      title: '',
      description: initialDescription,
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

  const detailed = {
    [EItemCategory.AUTO]: autoForm,
    [EItemCategory.REAL_ESTATE]: realEstateForm,
    [EItemCategory.ELECTRONICS]: electronicsForm,
  }

  return (
    <FormProvider
      value={{
        common,
        ...detailed,
      }}
    >
      {children}
    </FormProvider>
  )
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AllProviders>
    <DescriptionHarness>{children}</DescriptionHarness>
  </AllProviders>
)

describe('DescriptionTextField', () => {
  beforeAll(() => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    if (!document.fonts) {
      Object.defineProperty(document, 'fonts', {
        configurable: true,
        value: {
          addEventListener: () => {},
          removeEventListener: () => {},
        },
      })
    }
  })

  it('ограничивает длину описания (maxLength)', () => {
    render(<DescriptionTextField />, { wrapper })

    const area = screen.getByRole('textbox', { name: 'Описание' })
    expect(area).toHaveAttribute('maxlength', '1000')
  })

  it('счётчик символов обновляется при вводе', async () => {
    const user = userEvent.setup()
    render(<DescriptionTextField />, { wrapper })

    const area = screen.getByRole('textbox', { name: 'Описание' })
    await user.type(area, 'abc')

    await waitFor(() => {
      expect(screen.getByText('3 / 1000')).toBeInTheDocument()
    })
  })
})
