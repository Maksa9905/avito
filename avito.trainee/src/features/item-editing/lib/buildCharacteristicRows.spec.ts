import { describe, expect, it, vi } from 'vitest'

import { EAutoTransmission, EItemCategory } from '@/entities/items'

import { buildCharacteristicRows } from './buildCharacteristicRows'

describe('buildCharacteristicRows', () => {
  const t = vi.fn((key: string) => `TR:${key}`)

  it('пропускает невалидные по конфигу поля', () => {
    const rows = buildCharacteristicRows(EItemCategory.AUTO, {}, t as any)
    expect(rows).toEqual([])
  })

  it('строит строки только для валидных параметров с метками и значениями', () => {
    const rows = buildCharacteristicRows(
      EItemCategory.AUTO,
      {
        brand: 'Lada',
        model: 'Vesta',
        yearOfManufacture: 2020,
        transmission: EAutoTransmission.MANUAL,
        mileage: 10000,
        enginePower: 120,
      },
      t as any,
    )

    expect(rows).toHaveLength(6)
    expect(rows.map((r) => r.key)).toEqual([
      'brand',
      'model',
      'yearOfManufacture',
      'transmission',
      'mileage',
      'enginePower',
    ])
    expect(rows[0]).toEqual({
      key: 'brand',
      label: 'TR:form.edit.auto.brand.title',
      value: 'Lada',
    })
    expect(rows[3]).toEqual({
      key: 'transmission',
      label: 'TR:form.edit.auto.transmission.title',
      value: 'TR:form.edit.auto.transmission.options.manual',
    })
  })

  it('для SELECT с неизвестным значением подставляет строковое представление', () => {
    const rows = buildCharacteristicRows(
      EItemCategory.AUTO,
      {
        brand: 'X',
        model: 'Y',
        yearOfManufacture: 1,
        transmission: 'unknown' as EAutoTransmission,
        mileage: 1,
        enginePower: 1,
      },
      t as any,
    )

    const tr = rows.find((r) => r.key === 'transmission')
    expect(tr?.value).toBe('unknown')
  })
})
