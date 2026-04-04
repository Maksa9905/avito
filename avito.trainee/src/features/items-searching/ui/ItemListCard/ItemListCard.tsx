import { Box, Image, Skeleton, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { StockImagePlaceholder } from '@/shared/ui/StockImagePlaceholder'
import { cn } from '@/shared/utils/cn'

import { type IItem, NeedsRevisionChip } from '@/entities/items'

import { type EItemViewType } from '../../model/types'

import styles from './ItemListCard.module.css'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

type ItemListCardProps<TSkeleton extends boolean = false> = {
  item: TSkeleton extends true ? IItem | undefined : IItem
  isLoading?: TSkeleton
  type: EItemViewType.LIST
  className?: string
}

const ItemListCard = <TSkeleton extends boolean = false>({
  isLoading,
  item,
  className,
}: ItemListCardProps<TSkeleton>) => {
  const { t } = useTranslation('items')

  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    if (item) navigate(`/ads/${item.id}`)
  }, [item, navigate])

  if (isLoading || !item) {
    return <Skeleton className={cn(styles.card, className)} />
  }

  return (
    <Box
      className={cn(styles.card, className)}
      component="li"
      tabIndex={0}
      onClick={handleClick}
    >
      {item.imageURL ? (
        <Image
          className={styles.image}
          src={item.imageURL}
          alt={item.title}
          width={180}
          height={132}
        />
      ) : (
        <StockImagePlaceholder
          className={styles.image}
          label={item.title}
        />
      )}
      <Box className={styles.info}>
        <Box
          component="span"
          className={styles.category}
        >
          {t(`categories.${item.category}`)}
        </Box>
        <Title
          className={styles.title}
          order={2}
        >
          {item.title}
        </Title>
        <Box
          component="span"
          className={styles.price}
        >
          {item.price}₽
        </Box>
        {item.needsRevision && (
          <NeedsRevisionChip className={styles.needsRevision} />
        )}
      </Box>
    </Box>
  )
}

export default ItemListCard
