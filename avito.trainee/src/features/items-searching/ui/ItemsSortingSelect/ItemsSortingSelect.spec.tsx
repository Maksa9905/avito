import { describe, expect, it } from 'vitest'

import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import ItemsSortingSelect from './ItemsSortingSelect'

describe('ItemsSortingSelect', () => {
  it('показывает плейсхолдер сортировки', () => {
    renderWithAdsListProviders(<ItemsSortingSelect />)

    expect(screen.getByPlaceholderText('Сортировка')).toBeInTheDocument()
  })

  it('подставляет подпись сортировки из URL', () => {
    renderWithAdsListProviders(<ItemsSortingSelect />, {
      initialPath: '/ads?sortColumn=title&sortDirection=asc',
    })

    expect(screen.getByRole('combobox')).toHaveValue('По названию (А–Я)')
  })

  it('по выбору опции обновляет значение', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsSortingSelect />)

    await user.click(screen.getByRole('combobox'))

    const option = screen.getByRole('option', {
      name: 'По новизне (сначала новые)',
      hidden: true,
    })
    await user.click(option)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue(
        'По новизне (сначала новые)',
      )
    })
  })

  it('пробрасывает className', () => {
    const { container } = renderWithAdsListProviders(
      <ItemsSortingSelect className="sorting-select-extra" />,
    )

    expect(
      container.querySelector('.sorting-select-extra'),
    ).toBeInTheDocument()
  })
})
