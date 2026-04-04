import { Box, List, ListItem, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import AlertCircleIcon from '@/shared/icons/AlertCircleIcon'

import styles from './NeedsRevisionAlert.module.css'

type NeedsRevisionAlertProps = {
  fieldsNeeded: string[]
}

const NeedsRevisionAlert = ({ fieldsNeeded }: NeedsRevisionAlertProps) => {
  const { t } = useTranslation('items')

  return (
    <Box className={styles.container}>
      <AlertCircleIcon className={styles.icon} />
      <Title
        order={2}
        className={styles.title}
      >
        {t('needsRevisionAlert.title')}
      </Title>
      <Text className={styles.text}>
        {t('needsRevisionAlert.fieldsNeeded')}
      </Text>
      <List>
        {fieldsNeeded.map((field) => (
          <ListItem className={styles.listItem} key={field}>{field}</ListItem>
        ))}
      </List>
    </Box>
  )
}

export default NeedsRevisionAlert
