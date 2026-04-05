import { Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

import styles from './FormActions.module.css'
import { useFormContext } from '../FormProvider'
import type {
  CommonItemsEditingFormValues,
  DetailedFormValues,
} from '@/features/item-editing/model/types'
import { useItemEditingFormValidity } from '@/features/item-editing/model/useCommonItemEditingFormValidity'

type FormActionsProps = {
  onSave: (
    values: CommonItemsEditingFormValues & DetailedFormValues,
  ) => Promise<void>
  onCancel: () => void
}

const FormActions = ({ onSave, onCancel }: FormActionsProps) => {
  const { t } = useTranslation('items')
  const { common, ...detailedForms } = useFormContext()
  const isFormValid = useItemEditingFormValidity()

  const handleSave = useCallback(async () => {
    const category = common.getValues().category

    if (!category) return

    const selectedForm = detailedForms[category]

    await onSave({ ...common.getValues(), ...selectedForm.getValues() })
  }, [common, detailedForms, onSave])

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  return (
    <Stack className={styles.container}>
      <Button
        disabled={!isFormValid}
        onClick={handleSave}
        variant="filled"
      >
        {t('pages.itemEdit.save')}
      </Button>
      <Button
        variant="default"
        onClick={handleCancel}
      >
        {t('pages.itemEdit.cancel')}
      </Button>
    </Stack>
  )
}

export default FormActions
