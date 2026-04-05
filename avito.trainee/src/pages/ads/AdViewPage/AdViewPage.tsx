import { Divider } from '@mantine/core'
import { useParams } from 'react-router-dom'

import PageContainer from '@/widgets/PageContainer'
import { useGetItemByIdQuery } from '@/features/item-editing'

import AdViewPageHeader from './AdViewPageHeader'
import AdViewPageContent from './AdViewPageContent'

import styles from './AdViewPage.module.css'

export const AdViewPage = () => {
  const { id } = useParams<{ id: string }>()

  const { isLoading, isPending } = useGetItemByIdQuery(id)

  return (
    <PageContainer
      classNames={{
        container: styles.container,
        wrapper: isLoading || isPending ? styles.loading : undefined,
      }}
    >
      <AdViewPageHeader />
      <Divider />
      <AdViewPageContent />
    </PageContainer>
  )
}

export default AdViewPage
