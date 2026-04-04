import { useEffect, useMemo, useState } from 'react'
import { useGetItemsListQuery } from '../api/api'
import { mapItemsListQueryParams } from '../api/mappers'
import { useItemsListQueryParams } from './useItemsListQueryParams'

export const useTotalItems = () => {
  const { query } = useItemsListQueryParams()
  const [totalCache, setTotalCache] = useState(0)

  const { data, isLoading, isPending } = useGetItemsListQuery(
    mapItemsListQueryParams(query),
  )

  useEffect(() => {
    if (data?.total) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalCache(data.total)
    }
  }, [data?.total])

  return useMemo(
    () => ({ total: totalCache, isLoading: isLoading || isPending }),
    [isLoading, isPending, totalCache],
  )
}
