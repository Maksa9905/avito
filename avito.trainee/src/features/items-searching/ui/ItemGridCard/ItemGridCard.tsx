import { Box, Image, Skeleton, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { StockImagePlaceholder } from '@/shared/ui/StockImagePlaceholder'
import { cn } from '@/shared/utils/cn'

import type { EItemViewType } from '../../model/types'
import { type IItem, NeedsRevisionChip } from '@/entities/items'

import styles from './ItemGridCard.module.css'

type ItemGridCardProps<TSkeleton extends boolean = false> = {
  item: TSkeleton extends true ? IItem | undefined : IItem
  isLoading?: TSkeleton
  type: EItemViewType.GRID
  className?: string
}

const ItemGridCard = <TSkeleton extends boolean = false>({
  isLoading,
  item,
  className,
}: ItemGridCardProps<TSkeleton>) => {
  const { t } = useTranslation('items')

  if (isLoading || !item) {
    return <Skeleton className={styles.card} />
  }

  return (
    <Box
      className={cn(styles.card, className)}
      component="li"
    >
      {item.imageURL ? (
        <Image
          className={styles.image}
          src={item.imageURL}
          alt={item.title}
          width={200}
          height={150}
        />
      ) : (
        <StockImagePlaceholder
          className={styles.image}
          label={item.title}
        />
      )}
      <Box className={styles.category}>{t(`categories.${item.category}`)}</Box>
      <Box className={styles.info}>
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

export default ItemGridCard
