import { cn } from '@/shared/utils/cn'
import { useItemsListQueryParams } from '../../lib/useItemsListQueryParams'

import styles from './ItemsList.module.css'
import {
  mapItemsListDtoToItem,
  mapItemsListQueryParams,
} from '../../api/mappers'
import { useGetItemsListQuery } from '../../api/api'
import { Box } from '@mantine/core'
import ItemsListItem from './ItemsListItem'
import { useMemo } from 'react'

type ItemsListProps = {
  className?: string
}

const ItemsList = ({ className }: ItemsListProps) => {
  const { query } = useItemsListQueryParams()

  const { data, isLoading } = useGetItemsListQuery(
    mapItemsListQueryParams(query),
  )

  const items = useMemo(
    () => data?.items.map(mapItemsListDtoToItem) || [],
    [data?.items],
  )

  const body = (
    <>
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <ItemsListItem
            key={index}
            item={undefined}
            isLoading
          />
        ))}
      {!isLoading &&
        items.map((item) => (
          <ItemsListItem
            key={item.id}
            item={item}
          />
        ))}
    </>
  )

  return (
    <Box className={styles.gridQueryHost}>
      <Box
        className={cn(
          styles.container,
          query.viewType && styles[query.viewType],
          className,
        )}
      >
        {body}
      </Box>
    </Box>
  )
}

export default ItemsList
