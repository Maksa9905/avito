import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from '../FormProvider'
import { EItemCategory } from '@/entities/items'
import { ITEM_EDITING_FORM_FIELDS } from '@/features/item-editing/lib/detailedFormConfig'
import { getFieldTitleI18nKey } from '@/features/item-editing/lib/utils'
import FormElement from './FormElement'
import type { UseFormReturnType } from '@mantine/form'
import type {
  DetailedFormValues,
  ItemEditingFieldConfig,
} from '@/features/item-editing/model/types'
import { Stack, Title } from '@mantine/core'

import styles from './DetailedEditingForm.module.css'
import { cn } from '@/shared/utils/cn'
import { tItemsDynamic } from '@/shared/i18n/tItemsDynamic'

type DetailedEditingFormProps = {
  className?: string
  isLoading?: boolean
}

const DetailedEditingForm = ({
  className,
  isLoading,
}: DetailedEditingFormProps) => {
  const { t } = useTranslation('items')
  const { common, ...detailedForms } = useFormContext()

  const [category, setCategory] = useState<EItemCategory | null>(
    common.getValues().category,
  )

  common.watch('category', ({ value }) => {
    setCategory(value)
  })

  const currentForm = useMemo(() => {
    if (!category) return null

    return detailedForms[category] as UseFormReturnType<DetailedFormValues>
  }, [category, detailedForms])

  const currentFormConfig = useMemo(() => {
    if (!category) return null

    return ITEM_EDITING_FORM_FIELDS[category] as Record<
      string,
      ItemEditingFieldConfig
    >
  }, [category])

  const shouldRenderForm = useMemo(
    () => Boolean(category && currentForm && currentFormConfig && !isLoading),
    [category, currentForm, currentFormConfig, isLoading],
  )

  return (
    <Stack
      component="form"
      className={cn(styles.container, className)}
    >
      <Title
        className={styles.title}
        order={2}
      >
        {t('form.edit.detailedSectionTitle')}
      </Title>
      {isLoading &&
        Object.keys(ITEM_EDITING_FORM_FIELDS[EItemCategory.AUTO]).map((key) => (
          <FormElement
            key={key}
            isLoading={true}
            category={undefined}
            fieldName={undefined}
            config={undefined}
            inputProps={undefined}
            label={undefined}
          />
        ))}
      {shouldRenderForm &&
        Object.entries(currentFormConfig!).map(([key, config]) => (
          <FormElement
            key={currentForm!.key(key)}
            category={category!}
            fieldName={key}
            config={config}
            label={tItemsDynamic(t, getFieldTitleI18nKey(category!, key))}
            inputProps={currentForm!.getInputProps(key)}
          />
        ))}
    </Stack>
  )
}

export default DetailedEditingForm
