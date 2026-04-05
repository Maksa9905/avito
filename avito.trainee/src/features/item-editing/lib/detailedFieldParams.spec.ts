import { describe, expect, it } from 'vitest'

import {
  EAutoTransmission,
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
  ERealEstateType,
} from '@/entities/items'

import { ITEM_EDITING_FORM_FIELDS } from './detailedFormConfig'
import { isDetailedFieldInvalid } from './detailedFieldParams'

describe('isDetailedFieldInvalid', () => {
  const auto = ITEM_EDITING_FORM_FIELDS[EItemCategory.AUTO]

  it('для TEXT считает поле невалидным при пустой строке', () => {
    expect(isDetailedFieldInvalid(auto.brand, '')).toBe(true)
    expect(isDetailedFieldInvalid(auto.brand, 'Toyota')).toBe(false)
  })

  it('для NUMBER: пустое значение невалидно, число валидно', () => {
    expect(isDetailedFieldInvalid(auto.yearOfManufacture, null)).toBe(true)
    expect(isDetailedFieldInvalid(auto.yearOfManufacture, undefined)).toBe(true)
    expect(isDetailedFieldInvalid(auto.yearOfManufacture, '')).toBe(true)
    expect(isDetailedFieldInvalid(auto.yearOfManufacture, 2015)).toBe(false)
    expect(isDetailedFieldInvalid(auto.yearOfManufacture, '2015')).toBe(false)
  })

  it('для NUMBER: нечисловая строка невалидна', () => {
    expect(isDetailedFieldInvalid(auto.mileage, 'abc')).toBe(true)
  })

  it('для SELECT: null и пустая строка невалидны, допустимое значение валидно', () => {
    expect(isDetailedFieldInvalid(auto.transmission, null)).toBe(true)
    expect(isDetailedFieldInvalid(auto.transmission, '')).toBe(true)
    expect(
      isDetailedFieldInvalid(auto.transmission, EAutoTransmission.MANUAL),
    ).toBe(false)
  })

  it('для недвижимости и электроники согласовано с правилами конфига', () => {
    const re = ITEM_EDITING_FORM_FIELDS[EItemCategory.REAL_ESTATE]
    expect(isDetailedFieldInvalid(re.type, null)).toBe(true)
    expect(isDetailedFieldInvalid(re.type, ERealEstateType.FLAT)).toBe(false)

    const el = ITEM_EDITING_FORM_FIELDS[EItemCategory.ELECTRONICS]
    expect(isDetailedFieldInvalid(el.type, null)).toBe(true)
    expect(isDetailedFieldInvalid(el.type, EElectronicsType.PHONE)).toBe(
      false,
    )
    expect(isDetailedFieldInvalid(el.condition, EElectronicsCondition.NEW)).toBe(
      false,
    )
  })
})
