import { Text } from '@mantine/core'

import styles from './ItemsTotalCount.module.css'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useTotalItems } from '../../lib/useTotalItems'

const ItemsTotalCount = observer(() => {
  const { t } = useTranslation('ads')

  const { total, isLoading } = useTotalItems()

  return (
    <Text className={styles.text}>
      {isLoading
        ? t('listPage.calculatingCount')
        : t('listPage.listingsCount', { count: total })}
    </Text>
  )
})

export default ItemsTotalCount
