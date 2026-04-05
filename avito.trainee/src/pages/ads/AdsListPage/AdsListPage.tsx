import { Box, Title } from '@mantine/core'
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

import PageContainer from '@/widgets/PageContainer'

import styles from './AdsListPage.module.css'

const AdsListPage = () => {
  const { t } = useTranslation('items')

  return (
    <PageContainer
      classNames={{ container: styles.container, wrapper: styles.wrapper }}
    >
      <header className={styles.header}>
        <Title
          className={styles.title}
          order={1}
        >
          {t('pages.list.title')}
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
    </PageContainer>
  )
}

export default AdsListPage
