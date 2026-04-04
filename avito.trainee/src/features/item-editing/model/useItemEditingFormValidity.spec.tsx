import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { EItemCategory } from '@/entities/items'

import FormProvider from '../ui/ItemEditingForm/FormProvider/FormProvider'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from './types'
import { useItemEditingFormValidity } from './useCommonItemEditingFormValidity'

import type { UseFormReturnType } from '@mantine/form'

function stubDetailedForm<T>(): UseFormReturnType<T> {
  return {} as UseFormReturnType<T>
}

describe('useItemEditingFormValidity', () => {
  it('обновляет isValid при срабатывании watch', () => {
    const callbacks: Array<() => void> = []
    const common = {
      values: {
        title: '',
        description: '',
        price: null as number | null,
        category: null,
      },
      isValid: vi.fn(() => true),
      watch: vi.fn((_key: string, cb: () => void) => {
        callbacks.push(cb)
      }),
    } as unknown as UseFormReturnType<CommonItemsEditingFormValues>

    const wrapper = ({ children }: { children: ReactNode }) => (
      <FormProvider
        value={{
          common,
          [EItemCategory.AUTO]: stubDetailedForm<AutoFormValues>(),
          [EItemCategory.REAL_ESTATE]: stubDetailedForm<RealEstateFormValues>(),
          [EItemCategory.ELECTRONICS]: stubDetailedForm<ElecrtonicFormValues>(),
        }}
      >
        {children}
      </FormProvider>
    )

    const { result } = renderHook(() => useItemEditingFormValidity(), { wrapper })

    expect(result.current).toBe(false)

    const fieldCount = Object.keys(
      (common as { values: object }).values,
    ).length
    const lastBatchStart = Math.max(0, callbacks.length - fieldCount)
    const activeTitleCallback = callbacks[lastBatchStart]

    act(() => {
      activeTitleCallback?.()
    })

    expect(result.current).toBe(true)
  })
})
