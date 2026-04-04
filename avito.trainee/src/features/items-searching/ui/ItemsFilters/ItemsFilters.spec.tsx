import { describe, expect, it } from 'vitest'

import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithAdsListProviders } from '@/test/renderWithProviders'

import ItemsFilters from './ItemsFilters'

describe('ItemsFilters', () => {
  it('показывает заголовок фильтров и блок категорий', () => {
    renderWithAdsListProviders(<ItemsFilters />)

    expect(screen.getByRole('heading', { name: 'Фильтры' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Категории' })).toBeInTheDocument()
  })

  it('пробрасывает className на aside', () => {
    renderWithAdsListProviders(
      <ItemsFilters className="filters-custom-class" />,
      { initialPath: '/ads' },
    )

    expect(screen.getByRole('complementary')).toHaveClass('filters-custom-class')
  })

  it('переключает aria-expanded у кнопки раскрытия категорий', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsFilters />)

    const toggle = screen.getByRole('button', {
      name: 'Показать или скрыть список категорий',
    })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('после раскрытия списка показывает чекбоксы всех категорий', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsFilters />)

    await user.click(
      screen.getByRole('button', {
        name: 'Показать или скрыть список категорий',
      }),
    )

    expect(screen.getByRole('checkbox', { name: 'Авто' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Недвижимость' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Электроника' })).toBeInTheDocument()
  })

  it('включает чекбокс категории по клику', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsFilters />)

    await user.click(
      screen.getByRole('button', {
        name: 'Показать или скрыть список категорий',
      }),
    )

    const auto = screen.getByRole('checkbox', { name: 'Авто' })
    expect(auto).not.toBeChecked()

    await user.click(auto)
    expect(auto).toBeChecked()
  })

  it('переключает «Только требующие доработок»', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsFilters />)

    const revisionSwitch = screen.getByRole('switch', {
      name: 'Только требующие доработок',
    })
    expect(revisionSwitch).not.toBeChecked()

    await user.click(revisionSwitch)
    expect(revisionSwitch).toBeChecked()
  })

  it('«Сбросить фильтры» снимает категории и переключатель доработок', async () => {
    const user = userEvent.setup()
    renderWithAdsListProviders(<ItemsFilters />, {
      initialPath: '/ads?categories=auto&categories=electronics&needsRevision=1',
    })

    await user.click(
      screen.getByRole('button', {
        name: 'Показать или скрыть список категорий',
      }),
    )

    expect(screen.getByRole('checkbox', { name: 'Авто' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Электроника' })).toBeChecked()
    expect(
      screen.getByRole('switch', { name: 'Только требующие доработок' }),
    ).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))

    expect(screen.getByRole('checkbox', { name: 'Авто' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Электроника' })).not.toBeChecked()
    expect(
      screen.getByRole('switch', { name: 'Только требующие доработок' }),
    ).not.toBeChecked()
  })
})
