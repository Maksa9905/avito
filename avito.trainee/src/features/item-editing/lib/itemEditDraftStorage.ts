import { EItemCategory } from '@/entities/items'

import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from '../model/types'

export const ITEM_EDIT_DRAFT_VERSION = 1 as const

export type ItemEditDraftPayloadV1 = {
  v: typeof ITEM_EDIT_DRAFT_VERSION
  itemId: string
  common: CommonItemsEditingFormValues
  [EItemCategory.AUTO]: AutoFormValues
  [EItemCategory.REAL_ESTATE]: RealEstateFormValues
  [EItemCategory.ELECTRONICS]: ElecrtonicFormValues
}

export function getItemEditDraftStorageKey(itemId: string): string {
  return `avito-item-edit-draft:${itemId}`
}

export function parseItemEditDraft(
  raw: string,
  itemId: string,
): ItemEditDraftPayloadV1 | null {
  try {
    const data = JSON.parse(raw) as unknown
    if (!data || typeof data !== 'object') {
      return null
    }
    const o = data as Record<string, unknown>
    if (o.v !== ITEM_EDIT_DRAFT_VERSION || o.itemId !== itemId) {
      return null
    }
    if (!o.common || typeof o.common !== 'object') {
      return null
    }
    if (
      !o[EItemCategory.AUTO] ||
      !o[EItemCategory.REAL_ESTATE] ||
      !o[EItemCategory.ELECTRONICS]
    ) {
      return null
    }
    return o as unknown as ItemEditDraftPayloadV1
  } catch {
    return null
  }
}

export function serializeItemEditDraft(payload: ItemEditDraftPayloadV1): string {
  return JSON.stringify(payload)
}
