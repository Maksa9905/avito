import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiController } from '@/shared/api'

import type {
  ItemDetailDto,
  ItemUpdateBody,
  ItemUpdateSuccessResponse,
} from './types'

export const useGetItemByIdQuery = (itemId: number | string | undefined) => {
  return useQuery<ItemDetailDto>({
    queryKey: ['items', 'detail', itemId],
    queryFn: () =>
      ApiController.send<ItemDetailDto>({
        method: 'GET',
        url: `/items/${itemId}`,
      }),
    enabled:
      itemId !== undefined && itemId !== '' && Number.isFinite(Number(itemId)),
  })
}

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      body,
    }: {
      itemId: number | string
      body: ItemUpdateBody
    }) =>
      ApiController.send<ItemUpdateSuccessResponse>({
        method: 'PUT',
        url: `/items/${itemId}`,
        data: body,
      }),
    onSuccess: (_, { itemId }) => {
      void queryClient.invalidateQueries({
        queryKey: ['items', 'detail', itemId],
      })
      void queryClient.invalidateQueries({ queryKey: ['items', 'list'] })
    },
  })
}
