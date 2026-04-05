import { useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { EItemCategory } from '@/entities/items'

import type { CommonItemsEditingFormValues } from './types'
import { useEffect } from 'react'

export type UseCommonItemEditingFormParams = {
  initialValues?: CommonItemsEditingFormValues
}

export const useCommonItemEditingForm = ({
  initialValues,
}: UseCommonItemEditingFormParams) => {
  const { t } = useTranslation('items')

  const commonForm = useForm<CommonItemsEditingFormValues>({
    initialValues: {
      title: '',
      description: '',
      price: null,
      category: EItemCategory.AUTO,
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    validate: {
      title: (value: string) =>
        value.length > 0 ? null : t('edit.common.title.required'),
      price: (value: number | null) =>
        value != null && value > 0 ? null : t('edit.common.price.required'),
      category: (value: EItemCategory | null) =>
        value ? null : t('edit.common.category.required'),
    },
  })

  useEffect(() => {
    if (initialValues) {
      commonForm.setValues(initialValues)
      commonForm.resetDirty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  return commonForm
}
