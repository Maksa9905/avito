import type { ItemEditingFormElement } from '@/features/item-editing/model/types'
import { TextInput } from '@mantine/core'
import type { GetInputPropsReturnType } from '@mantine/form'

import styles from './FormElement.module.css'

type TextFormElementProps = {
  title: string
  type: ItemEditingFormElement.TEXT
  inputProps: GetInputPropsReturnType
}

const TextFormElement = (props: TextFormElementProps) => {
  return (
    <TextInput
      {...props.inputProps}
      placeholder={props.title}
      label={props.title}
      classNames={{
        root: styles.root,
        label: styles.label,
      }}
    />
  )
}

export default TextFormElement
