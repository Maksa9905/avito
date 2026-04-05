import { Box, Stack, Text, Title } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { ItemImage, NeedsRevisionAlert } from '@/entities/items'
import {
  ItemCharacteristicsTable,
  useGetItemByIdQuery,
  useNeedRevisionFields,
} from '@/features/item-editing'
import { cn } from '@/shared/utils/cn'

import styles from '../AdViewPage.module.css'

const AdViewPageContent = () => {
  const { id } = useParams<{ id: string }>()
  const { data: item } = useGetItemByIdQuery(id)

  const fields = useNeedRevisionFields(item)

  return (
    <Box className={styles.main}>
      <ItemImage
        className={styles.images}
        images={item?.images ?? []}
      />
      <NeedsRevisionAlert
        className={styles.needsRevision}
        fieldsNeeded={fields}
      />
      <ItemCharacteristicsTable
        className={cn(
          styles.characteristics,
          fields.length === 0 && styles.characteristicsNoAlert,
        )}
        item={item!}
      />
      {Boolean(item?.description) && (
        <Stack className={styles.description}>
          <Title
            className={styles.subtitle}
            order={2}
          >
            Описание
          </Title>
          <Text>{item?.description}</Text>
        </Stack>
      )}
    </Box>
  )
}

export default AdViewPageContent
