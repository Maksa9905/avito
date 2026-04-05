import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ITEM_EDITING_FORM_FIELDS } from '../lib/detailedFormConfig'
import { isDetailedFieldInvalid } from '../lib/detailedFieldParams'

import type { ItemDetailDto } from '../api/types'
import type { ItemEditingFieldConfig } from './types'

export function useNeedRevisionFields(
  item: ItemDetailDto | undefined,
): string[] {
  const { t } = useTranslation('items')

  return useMemo(() => {
    const result: string[] = []
    const category = item?.category

    if (!category || !item) return result

    const configMap = ITEM_EDITING_FORM_FIELDS[category] as Record<
      string,
      ItemEditingFieldConfig
    >

    const params = item.params as Record<string, unknown>

    for (const [key, config] of Object.entries(configMap)) {
      if (isDetailedFieldInvalid(config, params[key])) {
        result.push(t(`form.edit.${category}.${key}.title`))
      }
    }

    return result
  }, [item, t])
}
