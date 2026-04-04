import { describe, expect, it } from 'vitest'

import { screen } from '@testing-library/react'
import { EItemCategory, type IItem } from '@/entities/items'
import { renderWithProviders } from '@/test/renderWithProviders'

import { EItemViewType } from '../../model/types'
import ItemListCard from './ItemListCard'

const baseItem: IItem = {
  id: 'item-1',
  category: EItemCategory.ELECTRONICS,
  title: 'Тестовое объявление',
  price: 12500,
  needsRevision: false,
}

describe('ItemListCard', () => {
  it('показывает заголовок, цену, категорию и картинку по URL', () => {
    const item: IItem = {
      ...baseItem,
      imageURL: 'https://example.com/photo.jpg',
    }

    renderWithProviders(
      <ItemListCard
        type={EItemViewType.LIST}
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

  it('показывает заглушку вместо изображения, если imageURL нет', () => {
    renderWithProviders(
      <ItemListCard
        type={EItemViewType.LIST}
        item={{ ...baseItem, imageURL: undefined }}
      />,
    )

    expect(
      screen.getByRole('img', { name: baseItem.title }),
    ).toBeInTheDocument()
  })

  it('показывает чип «Требует доработок» при needsRevision', () => {
    renderWithProviders(
      <ItemListCard
        type={EItemViewType.LIST}
        item={{ ...baseItem, needsRevision: true }}
      />,
    )

    expect(screen.getByText('Требует доработок')).toBeInTheDocument()
  })

  it('не показывает чип доработок, если needsRevision false', () => {
    renderWithProviders(
      <ItemListCard
        type={EItemViewType.LIST}
        item={baseItem}
      />,
    )

    expect(screen.queryByText('Требует доработок')).not.toBeInTheDocument()
  })

  it('рендерит Skeleton при isLoading', () => {
    const { container } = renderWithProviders(
      <ItemListCard
        type={EItemViewType.LIST}
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
        <ItemListCard
          type={EItemViewType.LIST}
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
        <ItemListCard
          type={EItemViewType.LIST}
          item={{ ...baseItem, imageURL: undefined }}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('карточка с needsRevision', () => {
      const { container } = renderWithProviders(
        <ItemListCard
          type={EItemViewType.LIST}
          item={{ ...baseItem, needsRevision: true }}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('skeleton', () => {
      const { container } = renderWithProviders(
        <ItemListCard
          type={EItemViewType.LIST}
          isLoading
          item={undefined}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
