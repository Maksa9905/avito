import { Box } from '@mantine/core'

import styles from './NeedsRevisionChip.module.css'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

type NeedsRevisionChipProps = {
  className?: string
}

const NeedsRevisionChip = ({ className }: NeedsRevisionChipProps) => {
  const { t } = useTranslation('items')

  return (
    <Box
      component="span"
      className={cn(styles.chip, className)}
    >
      <Box
        component="span"
        className={styles.circle}
      />
      {t('needsRevision')}
    </Box>
  )
}

export default NeedsRevisionChip
