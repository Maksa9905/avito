import { Stack } from '@mantine/core'
import { cn } from '@/shared/utils/cn'

import styles from './PageContainer.module.css'

type PageContainerProps = {
  children?: React.ReactNode
  classNames?: {
    container?: string
    wrapper?: string
  }
}

const PageContainer = ({ children, classNames }: PageContainerProps) => {
  return (
    <Stack className={cn(styles.wrapper, classNames?.wrapper)}>
      <Stack className={cn(styles.container, classNames?.container)}>
        {children}
      </Stack>
    </Stack>
  )
}

export default PageContainer
