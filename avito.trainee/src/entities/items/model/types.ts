export enum EItemCategory {
  AUTO = 'auto',
  REAL_ESTATE = 'real_estate',
  ELECTRONICS = 'electronics',
}

export enum EAutoTransmission {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

export enum ERealEstateType {
  FLAT = 'flat',
  HOUSE = 'house',
  ROOM = 'room',
}

export enum EElectronicsType {
  PHONE = 'phone',
  LAPTOP = 'laptop',
  MISC = 'misc',
}

export enum EElectronicsCondition {
  NEW = 'new',
  USED = 'used',
}

export interface IItem {
  id: string
  imageURL?: string
  category: EItemCategory
  title: string
  price: number
  needsRevision: boolean
}

export type IItemGridRow = {
  rowKey: string
  items: IItem[]
}
