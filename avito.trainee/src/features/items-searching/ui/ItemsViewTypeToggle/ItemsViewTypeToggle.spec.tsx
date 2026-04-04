import { describe, expect, it } from 'vitest'

import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import ItemsViewTypeToggle from './ItemsViewTypeToggle'

describe('ItemsViewTypeToggle', () => {
  it('по умолчанию выделяет режим сетки', () => {
    renderWithAdsListProviders(<ItemsViewTypeToggle />)

    const [gridBtn, listBtn] = screen.getAllByRole('button')

    expect(gridBtn).toHaveAttribute('aria-selected', 'true')
    expect(listBtn).toHaveAttribute('aria-selected', 'false')
  })

  it('читает viewType=list из query string', () => {
    renderWithAdsListProviders(<ItemsViewTypeToggle />, {
      initialPath: '/ads?viewType=list',
    })

    const [gridBtn, listBtn] = screen.getAllByRole('button')

    expect(gridBtn).toHaveAttribute('aria-selected', 'false')
    expect(listBtn).toHaveAttribute('aria-selected', 'true')
  })

  it('переключает вид по клику', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsViewTypeToggle />)

    const [gridBtn, listBtn] = screen.getAllByRole('button')

    await user.click(listBtn)
    expect(listBtn).toHaveAttribute('aria-selected', 'true')
    expect(gridBtn).toHaveAttribute('aria-selected', 'false')

    await user.click(gridBtn)
    expect(gridBtn).toHaveAttribute('aria-selected', 'true')
    expect(listBtn).toHaveAttribute('aria-selected', 'false')
  })
})
