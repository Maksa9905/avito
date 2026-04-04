import { describe, expect, it } from 'vitest'

import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import ItemsSearchInput from './ItemsSearchInput'

describe('ItemsSearchInput', () => {
  it('показывает плейсхолдер из переводов ads', () => {
    renderWithAdsListProviders(<ItemsSearchInput />)

    expect(
      screen.getByPlaceholderText('Найти объявление...'),
    ).toBeInTheDocument()
  })

  it('инициализирует значение из query-параметра q', () => {
    renderWithAdsListProviders(<ItemsSearchInput />, {
      initialPath: '/ads?q=кресло',
    })

    expect(screen.getByPlaceholderText('Найти объявление...')).toHaveValue(
      'кресло',
    )
  })

  it('обновляет поле при вводе', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsSearchInput />)

    const input = screen.getByPlaceholderText('Найти объявление...')
    await user.type(input, 'телефон')

    expect(input).toHaveValue('телефон')
  })

  it('пробрасывает className', () => {
    const { container } = renderWithAdsListProviders(
      <ItemsSearchInput className="search-input-extra" />,
    )

    expect(container.querySelector('.search-input-extra')).toBeInTheDocument()
  })
})
