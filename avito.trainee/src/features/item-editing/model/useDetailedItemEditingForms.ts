import { useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { EItemCategory } from '@/entities/items'

import { getFormInitialValues, getFormValidationRules } from '../lib/utils'

import type {
  AutoFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
  DetailedFormValues,
} from './types'
import { useEffect } from 'react'

export type UseDetailedItemEditingFormsParams = {
  initialValues?: DetailedFormValues
  category?: EItemCategory
}

export const useDetailedItemEditingForms = ({
  initialValues,
  category,
}: UseDetailedItemEditingFormsParams) => {
  const { t } = useTranslation('items')

  const autoForm = useForm<AutoFormValues>({
    initialValues: getFormInitialValues(EItemCategory.AUTO) as AutoFormValues,
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    validate: getFormValidationRules(EItemCategory.AUTO, t),
  })

  const realEstateForm = useForm<RealEstateFormValues>({
    initialValues: getFormInitialValues(
      EItemCategory.REAL_ESTATE,
    ) as RealEstateFormValues,
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    validate: getFormValidationRules(EItemCategory.REAL_ESTATE, t),
  })

  const electronicsForm = useForm<ElecrtonicFormValues>({
    initialValues: getFormInitialValues(
      EItemCategory.ELECTRONICS,
    ) as ElecrtonicFormValues,
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    validate: getFormValidationRules(EItemCategory.ELECTRONICS, t),
  })

  useEffect(() => {
    if (initialValues === undefined || category === undefined) {
      return
    }

    switch (category) {
      case EItemCategory.AUTO:
        autoForm.setValues(initialValues as AutoFormValues)
        break
      case EItemCategory.REAL_ESTATE:
        realEstateForm.setValues(initialValues as RealEstateFormValues)
        break
      case EItemCategory.ELECTRONICS:
        electronicsForm.setValues(initialValues as ElecrtonicFormValues)
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, category])

  return {
    [EItemCategory.AUTO]: autoForm,
    [EItemCategory.REAL_ESTATE]: realEstateForm,
    [EItemCategory.ELECTRONICS]: electronicsForm,
  }
}
