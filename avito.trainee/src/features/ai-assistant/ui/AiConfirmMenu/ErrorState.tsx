import { Button, Group, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/utils/cn'

import styles from './AiConfirmMenu.module.css'

type ErrorStateProps = {
  onClose: () => void
}
const ErrorState = ({ onClose }: ErrorStateProps) => {
  const { t } = useTranslation('items')

  return (
    <Stack className={cn(styles.container, styles.error)}>
      <Text className={styles.title}>
        {t('aiAssistant.confirmMenu.errorTitle')}
      </Text>

      <Text className={styles.content}>
        {t('aiAssistant.confirmMenu.errorDescription')}
      </Text>

      <Group>
        <Button
          color="red"
          size="sm"
          onClick={onClose}
        >
          {t('aiAssistant.confirmMenu.close')}
        </Button>
      </Group>
    </Stack>
  )
}

export default ErrorState
