import { useState } from 'react'

import { useFormContext } from '../ui/ItemEditingForm/FormProvider'

export function useItemEditingFormValidity() {
  const { common } = useFormContext()

  const [isValid, setIsValid] = useState(false)

  Object.keys(common.values).forEach((key) => {
    common.watch(key, () => {
      setIsValid(common.isValid())
    })
  })

  return isValid
}
