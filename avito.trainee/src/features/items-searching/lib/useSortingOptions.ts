import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  EItemsSortColumn,
  EItemsSortDirection,
  type TSortingOption,
} from '../model/types'

const sortingOptions = Object.values(EItemsSortDirection).flatMap((direction) =>
  Object.values(EItemsSortColumn).map((column) => ({
    column: column,
    direction: direction,
    translationKey: `sorting.${column}.${direction}`,
  })),
)

export const useSortingOptions = () => {
  const { t } = useTranslation('items')

  return useMemo(
    () =>
      sortingOptions.map((option) => ({
        title: t(option.translationKey),
        value: option.column,
        direction: option.direction,
      })),
    [t],
  )
}

export const selectSortingOptionTitle = (sortingOption: TSortingOption) =>
  sortingOption.title
