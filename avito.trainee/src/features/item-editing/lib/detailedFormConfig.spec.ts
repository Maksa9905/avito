import { describe, expect, it } from 'vitest'

import {
  EAutoTransmission,
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
  ERealEstateType,
} from '@/entities/items'

import { ITEM_EDITING_FORM_FIELDS } from './detailedFormConfig'

describe('ITEM_EDITING_FORM_FIELDS — validate', () => {
  describe(EItemCategory.AUTO, () => {
    const f = ITEM_EDITING_FORM_FIELDS[EItemCategory.AUTO]

    it('brand и model: required', () => {
      expect(f.brand.validate('')).toBe('required')
      expect(f.brand.validate('x')).toBeNull()
      expect(f.model.validate('')).toBe('required')
    })

    it('yearOfManufacture: только положительное число', () => {
      expect(f.yearOfManufacture.validate(null)).toBe('required')
      expect(f.yearOfManufacture.validate(0)).toBe('required')
      expect(f.yearOfManufacture.validate(-1)).toBe('required')
      expect(f.yearOfManufacture.validate(2000)).toBeNull()
    })

    it('transmission: required', () => {
      expect(f.transmission.validate(null)).toBe('required')
      expect(f.transmission.validate('')).toBe('required')
      expect(f.transmission.validate(EAutoTransmission.MANUAL)).toBeNull()
    })

    it('mileage и enginePower: > 0', () => {
      expect(f.mileage.validate(null)).toBe('required')
      expect(f.mileage.validate(0)).toBe('required')
      expect(f.mileage.validate(0.5)).toBeNull()
      expect(f.enginePower.validate(1)).toBeNull()
    })
  })

  describe(EItemCategory.REAL_ESTATE, () => {
    const f = ITEM_EDITING_FORM_FIELDS[EItemCategory.REAL_ESTATE]

    it('type и address', () => {
      expect(f.type.validate(null)).toBe('required')
      expect(f.type.validate(ERealEstateType.HOUSE)).toBeNull()
      expect(f.address.validate('')).toBe('required')
      expect(f.address.validate('г. М.')).toBeNull()
    })

    it('area и floor', () => {
      expect(f.area.validate(null)).toBe('required')
      expect(f.area.validate(0)).toBe('required')
      expect(f.area.validate(30)).toBeNull()
      expect(f.floor.validate(1)).toBeNull()
    })
  })

  describe(EItemCategory.ELECTRONICS, () => {
    const f = ITEM_EDITING_FORM_FIELDS[EItemCategory.ELECTRONICS]

    it('обязательные поля', () => {
      expect(f.type.validate(null)).toBe('required')
      expect(f.type.validate(EElectronicsType.LAPTOP)).toBeNull()
      expect(f.brand.validate('')).toBe('required')
      expect(f.model.validate('')).toBe('required')
      expect(f.condition.validate(null)).toBe('required')
      expect(f.condition.validate(EElectronicsCondition.USED)).toBeNull()
      expect(f.color.validate('')).toBe('required')
    })
  })
})
