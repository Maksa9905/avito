import { Box, Skeleton, Stack } from '@mantine/core'

import styles from '../AdViewPage.module.css'

const AdViewPageContentLoader = () => {
  return (
    <Box className={styles.main}>
      <Skeleton className={styles.images} />

      <Skeleton className={styles.needsRevision} />

      <Skeleton className={styles.characteristics} />

      <Stack>
        <Skeleton className={styles.subtitle} />
        <Skeleton className={styles.description} />
      </Stack>
    </Box>
  )
}

export default AdViewPageContentLoader
