import type { EItemCategory } from '@/entities/items'
import type { ItemEditingFormElement } from '@/features/item-editing/model/types'
import { getFieldSelectOptionI18nKey } from '@/features/item-editing/lib/utils'
import { Select } from '@mantine/core'
import type { GetInputPropsReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

import { tItemsDynamic } from '@/shared/i18n/tItemsDynamic'

import styles from './FormElement.module.css'

type SelectFormElementProps = {
  title: string
  type: ItemEditingFormElement.SELECT
  inputProps: GetInputPropsReturnType
  options: ReadonlyArray<{ value: string; label: string }>
  category: EItemCategory
  fieldName: string
}

const SelectFormElement = ({
  title,
  inputProps,
  options,
  category,
  fieldName,
}: SelectFormElementProps) => {
  const { t } = useTranslation('items')

  const data = useMemo(
    () =>
      options.map((opt) => ({
        value: opt.value,
        label: tItemsDynamic(
          t,
          getFieldSelectOptionI18nKey(category, fieldName, opt.value),
        ),
      })),
    [category, fieldName, options, t],
  )

  return (
    <Select
      {...inputProps}
      placeholder={title}
      classNames={{
        root: styles.root,
        label: styles.label,
      }}
      data={data}
      label={title}
    />
  )
}

export default SelectFormElement
