import type { HTMLAttributes } from 'react'

import StockImageIcon from '@/shared/icons/StockImageIcon'
import { cn } from '@/shared/utils/cn'

import styles from './StockImagePlaceholder.module.css'

type StockImagePlaceholderProps = HTMLAttributes<HTMLDivElement> & {
  label: string
}

export function StockImagePlaceholder({
  className,
  label,
  ...rest
}: StockImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(styles.root, className)}
      {...rest}
    >
      <StockImageIcon
        className={styles.icon}
        aria-hidden
      />
    </div>
  )
}
