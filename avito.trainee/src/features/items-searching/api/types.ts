import type { EItemCategory } from '@/entities/items'
import type { EItemsSortColumn, EItemsSortDirection } from '../model/types'

export type ApiGetItemsListQueryParams = {
  q?: string
  limit?: number
  skip?: number
  categories?: string
  needsRevision?: boolean
  sortColumn?: EItemsSortColumn
  sortDirection?: EItemsSortDirection
}

export type ApiGetItemsListResponse = {
  items: ItemsListItemDto[]
  total: number
}

export type ItemsListItemDto = {
  id: number
  category: EItemCategory
  title: string
  price: number | null
  needsRevision: boolean
  images?: string[]
}
