import { beforeEach, describe, expect, it, vi } from 'vitest'

import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { EItemCategory, type IItem } from '@/entities/items'
import { renderWithProviders } from '@/test/renderWithProviders'

import { EItemViewType } from '../../model/types'
import ItemGridCard from './ItemGridCard'

const navigateMock = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const baseItem: IItem = {
  id: 'item-1',
  category: EItemCategory.ELECTRONICS,
  title: 'Тестовое объявление',
  price: 12500,
  needsRevision: false,
}

describe('ItemGridCard', () => {
  beforeEach(() => {
    navigateMock.mockReset()
  })

  it('показывает заголовок, цену, категорию и картинку по URL', () => {
    const item: IItem = {
      ...baseItem,
      imageURL: 'https://example.com/photo.jpg',
    }

    renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        item={item}
      />,
    )

    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: item.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('12500₽')).toBeInTheDocument()
    expect(screen.getByText('Электроника')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: item.title })).toHaveAttribute(
      'src',
      item.imageURL,
    )
  })

  it('по клику на карточку вызывает переход на страницу объявления', async () => {
    const user = userEvent.setup()
    const item: IItem = {
      ...baseItem,
      id: 'ad-42',
      imageURL: 'https://example.com/photo.jpg',
    }

    renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        item={item}
      />,
    )

    await user.click(screen.getByRole('listitem'))

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/ads/ad-42')
  })

  it('карточка с объявлением фокусируема (tabIndex 0)', () => {
    renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        item={baseItem}
      />,
    )

    expect(screen.getByRole('listitem')).toHaveAttribute('tabIndex', '0')
  })

  it('показывает заглушку вместо изображения, если imageURL нет', () => {
    renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        item={{ ...baseItem, imageURL: undefined }}
      />,
    )

    expect(
      screen.getByRole('img', { name: baseItem.title }),
    ).toBeInTheDocument()
  })

  it('показывает чип «Требует доработок» при needsRevision', () => {
    renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        item={{ ...baseItem, needsRevision: true }}
      />,
    )

    expect(screen.getByText('Требует доработок')).toBeInTheDocument()
  })

  it('не показывает чип доработок, если needsRevision false', () => {
    renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        item={baseItem}
      />,
    )

    expect(screen.queryByText('Требует доработок')).not.toBeInTheDocument()
  })

  it('рендерит Skeleton при isLoading', () => {
    const { container } = renderWithProviders(
      <ItemGridCard
        type={EItemViewType.GRID}
        isLoading
        item={undefined}
      />,
    )

    expect(
      container.querySelector('.mantine-Skeleton-root'),
    ).toBeInTheDocument()
  })

  describe('snapshots', () => {
    it('карточка с изображением', () => {
      const { container } = renderWithProviders(
        <ItemGridCard
          type={EItemViewType.GRID}
          item={{
            ...baseItem,
            imageURL: 'https://example.com/photo.jpg',
          }}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('карточка без изображения', () => {
      const { container } = renderWithProviders(
        <ItemGridCard
          type={EItemViewType.GRID}
          item={{ ...baseItem, imageURL: undefined }}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('карточка с needsRevision', () => {
      const { container } = renderWithProviders(
        <ItemGridCard
          type={EItemViewType.GRID}
          item={{ ...baseItem, needsRevision: true }}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('skeleton', () => {
      const { container } = renderWithProviders(
        <ItemGridCard
          type={EItemViewType.GRID}
          isLoading
          item={undefined}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
