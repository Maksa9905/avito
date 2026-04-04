import {
  EAutoTransmission,
  EElectronicsCondition,
  EElectronicsType,
  EItemCategory,
  ERealEstateType,
} from '@/entities/items'
import type { ItemEditingFormFieldsByCategory } from '../model/types'
import { ItemEditingFormElement } from '../model/types'

export const ITEM_EDITING_FORM_FIELDS = {
  [EItemCategory.AUTO]: {
    brand: {
      title: 'brand',
      type: ItemEditingFormElement.TEXT,
      initialValue: '',
      validate: (value: string) => (value.length > 0 ? null : 'required'),
    },
    model: {
      title: 'model',
      type: ItemEditingFormElement.TEXT,
      initialValue: '',
      validate: (value: string) => (value.length > 0 ? null : 'required'),
    },
    yearOfManufacture: {
      title: 'yearOfManufacture',
      type: ItemEditingFormElement.NUMBER,
      initialValue: null as number | null,
      validate: (value: number | null) =>
        value != null && value > 0 ? null : 'required',
      allowDecimal: false,
      allowNegative: false,
    },
    transmission: {
      title: 'transmission',
      type: ItemEditingFormElement.SELECT,
      initialValue: null as EAutoTransmission | null,
      options: [
        { value: EAutoTransmission.AUTOMATIC, label: 'automatic' },
        { value: EAutoTransmission.MANUAL, label: 'manual' },
      ],
      validate: (value: string | null) => (value ? null : 'required'),
    },
    mileage: {
      title: 'mileage',
      type: ItemEditingFormElement.NUMBER,
      initialValue: null as number | null,
      validate: (value: number | null) =>
        value != null && value > 0 ? null : 'required',
      allowDecimal: true,
      allowNegative: false,
    },
    enginePower: {
      title: 'enginePower',
      type: ItemEditingFormElement.NUMBER,
      initialValue: null as number | null,
      validate: (value: number | null) =>
        value != null && value > 0 ? null : 'required',
      allowDecimal: false,
      allowNegative: false,
    },
  },
  [EItemCategory.REAL_ESTATE]: {
    type: {
      title: 'type',
      type: ItemEditingFormElement.SELECT,
      initialValue: null as ERealEstateType | null,
      options: [
        { value: ERealEstateType.FLAT, label: 'flat' },
        { value: ERealEstateType.HOUSE, label: 'house' },
        { value: ERealEstateType.ROOM, label: 'room' },
      ],
      validate: (value: string | null) => (value ? null : 'required'),
    },
    address: {
      title: 'address',
      type: ItemEditingFormElement.TEXT,
      initialValue: '',
      validate: (value: string) => (value.length > 0 ? null : 'required'),
    },
    area: {
      title: 'area',
      type: ItemEditingFormElement.NUMBER,
      initialValue: null as number | null,
      validate: (value: number | null) =>
        value != null && value > 0 ? null : 'required',
      allowNegative: false,
      allowDecimal: true,
    },
    floor: {
      title: 'floor',
      type: ItemEditingFormElement.NUMBER,
      initialValue: null as number | null,
      validate: (value: number | null) =>
        value != null && value > 0 ? null : 'required',
      allowNegative: false,
      allowDecimal: false,
    },
  },
  [EItemCategory.ELECTRONICS]: {
    type: {
      title: 'type',
      type: ItemEditingFormElement.SELECT,
      initialValue: null as EElectronicsType | null,
      options: [
        { value: EElectronicsType.PHONE, label: 'phone' },
        { value: EElectronicsType.LAPTOP, label: 'laptop' },
        { value: EElectronicsType.MISC, label: 'misc' },
      ],
      validate: (value: string | null) => (value ? null : 'required'),
    },
    brand: {
      title: 'brand',
      type: ItemEditingFormElement.TEXT,
      initialValue: '',
      validate: (value: string) => (value.length > 0 ? null : 'required'),
    },
    model: {
      title: 'model',
      type: ItemEditingFormElement.TEXT,
      initialValue: '',
      validate: (value: string) => (value.length > 0 ? null : 'required'),
    },
    condition: {
      title: 'condition',
      type: ItemEditingFormElement.SELECT,
      initialValue: null as EElectronicsCondition | null,
      options: [
        { value: EElectronicsCondition.NEW, label: 'new' },
        { value: EElectronicsCondition.USED, label: 'used' },
      ],
      validate: (value: string | null) => (value ? null : 'required'),
    },
    color: {
      title: 'color',
      type: ItemEditingFormElement.TEXT,
      initialValue: '',
      validate: (value: string) => (value.length > 0 ? null : 'required'),
    },
  },
} satisfies ItemEditingFormFieldsByCategory
