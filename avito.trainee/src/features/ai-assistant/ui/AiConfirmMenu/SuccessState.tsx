import { Button, Group, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import styles from './AiConfirmMenu.module.css'

type SuccessStateProps = {
  content: string
  onApply: () => void
  onClose: () => void
}

const SuccessState = ({ content, onApply, onClose }: SuccessStateProps) => {
  const { t } = useTranslation('items')

  return (
    <Stack className={styles.container}>
      <Text className={styles.title}>
        {t('aiAssistant.confirmMenu.responseTitle')}
      </Text>

      <Text className={styles.content}>{content}</Text>

      <Group>
        <Button
          size="sm"
          variant="filled"
          onClick={onApply}
        >
          {t('aiAssistant.confirmMenu.apply')}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onClose}
        >
          {t('aiAssistant.confirmMenu.close')}
        </Button>
      </Group>
    </Stack>
  )
}

export default SuccessState
