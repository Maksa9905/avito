import { describe, expect, it, vi } from 'vitest'

import { EItemCategory } from '@/entities/items'

import { ITEM_EDITING_FORM_FIELDS } from './detailedFormConfig'
import {
  getFieldSelectOptionI18nKey,
  getFieldTitleI18nKey,
  getFormInitialValues,
  getFormValidationRules,
} from './utils'

describe('getFieldTitleI18nKey', () => {
  it('строит ключ заголовка поля', () => {
    expect(getFieldTitleI18nKey(EItemCategory.AUTO, 'brand')).toBe(
      'form.edit.auto.brand.title',
    )
  })
})

describe('getFieldSelectOptionI18nKey', () => {
  it('строит ключ опции селекта', () => {
    expect(
      getFieldSelectOptionI18nKey(EItemCategory.AUTO, 'transmission', 'manual'),
    ).toBe('form.edit.auto.transmission.options.manual')
  })
})

describe('getFormInitialValues', () => {
  it('совпадает с initialValue из конфига для каждой категории', () => {
    for (const category of Object.values(EItemCategory)) {
      const fields = ITEM_EDITING_FORM_FIELDS[category]
      const initial = getFormInitialValues(category)
      for (const key of Object.keys(fields)) {
        // @ts-expect-error: key is a string
        expect(initial[key]).toEqual(fields[key].initialValue)
      }
    }
  })
})

describe('getFormValidationRules', () => {
  it('переводит код ошибки через t с ожидаемым ключом', () => {
    const t = vi.fn((key: string) => `TR:${key}`)
    const rules = getFormValidationRules(EItemCategory.AUTO, t as never)

    const brandRule = rules.brand as (v: unknown) => string | null
    expect(brandRule('')).toBe('TR:form.edit.auto.brand.required')
    expect(brandRule('ok')).toBeNull()
    expect(t).toHaveBeenCalledWith('form.edit.auto.brand.required')
  })
})
