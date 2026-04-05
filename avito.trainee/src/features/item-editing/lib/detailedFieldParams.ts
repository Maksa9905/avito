import {
  ItemEditingFormElement,
  type ItemEditingFieldConfig,
} from '../model/types'

export function isDetailedFieldInvalid(
  config: ItemEditingFieldConfig,
  raw: unknown,
): boolean {
  switch (config.type) {
    case ItemEditingFormElement.TEXT:
      return config.validate(String(raw ?? '')) !== null
    case ItemEditingFormElement.NUMBER: {
      if (raw === null || raw === undefined || raw === '') {
        return config.validate(null) !== null
      }
      const n = Number(raw)
      return config.validate(Number.isFinite(n) ? n : null) !== null
    }
    case ItemEditingFormElement.SELECT:
      return (
        config.validate(raw == null || raw === '' ? null : String(raw)) !== null
      )
    default: {
      const _exhaustive: never = config
      return _exhaustive
    }
  }
}
