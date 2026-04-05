import PromptIcon from '@/shared/icons/PromptIcon'
import RedoRequestIcon from '@/shared/icons/RedoRequestIcon'
import { Button, Loader } from '@mantine/core'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import AiConfirmMenu from '../AiConfirmMenu'
import { useGenerateRecommendedPrice } from '../../api/api'

import styles from './AiButton.module.css'

type RecommendedPriceAiButtonProps = {
  onApply?: (value: string) => void
  onGetValues: () => Record<string, unknown>
}

const RecommendedPriceAiButton = ({
  onApply,
  onGetValues,
}: RecommendedPriceAiButtonProps) => {
  const {
    mutate: generateRecommendedPrice,
    data,
    isPending,
    isSuccess,
    isError,
  } = useGenerateRecommendedPrice()

  const { t, i18n } = useTranslation('items')

  const handleClick = useCallback(async () => {
    if (isPending) return

    const language = i18n.resolvedLanguage ?? i18n.language
    const params = onGetValues()
    await generateRecommendedPrice({ language, params })
  }, [
    generateRecommendedPrice,
    i18n.language,
    i18n.resolvedLanguage,
    isPending,
    onGetValues,
  ])

  const handleApply = useCallback(() => {
    if (data?.recommendedPrice) {
      onApply?.(String(data.recommendedPrice))
    }
  }, [data, onApply])

  const leftSection = useMemo(() => {
    if (isPending) return <Loader className={styles.icon} />
    if (isSuccess || isError) return <RedoRequestIcon className={styles.icon} />
    return <PromptIcon className={styles.icon} />
  }, [isError, isPending, isSuccess])

  const label = useMemo(() => {
    if (isPending) return t('aiAssistant.requestInProgress')
    if (isSuccess || isError) return t('aiAssistant.repeatRequest')
    return t('aiAssistant.prompts.recommended_price')
  }, [isError, isPending, isSuccess, t])

  return (
    <AiConfirmMenu
      open={isSuccess || isError}
      content={data?.marketOverview || ''}
      error={isError}
      onApply={handleApply}
    >
      <Button
        variant="light"
        color="orange"
        size="md"
        leftSection={leftSection}
        onClick={handleClick}
      >
        {label}
      </Button>
    </AiConfirmMenu>
  )
}

export default RecommendedPriceAiButton
