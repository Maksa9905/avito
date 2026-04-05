import { Box, Skeleton } from '@mantine/core'

import styles from '../AdViewPage.module.css'

const AdViewPageHeaderLoader = () => {
  return (
    <Box
      component="header"
      className={styles.header}
    >
      <Skeleton className={styles.title} />
      <Skeleton className={styles.edit} />
      <Skeleton className={styles.price} />
      <Box className={styles.timestamps}>
        <Skeleton className={styles.timestamp} />
        <Skeleton className={styles.timestamp} />
      </Box>
    </Box>
  )
}

export default AdViewPageHeaderLoader
