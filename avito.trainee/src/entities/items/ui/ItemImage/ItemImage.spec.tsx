import { describe, expect, it } from 'vitest'

import { render, screen } from '@testing-library/react'

import { AllProviders } from '@/test/renderWithProviders'

import ItemImage from './ItemImage'

describe('ItemImage', () => {
  it('при пустом списке изображений ничего не рендерит', () => {
    render(
      <AllProviders>
        <ItemImage images={[]} />
      </AllProviders>,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('показывает главное фото и миниатюры', () => {
    const { getAllByRole } = render(
      <AllProviders>
        <ItemImage
          images={[
            'https://example.com/a.jpg',
            'https://example.com/b.jpg',
            'https://example.com/c.jpg',
          ]}
        />
      </AllProviders>,
    )

    const imgs = getAllByRole('img')
    expect(imgs).toHaveLength(3)
    expect(imgs[0]).toHaveAttribute('src', 'https://example.com/a.jpg')
    expect(imgs[1]).toHaveAttribute('src', 'https://example.com/b.jpg')
    expect(imgs[2]).toHaveAttribute('src', 'https://example.com/c.jpg')
  })
})
