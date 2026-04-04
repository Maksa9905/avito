import type { IItem } from '@/entities/items'
import { EItemViewType } from '../../model/types'
import { useItemsListQueryParams } from '../../lib/useItemsListQueryParams'
import ItemGridCard from '../ItemGridCard'
import ItemListCard from '../ItemListCard'

type ItemsListItemProps<TSkeleton extends boolean = false> = {
  item: TSkeleton extends true ? IItem | undefined : IItem
  className?: string
  isLoading?: TSkeleton
}

const ItemsListItem = <TSkeleton extends boolean = false>({
  item,
  className,
  isLoading,
}: ItemsListItemProps<TSkeleton>) => {
  const { query } = useItemsListQueryParams()

  if (query.viewType === EItemViewType.GRID)
    return (
      <ItemGridCard
        type={query.viewType}
        item={item}
        className={className}
        isLoading={isLoading}
      />
    )

  if (query.viewType === EItemViewType.LIST)
    return (
      <ItemListCard
        type={query.viewType}
        item={item}
        className={className}
        isLoading={isLoading}
      />
    )

  return null
}

export default ItemsListItem
