import { useQuery } from '@tanstack/react-query'
import type {
  ApiGetItemsListQueryParams,
  ApiGetItemsListResponse,
} from './types'
import { ApiController } from '@/shared/api'

export const useGetItemsListQuery = (payload: ApiGetItemsListQueryParams) => {
  return useQuery<ApiGetItemsListResponse>({
    queryKey: ['items', 'list', payload],
    queryFn: () =>
      ApiController.send({
        method: 'GET',
        url: '/items',
        params: payload,
      }),
  })
}
