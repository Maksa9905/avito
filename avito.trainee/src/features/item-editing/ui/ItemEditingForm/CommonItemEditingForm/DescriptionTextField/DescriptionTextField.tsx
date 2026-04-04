import { Stack, Textarea } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useFormContext } from '../../FormProvider'

import styles from './DescriptionTextField.module.css'
import DescriptionTextFieldCounter from './DescriptionTextFieldCounter'

type DescriptionTextFieldProps = {
  isLoading?: boolean
}

const DescriptionTextField = ({ isLoading }: DescriptionTextFieldProps) => {
  const { t } = useTranslation('items')
  const { common } = useFormContext()

  return (
    <Stack className={styles.container}>
      <Textarea
        key={common.key('description')}
        {...common.getInputProps('description')}
        loading={isLoading}
        label={t('edit.common.description.label')}
        placeholder={t('edit.common.description.placeholder')}
        autosize
        minRows={3}
        maxLength={1000}
        classNames={{
          label: styles.label,
        }}
      />
      <DescriptionTextFieldCounter />
    </Stack>
  )
}

export default DescriptionTextField
