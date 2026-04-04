import ItemViewGridIcon from '@/shared/icons/ItemViewGridIcon'
import ItemViewListIcon from '@/shared/icons/ItemViewListIcon'
import { Group } from '@mantine/core'

import IconButton from '@/shared/ui/IconButton'

import styles from './ItemsViewTypeToggle.module.css'
import { EItemViewType } from '../../model/types'
import { useCallback } from 'react'
import { useItemsListQueryParams } from '../../lib/useItemsListQueryParams'

const ItemsViewTypeToggle = () => {
  const { query, setQuery } = useItemsListQueryParams()

  const handleClickGridType = useCallback(() => {
    setQuery({ viewType: EItemViewType.GRID })
  }, [setQuery])

  const handleClickListType = useCallback(() => {
    setQuery({ viewType: EItemViewType.LIST })
  }, [setQuery])

  return (
    <Group className={styles.group}>
      <IconButton
        aria-selected={query.viewType === EItemViewType.GRID}
        onClick={handleClickGridType}
        className={styles.button}
      >
        <ItemViewGridIcon />
      </IconButton>
      <span className={styles.separator} />
      <IconButton
        aria-selected={query.viewType === EItemViewType.LIST}
        onClick={handleClickListType}
        className={styles.button}
      >
        <ItemViewListIcon />
      </IconButton>
    </Group>
  )
}

export default ItemsViewTypeToggle
