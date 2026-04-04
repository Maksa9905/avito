import { EItemCategory } from '@/entities/items'

import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  DetailedFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from '../model/types'
import type { ItemDetailDto, ItemUpdateBody } from './types'

export function mapItemDetailDtoToCommonFormValues(
  dto: ItemDetailDto,
): CommonItemsEditingFormValues {
  return {
    title: dto.title,
    description: dto.description ?? '',
    price: dto.price,
    category: dto.category,
  }
}

export function mapItemDetailDtoToDetailedFormValues(
  dto: ItemDetailDto,
): DetailedFormValues {
  switch (dto.category) {
    case EItemCategory.AUTO:
      return {
        brand: dto.params.brand ?? '',
        model: dto.params.model ?? '',
        yearOfManufacture: dto.params.yearOfManufacture
          ? Number(dto.params.yearOfManufacture)
          : null,
        transmission: dto.params.transmission ?? null,
        mileage: dto.params.mileage ? Number(dto.params.mileage) : null,
        enginePower: dto.params.enginePower
          ? Number(dto.params.enginePower)
          : null,
      }
    case EItemCategory.REAL_ESTATE:
      return {
        type: dto.params.type ?? null,
        address: dto.params.address ?? '',
        area: dto.params.area ? Number(dto.params.area) : null,
        floor: dto.params.floor ? Number(dto.params.floor) : null,
      }
    case EItemCategory.ELECTRONICS:
      return {
        type: dto.params.type ?? null,
        brand: dto.params.brand ?? '',
        model: dto.params.model ?? '',
        condition: dto.params.condition ?? null,
        color: dto.params.color ?? '',
      }
  }
}

export function buildItemUpdateBody(
  common: CommonItemsEditingFormValues,
  detailed: DetailedFormValues,
): ItemUpdateBody | null {
  if (!common.category) {
    return null
  }

  const price = common.price ?? 0
  const description =
    common.description.trim() === '' ? undefined : common.description

  switch (common.category) {
    case EItemCategory.AUTO: {
      const d = detailed as AutoFormValues
      return {
        category: EItemCategory.AUTO,
        title: common.title,
        description,
        price,
        params: {
          brand: d.brand,
          model: d.model,
          yearOfManufacture: d.yearOfManufacture
            ? Number(d.yearOfManufacture)
            : undefined,
          transmission: d.transmission ?? undefined,
          mileage: d.mileage ? Number(d.mileage) : undefined,
          enginePower: d.enginePower ? Number(d.enginePower) : undefined,
        },
      }
    }
    case EItemCategory.REAL_ESTATE: {
      const d = detailed as RealEstateFormValues
      return {
        category: EItemCategory.REAL_ESTATE,
        title: common.title,
        description,
        price,
        params: {
          type: d.type ?? undefined,
          address: d.address,
          area: d.area ? Number(d.area) : undefined,
          floor: d.floor ? Number(d.floor) : undefined,
        },
      }
    }
    case EItemCategory.ELECTRONICS: {
      const d = detailed as ElecrtonicFormValues
      return {
        category: EItemCategory.ELECTRONICS,
        title: common.title,
        description,
        price,
        params: {
          type: d.type ?? undefined,
          brand: d.brand,
          model: d.model,
          condition: d.condition ?? undefined,
          color: d.color,
        },
      }
    }
  }
}
