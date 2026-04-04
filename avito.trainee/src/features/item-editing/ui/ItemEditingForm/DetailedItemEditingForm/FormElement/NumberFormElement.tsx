import type { ItemEditingFormElement } from '@/features/item-editing/model/types'
import { NumberInput } from '@mantine/core'
import type { GetInputPropsReturnType } from '@mantine/form'

import styles from './FormElement.module.css'

type NumberFormElementProps = {
  title: string
  type: ItemEditingFormElement.NUMBER
  allowDecimal: boolean
  allowNegative: boolean
  inputProps: GetInputPropsReturnType
}

const NumberFormElement = (props: NumberFormElementProps) => {
  return (
    <NumberInput
      {...props.inputProps}
      placeholder={props.title}
      classNames={{
        root: styles.root,
        label: styles.label,
      }}
      hideControls
      label={props.title}
      allowDecimal={props.allowDecimal}
      allowNegative={props.allowNegative}
    />
  )
}

export default NumberFormElement
