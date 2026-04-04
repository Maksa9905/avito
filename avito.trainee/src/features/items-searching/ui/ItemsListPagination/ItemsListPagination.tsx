import { Pagination } from '@mantine/core'
import { useTotalItems } from '../../lib/useTotalItems'
import { ITEMS_LIST_QUERY_LIMIT } from '../../lib/constants'

import styles from './ItemsListPagination.module.css'
import { useItemsListQueryParams } from '../../lib/useItemsListQueryParams'
import { useCallback } from 'react'

type ItemsListPaginationProps = {
  className?: string
}

const ItemsListPagination = ({ className }: ItemsListPaginationProps) => {
  const { total } = useTotalItems()

  const { setQuery, query } = useItemsListQueryParams()

  const handleChangePage = useCallback(
    (page: number) => {
      setQuery({ page })
    },
    [setQuery],
  )

  return (
    <Pagination
      className={className}
      classNames={{ control: styles.control }}
      variant="outlined"
      value={query.page}
      total={total ? Math.ceil(total / ITEMS_LIST_QUERY_LIMIT) : 1}
      onChange={handleChangePage}
    />
  )
}

export default ItemsListPagination
