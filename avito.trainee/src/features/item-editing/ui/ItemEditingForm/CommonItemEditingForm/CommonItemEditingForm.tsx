import {
  Box,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import useCategoriesOptions from '@/features/item-editing/model/useCategoriesOptions'
import { useFormContext } from '../FormProvider'

import styles from './CommonItemEditingForm.module.css'
import { cn } from '@/shared/utils/cn'

type CommonItemEditingFormProps = {
  isLoading?: boolean
  priceRightSection?: React.ReactNode
}

const CommonItemEditingForm = ({
  isLoading,
  priceRightSection,
}: CommonItemEditingFormProps) => {
  const { t } = useTranslation('items')
  const { common } = useFormContext()

  const categoriesOptions = useCategoriesOptions()

  return (
    <Stack className={cn(styles.container)}>
      <Box className={styles.widthLimiter}>
        <Select
          key={common.key('category')}
          {...common.getInputProps('category')}
          placeholder={t('edit.common.category.placeholder')}
          label={t('edit.common.category.label')}
          withAsterisk
          loading={isLoading}
          classNames={{
            label: styles.label,
          }}
          data={categoriesOptions}
        />
      </Box>
      <Divider />
      <Group
        align="flex-end"
        gap="xl"
      >
        <Box className={styles.widthLimiter}>
          <TextInput
            key={common.key('title')}
            {...common.getInputProps('title')}
            placeholder={t('edit.common.title.placeholder')}
            withAsterisk
            label={t('edit.common.title.label')}
            loading={isLoading}
            classNames={{
              label: styles.label,
            }}
          />
        </Box>
        {priceRightSection}
      </Group>
      <Divider />
      <Box className={styles.widthLimiter}>
        <NumberInput
          key={common.key('price')}
          {...common.getInputProps('price')}
          allowNegative={false}
          hideControls
          withAsterisk
          label={t('edit.common.price.label')}
          loading={isLoading}
          classNames={{
            label: styles.label,
          }}
          placeholder={t('edit.common.price.placeholder')}
        />
      </Box>
    </Stack>
  )
}

export default CommonItemEditingForm
