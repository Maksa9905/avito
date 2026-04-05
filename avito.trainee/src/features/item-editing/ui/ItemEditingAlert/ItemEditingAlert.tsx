import ErrorIcon from '@/shared/icons/ErrorIcon'
import SuccessIcon from '@/shared/icons/SuccessIcon'
import { notifications } from '@mantine/notifications'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

import styles from './ItemEditingAlert.module.css'

export enum ENotificationAlertType {
  ERROR = 'error',
  SUCCESS = 'success',
}

export const useNotificationAlert = () => {
  const { t } = useTranslation('items')

  const showAlert = useCallback(
    (type: ENotificationAlertType) => {
      switch (type) {
        case ENotificationAlertType.ERROR:
          notifications.show({
            title: t('edit.notifications.error.title'),
            message: t('edit.notifications.error.message'),
            color: 'red',
            autoClose: 5000,
            icon: <ErrorIcon />,
            w: '330px',
            position: 'top-right',
            withCloseButton: false,
            classNames: {
              description: styles.description,
              root: cn(styles.root, styles.error),
              icon: cn(styles.icon, styles.error),
              title: styles.title,
            },
          })
          break
        case ENotificationAlertType.SUCCESS:
          notifications.show({
            title: t('edit.notifications.success.title'),
            message: t('edit.notifications.success.message'),
            color: 'green',
            w: '330px',
            withCloseButton: false,
            autoClose: 5000,
            icon: <SuccessIcon />,
            position: 'top-right',
            classNames: {
              description: styles.description,
              root: cn(styles.root, styles.success),
              icon: cn(styles.icon, styles.success),
              title: styles.title,
            },
          })
          break
      }
    },
    [t],
  )

  return showAlert
}
