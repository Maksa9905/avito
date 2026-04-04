import type { EItemCategory } from '@/entities/items'
import type {
  AutoFormValues,
  CommonItemsEditingFormValues,
  ElecrtonicFormValues,
  RealEstateFormValues,
} from '@/features/item-editing/model/types'
import type { UseFormReturnType } from '@mantine/form'
import { createContext, useContext } from 'react'

export type FormContextType = {
  [EItemCategory.AUTO]: UseFormReturnType<AutoFormValues>
  [EItemCategory.ELECTRONICS]: UseFormReturnType<ElecrtonicFormValues>
  [EItemCategory.REAL_ESTATE]: UseFormReturnType<RealEstateFormValues>
  common: UseFormReturnType<CommonItemsEditingFormValues>
}

const FormContext = createContext<FormContextType | null>(null)

const useFormContext = () => {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }

  return context
}

export { useFormContext }
export default FormContext
