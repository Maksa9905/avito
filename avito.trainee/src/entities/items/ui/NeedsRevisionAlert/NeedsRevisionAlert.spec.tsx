import { describe, expect, it } from 'vitest'

import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/renderWithProviders'

import NeedsRevisionAlert from './NeedsRevisionAlert'

describe('NeedsRevisionAlert', () => {
  it('при пустом списке полей ничего не рендерит', () => {
    renderWithProviders(<NeedsRevisionAlert fieldsNeeded={[]} />)
    expect(
      screen.queryByRole('heading', { name: 'Требуются доработки' }),
    ).not.toBeInTheDocument()
  })

  it('показывает заголовок, текст и список полей', () => {
    renderWithProviders(
      <NeedsRevisionAlert
        fieldsNeeded={['Марка', 'Модель']}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Требуются доработки' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('У объявления не заполнены поля:'),
    ).toBeInTheDocument()
    expect(screen.getByText('Марка')).toBeInTheDocument()
    expect(screen.getByText('Модель')).toBeInTheDocument()
  })
})
