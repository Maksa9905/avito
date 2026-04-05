import AdViewPageHeaderLoaded from './AdViewPageHeader'
import AdViewPageHeaderLoader from './AdViewPageHeaderLoader'
import { useGetItemByIdQuery } from '@/features/item-editing'
import { useParams } from 'react-router-dom'

const AdViewPageHeader = () => {
  const { id } = useParams<{ id: string }>()
  const { isLoading } = useGetItemByIdQuery(id)

  if (isLoading) return <AdViewPageHeaderLoader />
  return <AdViewPageHeaderLoaded />
}

export default AdViewPageHeader
