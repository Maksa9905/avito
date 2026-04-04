import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { AllProviders } from '@/test/renderWithProviders'

import ItemEditDraftRestoreDialog from './ItemEditDraftRestoreDialog'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AllProviders>{children}</AllProviders>
)

describe('ItemEditDraftRestoreDialog', () => {
  it('при открытии показывает текст и кнопки действий', () => {
    render(
      <ItemEditDraftRestoreDialog
        opened
        onDiscard={vi.fn()}
        onRestore={vi.fn()}
      />,
      { wrapper },
    )

    expect(
      screen.getByText(
        'Найден сохранённый черновик этого объявления. Восстановить введённые ранее данные?',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Нет, начать заново' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Восстановить' }),
    ).toBeInTheDocument()
  })

  it('вызывает onDiscard при отказе', async () => {
    const user = userEvent.setup()
    const onDiscard = vi.fn()

    render(
      <ItemEditDraftRestoreDialog
        opened
        onDiscard={onDiscard}
        onRestore={vi.fn()}
      />,
      { wrapper },
    )

    await user.click(
      screen.getByRole('button', { name: 'Нет, начать заново' }),
    )
    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('вызывает onRestore при восстановлении', async () => {
    const user = userEvent.setup()
    const onRestore = vi.fn()

    render(
      <ItemEditDraftRestoreDialog
        opened
        onDiscard={vi.fn()}
        onRestore={onRestore}
      />,
      { wrapper },
    )

    await user.click(screen.getByRole('button', { name: 'Восстановить' }))
    expect(onRestore).toHaveBeenCalledTimes(1)
  })
})
