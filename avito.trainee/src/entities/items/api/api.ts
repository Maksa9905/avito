import { ApiController } from '@/shared/api'

import type {
  ItemDetailDto,
  ItemUpdateBody,
  ItemUpdateSuccessResponse,
} from './types'

export async function fetchItemById(
  itemId: number | string,
): Promise<ItemDetailDto> {
  return ApiController.send<ItemDetailDto>({
    method: 'GET',
    url: `/items/${itemId}`,
  })
}

export async function updateItem(
  itemId: number | string,
  body: ItemUpdateBody,
): Promise<ItemUpdateSuccessResponse> {
  return ApiController.send<ItemUpdateSuccessResponse>({
    method: 'PUT',
    url: `/items/${itemId}`,
    data: body,
  })
}
