import {
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useCallback } from 'react'

import MoonIcon from '@/shared/icons/MoonIcon'
import SunIcon from '@/shared/icons/SunIcon'

import styles from './ThemeToggleButton.module.css'

const ThemeToggleButton = () => {
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
        isLight ? 'Включить тёмную тему' : 'Включить светлую тему'
      }
    >
      {isLight ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default ThemeToggleButton
