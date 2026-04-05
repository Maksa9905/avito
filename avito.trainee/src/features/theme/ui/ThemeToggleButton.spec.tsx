import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'

import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import {
  MantineProvider,
  localStorageColorSchemeManager,
} from '@mantine/core'
import { I18nextProvider } from 'react-i18next'

import theme from '@/app/theme/theme'
import { i18n } from '@/shared/i18n'

import { COLOR_SCHEME_STORAGE_KEY } from '../constants'
import ThemeToggleButton from './ThemeToggleButton'

const colorSchemeManager = localStorageColorSchemeManager({
  key: COLOR_SCHEME_STORAGE_KEY,
})

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="light"
        colorSchemeManager={colorSchemeManager}
      >
        {children}
      </MantineProvider>
    </I18nextProvider>
  )
}

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    localStorage.removeItem(COLOR_SCHEME_STORAGE_KEY)
  })

  it('в светлой теме показывает солнце и подпись для перехода в тёмную', () => {
    render(<ThemeToggleButton />, { wrapper: TestWrapper })

    const btn = screen.getByRole('button', { name: 'Включить тёмную тему' })
    expect(btn).toBeInTheDocument()
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('по клику переключает на тёмную тему и пишет значение в localStorage', async () => {
    const user = userEvent.setup()
    render(<ThemeToggleButton />, { wrapper: TestWrapper })

    await user.click(
      screen.getByRole('button', { name: 'Включить тёмную тему' }),
    )

    expect(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    ).toBeInTheDocument()
    expect(localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('dark')
  })

  it('второй клик возвращает светлую тему', async () => {
    const user = userEvent.setup()
    render(<ThemeToggleButton />, { wrapper: TestWrapper })

    await user.click(
      screen.getByRole('button', { name: 'Включить тёмную тему' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    )

    expect(
      screen.getByRole('button', { name: 'Включить тёмную тему' }),
    ).toBeInTheDocument()
    expect(localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('light')
  })
})
