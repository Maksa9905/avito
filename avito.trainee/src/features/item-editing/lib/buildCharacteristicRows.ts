import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { EItemCategory } from '@/entities/items'

import {
  ItemEditingFormElement,
  type ItemEditingFieldConfig,
} from '../model/types'
import { ITEM_EDITING_FORM_FIELDS } from './detailedFormConfig'
import { isDetailedFieldInvalid } from './detailedFieldParams'

function formatParamValue(
  value: unknown,
  category: EItemCategory,
  key: string,
  configItem: ItemEditingFieldConfig,
  t: TFunction<'items'>,
): string {
  if (configItem.type === ItemEditingFormElement.TEXT) {
    return String(value)
  }

  if (configItem.type === ItemEditingFormElement.NUMBER) {
    return String(value)
  }

  if (configItem.type === ItemEditingFormElement.SELECT) {
    const option = configItem.options.find((option) => option.value === value)

    if (!option) return String(value)
    return t(`form.edit.${category}.${key}.options.${option.value}`)
  }

  return String(value)
}

export type CharacteristicRow = {
  key: string
  label: string
  value: string
}

export function buildCharacteristicRows(
  category: EItemCategory,
  params: Record<string, unknown>,
  t: TFunction<'items'>,
): CharacteristicRow[] {
  const configMap = ITEM_EDITING_FORM_FIELDS[category] as Record<
    string,
    ItemEditingFieldConfig
  >
  const rows: CharacteristicRow[] = []

  for (const [key, config] of Object.entries(configMap)) {
    const value = params[key]

    if (isDetailedFieldInvalid(config, value)) continue

    rows.push({
      key,
      label: t(`form.edit.${category}.${key}.title`),
      value: formatParamValue(value, category, key, config, t),
    })
  }

  return rows
}

export function useCharacteristicRows(
  category: EItemCategory,
  params: Record<string, unknown>,
): CharacteristicRow[] {
  const { t } = useTranslation('items')

  return useMemo(
    () => buildCharacteristicRows(category, params, t),
    [category, params, t],
  )
}
