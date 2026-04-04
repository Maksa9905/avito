import { describe, expect, it } from 'vitest'

import {
  EAutoTransmission,
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
  ERealEstateType,
} from '@/entities/items'

import {
  buildItemUpdateBody,
  mapItemDetailDtoToCommonFormValues,
  mapItemDetailDtoToDetailedFormValues,
} from './mappers'
import type {
  AutoItemDetailDto,
  ElectronicsItemDetailDto,
  RealEstateItemDetailDto,
} from './types'

const baseDto = {
  id: 1,
  createdAt: '',
  updatedAt: '',
  needsRevision: false,
}

describe('mapItemDetailDtoToCommonFormValues', () => {
  it('копирует общие поля, description по умолчанию пустая строка', () => {
    const dto: AutoItemDetailDto = {
      ...baseDto,
      title: 'T',
      price: 100,
      category: EItemCategory.AUTO,
      params: {},
    }

    expect(mapItemDetailDtoToCommonFormValues(dto)).toEqual({
      title: 'T',
      description: '',
      price: 100,
      category: EItemCategory.AUTO,
    })
  })

  it('сохраняет description из DTO', () => {
    const dto: AutoItemDetailDto = {
      ...baseDto,
      title: 'T',
      description: 'd',
      price: null,
      category: EItemCategory.AUTO,
      params: {},
    }

    expect(mapItemDetailDtoToCommonFormValues(dto).description).toBe('d')
  })
})

describe('mapItemDetailDtoToDetailedFormValues', () => {
  it('AUTO: парсит числа и подставляет значения по умолчанию', () => {
    const dto: AutoItemDetailDto = {
      ...baseDto,
      title: '',
      price: null,
      category: EItemCategory.AUTO,
      params: {
        brand: 'B',
        model: 'M',
        yearOfManufacture: 2020,
        transmission: EAutoTransmission.MANUAL,
        mileage: 10,
        enginePower: 100,
      },
    }

    expect(mapItemDetailDtoToDetailedFormValues(dto)).toEqual({
      brand: 'B',
      model: 'M',
      yearOfManufacture: 2020,
      transmission: EAutoTransmission.MANUAL,
      mileage: 10,
      enginePower: 100,
    })
  })

  it('AUTO: пустые опциональные поля становятся пустыми строками или null', () => {
    const dto: AutoItemDetailDto = {
      ...baseDto,
      title: '',
      price: null,
      category: EItemCategory.AUTO,
      params: {},
    }

    expect(mapItemDetailDtoToDetailedFormValues(dto)).toEqual({
      brand: '',
      model: '',
      yearOfManufacture: null,
      transmission: null,
      mileage: null,
      enginePower: null,
    })
  })

  it('REAL_ESTATE', () => {
    const dto: RealEstateItemDetailDto = {
      ...baseDto,
      title: '',
      price: null,
      category: EItemCategory.REAL_ESTATE,
      params: {
        type: ERealEstateType.FLAT,
        address: 'A',
        area: 50,
        floor: 3,
      },
    }

    expect(mapItemDetailDtoToDetailedFormValues(dto)).toEqual({
      type: ERealEstateType.FLAT,
      address: 'A',
      area: 50,
      floor: 3,
    })
  })

  it('ELECTRONICS', () => {
    const dto: ElectronicsItemDetailDto = {
      ...baseDto,
      title: '',
      price: null,
      category: EItemCategory.ELECTRONICS,
      params: {
        type: EElectronicsType.PHONE,
        brand: 'Apple',
        model: 'X',
        condition: EElectronicsCondition.NEW,
        color: 'black',
      },
    }

    expect(mapItemDetailDtoToDetailedFormValues(dto)).toEqual({
      type: EElectronicsType.PHONE,
      brand: 'Apple',
      model: 'X',
      condition: EElectronicsCondition.NEW,
      color: 'black',
    })
  })
})

describe('buildItemUpdateBody', () => {
  it('возвращает null без category', () => {
    expect(
      buildItemUpdateBody(
        {
          title: 't',
          description: '',
          price: 1,
          category: null,
        },
        {
          brand: '',
          model: '',
          yearOfManufacture: null,
          transmission: null,
          mileage: null,
          enginePower: null,
        },
      ),
    ).toBeNull()
  })

  it('пустое описание после trim не попадает в body', () => {
    const body = buildItemUpdateBody(
      {
        title: 't',
        description: '   ',
        price: 10,
        category: EItemCategory.ELECTRONICS,
      },
      {
        type: EElectronicsType.LAPTOP,
        brand: 'b',
        model: 'm',
        condition: EElectronicsCondition.USED,
        color: 'c',
      },
    )

    expect(body).not.toBeNull()
    expect(body).toMatchObject({ description: undefined })
  })

  it('price по умолчанию 0', () => {
    const body = buildItemUpdateBody(
      {
        title: 't',
        description: 'x',
        price: null,
        category: EItemCategory.REAL_ESTATE,
      },
      {
        type: ERealEstateType.HOUSE,
        address: 'a',
        area: 1,
        floor: 1,
      },
    )

    expect(body).toMatchObject({ price: 0 })
  })

  it('AUTO: опциональные числа как undefined при null', () => {
    const body = buildItemUpdateBody(
      {
        title: 't',
        description: '',
        price: 1,
        category: EItemCategory.AUTO,
      },
      {
        brand: 'b',
        model: 'm',
        yearOfManufacture: null,
        transmission: null,
        mileage: null,
        enginePower: null,
      },
    )

    expect(body).toEqual({
      category: EItemCategory.AUTO,
      title: 't',
      price: 1,
      params: {
        brand: 'b',
        model: 'm',
        yearOfManufacture: undefined,
        transmission: undefined,
        mileage: undefined,
        enginePower: undefined,
      },
    })
  })
})
