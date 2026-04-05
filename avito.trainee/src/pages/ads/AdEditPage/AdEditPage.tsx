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
  useNotificationAlert,
  ENotificationAlertType,
} from '@/features/item-editing'

import styles from './AdEditPage.module.css'
import { useCallback, useMemo } from 'react'
import {
  ImproveDescriptionAiButton,
  RecommendedPriceAiButton,
  AiFloatingButton,
} from '@/features/ai-assistant'
import PageContainer from '@/widgets/PageContainer'
import { AiChatProvider } from '@/features/ai-assistant/ui/AiChat'

export function AdEditPage() {
  const { t } = useTranslation('items')
  const { id: itemId } = useParams<{ id: string }>()

  const { data: item, isLoading } = useGetItemByIdQuery(itemId)

  const showAlert = useNotificationAlert()

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
    try {
      if (!itemId) throw new Error('Item ID is required')

      const commonValues = commonForm.getValues()

      const category = commonValues.category

      if (!category) throw new Error('Category is required')

      const selectedForm = detailedForms[category]

      const updateBody = buildItemUpdateBody(
        commonValues,
        selectedForm.getValues(),
      )

      if (!updateBody) throw new Error('Update body is required')

      await updateItem({
        itemId,
        body: updateBody,
      })

      showAlert(ENotificationAlertType.SUCCESS)

      clearDraft()
      navigate(`/ads/${itemId}`)
    } catch {
      showAlert(ENotificationAlertType.ERROR)
    }
  }, [
    clearDraft,
    commonForm,
    detailedForms,
    itemId,
    navigate,
    showAlert,
    updateItem,
  ])

  const handleCancel = useCallback(() => {
    navigate(`/ads/${itemId}`)
  }, [itemId, navigate])

  const formContextValue = useMemo(() => {
    return { common: commonForm, ...detailedForms }
  }, [commonForm, detailedForms])

  const handleGetValues = useCallback(() => {
    let result: Record<string, unknown> = {}

    const commonFormValues = commonForm.getValues()

    result = { ...commonFormValues }

    const category = commonFormValues.category

    const detailedFormValues = category
      ? detailedForms[category].getValues()
      : {}

    result = { ...result, ...detailedFormValues }

    return result
  }, [commonForm, detailedForms])

  const handleApplyAiDescription = useCallback(
    (description: string) => {
      commonForm.setFieldValue('description', description)
    },
    [commonForm],
  )

  const handleApplyAiPrice = useCallback(
    (price: string) => {
      commonForm.setFieldValue('price', Number(price))
    },
    [commonForm],
  )

  return (
    <AiChatProvider onGetValues={handleGetValues}>
      <PageContainer
        classNames={{ container: styles.container, wrapper: styles.wrapper }}
      >
        <ItemEditDraftRestoreDialog {...restoreDraftDialog} />
        <Box
          component="header"
          className={styles.header}
        >
          <Title
            className={styles.title}
            order={1}
          >
            {t('pages.itemEdit.title')}
          </Title>
        </Box>
        <FormProvider value={formContextValue}>
          <Stack className={styles.forms}>
            <CommonItemEditingForm
              isLoading={isLoading}
              priceRightSection={
                <RecommendedPriceAiButton
                  onApply={handleApplyAiPrice}
                  onGetValues={handleGetValues}
                />
              }
            />
            <Divider className={styles.divider} />
            <DetailedEditingForm
              className={styles.form}
              isLoading={isLoading}
            />
            <Divider className={styles.divider} />
            <Stack className={styles.descriptionContainer}>
              <DescriptionTextField isLoading={isLoading} />
              <ImproveDescriptionAiButton
                className={styles.aiButton}
                onApply={handleApplyAiDescription}
                onGetValues={handleGetValues}
              />
            </Stack>
          </Stack>
          <FormActions
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </FormProvider>
        <AiFloatingButton />
      </PageContainer>
    </AiChatProvider>
  )
}
