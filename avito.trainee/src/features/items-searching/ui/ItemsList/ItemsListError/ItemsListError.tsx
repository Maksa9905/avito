import { Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import ListLoadErrorIcon from '@/shared/icons/ListLoadErrorIcon'

import styles from './ItemsListError.module.css'
import NotFoundIcon from '@/shared/icons/NotFoundIcon'

type ItemsListErrorProps = {
  type: 'error' | 'notFound'
}

const ItemsListError = ({ type }: ItemsListErrorProps) => {
  const { t } = useTranslation('items')

  const titleKey =
    type === 'error' ? 'listLoadError.title' : 'listNotFound.title'
  const descriptionKey =
    type === 'error' ? 'listLoadError.description' : 'listNotFound.description'

  return (
    <Stack
      className={styles.root}
      align="center"
      gap="md"
      role={type === 'error' ? 'alert' : 'status'}
    >
      {type === 'error' ? (
        <ListLoadErrorIcon className={styles.icon} />
      ) : (
        <div className={styles.notFoundIconWrap}>
          <NotFoundIcon />
        </div>
      )}
      <Stack
        gap="xs"
        align="center"
      >
        <Text
          fw={700}
          size="lg"
          ta="center"
        >
          {t(titleKey)}
        </Text>
        <Text
          c="dimmed"
          size="sm"
          ta="center"
          maw={400}
        >
          {t(descriptionKey)}
        </Text>
      </Stack>
    </Stack>
  )
}

export default ItemsListError
