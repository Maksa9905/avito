import type { ApiGetItemsListQueryParams, ItemsListItemDto } from './types'
import type { ItemsListQueryParams } from '../model/types'

import { ITEMS_LIST_QUERY_LIMIT } from '../lib/constants'

import type { IItem } from '@/entities/items'

export const mapItemsListQueryParams = (
  query: ItemsListQueryParams,
): ApiGetItemsListQueryParams => ({
  q: query.q,
  limit: ITEMS_LIST_QUERY_LIMIT,
  skip: query.page ? (query.page - 1) * ITEMS_LIST_QUERY_LIMIT : 0,
  categories: query.categories?.join(','),
  needsRevision: query.needsRevision,
  sortColumn: query.sortColumn,
  sortDirection: query.sortDirection,
})

export function mapItemsListDtoToItem(dto: ItemsListItemDto): IItem {
  return {
    id: String(dto.id),
    category: dto.category,
    title: dto.title,
    price: dto.price ?? 0,
    needsRevision: dto.needsRevision,
  }
}
