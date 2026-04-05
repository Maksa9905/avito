import { Divider, Stack } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { cn } from '@/shared/utils/cn'
import { useGetItemByIdQuery } from '@/features/item-editing'

import AdViewPageHeader from './AdViewPageHeader'
import AdViewPageContent from './AdViewPageContent'

import styles from './AdViewPage.module.css'

export const AdViewPage = () => {
  const { id } = useParams<{ id: string }>()

  const { isLoading, isPending } = useGetItemByIdQuery(id)

  return (
    <Stack
      className={cn(
        styles.wrapper,
        Boolean(isLoading || isPending) && styles.loading,
      )}
    >
      <Stack className={styles.container}>
        <AdViewPageHeader />
        <Divider />
        <AdViewPageContent />
      </Stack>
    </Stack>
  )
}

export default AdViewPage
