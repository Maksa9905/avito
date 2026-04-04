import { Text } from '@mantine/core'
import { useFormContext } from '../../FormProvider'

import styles from './DescriptionTextField.module.css'
import { useState } from 'react'

const DescriptionTextFieldCounter = () => {
  const { common } = useFormContext()

  const [count, setCount] = useState(0)

  common.watch('description', ({ value }) => {
    setCount(value.length)
  })

  return <Text className={styles.counter}>{count} / 1000</Text>
}

export default DescriptionTextFieldCounter
