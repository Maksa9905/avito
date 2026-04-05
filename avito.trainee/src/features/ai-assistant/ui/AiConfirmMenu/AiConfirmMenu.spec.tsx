import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AllProviders } from '@/test/renderWithProviders'

import AiConfirmMenu from './AiConfirmMenu'

describe('AiConfirmMenu', () => {
  it('в успешном состоянии показывает контент и вызывает onApply по «Применить»', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()

    render(
      <AllProviders>
        <AiConfirmMenu
          open
          content="Предложенный текст"
          onApply={onApply}
        >
          <button type="button">AI</button>
        </AiConfirmMenu>
      </AllProviders>,
    )

    expect(screen.getByText('Ответ от AI:')).toBeInTheDocument()
    expect(screen.getByText('Предложенный текст')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Применить' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('по «Закрыть» в успешном состоянии не вызывает onApply', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()

    render(
      <AllProviders>
        <AiConfirmMenu
          open
          content="x"
          onApply={onApply}
        >
          <button type="button">AI</button>
        </AiConfirmMenu>
      </AllProviders>,
    )

    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onApply).not.toHaveBeenCalled()
  })

  it('в состоянии ошибки показывает текст ошибки и «Закрыть»', async () => {
    const user = userEvent.setup()

    render(
      <AllProviders>
        <AiConfirmMenu
          open
          error
        >
          <button type="button">AI</button>
        </AiConfirmMenu>
      </AllProviders>,
    )

    expect(
      screen.getByText('Произошла ошибка при запросе к AI'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Попробуйте повторить запрос или закройте уведомление',
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
  })
})
