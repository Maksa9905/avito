import {
  EItemCategory,
  type EAutoTransmission,
  type EElectronicsCondition,
  type EElectronicsType,
  type ERealEstateType,
} from '@/entities/items'

export type CommonItemsEditingFormValues = {
  title: string
  description: string
  price: number | null
  category: EItemCategory | null
}

export type AutoFormValues = {
  brand: string
  model: string
  yearOfManufacture: number | null
  transmission: EAutoTransmission | null
  mileage: number | null
  enginePower: number | null
}

export type RealEstateFormValues = {
  type: ERealEstateType | null
  address: string
  area: number | null
  floor: number | null
}

export type ElecrtonicFormValues = {
  type: EElectronicsType | null
  brand: string
  model: string
  condition: EElectronicsCondition | null
  color: string
}

export type DetailedFormValues =
  | AutoFormValues
  | ElecrtonicFormValues
  | RealEstateFormValues

export enum ItemEditingFormElement {
  SELECT = 'select',
  TEXT = 'text',
  NUMBER = 'number',
}

export type ItemEditingFieldErrorCode = string

export type ItemEditingTextFieldConfig = {
  title: string
  type: ItemEditingFormElement.TEXT
  initialValue: string
  validate: (value: string) => ItemEditingFieldErrorCode | null
}

export type ItemEditingNumberFieldConfig = {
  title: string
  type: ItemEditingFormElement.NUMBER
  initialValue: number | null
  allowDecimal: boolean
  allowNegative: boolean
  validate: (value: number | null) => ItemEditingFieldErrorCode | null
}

export type ItemEditingSelectFieldConfig = {
  title: string
  type: ItemEditingFormElement.SELECT
  initialValue: string | null
  options: ReadonlyArray<{ value: string; label: string }>
  validate: (value: string | null) => ItemEditingFieldErrorCode | null
}

export type ItemEditingFieldConfig =
  | ItemEditingTextFieldConfig
  | ItemEditingNumberFieldConfig
  | ItemEditingSelectFieldConfig

export type ItemEditingFormFieldsByCategory = {
  [EItemCategory.AUTO]: { [K in keyof AutoFormValues]: ItemEditingFieldConfig }
  [EItemCategory.REAL_ESTATE]: {
    [K in keyof RealEstateFormValues]: ItemEditingFieldConfig
  }
  [EItemCategory.ELECTRONICS]: {
    [K in keyof ElecrtonicFormValues]: ItemEditingFieldConfig
  }
}
