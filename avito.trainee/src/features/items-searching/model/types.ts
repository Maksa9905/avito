import type { EItemCategory } from '@/entities/items'

export enum EItemsSortColumn {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
}

export enum EItemsSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum EItemViewType {
  GRID = 'grid',
  LIST = 'list',
}

export type TSortingOption = {
  value: EItemsSortColumn
  direction: EItemsSortDirection
  title: string
}

export type ItemsListQueryParams = Partial<{
  viewType: EItemViewType
  categories: EItemCategory[]
  needsRevision: boolean
  q: string
  sortColumn: EItemsSortColumn
  sortDirection: EItemsSortDirection
  expandedFilters: boolean
  page: number
}>
