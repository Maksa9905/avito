import SearchIcon from '@/shared/icons/SearchIcon'
import { TextInput } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useItemsListQueryParams } from '../../lib/useItemsListQueryParams'

type ItemsSearchInputProps = {
  className?: string
}

const SEARCH_DEBOUNCE_MS = 300

const ItemsSearchInput = ({ className }: ItemsSearchInputProps) => {
  const { t } = useTranslation('ads')

  const { query, setQuery } = useItemsListQueryParams()

  const [value, setValue] = useState(() => query.q ?? '')

  useEffect(() => {
    setQuery({ q: value })
  }, [setQuery, value])

  const debouncedSetSearch = useDebouncedCallback(
    (next: string) => {
      setQuery({ q: next || undefined })
    },
    { delay: SEARCH_DEBOUNCE_MS, flushOnUnmount: true },
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setValue(next)
      debouncedSetSearch(next)
    },
    [debouncedSetSearch],
  )

  return (
    <TextInput
      variant="filled"
      placeholder={t('searchAd')}
      rightSection={<SearchIcon />}
      value={value}
      onChange={handleChange}
      className={className}
    />
  )
}

export default ItemsSearchInput
