import { Stack, Table, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { ItemDetailDto } from '../../api/types'
import { useCharacteristicRows } from '../../lib/buildCharacteristicRows'

import { cn } from '@/shared/utils/cn'

import styles from './ItemCharacteristicsTable.module.css'

type ItemCharacteristicsTableProps = {
  item: ItemDetailDto
  className?: string
}

const ItemCharacteristicsTable = ({
  item,
  className,
}: ItemCharacteristicsTableProps) => {
  const { t } = useTranslation('items')
  const rows = useCharacteristicRows(item.category, item.params)

  if (!rows.length) return null

  return (
    <Stack className={className}>
      <Title
        className={styles.subtitle}
        order={2}
      >
        {t('form.edit.detailedSectionTitle')}
      </Title>
      <Table className={styles.table}>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr
              className={styles.row}
              key={row.key}
            >
              <Table.Td className={cn(styles.characteristic, styles.cell)}>
                {row.label}
              </Table.Td>
              <Table.Td className={cn(styles.value, styles.cell)}>
                {row.value}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  )
}

export default ItemCharacteristicsTable
