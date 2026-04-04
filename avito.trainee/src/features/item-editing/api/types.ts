import {
  type EAutoTransmission,
  type EElectronicsCondition,
  type EElectronicsType,
  EItemCategory,
  type ERealEstateType,
} from '@/entities/items'

export type AutoItemParamsDto = {
  brand?: string
  model?: string
  yearOfManufacture?: number
  transmission?: EAutoTransmission
  mileage?: number
  enginePower?: number
}

export type RealEstateItemParamsDto = {
  type?: ERealEstateType
  address?: string
  area?: number
  floor?: number
}

export type ElectronicsItemParamsDto = {
  type?: EElectronicsType
  brand?: string
  model?: string
  condition?: EElectronicsCondition
  color?: string
}

export type BaseItemDetailDto = {
  id: number
  title: string
  description?: string
  price: number | null
  createdAt: string
  updatedAt: string
  needsRevision: boolean
}

export type AutoItemDetailDto = BaseItemDetailDto & {
  category: EItemCategory.AUTO
  params: AutoItemParamsDto
}

export type RealEstateItemDetailDto = BaseItemDetailDto & {
  category: EItemCategory.REAL_ESTATE
  params: RealEstateItemParamsDto
}

export type ElectronicsItemDetailDto = BaseItemDetailDto & {
  category: EItemCategory.ELECTRONICS
  params: ElectronicsItemParamsDto
}

export type ItemDetailDto =
  | AutoItemDetailDto
  | RealEstateItemDetailDto
  | ElectronicsItemDetailDto

export type AutoItemUpdateBody = {
  category: EItemCategory.AUTO
  title: string
  description?: string
  price: number
  params?: Partial<AutoItemParamsDto>
}

export type RealEstateItemUpdateBody = {
  category: EItemCategory.REAL_ESTATE
  title: string
  description?: string
  price: number
  params?: Partial<RealEstateItemParamsDto>
}

export type ElectronicsItemUpdateBody = {
  category: EItemCategory.ELECTRONICS
  title: string
  description?: string
  price: number
  params?: Partial<ElectronicsItemParamsDto>
}

export type ItemUpdateBody =
  | AutoItemUpdateBody
  | RealEstateItemUpdateBody
  | ElectronicsItemUpdateBody

export type ItemUpdateSuccessResponse = {
  success: true
}

export type ApiErrorResponse = {
  success: false
  error: string | unknown
}
