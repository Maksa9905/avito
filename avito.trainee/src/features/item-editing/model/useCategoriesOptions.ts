import { EItemCategory } from '@/entities/items'
import { useTranslation } from 'react-i18next'

export const useCategoriesOptions = () => {
  const { t } = useTranslation('items')

  return Object.values(EItemCategory).map((value) => ({
    value,
    label: t(`categories.${value}`),
  })) as { value: EItemCategory; label: string }[]
}

export default useCategoriesOptions
