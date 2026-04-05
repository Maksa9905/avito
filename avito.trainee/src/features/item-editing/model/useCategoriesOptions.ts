import { EItemCategory } from '@/entities/items'
import { useTranslation } from 'react-i18next'

import { tItemsDynamic } from '@/shared/i18n/tItemsDynamic'

export const useCategoriesOptions = () => {
  const { t } = useTranslation('items')

  return Object.values(EItemCategory).map((value) => ({
    value,
    label: tItemsDynamic(t, `categories.${value}`),
  })) as { value: EItemCategory; label: string }[]
}

export default useCategoriesOptions
