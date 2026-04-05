import { useCallback, useMemo } from 'react'

import { Select } from '@mantine/core'

import styles from './ItemsSortingSelect.module.css'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'
import { useTranslation } from 'react-i18next'

import {
  useSortingOptions,
  selectSortingOptionTitle,
} from '../../lib/useSortingOptions'
import { tItemsDynamic } from '@/shared/i18n/tItemsDynamic'

type ItemsSortingSelectProps = {
  className?: string
}

const ItemsSortingSelect = ({ className }: ItemsSortingSelectProps) => {
  const { t } = useTranslation('items')

  const [sortingOption, setSortingOption] = useQueryParams({
    sortColumn: withDefault(StringParam, undefined),
    sortDirection: withDefault(StringParam, undefined),
  })

  const sortingOptions = useSortingOptions()

  const data = useMemo(
    () => sortingOptions.map(selectSortingOptionTitle),
    [sortingOptions],
  )

  const sortingValue = useMemo(() => {
    const sortKey = `sorting.${sortingOption.sortColumn}.${sortingOption.sortDirection}`
    const title = tItemsDynamic(t, sortKey)

    if (sortingOptions.find((option) => option.title === title))
      return tItemsDynamic(t, sortKey)

    return null
  }, [sortingOption.sortColumn, sortingOption.sortDirection, sortingOptions, t])

  const handleChange = useCallback(
    (title: string | null) => {
      const nextSortingOption = sortingOptions.find(
        (option) => option.title === title,
      )

      if (nextSortingOption) {
        setSortingOption({
          sortColumn: nextSortingOption.value,
          sortDirection: nextSortingOption.direction,
        })
      } else {
        setSortingOption({
          sortColumn: undefined,
          sortDirection: undefined,
        })
      }
    },
    [sortingOptions, setSortingOption],
  )

  return (
    <Select
      variant="default"
      value={sortingValue}
      classNames={{
        input: styles.input,
      }}
      clearable
      placeholder={t('sorting.placeholder')}
      onChange={handleChange}
      className={className}
      data={data}
    />
  )
}

export default ItemsSortingSelect
