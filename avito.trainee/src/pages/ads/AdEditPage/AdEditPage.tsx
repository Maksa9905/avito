import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Divider, Stack, Title } from '@mantine/core'
import {
  DetailedEditingForm,
  CommonItemEditingForm,
  DescriptionTextField,
  FormProvider,
  useCommonItemEditingForm,
  useDetailedItemEditingForms,
  useFormValuesAutosave,
  useUpdateItemMutation,
  FormActions,
  ItemEditDraftRestoreDialog,
  buildItemUpdateBody,
  useGetItemByIdQuery,
  mapItemDetailDtoToCommonFormValues,
  mapItemDetailDtoToDetailedFormValues,
} from '@/features/item-editing'

import styles from './AdEditPage.module.css'
import { useCallback, useMemo } from 'react'

export function AdEditPage() {
  const { t } = useTranslation('ads')
  const { id: itemId } = useParams<{ id: string }>()

  const { data: item, isLoading } = useGetItemByIdQuery(itemId)

  const commonFormValues = useMemo(() => {
    return item ? mapItemDetailDtoToCommonFormValues(item) : undefined
  }, [item])

  const detailedFormValues = useMemo(() => {
    return item ? mapItemDetailDtoToDetailedFormValues(item) : undefined
  }, [item])

  const navigate = useNavigate()

  const commonForm = useCommonItemEditingForm({
    initialValues: commonFormValues,
  })

  const detailedForms = useDetailedItemEditingForms({
    initialValues: detailedFormValues,
    category: item?.category,
  })

  const { clearDraft, restoreDraftDialog } = useFormValuesAutosave({
    itemId,
    commonForm,
    detailedForms,
  })

  const { mutateAsync: updateItem } = useUpdateItemMutation()

  const handleSave = useCallback(async () => {
    if (!itemId) return

    const commonValues = commonForm.getValues()

    const category = commonValues.category

    if (!category) return

    const selectedForm = detailedForms[category]

    const updateBody = buildItemUpdateBody(
      commonValues,
      selectedForm.getValues(),
    )

    if (!updateBody) return

    await updateItem({
      itemId,
      body: updateBody,
    })

    clearDraft()
  }, [clearDraft, commonForm, detailedForms, itemId, updateItem])

  const handleCancel = useCallback(() => {
    navigate(`/ads/${itemId}`)
  }, [itemId, navigate])

  const formContextValue = useMemo(() => {
    return { common: commonForm, ...detailedForms }
  }, [commonForm, detailedForms])

  return (
    <Stack className={styles.wrapper}>
      <ItemEditDraftRestoreDialog {...restoreDraftDialog} />
      <Stack className={styles.container}>
        <Box
          component="header"
          className={styles.header}
        >
          <Title
            className={styles.title}
            order={1}
          >
            {t('editPage.title')}
          </Title>
        </Box>
        <FormProvider value={formContextValue}>
          <Stack className={styles.forms}>
            <CommonItemEditingForm isLoading={isLoading} />
            <Divider className={styles.divider} />
            <DetailedEditingForm
              className={styles.form}
              isLoading={isLoading}
            />
            <Divider className={styles.divider} />
            <DescriptionTextField isLoading={isLoading} />
          </Stack>
          <FormActions
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </FormProvider>
      </Stack>
    </Stack>
  )
}
