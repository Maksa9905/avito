import { useGetItemByIdQuery } from '@/features/item-editing'
import AdViewPageContentLoaded from './AdViewPageContent'
import AdViewPageContentLoader from './AdViewPageContentLoader'
import { useParams } from 'react-router-dom'
import ErrorIcon from '@/shared/icons/ErrorIcon'

const AdViewPageContent = () => {
  const { id } = useParams<{ id: string }>()
  const { isLoading, isError } = useGetItemByIdQuery(id)

  if (isError) return <ErrorIcon />
  if (isLoading) return <AdViewPageContentLoader />
  return <AdViewPageContentLoaded />
}

export default AdViewPageContent
