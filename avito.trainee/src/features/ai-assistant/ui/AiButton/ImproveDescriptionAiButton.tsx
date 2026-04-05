import PromptIcon from '@/shared/icons/PromptIcon'
import RedoRequestIcon from '@/shared/icons/RedoRequestIcon'
import { Button, Loader } from '@mantine/core'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGenerateDescription } from '../../api/api'

import styles from './AiButton.module.css'
import AiConfirmMenu from '../AiConfirmMenu'

type ImproveDescriptionAiButtonProps = {
  onApply: (value: string) => void
  onGetValues: () => Record<string, unknown>
  className?: string
}

const ImproveDescriptionAiButton = ({
  onApply,
  onGetValues,
  className,
}: ImproveDescriptionAiButtonProps) => {
  const {
    mutate: generateDescription,
    data,
    isPending,
    isSuccess,
    isError,
  } = useGenerateDescription()

  const { t, i18n } = useTranslation('items')

  const handleClick = useCallback(async () => {
    if (isPending) return

    const language = i18n.resolvedLanguage ?? i18n.language
    const params = onGetValues()
    await generateDescription({ language, params })
  }, [
    generateDescription,
    i18n.language,
    i18n.resolvedLanguage,
    isPending,
    onGetValues,
  ])

  const handleApply = useCallback(() => {
    if (data?.description) {
      onApply(data.description)
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
    return t('aiAssistant.prompts.improve_description')
  }, [isError, isPending, isSuccess, t])

  return (
    <AiConfirmMenu
      open={isSuccess || isError}
      content={data?.description || ''}
      error={isError}
      onApply={handleApply}
    >
      <Button
        variant="light"
        color="orange"
        size="md"
        className={className}
        leftSection={leftSection}
        onClick={handleClick}
      >
        {label}
      </Button>
    </AiConfirmMenu>
  )
}

export default ImproveDescriptionAiButton
