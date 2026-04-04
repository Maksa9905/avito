import { describe, expect, it } from 'vitest'

import {
  EAutoTransmission,
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
  ERealEstateType,
} from '@/entities/items'

import {
  getItemEditDraftStorageKey,
  ITEM_EDIT_DRAFT_VERSION,
  parseItemEditDraft,
  serializeItemEditDraft,
  type ItemEditDraftPayloadV1,
} from './itemEditDraftStorage'

const minimalPayload = (itemId: string): ItemEditDraftPayloadV1 => ({
  v: ITEM_EDIT_DRAFT_VERSION,
  itemId,
  common: {
    title: '',
    description: '',
    price: null,
    category: null,
  },
  [EItemCategory.AUTO]: {
    brand: '',
    model: '',
    yearOfManufacture: null,
    transmission: null,
    mileage: null,
    enginePower: null,
  },
  [EItemCategory.REAL_ESTATE]: {
    type: null,
    address: '',
    area: null,
    floor: null,
  },
  [EItemCategory.ELECTRONICS]: {
    type: null,
    brand: '',
    model: '',
    condition: null,
    color: '',
  },
})

describe('getItemEditDraftStorageKey', () => {
  it('формирует ключ с id объявления', () => {
    expect(getItemEditDraftStorageKey('42')).toBe('avito-item-edit-draft:42')
  })
})

describe('serializeItemEditDraft / parseItemEditDraft', () => {
  it('round-trip для валидного payload', () => {
    const payload = minimalPayload('7')
    payload.common.title = 'Заголовок'
    payload[EItemCategory.AUTO].brand = 'VW'

    const raw = serializeItemEditDraft(payload)
    expect(parseItemEditDraft(raw, '7')).toEqual(payload)
  })

  it('возвращает null при несовпадении itemId', () => {
    const raw = serializeItemEditDraft(minimalPayload('1'))
    expect(parseItemEditDraft(raw, '2')).toBeNull()
  })

  it('возвращает null при неверной версии', () => {
    const raw = JSON.stringify({ ...minimalPayload('1'), v: 999 })
    expect(parseItemEditDraft(raw, '1')).toBeNull()
  })

  it('возвращает null при невалидном JSON', () => {
    expect(parseItemEditDraft('{', '1')).toBeNull()
  })

  it('возвращает null если не объект', () => {
    expect(parseItemEditDraft('null', '1')).toBeNull()
    expect(parseItemEditDraft('"x"', '1')).toBeNull()
  })

  it('возвращает null без common', () => {
    const bad = {
      v: ITEM_EDIT_DRAFT_VERSION,
      itemId: '1',
      [EItemCategory.AUTO]: {},
      [EItemCategory.REAL_ESTATE]: {},
      [EItemCategory.ELECTRONICS]: {},
    }
    expect(parseItemEditDraft(JSON.stringify(bad), '1')).toBeNull()
  })

  it('возвращает null если отсутствует блок категории', () => {
    const rest = { ...minimalPayload('1') } as Record<string, unknown>
    delete rest[EItemCategory.AUTO]
    expect(parseItemEditDraft(JSON.stringify(rest), '1')).toBeNull()
  })
})

describe('parseItemEditDraft — заполненный черновик', () => {
  it('принимает payload со всеми вложенными данными', () => {
    const payload: ItemEditDraftPayloadV1 = {
      v: ITEM_EDIT_DRAFT_VERSION,
      itemId: '99',
      common: {
        title: 'T',
        description: 'D',
        price: 500,
        category: EItemCategory.AUTO,
      },
      [EItemCategory.AUTO]: {
        brand: 'b',
        model: 'm',
        yearOfManufacture: 2010,
        transmission: EAutoTransmission.AUTOMATIC,
        mileage: 1000,
        enginePower: 150,
      },
      [EItemCategory.REAL_ESTATE]: {
        type: ERealEstateType.FLAT,
        address: 'ул.',
        area: 40,
        floor: 2,
      },
      [EItemCategory.ELECTRONICS]: {
        type: EElectronicsType.PHONE,
        brand: 'b',
        model: 'm',
        condition: EElectronicsCondition.NEW,
        color: 'red',
      },
    }

    const parsed = parseItemEditDraft(serializeItemEditDraft(payload), '99')
    expect(parsed).toEqual(payload)
  })
})
