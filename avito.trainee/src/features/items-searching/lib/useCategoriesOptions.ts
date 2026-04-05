import { EItemCategory } from '@/entities/items'
import { useTranslation } from 'react-i18next'

import { tItemsDynamic } from '@/shared/i18n/tItemsDynamic'

const categoriesOptions = Object.values(EItemCategory).map((value) => ({
  value,
  translationKey: `categories.${value}`,
}))

const useCatigoriesOptions = () => {
  const { t } = useTranslation('items')

  return categoriesOptions.map((option) => ({
    ...option,
    label: tItemsDynamic(t, option.translationKey),
  }))
}

export default useCatigoriesOptions
