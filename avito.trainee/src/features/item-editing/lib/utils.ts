import type { TFunction } from 'i18next'

import { EItemCategory } from '@/entities/items'
import { tItemsDynamic } from '@/shared/i18n/tItemsDynamic'

import { ITEM_EDITING_FORM_FIELDS } from './detailedFormConfig'

function getFieldErrorI18nKey(
  category: EItemCategory,
  fieldName: string,
  errorKey: string,
) {
  return `form.edit.${category}.${fieldName}.${errorKey}`
}

export function getFieldTitleI18nKey(
  category: EItemCategory,
  fieldName: string,
) {
  return `form.edit.${category}.${fieldName}.title`
}

export function getFieldSelectOptionI18nKey(
  category: EItemCategory,
  fieldName: string,
  optionValue: string,
) {
  return `form.edit.${category}.${fieldName}.options.${optionValue}`
}

export function getFormInitialValues(category: EItemCategory) {
  const fields = ITEM_EDITING_FORM_FIELDS[category]

  return Object.fromEntries(
    Object.entries(fields).map(([key, def]) => [key, def.initialValue]),
  )
}

export function getFormValidationRules(
  category: EItemCategory,
  t: TFunction<'items'>,
) {
  const fields = ITEM_EDITING_FORM_FIELDS[category]

  return Object.fromEntries(
    Object.entries(fields).map(([fieldName, def]) => [
      fieldName,
      (value: unknown) => {
        const errorKey = def.validate(value as never)
        return errorKey === null
          ? null
          : tItemsDynamic(t, getFieldErrorI18nKey(category, fieldName, errorKey))
      },
    ]),
  )
}
