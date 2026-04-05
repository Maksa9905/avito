import {
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import MoonIcon from '@/shared/icons/MoonIcon'
import SunIcon from '@/shared/icons/SunIcon'

import styles from './ThemeToggleButton.module.css'

const ThemeToggleButton = () => {
  const { t } = useTranslation('items')
  const { setColorScheme } = useMantineColorScheme()
  const computedScheme = useComputedColorScheme('light')

  const handleClick = useCallback(() => {
    setColorScheme(computedScheme === 'light' ? 'dark' : 'light')
  }, [computedScheme, setColorScheme])

  const isLight = computedScheme === 'light'

  return (
    <button
      type="button"
      className={styles.tab}
      onClick={handleClick}
      aria-label={
        isLight ? t('theme.toggleToDark') : t('theme.toggleToLight')
      }
    >
      {isLight ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default ThemeToggleButton
