import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EItemCategory } from '@/entities/items'

import {
  getItemEditDraftStorageKey,
  ITEM_EDIT_DRAFT_VERSION,
  serializeItemEditDraft,
  type ItemEditDraftPayloadV1,
} from '../lib/itemEditDraftStorage'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from './types'
import { useFormValuesAutosave } from './useFormValuesAutosave'

import type { UseFormReturnType } from '@mantine/form'

function payloadForItem(itemId: string): ItemEditDraftPayloadV1 {
  return {
    v: ITEM_EDIT_DRAFT_VERSION,
    itemId,
    common: {
      title: 'saved',
      description: 'd',
      price: 5,
      category: EItemCategory.AUTO,
    },
    [EItemCategory.AUTO]: {
      brand: 'B',
      model: 'M',
      yearOfManufacture: 2011,
      transmission: null,
      mileage: 1,
      enginePower: 2,
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
  }
}

function mockCommonForm(
  overrides: Partial<
    Pick<
      UseFormReturnType<CommonItemsEditingFormValues>,
      'getValues' | 'setValues' | 'isDirty'
    >
  > = {},
): UseFormReturnType<CommonItemsEditingFormValues> {
  const values: CommonItemsEditingFormValues = {
    title: '',
    description: '',
    price: null,
    category: null,
  }
  return {
    getValues: () => values,
    setValues: vi.fn(),
    isDirty: vi.fn(() => false),
    ...overrides,
  } as unknown as UseFormReturnType<CommonItemsEditingFormValues>
}

function mockDetailedForm<T>(defaults: T): UseFormReturnType<T> {
  let current = { ...defaults }
  return {
    getValues: () => current,
    setValues: vi.fn((next: T) => {
      current = { ...next }
    }),
    isDirty: vi.fn(() => false),
  } as unknown as UseFormReturnType<T>
}

function createDetailedForms() {
  const emptyAuto: AutoFormValues = {
    brand: '',
    model: '',
    yearOfManufacture: null,
    transmission: null,
    mileage: null,
    enginePower: null,
  }
  const emptyRe: RealEstateFormValues = {
    type: null,
    address: '',
    area: null,
    floor: null,
  }
  const emptyEl: ElecrtonicFormValues = {
    type: null,
    brand: '',
    model: '',
    condition: null,
    color: '',
  }
  return {
    [EItemCategory.AUTO]: mockDetailedForm(emptyAuto),
    [EItemCategory.REAL_ESTATE]: mockDetailedForm(emptyRe),
    [EItemCategory.ELECTRONICS]: mockDetailedForm(emptyEl),
  }
}

describe('useFormValuesAutosave', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('при пустом localStorage включает автосохранение без диалога', async () => {
    const commonForm = mockCommonForm({ isDirty: vi.fn(() => true) })
    const detailedForms = createDetailedForms()
    Object.values(detailedForms).forEach((f) => {
      vi.mocked(f.isDirty).mockReturnValue(true)
    })

    const { result } = renderHook(() =>
      useFormValuesAutosave({
        itemId: '1',
        commonForm,
        detailedForms,
      }),
    )

    await waitFor(() => {
      expect(result.current.restoreDraftDialog.opened).toBe(false)
    })
  })

  it('при валидном черновике открывает диалог восстановления', async () => {
    const key = getItemEditDraftStorageKey('10')
    localStorage.setItem(key, serializeItemEditDraft(payloadForItem('10')))

    const { result } = renderHook(() =>
      useFormValuesAutosave({
        itemId: '10',
        commonForm: mockCommonForm(),
        detailedForms: createDetailedForms(),
      }),
    )

    await waitFor(() => {
      expect(result.current.restoreDraftDialog.opened).toBe(true)
    })
  })

  it('битый черновик удаляется и автосохранение включается', async () => {
    const key = getItemEditDraftStorageKey('2')
    localStorage.setItem(key, '{')

    const detailedForms = createDetailedForms()
    const { result } = renderHook(() =>
      useFormValuesAutosave({
        itemId: '2',
        commonForm: mockCommonForm({ isDirty: vi.fn(() => true) }),
        detailedForms,
      }),
    )

    await waitFor(() => {
      expect(localStorage.getItem(key)).toBeNull()
      expect(result.current.restoreDraftDialog.opened).toBe(false)
    })
  })

  it('discardDraft очищает storage и закрывает диалог', async () => {
    const key = getItemEditDraftStorageKey('3')
    localStorage.setItem(key, serializeItemEditDraft(payloadForItem('3')))

    const { result } = renderHook(() =>
      useFormValuesAutosave({
        itemId: '3',
        commonForm: mockCommonForm(),
        detailedForms: createDetailedForms(),
      }),
    )

    await waitFor(() => {
      expect(result.current.restoreDraftDialog.opened).toBe(true)
    })

    act(() => {
      result.current.restoreDraftDialog.onDiscard()
    })

    expect(localStorage.getItem(key)).toBeNull()
    expect(result.current.restoreDraftDialog.opened).toBe(false)
  })

  it('onRestore вызывает setValues и очищает черновик', async () => {
    const key = getItemEditDraftStorageKey('4')
    localStorage.setItem(key, serializeItemEditDraft(payloadForItem('4')))

    const commonForm = mockCommonForm()
    const detailedForms = createDetailedForms()

    const { result } = renderHook(() =>
      useFormValuesAutosave({
        itemId: '4',
        commonForm,
        detailedForms,
      }),
    )

    await waitFor(() => {
      expect(result.current.restoreDraftDialog.opened).toBe(true)
    })

    act(() => {
      result.current.restoreDraftDialog.onRestore()
    })

    expect(commonForm.setValues).toHaveBeenCalledWith(payloadForItem('4').common)
    expect(detailedForms[EItemCategory.AUTO].setValues).toHaveBeenCalled()
    expect(localStorage.getItem(key)).toBeNull()
    expect(result.current.restoreDraftDialog.opened).toBe(false)
  })

  it('по интервалу пишет черновик в localStorage при isDirty', async () => {
    vi.useFakeTimers()
    try {
      const commonForm = mockCommonForm({ isDirty: vi.fn(() => true) })
      const detailedForms = createDetailedForms()
      for (const f of Object.values(detailedForms)) {
        vi.mocked(f.isDirty).mockReturnValue(true)
      }

      const key = getItemEditDraftStorageKey('5')

      renderHook(() =>
        useFormValuesAutosave({
          itemId: '5',
          commonForm,
          detailedForms,
        }),
      )

      await act(async () => {
        await Promise.resolve()
        await Promise.resolve()
      })

      await act(async () => {
        vi.advanceTimersByTime(5_000)
      })

      const raw = localStorage.getItem(key)
      expect(raw).toBeTruthy()
      expect(JSON.parse(raw!).itemId).toBe('5')
    } finally {
      vi.useRealTimers()
    }
  })

  it('clearDraft удаляет запись', () => {
    const key = getItemEditDraftStorageKey('6')
    localStorage.setItem(key, '"x"')

    const { result } = renderHook(() =>
      useFormValuesAutosave({
        itemId: '6',
        commonForm: mockCommonForm(),
        detailedForms: createDetailedForms(),
      }),
    )

    act(() => {
      result.current.clearDraft()
    })

    expect(localStorage.getItem(key)).toBeNull()
  })
})
