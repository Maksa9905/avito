import type { EItemCategory } from '@/entities/items'
import {
  ItemEditingFormElement,
  type ItemEditingFieldConfig,
} from '@/features/item-editing/model/types'

import TextFormElement from './TextFormElement'
import NumberFormElement from './NumberFormElement'
import SelectFormElement from './SelectFormElement'
import type { GetInputPropsReturnType } from '@mantine/form'
import { Skeleton, Stack } from '@mantine/core'

export type FormElementProps<TSkeleton extends boolean = false> = {
  category: TSkeleton extends true ? EItemCategory | undefined : EItemCategory
  fieldName: TSkeleton extends true ? string | undefined : string
  config: TSkeleton extends true
    ? ItemEditingFieldConfig | undefined
    : ItemEditingFieldConfig
  inputProps: TSkeleton extends true
    ? GetInputPropsReturnType | undefined
    : GetInputPropsReturnType
  label: TSkeleton extends true ? string | undefined : string
  isLoading?: TSkeleton
}

const FormElement = <TSkeleton extends boolean = false>({
  category,
  fieldName,
  config,
  inputProps,
  label,
  isLoading,
}: FormElementProps<TSkeleton>) => {
  if (isLoading === true) {
    return (
      <Stack>
        <Skeleton
          width={70}
          height={22}
        />
        <Skeleton
          width={460}
          height={32}
        />
      </Stack>
    )
  }

  if (!config || !inputProps || !label || !category || !fieldName) return null

  switch (config.type) {
    case ItemEditingFormElement.TEXT:
      return (
        <TextFormElement
          {...config}
          title={label}
          inputProps={inputProps}
        />
      )
    case ItemEditingFormElement.NUMBER:
      return (
        <NumberFormElement
          {...config}
          title={label}
          inputProps={inputProps}
        />
      )
    case ItemEditingFormElement.SELECT:
      return (
        <SelectFormElement
          {...config}
          title={label}
          inputProps={inputProps}
          category={category}
          fieldName={fieldName}
        />
      )
    default:
      return null
  }
}

export default FormElement
