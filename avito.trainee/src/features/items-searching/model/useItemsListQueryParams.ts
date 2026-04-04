import {
  ArrayParam,
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params'
import { EItemViewType, type ItemsListQueryParams } from './types'
import { useCallback } from 'react'

export const useItemsListQueryParams = () => {
  const [query, setQuery] = useQueryParams({
    viewType: withDefault(StringParam, EItemViewType.GRID),
    categories: withDefault(ArrayParam, []),
    needsRevision: withDefault(BooleanParam, false),
    q: withDefault(StringParam, ''),
    sortColumn: withDefault(StringParam, undefined),
    sortDirection: withDefault(StringParam, undefined),
    expandedFilters: withDefault(BooleanParam, false),
    page: withDefault(NumberParam, 1),
  })

  const handleChangeQuery = useCallback(
    (values: Partial<ItemsListQueryParams>) => {
      if (
        'page' in values ||
        'expandedFilters' in values ||
        'viewType' in values
      ) {
        setQuery(values)
      } else {
        setQuery({ ...values, page: 1 })
      }
    },
    [setQuery],
  )

  return { query: query as ItemsListQueryParams, setQuery: handleChangeQuery }
}
