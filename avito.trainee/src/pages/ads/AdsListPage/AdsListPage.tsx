import { Box, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import {
  ItemsFilters,
  ItemsList,
  ItemsSearchInput,
  ItemsSortingSelect,
  ItemsTotalCount,
  ItemsViewTypeToggle,
  ItemsListPagination,
} from '@/features/items-searching'

import styles from './AdsListPage.module.css'

const AdsListPage = () => {
  const { t } = useTranslation('ads')

  return (
    <Stack className={styles.wrapper}>
      <Box className={styles.container}>
        <header className={styles.header}>
          <Title
            className={styles.title}
            order={1}
          >
            {t('listPage.title')}
          </Title>
          <ItemsTotalCount />
        </header>
        <Box className={styles.searchContainer}>
          <ItemsSearchInput className={styles.search} />
          <ItemsViewTypeToggle />
          <ItemsSortingSelect className={styles.sorting} />
        </Box>

        <ItemsFilters className={styles.filters} />

        <ItemsList className={styles.list} />

        <ItemsListPagination className={styles.pagination} />
      </Box>
    </Stack>
  )
}

export default AdsListPage
